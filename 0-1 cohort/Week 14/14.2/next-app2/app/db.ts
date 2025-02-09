//ref:https://www.prisma.io/docs/orm/more/help-and-troubleshooting/nextjs-help

import { PrismaClient } from "@prisma/client";

console.log('inside db.ts');

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();
(globalForPrisma.prisma ? console.log('global prisma client instantiated') : console.log('new prisma client instantiated'));

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;