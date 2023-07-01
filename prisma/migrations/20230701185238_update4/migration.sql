/*
  Warnings:

  - Made the column `date` on table `CardStatement` required. This step will fail if there are existing NULL values in that column.
  - Made the column `date` on table `Invoice` required. This step will fail if there are existing NULL values in that column.
  - Made the column `date` on table `Receipt` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "CardStatement" ALTER COLUMN "date" SET NOT NULL;

-- AlterTable
ALTER TABLE "Invoice" ALTER COLUMN "date" SET NOT NULL;

-- AlterTable
ALTER TABLE "Receipt" ALTER COLUMN "date" SET NOT NULL;
