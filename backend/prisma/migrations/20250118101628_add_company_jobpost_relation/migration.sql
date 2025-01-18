/*
  Warnings:

  - Added the required column `companyId` to the `JobPost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `JobPost` ADD COLUMN `companyId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `JobPost` ADD CONSTRAINT `JobPost_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
