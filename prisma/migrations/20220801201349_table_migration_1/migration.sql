/*
  Warnings:

  - The primary key for the `devices` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `retries` on the `otp_tokens` table. All the data in the column will be lost.
  - You are about to alter the column `phone_number` on the `otp_tokens` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(15)`.
  - You are about to alter the column `token` on the `refresh_token` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[device_id]` on the table `devices` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[token]` on the table `refresh_token` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[device_id]` on the table `refresh_token` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `device_id` to the `devices` table without a default value. This is not possible if the table is not empty.
  - Made the column `user_id` on table `devices` required. This step will fail if there are existing NULL values in that column.
  - Made the column `valid_till` on table `otp_tokens` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sent_at` on table `otp_tokens` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `device_id` to the `refresh_token` table without a default value. This is not possible if the table is not empty.
  - Made the column `token` on table `refresh_token` required. This step will fail if there are existing NULL values in that column.
  - Made the column `valid_till` on table `refresh_token` required. This step will fail if there are existing NULL values in that column.
  - Made the column `revoked` on table `refresh_token` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "refresh_token" DROP CONSTRAINT "refresh_token_user_id_fkey";

-- AlterTable
ALTER TABLE "devices" DROP CONSTRAINT "devices_pkey",
ADD COLUMN     "device_id" TEXT NOT NULL,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "last_refreshed_at" TIMESTAMP(3),
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET NOT NULL,
ADD CONSTRAINT "devices_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "devices_id_seq";

-- AlterTable
ALTER TABLE "otp_tokens" DROP COLUMN "retries",
ADD COLUMN     "retries_count" INTEGER,
ALTER COLUMN "phone_number" SET DATA TYPE VARCHAR(15),
ALTER COLUMN "valid_till" SET NOT NULL,
ALTER COLUMN "sent_at" SET NOT NULL;

-- AlterTable
ALTER TABLE "refresh_token" ADD COLUMN     "device_id" TEXT NOT NULL,
ALTER COLUMN "token" SET NOT NULL,
ALTER COLUMN "token" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "valid_till" SET NOT NULL,
ALTER COLUMN "revoked" SET NOT NULL;

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255),
    "phone_number" VARCHAR(15) NOT NULL,
    "email" VARCHAR(255),
    "avatar_url" VARCHAR(255),
    "phone_confirmed_at" TIMESTAMP(3),
    "email_confirmed_at" TIMESTAMP(3),
    "last_sign_in_at" TIMESTAMP(3),
    "meta_data" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "banned_until" TIMESTAMP(3),
    "is_super_admin" BOOLEAN NOT NULL DEFAULT false,
    "roles" "UserRole" NOT NULL DEFAULT 'CONSUMER',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "upadted_by" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_phone_number_key" ON "user"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "devices_device_id_key" ON "devices"("device_id");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_token_token_key" ON "refresh_token"("token");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_token_device_id_key" ON "refresh_token"("device_id");

-- AddForeignKey
ALTER TABLE "refresh_token" ADD CONSTRAINT "refresh_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_token" ADD CONSTRAINT "refresh_token_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
