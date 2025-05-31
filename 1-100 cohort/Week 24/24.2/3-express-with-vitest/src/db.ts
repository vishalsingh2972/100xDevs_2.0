//separated prisma-db code from the main code index2.ts
//we will later on mock out prisma-db interaction part during tests so it's a good practice to separate the database code from the main application logic befforehand.
import { PrismaClient } from "./generated/prisma";

export const prismaClient = new PrismaClient();

//then while testing in index2.test.ts we use vi.mock('../db', where we use vitest and tell prisma to not use the real Prisma client that is present here in the db.ts, but instead use the dummy fake prisma client present inside the vi.mock.....
//so now during tests whenever await prismaClient.sum.create({ ... }) is called in index2.ts it will not add data to real db but will point to fake empty function that we defined in index2.test.ts i.e 'create: vi.fn()' that does nothing, hence no real DB calls are made during tests.

/* Hence,
- db.ts	=> Real PrismaClient	=> Used in production and development
- index2.test.ts	=> vi.mock('../db', ...)	=> Replaces real prisma client with a fake one in tests
- Result	=> No real DB calls during tests ✅	=> Safer, faster, isolated tests
*/