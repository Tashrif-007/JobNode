/*
  Warnings:

  - You are about to drop the column `companyId` on the `JobPost` table. All the data in the column will be lost.
  - Added the required column `userId` to the `JobPost` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `JobPost` DROP FOREIGN KEY `JobPost_companyId_fkey`;

-- DropIndex
DROP INDEX `JobPost_companyId_fkey` ON `JobPost`;

-- AlterTable
ALTER TABLE `JobPost` DROP COLUMN `companyId`,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `JobPost` ADD CONSTRAINT `JobPost_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
