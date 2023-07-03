/*
  Warnings:

  - Made the column `issuerName` on table `CardStatement` required. This step will fail if there are existing NULL values in that column.
  - Made the column `totalAmountDue` on table `CardStatement` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `CardTransaction` required. This step will fail if there are existing NULL values in that column.
  - Made the column `amount` on table `CardTransaction` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "CardStatement" ALTER COLUMN "issuerName" SET NOT NULL,
ALTER COLUMN "totalAmountDue" SET NOT NULL;

-- AlterTable
ALTER TABLE "CardTransaction" ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "amount" SET NOT NULL;
