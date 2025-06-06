-- CreateEnum
CREATE TYPE "Type" AS ENUM ('ADD', 'MUL');

-- CreateTable
CREATE TABLE "Request" (
    "id" SERIAL NOT NULL,
    "a" INTEGER NOT NULL,
    "b" INTEGER NOT NULL,
    "answer" INTEGER NOT NULL,
    "type" "Type" NOT NULL,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);
