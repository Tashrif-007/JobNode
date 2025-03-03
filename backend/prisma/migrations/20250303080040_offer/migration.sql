-- CreateTable
CREATE TABLE `Hires` (
    `hiresId` INTEGER NOT NULL AUTO_INCREMENT,
    `jobSeekerId` INTEGER NOT NULL,
    `companyId` INTEGER NOT NULL,
    `hireDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Hires_jobSeekerId_companyId_key`(`jobSeekerId`, `companyId`),
    PRIMARY KEY (`hiresId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Offers` (
    `offerId` INTEGER NOT NULL AUTO_INCREMENT,
    `jobSeekerId` INTEGER NOT NULL,
    `companyId` INTEGER NOT NULL,
    `applicationId` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `offerLetterPath` VARCHAR(191) NOT NULL,
    `offerDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`offerId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Hires` ADD CONSTRAINT `Hires_jobSeekerId_fkey` FOREIGN KEY (`jobSeekerId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Hires` ADD CONSTRAINT `Hires_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Offers` ADD CONSTRAINT `Offers_jobSeekerId_fkey` FOREIGN KEY (`jobSeekerId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Offers` ADD CONSTRAINT `Offers_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Offers` ADD CONSTRAINT `Offers_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `Apply`(`applicationId`) ON DELETE CASCADE ON UPDATE CASCADE;
