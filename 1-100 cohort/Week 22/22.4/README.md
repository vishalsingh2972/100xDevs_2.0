# Normalization in DBs

Normalization is the process of removing redundancy in your database.

## Redundancy

Redundant data means data that already exists elsewhere and we’re duplicating it in two places. For example, if you have two tables

1. users
2. user_metadata
   where you do the following -

<figure class="notion-asset-wrapper notion-asset-wrapper-image notion-block-107d0556d19e4c669256dbd421dc0b09"><div style="position: relative; display: flex; justify-content: center; align-self: center; width: 100%; max-width: 100%; flex-direction: column; height: 100%;"><img src="https://www.notion.so/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F085e8ad8-528e-47d7-8922-a23dc4016453%2F9fdded74-4e0e-4866-8459-e730c87bc521%2FScreenshot_2024-05-02_at_1.14.02_PM.png?table=block&amp;id=107d0556-d19e-4c66-9256-dbd421dc0b09&amp;cache=v2" alt="notion image" loading="lazy" decoding="async" class="medium-zoom-image" style="object-fit: cover;"></div></figure>

If you notice, we’ve stored the name on the order in the Orders table, when it is already present in the Users table. This is what is `redundant` data.
Notice this schema is still `full proof`. We can get all the orders given a user id. We can tell the users details (username, name) given an order id.

## Non full proof data

<figure class="notion-asset-wrapper notion-asset-wrapper-image notion-block-e98a5baa40a744bab961b7b2eab5a600"><div style="position: relative; display: flex; justify-content: center; align-self: center; width: 100%; max-width: 100%; flex-direction: column; height: 100%;"><img src="https://www.notion.so/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F085e8ad8-528e-47d7-8922-a23dc4016453%2Ff389e2e8-cf2d-4843-80ca-19875a846868%2FScreenshot_2024-05-02_at_1.17.08_PM.png?table=block&amp;id=e98a5baa-40a7-44ba-b961-b7b2eab5a600&amp;cache=v2" alt="notion image" loading="lazy" decoding="async" class="medium-zoom-image" style="object-fit: cover;"></div></figure>

This data doesn’t have any relationship b/w Orders and users. This is just plain wrong. You can never tell the orders for a user (esp if 2 users can have the same name)
Normalisation is done on tables that are full proof to remove redundancy.

## Types of relationships

Use case - Library management system 1. Users table 2. Library card table 3. Books table 4. Genre table

### One to One

Each user has a single `Library card`

<figure class="notion-asset-wrapper notion-asset-wrapper-image notion-block-d7b7bef5e5f2426cb1ece1aab61c2015"><div style="position: relative; display: flex; justify-content: center; align-self: center; width: 100%; max-width: 100%; flex-direction: column; height: 100%;"><img src="https://www.notion.so/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F085e8ad8-528e-47d7-8922-a23dc4016453%2Fdaaa9d62-e071-4429-8ba4-e5a7a9fd500c%2FScreenshot_2024-05-02_at_1.37.56_PM.png?table=block&amp;id=d7b7bef5-e5f2-426c-b1ec-e1aab61c2015&amp;cache=v2" alt="notion image" loading="lazy" decoding="async" class="medium-zoom-image" style="object-fit: cover;"></div></figure>

### One to many

<figure class="notion-asset-wrapper notion-asset-wrapper-image notion-block-996adea5984d46658f72a785e38910d4"><div style="position: relative; display: flex; justify-content: center; align-self: center; width: 100%; max-width: 100%; flex-direction: column; height: 100%;"><img src="https://www.notion.so/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F085e8ad8-528e-47d7-8922-a23dc4016453%2F0852ad48-2f0a-4246-ac74-159b4c89cc36%2FScreenshot_2024-05-03_at_11.49.46_AM.png?table=block&amp;id=996adea5-984d-4665-8f72-a785e38910d4&amp;cache=v2" alt="notion image" loading="lazy" decoding="async" class="medium-zoom-image" style="object-fit: cover;"></div></figure>

### Many to one

Opposite of the thing above

### Many to Many

