/*
  Warnings:

  - A unique constraint covering the columns `[discordId]` on the table `helpdesk_users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `discordId` to the `helpdesk_users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "helpdesk_users" ADD COLUMN     "discordId" VARCHAR NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "helpdesk_users_discordId_key" ON "helpdesk_users"("discordId");
