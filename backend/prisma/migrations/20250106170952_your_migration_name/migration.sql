-- CreateTable
CREATE TABLE `JobPost` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `position` VARCHAR(191) NOT NULL,
    `salary` DOUBLE NOT NULL,
    `experience` INTEGER NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `JobPost_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Skills` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Skills_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JobPostReqSkills` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `jobPostId` INTEGER NOT NULL,
    `skillId` INTEGER NOT NULL,

    UNIQUE INDEX `JobPostReqSkills_jobPostId_skillId_key`(`jobPostId`, `skillId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `JobPostReqSkills` ADD CONSTRAINT `JobPostReqSkills_jobPostId_fkey` FOREIGN KEY (`jobPostId`) REFERENCES `JobPost`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JobPostReqSkills` ADD CONSTRAINT `JobPostReqSkills_skillId_fkey` FOREIGN KEY (`skillId`) REFERENCES `Skills`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
