-- AlterTable
ALTER TABLE `BeatmapSet` MODIFY `ArtistUnicode` VARCHAR(191) NULL,
    MODIFY `TitleUnicode` VARCHAR(191) NULL,
    MODIFY `DateRanked` DATETIME(3) NOT NULL;
