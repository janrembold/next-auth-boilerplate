/*
  Warnings:

  - You are about to drop the `Authentication` table. If the table is not empty, all the data it contains will be lost.
  - The required column `verificationToken` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Authentication" DROP CONSTRAINT "Authentication_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "password" TEXT,
ADD COLUMN     "verificationToken" TEXT NOT NULL;

-- DropTable
DROP TABLE "Authentication";
