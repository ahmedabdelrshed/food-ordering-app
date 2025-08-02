/*
  Warnings:

  - You are about to drop the column `adminId` on the `chats` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `chats` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `chats` table. All the data in the column will be lost.
  - You are about to drop the column `senderId` on the `messages` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `chats` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `chats` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `senderType` on the `messages` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "chats" DROP COLUMN "adminId",
DROP COLUMN "customerId",
DROP COLUMN "status",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "senderId",
DROP COLUMN "senderType",
ADD COLUMN     "senderType" "UserRole" NOT NULL;

-- DropEnum
DROP TYPE "ChatStatus";

-- DropEnum
DROP TYPE "SenderType";

-- CreateIndex
CREATE UNIQUE INDEX "chats_userId_key" ON "chats"("userId");

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
