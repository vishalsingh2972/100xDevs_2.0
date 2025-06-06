import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async () => {
  await prisma.$transaction([prisma.request.deleteMany()]);
};