<figure class="notion-asset-wrapper notion-asset-wrapper-image notion-block-d09f77cb5d3046d89a07e16d2d9f90be"><div style="position: relative; display: flex; justify-content: center; align-self: center; width: 100%; max-width: 100%; flex-direction: column; height: 100%;"><img src="https://www.notion.so/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F085e8ad8-528e-47d7-8922-a23dc4016453%2F7f419cf4-f225-47b1-8082-0a6ba929a8ce%2FScreenshot_2024-05-03_at_11.56.00_AM.png?table=block&amp;id=d09f77cb-5d30-46d8-9a07-e16d2d9f90be&amp;cache=v2" alt="notion image" loading="lazy" decoding="async" class="medium-zoom-image" style="object-fit: cover;"></div></figure>

## Final Graph

<figure class="notion-asset-wrapper notion-asset-wrapper-image notion-block-0b6e7529fcf54e81810c3fd7ce32e5f6"><div style="position: relative; display: flex; justify-content: center; align-self: center; width: 100%; max-width: 100%; flex-direction: column; height: 100%;"><img src="https://www.notion.so/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F085e8ad8-528e-47d7-8922-a23dc4016453%2Fdd916952-b32c-4346-972e-6cba39e310af%2FScreenshot_2024-05-03_at_12.01.17_PM.png?table=block&amp;id=0b6e7529-fcf5-4e81-810c-3fd7ce32e5f6&amp;cache=v2" alt="notion image" loading="lazy" decoding="async" class="medium-zoom-image" style="object-fit: cover;"></div></figure>

# Normalizing data

Normalization in databases is a systematic approach of decomposing tables to eliminate data redundancy and improve data integrity.
The process typically progresses through several normal forms, each building on the last.
When you look at a schema, you can identify if it lies in one of the following categories of normalization

1. 1NF
2. 2NF
3. 3NF
4. BCNF
5. 4NF
6. 5NF

You aim to reach 3NF/BCNF usually. The lower you go, the more normalised your table is. But over normalization can lead to excessive joins

## 1NF

- A single cell must not hold more than one value (atomicity): This rule ensures that each column of a database table holds only atomic (indivisible) values, and multi-valued attributes are split into separate columns. For example, if a column is meant to store phone numbers, and a person has multiple phone numbers, each number should be in a separate row, not as a list or set in a single cell.
<ul class="notion-list notion-list-disc notion-block-ec3c5194f57d4610bec83f99268d13ec"><figure class="notion-asset-wrapper notion-asset-wrapper-image notion-block-403e39a2149641928931d6316ae21ed8"><div style="position: relative; display: flex; justify-content: center; align-self: center; width: 100%; max-width: 100%; flex-direction: column; height: 100%;"><img src="https://www.notion.so/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F085e8ad8-528e-47d7-8922-a23dc4016453%2F93afac44-d131-4622-a7b7-11704ac94c8e%2FScreenshot_2024-05-03_at_12.26.37_PM.png?table=block&amp;id=403e39a2-1496-4192-8931-d6316ae21ed8&amp;cache=v2" alt="notion image" loading="lazy" decoding="async" class="medium-zoom-image" style="object-fit: cover;"></div></figure><figure class="notion-asset-wrapper notion-asset-wrapper-image notion-block-1a850971420b4ae0afc9f2ef58f7465b"><div style="position: relative; display: flex; justify-content: center; align-self: center; width: 100%; max-width: 100%; flex-direction: column; height: 100%;"><img src="https://www.notion.so/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F085e8ad8-528e-47d7-8922-a23dc4016453%2Fb2fec16c-b8f7-4717-9513-677f09c0f6cc%2FScreenshot_2024-05-03_at_12.26.41_PM.png?table=block&amp;id=1a850971-420b-4ae0-afc9-f2ef58f7465b&amp;cache=v2" alt="notion image" loading="lazy" decoding="async" class="medium-zoom-image" style="object-fit: cover;"></div></figure></ul>

