-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('WAITING', 'IN_DELIVERY', 'COMPLETED');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'WAITING';
