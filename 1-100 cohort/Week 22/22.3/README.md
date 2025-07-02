# Indexing in databases

## Server

1. Cluster module and horizontal scaling
2. Capacity Estimation, ASGs and Vertical scaling
3. Load balancers

## Database

1. Indexing
2. Normalization
3. Sharding

4. Indexing
   We've created postgres tables many times now. Let's see how/if indexing helps us speed up queries.

- Create a postgres DB locally (dont use neon, we have a lot of data to store, will be very slow)

```bash
$ docker run  -p 5432:5432 -e POSTGRES_PASSWORD=mysecretpassword -d postgres
d92d2293320cc7ade9a888a55b14e867a49d7c1f58689df776f61ad3cd1b6119
```

- Connect to it and create some dummy data in it

```bash
docker exec -it container_id /bin/bash
psql -U postgres
```

- Create a Schema for Medium like app

```sql
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255)
);
CREATE TABLE posts (
    post_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

- Insert some data

```sql
DO $$
DECLARE
    returned_user_id INT;
BEGIN
    -- Insert 5 users
    FOR i IN 1..5 LOOP
        INSERT INTO users (email, password, name) VALUES
        ('user'||i||'@example.com', 'pass'||i, 'User '||i)
        RETURNING user_id INTO returned_user_id;

        FOR j IN 1..500000 LOOP
            INSERT INTO posts (user_id, title, description)
            VALUES (returned_user_id, 'Title '||j, 'Description for post '||j);
        END LOOP;
    END LOOP;
END $$;
```

```sql
SELECT * FROM users;
```

- Try running a query to get all the posts of a user and log the time it took

```sql
EXPLAIN ANALYSE SELECT * FROM posts WHERE user_id=1 LIMIT 5;
```

Focus on the `execution time`

- Add an index to user_id

```sql
CREATE INDEX idx_user_id ON posts (user_id);
```

## How indexing works (briefly)

When you create an index on a field, a new data structure (usually B-tree) is created that stores the mapping from the `index column` to the `location` of the record in the original table.
Search on the index is usually `log(n)`

<h4>Without indexes</h4>
without index-> linear search 
<figure class="notion-asset-wrapper notion-asset-wrapper-image notion-block-843dcaf359954980ace1e3ae58b0b03e"><div style="position: relative; display: flex; justify-content: center; align-self: center; width: 100%; max-width: 100%; flex-direction: column; height: 100%;"><img src="https://www.notion.so/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F085e8ad8-528e-47d7-8922-a23dc4016453%2F059144a3-cb58-4658-8b51-019f2411950b%2FScreenshot_2024-04-27_at_7.04.41_PM.png?table=block&amp;id=843dcaf3-5995-4980-ace1-e3ae58b0b03e&amp;cache=v2" alt="notion image" loading="lazy" decoding="async" class="medium-zoom-image" style="object-fit: cover;"></div></figure>

<h4>With indexes</h4>
with index-> binary search on the index table finds the required row first, then that rows points to a record in the original table.
<figure class="notion-asset-wrapper notion-asset-wrapper-image notion-block-b1492b6a279846679f9296225c31ba1c"><div style="position: relative; display: flex; justify-content: center; align-self: center; width: 100%; max-width: 100%; flex-direction: column; height: 100%;"><img src="https://www.notion.so/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F085e8ad8-528e-47d7-8922-a23dc4016453%2F3df35f4c-ed1e-4ed2-a704-99c43a3a999a%2FScreenshot_2024-04-27_at_7.10.00_PM.png?table=block&amp;id=b1492b6a-2798-4667-9f92-96225c31ba1c&amp;cache=v2" alt="notion image" loading="lazy" decoding="async" class="medium-zoom-image" style="object-fit: cover;"></div></figure>

The data pointer (in case of postgres) is the `page` and `offset` at which this record can be found.
Think of the index as the `appendix` of a book and the `location` as the `page + offset` of where this data can be found

# Complex indexes

You can have index on more than one column for more complex queries
For example,
Give me all the posts of a user with given `id` with `title` “Class 1”.
The index needs to have two keys now

```sql
CREATE INDEX idx_posts_user_id_title ON posts (description, title);
```

- Try searching before the index is added and after it is added

```sql
 SELECT * FROM posts WHERE title='title' AND description='my title';
```