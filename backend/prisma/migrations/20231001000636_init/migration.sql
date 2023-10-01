-- CreateTable
CREATE TABLE "channels" (
    "id" UUID NOT NULL,
    "discordChannelId" VARCHAR,
    "organizationId" UUID NOT NULL,

    CONSTRAINT "channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "helpdesk_users" (
    "id" UUID NOT NULL,
    "email" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "locale" VARCHAR NOT NULL,
    "accessToken" VARCHAR NOT NULL,
    "refreshToken" VARCHAR NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizationsId" UUID,

    CONSTRAINT "helpdesk_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizations" (
    "id" UUID NOT NULL,
    "domain" VARCHAR NOT NULL,
    "name" VARCHAR,

    CONSTRAINT "account_companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizations_users" (
    "organizationId" UUID NOT NULL,
    "helpdeskUserId" UUID NOT NULL,

    CONSTRAINT "organizations_users_pkey" PRIMARY KEY ("organizationId","helpdeskUserId")
);

-- CreateTable
CREATE TABLE "question_sheets" (
    "id" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "structure" JSON NOT NULL,

    CONSTRAINT "question_sheets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questioners" (
    "id" UUID NOT NULL,
    "email" VARCHAR NOT NULL,
    "name" VARCHAR,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" UUID NOT NULL,
    "questionerId" UUID NOT NULL,
    "content" JSON NOT NULL,
    "questionSheetId" UUID NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "channels" ADD CONSTRAINT "channels_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "helpdesk_users" ADD CONSTRAINT "helpdesk_users_organizationsId_fkey" FOREIGN KEY ("organizationsId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations_users" ADD CONSTRAINT "organizations_users_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations_users" ADD CONSTRAINT "organizations_users_helpdeskUserId_fkey" FOREIGN KEY ("helpdeskUserId") REFERENCES "helpdesk_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_sheets" ADD CONSTRAINT "question_sheets_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_questionSheetId_fkey" FOREIGN KEY ("questionSheetId") REFERENCES "question_sheets"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_questionerId_fkey" FOREIGN KEY ("questionerId") REFERENCES "questioners"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
