```
npm install
npm run dev
```

```
npm run deploy
```

//Notes
- db url 'database_url' in .env is the postgres db url ~ local deployment, CLI commands: When running CLI commands like npx prisma migrate, npx prisma generate, or npx prisma studio, all these will use database URL from .env
- db url 'database_url' in wrangler.toml is the prisma accelerate connection pooling url ~ With Prisma Accelerate, your backend application uses the connection pool URL from wrangler.toml, so these env variables(i.e here database_url) is the one that will eventually be used by our cloudflare workers. In short "When deploying to Cloudflare Workers, this DATABASE_URL from wrangler.toml will be used"
- local deployment vs production deployment ~ so locally when we are suppose testing and adding user table to db and then adding user names as list for filling this user table in db... we will connect to db directly and in this case database_url from .env will be used i.e we are directly inteacting with db without connection pool where prisma will directly send the data to postgres db directly, whereas when we our app is running in multiple servers or cloudflare workers accross the globe it will not directly add data or send request to db it must first pass through the connection pooling and in this case where our app is running in multiple servers or cloudflare workers accross the globe we will be using the wrangler.toml file database_url when making requests to db via prisma where prisma will first send the request to connection pool and then eventually it may go to db later on...
- (EXTRA) Henca, When deploying to Cloudflare Workers:
  - wrangler.toml is accessible to Cloudflare Workers, as it's used for configuration.
  - .env file remains private and is not accessible to Cloudflare Workers.