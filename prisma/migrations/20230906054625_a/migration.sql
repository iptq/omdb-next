/*
  Warnings:

  - You are about to drop the `user_relations` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `SetID` on table `BeatmapSetNominator` required. This step will fail if there are existing NULL values in that column.
  - Made the column `NominatorID` on table `BeatmapSetNominator` required. This step will fail if there are existing NULL values in that column.
  - Made the column `Mode` on table `BeatmapSetNominator` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `idx_BeatmapID` ON `BeatmapCreator`;

-- DropIndex
DROP INDEX `beatmapset_nominators_SetID_index` ON `BeatmapSetNominator`;

-- AlterTable
ALTER TABLE `BeatmapSetNominator` MODIFY `SetID` INTEGER NOT NULL,
    MODIFY `NominatorID` INTEGER NOT NULL,
    MODIFY `Mode` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `OmdbUser` MODIFY `AccessToken` VARCHAR(191) NULL,
    MODIFY `RefreshToken` VARCHAR(191) NULL,
    MODIFY `Weight` DECIMAL(6, 4) NULL;

-- DropTable
DROP TABLE `user_relations`;

-- CreateTable
CREATE TABLE `UserRelation` (
    `UserIDFrom` INTEGER NULL,
    `UserIDTo` INTEGER NULL,
    `type` INTEGER NULL,

    UNIQUE INDEX `UserRelation_UserIDTo_UserIDFrom_key`(`UserIDTo`, `UserIDFrom`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BeatmapCreator` ADD CONSTRAINT `BeatmapCreator_BeatmapID_fkey` FOREIGN KEY (`BeatmapID`) REFERENCES `Beatmap`(`BeatmapID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BeatmapCreator` ADD CONSTRAINT `BeatmapCreator_CreatorID_fkey` FOREIGN KEY (`CreatorID`) REFERENCES `OsuUser`(`UserID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BeatmapEditRequest` ADD CONSTRAINT `BeatmapEditRequest_BeatmapID_fkey` FOREIGN KEY (`BeatmapID`) REFERENCES `Beatmap`(`BeatmapID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BeatmapSetNominator` ADD CONSTRAINT `BeatmapSetNominator_SetID_fkey` FOREIGN KEY (`SetID`) REFERENCES `BeatmapSet`(`SetID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BeatmapSetNominator` ADD CONSTRAINT `BeatmapSetNominator_NominatorID_fkey` FOREIGN KEY (`NominatorID`) REFERENCES `OsuUser`(`UserID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `BeatmapSetNominator` RENAME INDEX `beatmapset_nominators_pk` TO `BeatmapSetNominator_SetID_NominatorID_Mode_key`;

-- RenameIndex
ALTER TABLE `Descriptor` RENAME INDEX `descriptors_pk2` TO `Descriptor_Name_key`;

-- RenameIndex
ALTER TABLE `DescriptorVote` RENAME INDEX `descriptor_votes_pk2` TO `DescriptorVote_BeatmapID_UserID_DescriptorID_key`;

-- RenameIndex
ALTER TABLE `UserCorrelation` RENAME INDEX `user_correlations_pk` TO `UserCorrelation_User1ID_User2ID_key`;
