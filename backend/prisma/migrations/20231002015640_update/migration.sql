/*
  Warnings:

  - Added the required column `name` to the `channels` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "channels" ADD COLUMN     "name" VARCHAR NOT NULL;

-- AlterTable
ALTER TABLE "helpdesk_users" ADD COLUMN     "icon" VARCHAR;

-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "guildId" VARCHAR,
ADD COLUMN     "icon" VARCHAR;
