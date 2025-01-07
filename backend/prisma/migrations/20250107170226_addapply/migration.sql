/*
  Warnings:

  - Added the required column `cvPath` to the `Apply` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Apply` ADD COLUMN `cvPath` VARCHAR(191) NOT NULL;
