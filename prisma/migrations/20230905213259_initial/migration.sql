-- CreateTable
CREATE TABLE `apikeys` (
    `ApiID` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` TEXT NULL,
    `ApiKey` TEXT NULL,
    `UserID` INTEGER NULL,

    UNIQUE INDEX `ApiKey`(`ApiKey`(255)),
    PRIMARY KEY (`ApiID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `beatmap_creators` (
    `BeatmapID` INTEGER NOT NULL,
    `CreatorID` INTEGER NOT NULL,

    INDEX `idx_BeatmapID`(`BeatmapID`),
    PRIMARY KEY (`BeatmapID`, `CreatorID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `beatmap_edit_requests` (
    `EditID` INTEGER NOT NULL AUTO_INCREMENT,
    `BeatmapID` INTEGER NULL,
    `SetID` INTEGER NULL,
    `UserID` INTEGER NOT NULL,
    `EditData` JSON NOT NULL,
    `Timestamp` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `Status` ENUM('Pending', 'Denied', 'Approved') NULL DEFAULT 'Pending',
    `EditorID` INTEGER NULL,

    PRIMARY KEY (`EditID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `beatmaps` (
    `BeatmapID` MEDIUMINT UNSIGNED NOT NULL,
    `SetID` MEDIUMINT UNSIGNED NULL,
    `SetCreatorID` INTEGER NULL,
    `DifficultyName` VARCHAR(255) NULL,
    `Mode` TINYINT UNSIGNED NOT NULL DEFAULT 0,
    `Status` TINYINT NOT NULL DEFAULT 0,
    `SR` FLOAT NOT NULL DEFAULT 0,
    `Rating` VARCHAR(45) NULL,
    `ChartRank` INTEGER NULL,
    `ChartYearRank` INTEGER NULL,
    `Timestamp` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `RatingCount` INTEGER NULL,
    `WeightedAvg` FLOAT NULL,
    `Genre` INTEGER NULL,
    `Lang` INTEGER NULL,
    `Artist` VARCHAR(255) NULL,
    `Title` VARCHAR(255) NULL,
    `DateRanked` TIMESTAMP(0) NULL,
    `Blacklisted` BOOLEAN NOT NULL DEFAULT false,
    `BlacklistReason` TEXT NULL,
    `controversy` DECIMAL(10, 8) NULL,

    INDEX `beatmapset_id`(`SetID`),
    FULLTEXT INDEX `Artist`(`DifficultyName`, `Artist`, `Title`),
    PRIMARY KEY (`BeatmapID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `beatmapset_nominators` (
    `SetID` INTEGER NULL,
    `NominatorID` INTEGER NULL,
    `Mode` INTEGER NULL,

    INDEX `beatmapset_nominators_SetID_index`(`SetID`),
    UNIQUE INDEX `beatmapset_nominators_pk`(`SetID`, `NominatorID`, `Mode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blacklist` (
    `UserID` INTEGER NOT NULL,

    PRIMARY KEY (`UserID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comments` (
    `CommentID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserID` INTEGER NOT NULL,
    `SetID` INTEGER NOT NULL,
    `Comment` TEXT NULL,
    `date` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`CommentID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `descriptor_votes` (
    `VoteID` INTEGER NOT NULL AUTO_INCREMENT,
    `BeatmapID` INTEGER NOT NULL,
    `UserID` INTEGER NOT NULL,
    `Vote` BOOLEAN NOT NULL,
    `DescriptorID` INTEGER NOT NULL,

    INDEX `descriptor_votes_BeatmapID_index`(`BeatmapID`),
    UNIQUE INDEX `descriptor_votes_pk2`(`BeatmapID`, `UserID`, `DescriptorID`),
    PRIMARY KEY (`VoteID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `descriptors` (
    `DescriptorID` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(40) NOT NULL,
    `ShortDescription` TEXT NULL,
    `ParentID` INTEGER NULL,
    `Usable` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `descriptors_pk2`(`Name`),
    PRIMARY KEY (`DescriptorID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `logs` (
    `LogID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserID` INTEGER NOT NULL,
    `LogData` JSON NULL,

    PRIMARY KEY (`LogID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mappernames` (
    `UserID` INTEGER NOT NULL,
    `Username` VARCHAR(255) NULL,

    PRIMARY KEY (`UserID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rating_tags` (
    `UserID` INTEGER NULL,
    `BeatmapID` INTEGER NULL,
    `Tag` VARCHAR(150) NULL,
    `TagID` INTEGER NOT NULL AUTO_INCREMENT,

    UNIQUE INDEX `rating_tags_pk`(`BeatmapID`, `UserID`, `Tag`),
    PRIMARY KEY (`TagID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ratings` (
    `RatingID` INTEGER NOT NULL AUTO_INCREMENT,
    `BeatmapID` INTEGER NOT NULL,
    `UserID` INTEGER NOT NULL,
    `Score` DECIMAL(2, 1) NULL,
    `date` DATETIME(0) NOT NULL,

    INDEX `idx_beatmapID`(`BeatmapID`),
    PRIMARY KEY (`RatingID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `setretrieveinfo` (
    `LastRetrieval` DATETIME(0) NULL,
    `LastDate` DATE NULL
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_correlations` (
    `user1_id` INTEGER NULL,
    `user2_id` INTEGER NULL,
    `correlation` FLOAT NULL,

    UNIQUE INDEX `user_correlations_pk`(`user1_id`, `user2_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_relations` (
    `UserIDFrom` INTEGER NULL,
    `UserIDTo` INTEGER NULL,
    `type` INTEGER NULL,

    UNIQUE INDEX `user_relations_pk`(`UserIDTo`, `UserIDFrom`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `UserID` INTEGER NOT NULL,
    `Username` VARCHAR(255) NULL,
    `AccessToken` VARCHAR(2000) NULL,
    `RefreshToken` VARCHAR(2000) NULL,
    `banned` BOOLEAN NULL DEFAULT false,
    `Weight` DECIMAL(6, 4) NULL,
    `DoTrueRandom` BOOLEAN NOT NULL DEFAULT false,
    `Custom00Rating` VARCHAR(60) NOT NULL DEFAULT '',
    `Custom05Rating` VARCHAR(60) NOT NULL DEFAULT '',
    `Custom10Rating` VARCHAR(60) NOT NULL DEFAULT '',
    `Custom15Rating` VARCHAR(60) NOT NULL DEFAULT '',
    `Custom20Rating` VARCHAR(60) NOT NULL DEFAULT '',
    `Custom25Rating` VARCHAR(60) NOT NULL DEFAULT '',
    `Custom30Rating` VARCHAR(60) NOT NULL DEFAULT '',
    `Custom35Rating` VARCHAR(60) NOT NULL DEFAULT '',
    `Custom40Rating` VARCHAR(60) NOT NULL DEFAULT '',
    `Custom45Rating` VARCHAR(60) NOT NULL DEFAULT '',
    `Custom50Rating` VARCHAR(60) NOT NULL DEFAULT '',
    `LastAccessedSite` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `HideRatings` BOOLEAN NULL DEFAULT false,

    PRIMARY KEY (`UserID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
