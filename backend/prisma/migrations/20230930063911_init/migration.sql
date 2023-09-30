-- CreateTable
CREATE TABLE "channels" (
    "id" UUID NOT NULL,
    "discord_channel_id" VARCHAR,
    "organization_id" UUID NOT NULL,

    CONSTRAINT "channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "helpdesk_users" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "email" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "locale" VARCHAR NOT NULL,
    "access_token" VARCHAR NOT NULL,
    "refresh_token" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

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
CREATE TABLE "question_sheets" (
    "id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
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
    "questioner_id" UUID NOT NULL,
    "content" JSON NOT NULL,
    "question_sheet_id" UUID NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "channels" ADD CONSTRAINT "channels_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "helpdesk_users" ADD CONSTRAINT "helpdesk_users_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "question_sheets" ADD CONSTRAINT "question_sheets_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_question_sheet_id_fkey" FOREIGN KEY ("question_sheet_id") REFERENCES "question_sheets"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_questioner_id_fkey" FOREIGN KEY ("questioner_id") REFERENCES "questioners"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
