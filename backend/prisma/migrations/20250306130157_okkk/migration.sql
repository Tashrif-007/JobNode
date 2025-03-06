-- DropForeignKey
ALTER TABLE `JobPostReqSkills` DROP FOREIGN KEY `JobPostReqSkills_jobPostId_fkey`;

-- DropIndex
DROP INDEX `JobPostReqSkills_jobPostId_skillId_key` ON `JobPostReqSkills`;

-- AddForeignKey
ALTER TABLE `Apply` ADD CONSTRAINT `Apply_jobPostId_fkey` FOREIGN KEY (`jobPostId`) REFERENCES `JobPost`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
