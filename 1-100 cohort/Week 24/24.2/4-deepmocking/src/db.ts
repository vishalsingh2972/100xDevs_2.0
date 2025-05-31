//vitest with deepmocking + adding a db + prisma
//separated prisma-db code from the main code index.ts
import { PrismaClient } from "./generated/prisma";

export const prismaClient = new PrismaClient();