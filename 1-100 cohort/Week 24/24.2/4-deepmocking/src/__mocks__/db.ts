//vitest with deepmocking + adding a db + prisma
//Here we're using the mockDeep function from vitest-mock-extended to create a deep mock of the real PrismaClient instance present in src/db.ts. This will automatically mock all the properties and functions of the prismaClient object.
import { PrismaClient } from '@prisma/client'
import { mockDeep } from 'vitest-mock-extended'

export const prismaClient = mockDeep<PrismaClient>(); //mockDeep so now all the properties and functions of the prismaClient instance are availavle to us and ready for use during testing.