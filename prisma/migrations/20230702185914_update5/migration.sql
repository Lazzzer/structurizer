/*
  Warnings:

  - Made the column `fromName` on table `Invoice` required. This step will fail if there are existing NULL values in that column.
  - Made the column `totalAmountDue` on table `Invoice` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `InvoiceItem` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Invoice" ALTER COLUMN "fromName" SET NOT NULL,
ALTER COLUMN "totalAmountDue" SET NOT NULL;

-- AlterTable
ALTER TABLE "InvoiceItem" ALTER COLUMN "description" SET NOT NULL;