- There must be a primary key for identification: Each table should have a primary key, which is a column (or a set of columns) that uniquely identifies each row in a table.
- No duplicated rows: To ensure that the data in the table is organized properly and to uphold the integrity of the data, each row in the table should be unique. This rule works hand-in-hand with the presence of a primary key to prevent duplicate entries which can lead to data anomalies.
- Each column must have only one value for each row in the table: This rule emphasizes that every column must hold only one value per row, and that value should be of the same kind for that column across all rows.
<figure class="notion-asset-wrapper notion-asset-wrapper-image notion-block-f9108d9afb29426d83da74206c873c35"><div style="position: relative; display: flex; justify-content: center; align-self: center; width: 100%; max-width: 100%; flex-direction: column; height: 100%;"><img src="https://www.notion.so/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F085e8ad8-528e-47d7-8922-a23dc4016453%2F72b3d81b-6a03-4f01-8bcb-480de001abc6%2FScreenshot_2024-05-03_at_12.25.23_PM.png?table=block&amp;id=f9108d9a-fb29-426d-83da-74206c873c35&amp;cache=v2" alt="notion image" loading="lazy" decoding="async" class="medium-zoom-image" style="object-fit: cover;"></div></figure>
<figure class="notion-asset-wrapper notion-asset-wrapper-image notion-block-a44b52af9efc4f63a5513b3db7f09a34"><div style="position: relative; display: flex; justify-content: center; align-self: center; width: 100%; max-width: 100%; flex-direction: column; height: 100%;"><img src="https://www.notion.so/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F085e8ad8-528e-47d7-8922-a23dc4016453%2Fa18e7a09-e396-480d-829e-221649ae61a6%2FScreenshot_2024-05-03_at_12.25.26_PM.png?table=block&amp;id=a44b52af-9efc-4f63-a551-3b3db7f09a34&amp;cache=v2" alt="notion image" loading="lazy" decoding="async" class="medium-zoom-image" style="object-fit: cover;"></div></figure>

## 2NF

Ref -https://www.studytonight.com/dbms/second-normal-form.php
1NF gets rid of repeating rows. 2NF gets rid of redundancy
A table is said to be in 2NF if it meets the following criteria:

- is already in 1NF
- Has 0 partial dependency.

### Before normalization

Enrollments table

<figure class="notion-asset-wrapper notion-asset-wrapper-image notion-block-96cced597dd44ec78c2f5ec0c54ba8ca"><div style="position: relative; display: flex; justify-content: center; align-self: center; width: 100%; max-width: 100%; flex-direction: column; height: 100%;"><img src="https://www.notion.so/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F085e8ad8-528e-47d7-8922-a23dc4016453%2Fd56a2464-4a92-432d-aa79-c998f1f58c34%2FScreenshot_2024-05-03_at_1.07.47_PM.png?table=block&amp;id=96cced59-7dd4-4ec7-8c2f-5ec0c54ba8ca&amp;cache=v2" alt="notion image" loading="lazy" decoding="async" class="medium-zoom-image" style="object-fit: cover;"></div></figure>
Can you spot the redundancy over here? The instructor name and course name are repeated in rows, even though the name of an instructor should be the same for a given courseID
Primary key of this table is (student_id, course_id)
CourseName and InstructorName have a `partial dependency` on `CourserID`
<figure class="notion-asset-wrapper notion-asset-wrapper-image notion-block-9d11093f3ca345de98ad9440e1afdaa1"><div style="position: relative; display: flex; justify-content: center; align-self: center; width: 100%; max-width: 100%; flex-direction: column; height: 100%;"><img src="https://www.notion.so/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F085e8ad8-528e-47d7-8922-a23dc4016453%2Fd9028a09-53f6-452e-a17c-37b061e6ce61%2FScreenshot_2024-05-03_at_1.11.14_PM.png?table=block&amp;id=9d11093f-3ca3-45de-98ad-9440e1afdaa1&amp;cache=v2" alt="notion image" loading="lazy" decoding="async" class="medium-zoom-image" style="object-fit: cover;"></div></figure>

### After normalization

Enrollments table

