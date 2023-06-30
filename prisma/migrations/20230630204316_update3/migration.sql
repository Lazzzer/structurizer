/*
  Warnings:

  - Made the column `description` on table `ReceiptItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `quantity` on table `ReceiptItem` required. This step will fail if there are existing NULL values in that column.
  - Made the column `amount` on table `ReceiptItem` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ReceiptItem" ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "quantity" SET NOT NULL,
ALTER COLUMN "amount" SET NOT NULL;
