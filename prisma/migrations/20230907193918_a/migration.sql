/*
  Warnings:

  - Added the required column `LastFetched` to the `OsuUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `OsuUser` ADD COLUMN `LastFetched` DATETIME(3) NOT NULL,
    MODIFY `Username` VARCHAR(255) NULL;
