/*
  Warnings:

  - Made the column `otp` on table `otp_tokens` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone_number` on table `otp_tokens` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `otp_tokens` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `otp_tokens` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "otp_tokens" ALTER COLUMN "otp" SET NOT NULL,
ALTER COLUMN "phone_number" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET NOT NULL;
