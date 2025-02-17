/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `OtpCode` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "OtpCode_otp_key";

-- CreateIndex
CREATE UNIQUE INDEX "OtpCode_email_key" ON "OtpCode"("email");
