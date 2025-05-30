//mocking code (separated from the main code index2.ts)
import { PrismaClient } from "./generated/prisma";

export const prismaClient = new PrismaClient();