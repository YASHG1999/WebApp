-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bannedUntil" TIMESTAMP(3),
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isSuperAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastSignInAt" TIMESTAMP(3),
ADD COLUMN     "phoneConfirmedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Otp" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "Otp" TEXT NOT NULL,
    "retryAllowed" INTEGER NOT NULL,
    "validTill" TIMESTAMP(3) NOT NULL,
    "retryDone" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "token" (
    "id" SERIAL NOT NULL,
    "refreshToken" TEXT,

    CONSTRAINT "token_pkey" PRIMARY KEY ("id")
);
