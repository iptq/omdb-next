-- CreateTable
CREATE TABLE `ApiKey` (
    `ApiKey` VARCHAR(191) NOT NULL,
    `Name` VARCHAR(191) NOT NULL,
    `UserID` INTEGER NOT NULL,

    PRIMARY KEY (`ApiKey`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BeatmapCreator` (
    `BeatmapID` INTEGER NOT NULL,
    `CreatorID` INTEGER NOT NULL,

    INDEX `idx_BeatmapID`(`BeatmapID`),
    PRIMARY KEY (`BeatmapID`, `CreatorID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BeatmapEditRequest` (
    `EditID` INTEGER NOT NULL AUTO_INCREMENT,
    `BeatmapID` INTEGER NOT NULL,
    `UserID` INTEGER NOT NULL,
    `EditData` JSON NOT NULL,
    `Timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `Status` ENUM('Pending', 'Denied', 'Approved') NOT NULL DEFAULT 'Pending',
    `EditorID` INTEGER NULL,

    PRIMARY KEY (`EditID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Beatmap` (
    `BeatmapID` INTEGER NOT NULL,
    `SetID` INTEGER NOT NULL,
    `DifficultyName` VARCHAR(191) NOT NULL,
    `Mode` INTEGER NOT NULL,
    `Status` INTEGER NOT NULL,
    `SR` DOUBLE NOT NULL,
    `Rating` VARCHAR(45) NULL,
    `ChartRank` INTEGER NULL,
    `ChartYearRank` INTEGER NULL,
    `Timestamp` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `RatingCount` INTEGER NULL,
    `WeightedAvg` FLOAT NULL,
    `Blacklisted` BOOLEAN NOT NULL DEFAULT false,
    `BlacklistReason` TEXT NULL,
    `controversy` DECIMAL(10, 8) NULL,

    PRIMARY KEY (`BeatmapID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BeatmapSet` (
    `SetID` INTEGER NOT NULL,
    `HostID` INTEGER NOT NULL,
    `Genre` INTEGER NOT NULL,
    `Lang` INTEGER NOT NULL,
    `Artist` VARCHAR(191) NOT NULL,
    `ArtistUnicode` VARCHAR(191) NOT NULL,
    `Title` VARCHAR(191) NOT NULL,
    `TitleUnicode` VARCHAR(191) NOT NULL,
    `DateRanked` TIMESTAMP(0) NOT NULL,

    FULLTEXT INDEX `BeatmapSet_Title_Artist_idx`(`Title`, `Artist`),
    PRIMARY KEY (`SetID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BeatmapSetNominator` (
    `SetID` INTEGER NULL,
    `NominatorID` INTEGER NULL,
    `Mode` INTEGER NULL,

    INDEX `beatmapset_nominators_SetID_index`(`SetID`),
    UNIQUE INDEX `beatmapset_nominators_pk`(`SetID`, `NominatorID`, `Mode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comment` (
    `CommentID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserID` INTEGER NOT NULL,
    `SetID` INTEGER NOT NULL,
    `Content` VARCHAR(191) NOT NULL,
    `DatePosted` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`CommentID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DescriptorVote` (
    `VoteID` INTEGER NOT NULL AUTO_INCREMENT,
    `BeatmapID` INTEGER NOT NULL,
    `UserID` INTEGER NOT NULL,
    `Vote` BOOLEAN NOT NULL,
    `DescriptorID` INTEGER NOT NULL,

    UNIQUE INDEX `descriptor_votes_pk2`(`BeatmapID`, `UserID`, `DescriptorID`),
    PRIMARY KEY (`VoteID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Descriptor` (
    `DescriptorID` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(40) NOT NULL,
    `ShortDescription` TEXT NULL,
    `ParentID` INTEGER NULL,
    `Usable` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `descriptors_pk2`(`Name`),
    PRIMARY KEY (`DescriptorID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Log` (
    `LogID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserID` INTEGER NOT NULL,
    `LogData` JSON NOT NULL,

    PRIMARY KEY (`LogID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RatingTag` (
    `TagID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserID` INTEGER NOT NULL,
    `BeatmapID` INTEGER NOT NULL,
    `Tag` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `RatingTag_BeatmapID_UserID_Tag_key`(`BeatmapID`, `UserID`, `Tag`),
    PRIMARY KEY (`TagID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Rating` (
    `RatingID` INTEGER NOT NULL AUTO_INCREMENT,
    `BeatmapID` INTEGER NOT NULL,
    `UserID` INTEGER NOT NULL,
    `Score` DECIMAL(2, 1) NOT NULL,
    `DateRated` DATETIME(3) NOT NULL,

    PRIMARY KEY (`RatingID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SetRetrieveInfo` (
    `Id` INTEGER NOT NULL,
    `LastRetrieval` DATETIME(3) NOT NULL,
    `LastDate` DATETIME(3) NOT NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserCorrelation` (
    `User1ID` INTEGER NOT NULL,
    `User2ID` INTEGER NOT NULL,
    `Correlation` DOUBLE NOT NULL,
    `Data` JSON NOT NULL,

    UNIQUE INDEX `user_correlations_pk`(`User1ID`, `User2ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_relations` (
    `UserIDFrom` INTEGER NULL,
    `UserIDTo` INTEGER NULL,
    `type` INTEGER NULL,

    UNIQUE INDEX `user_relations_pk`(`UserIDTo`, `UserIDFrom`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OmdbUser` (
    `UserID` INTEGER NOT NULL,
    `AccessToken` VARCHAR(191) NOT NULL,
    `RefreshToken` VARCHAR(191) NOT NULL,
    `Weight` DECIMAL(6, 4) NOT NULL,
    `DoTrueRandom` BOOLEAN NOT NULL DEFAULT false,
    `CustomRatings` JSON NOT NULL,
    `LastAccessedSite` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `HideRatings` BOOLEAN NOT NULL DEFAULT false,
    `IsBlacklisted` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`UserID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OsuUser` (
    `UserID` INTEGER NOT NULL,
    `Username` VARCHAR(255) NOT NULL,
    `Banned` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`UserID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ApiKey` ADD CONSTRAINT `ApiKey_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `OmdbUser`(`UserID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BeatmapEditRequest` ADD CONSTRAINT `BeatmapEditRequest_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `OmdbUser`(`UserID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Beatmap` ADD CONSTRAINT `Beatmap_SetID_fkey` FOREIGN KEY (`SetID`) REFERENCES `BeatmapSet`(`SetID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BeatmapSet` ADD CONSTRAINT `BeatmapSet_HostID_fkey` FOREIGN KEY (`HostID`) REFERENCES `OsuUser`(`UserID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `OmdbUser`(`UserID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_SetID_fkey` FOREIGN KEY (`SetID`) REFERENCES `BeatmapSet`(`SetID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DescriptorVote` ADD CONSTRAINT `DescriptorVote_BeatmapID_fkey` FOREIGN KEY (`BeatmapID`) REFERENCES `Beatmap`(`BeatmapID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DescriptorVote` ADD CONSTRAINT `DescriptorVote_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `OmdbUser`(`UserID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DescriptorVote` ADD CONSTRAINT `DescriptorVote_DescriptorID_fkey` FOREIGN KEY (`DescriptorID`) REFERENCES `Descriptor`(`DescriptorID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Log` ADD CONSTRAINT `Log_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `OmdbUser`(`UserID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RatingTag` ADD CONSTRAINT `RatingTag_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `OmdbUser`(`UserID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RatingTag` ADD CONSTRAINT `RatingTag_BeatmapID_fkey` FOREIGN KEY (`BeatmapID`) REFERENCES `Beatmap`(`BeatmapID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rating` ADD CONSTRAINT `Rating_BeatmapID_fkey` FOREIGN KEY (`BeatmapID`) REFERENCES `Beatmap`(`BeatmapID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rating` ADD CONSTRAINT `Rating_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `OmdbUser`(`UserID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserCorrelation` ADD CONSTRAINT `UserCorrelation_User1ID_fkey` FOREIGN KEY (`User1ID`) REFERENCES `OmdbUser`(`UserID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserCorrelation` ADD CONSTRAINT `UserCorrelation_User2ID_fkey` FOREIGN KEY (`User2ID`) REFERENCES `OmdbUser`(`UserID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OmdbUser` ADD CONSTRAINT `OmdbUser_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `OsuUser`(`UserID`) ON DELETE RESTRICT ON UPDATE CASCADE;
