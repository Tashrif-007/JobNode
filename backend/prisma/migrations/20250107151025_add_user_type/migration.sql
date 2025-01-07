-- AlterTable
ALTER TABLE `Company` MODIFY `description` VARCHAR(191) NULL,
    MODIFY `website` VARCHAR(191) NULL,
    MODIFY `techStack` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `JobSeeker` MODIFY `salaryExpectation` DOUBLE NULL,
    MODIFY `location` VARCHAR(191) NULL,
    MODIFY `experience` INTEGER NULL;
