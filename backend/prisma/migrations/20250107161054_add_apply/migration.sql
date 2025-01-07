-- CreateTable
CREATE TABLE `Apply` (
    `applicationId` INTEGER NOT NULL AUTO_INCREMENT,
    `jobSeekerId` INTEGER NOT NULL,
    `jobPostId` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Apply_jobSeekerId_jobPostId_key`(`jobSeekerId`, `jobPostId`),
    PRIMARY KEY (`applicationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Apply` ADD CONSTRAINT `Apply_jobSeekerId_fkey` FOREIGN KEY (`jobSeekerId`) REFERENCES `JobSeeker`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Apply` ADD CONSTRAINT `Apply_jobPostId_fkey` FOREIGN KEY (`jobPostId`) REFERENCES `JobPost`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
