/*
  Warnings:

  - You are about to drop the column `email` on the `Log` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Log` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Log` table. All the data in the column will be lost.
  - Added the required column `level` to the `Log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `message` to the `Log` table without a default value. This is not possible if the table is not empty.
  - Added the required column `meta` to the `Log` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Log" DROP COLUMN "email",
DROP COLUMN "name",
DROP COLUMN "password",
ADD COLUMN     "level" TEXT NOT NULL,
ADD COLUMN     "message" TEXT NOT NULL,
ADD COLUMN     "meta" JSONB NOT NULL;
