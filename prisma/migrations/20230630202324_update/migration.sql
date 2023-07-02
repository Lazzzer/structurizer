/*
  Warnings:

  - Made the column `category` on table `CardTransaction` required. This step will fail if there are existing NULL values in that column.
  - Made the column `category` on table `Invoice` required. This step will fail if there are existing NULL values in that column.
  - Made the column `category` on table `Receipt` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "CardTransaction" ALTER COLUMN "category" SET NOT NULL;

-- AlterTable
ALTER TABLE "Invoice" ALTER COLUMN "category" SET NOT NULL;

-- AlterTable
ALTER TABLE "Receipt" ALTER COLUMN "category" SET NOT NULL;
