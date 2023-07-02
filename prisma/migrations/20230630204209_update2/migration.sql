/*
  Warnings:

  - Made the column `from` on table `Receipt` required. This step will fail if there are existing NULL values in that column.
  - Made the column `total` on table `Receipt` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Receipt" ALTER COLUMN "from" SET NOT NULL,
ALTER COLUMN "total" SET NOT NULL;
