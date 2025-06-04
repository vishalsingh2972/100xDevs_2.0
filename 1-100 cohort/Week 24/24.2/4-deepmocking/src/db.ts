//vitest with deepmocking + adding a db + prisma
//vitest with deepmocking + adding a db + prisma + mockReturnValue
//separated prisma-db code from the main code index.ts
import { PrismaClient } from "./generated/prisma";

export const prismaClient = new PrismaClient();

/* When using deep mocking with vitest-mock-extended, all the properties and methods/functions of the PrismaClient—including nested models operations LITERALLY ALL OF THEM — are automatically mocked and readily available for use during testing.
console.log(Object.keys(prismaClient)); //list of all properties and methods/functions of the PrismaClient instance now directly available to us
console.log(Object.keys(prismaClient.sum));
*/