<figure class="notion-asset-wrapper notion-asset-wrapper-image notion-block-86ec6fa2d9fa44e2b25b5fadbfd53ed6"><div style="position: relative; display: flex; justify-content: center; align-self: center; width: 100%; max-width: 100%; flex-direction: column; height: 100%;"><img src="https://www.notion.so/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F085e8ad8-528e-47d7-8922-a23dc4016453%2F15fd6c51-8574-4911-9f95-facebfc3e2e8%2FScreenshot_2024-05-03_at_1.08.17_PM.png?table=block&amp;id=86ec6fa2-d9fa-44e2-b25b-5fadbfd53ed6&amp;cache=v2" alt="notion image" loading="lazy" decoding="async" class="medium-zoom-image" style="object-fit: cover;"></div></figure>
<figure class="notion-asset-wrapper notion-asset-wrapper-image notion-block-4a255882c9c9448f8713be03f1772e18"><div style="position: relative; display: flex; justify-content: center; align-self: center; width: 100%; max-width: 100%; flex-direction: column; height: 100%;"><img src="https://www.notion.so/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F085e8ad8-528e-47d7-8922-a23dc4016453%2Ff1df691d-2fab-489c-b138-844e23289a48%2FScreenshot_2024-05-03_at_1.08.32_PM.png?table=block&amp;id=4a255882-c9c9-448f-8713-be03f1772e18&amp;cache=v2" alt="notion image" loading="lazy" decoding="async" class="medium-zoom-image" style="object-fit: cover;"></div></figure>

## 3NF

When a table is in 2NF, it eliminates repeating groups and redundancy, but it does not eliminate transitive partial dependency.
So, for a table to be in 3NF, it must:

- be in 2NF
- have no transitive partial dependency.

Ex->

<figure class="notion-asset-wrapper notion-asset-wrapper-image notion-block-3614090315a94ff5ae9e0d5209147ed0"><div style="position: relative; display: flex; justify-content: center; align-self: center; width: 100%; max-width: 100%; flex-direction: column; height: 100%;"><img src="https://www.notion.so/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F085e8ad8-528e-47d7-8922-a23dc4016453%2F21b7cf62-dd2d-4674-8884-0e7599fcf627%2FScreenshot_2024-05-03_at_1.29.10_PM.png?table=block&amp;id=36140903-15a9-4ff5-ae9e-0d5209147ed0&amp;cache=v2" alt="notion image" loading="lazy" decoding="async" class="medium-zoom-image" style="object-fit: cover;"></div></figure>
`Department name` has a `transitive dependency` on the primary key (employee id).

To normalise to 3NF, we need to do the following

<figure class="notion-asset-wrapper notion-asset-wrapper-image notion-block-2e03a23f21ac4cebbef40b40f2feef93"><div style="position: relative; display: flex; justify-content: center; align-self: center; width: 100%; max-width: 100%; flex-direction: column; height: 100%;"><img src="https://www.notion.so/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F085e8ad8-528e-47d7-8922-a23dc4016453%2F8443bd6b-4baf-4213-831d-656cb23b243a%2FScreenshot_2024-05-03_at_1.31.18_PM.png?table=block&amp;id=2e03a23f-21ac-4ceb-bef4-0b40f2feef93&amp;cache=v2" alt="notion image" loading="lazy" decoding="async" class="medium-zoom-image" style="object-fit: cover;"></div></figure>

<figure class="notion-asset-wrapper notion-asset-wrapper-image notion-block-4623f5c4febc42b9b01514ecb919c5e5"><div style="position: relative; display: flex; justify-content: center; align-self: center; width: 100%; max-width: 100%; flex-direction: column; height: 100%;"><img src="https://www.notion.so/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F085e8ad8-528e-47d7-8922-a23dc4016453%2F7cfb41e8-bdaf-4083-85a4-7f0ab9017250%2FScreenshot_2024-05-03_at_1.31.21_PM.png?table=block&amp;id=4623f5c4-febc-42b9-b015-14ecb919c5e5&amp;cache=v2" alt="notion image" loading="lazy" decoding="async" class="medium-zoom-image" style="object-fit: cover;"></div></figure>