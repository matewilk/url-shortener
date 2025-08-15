-- AlterTable
ALTER TABLE "Url" ADD COLUMN     "disabledAt" TIMESTAMPTZ,
ADD COLUMN     "expiresAt" TIMESTAMPTZ;
