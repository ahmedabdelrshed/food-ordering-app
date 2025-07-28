/*
  Warnings:

  - Made the column `city` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `streetAddress` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "city" SET NOT NULL,
ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "streetAddress" SET NOT NULL;
