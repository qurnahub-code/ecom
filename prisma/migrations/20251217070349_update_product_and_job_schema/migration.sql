/*
  Warnings:

  - A unique constraint covering the columns `[sku]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `paymentMethod` on the `Order` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('JAZZCASH', 'EASYPAISA', 'COD', 'CARD');

-- DropIndex
DROP INDEX "Product_barcode_key";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "paymentMethod",
ADD COLUMN     "paymentMethod" "PaymentType" NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "brand" TEXT,
ADD COLUMN     "costPrice" DECIMAL(65,30) DEFAULT 0,
ADD COLUMN     "minStock" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "qrCode" TEXT,
ADD COLUMN     "sku" TEXT,
ADD COLUMN     "tags" TEXT,
ADD COLUMN     "taxRate" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "unit" TEXT DEFAULT 'pcs',
ALTER COLUMN "price" SET DEFAULT 0;

-- DropEnum
DROP TYPE "PaymentMethod";

-- CreateTable
CREATE TABLE "PaymentMethod" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "last4" TEXT NOT NULL,
    "expiry" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "salary" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requirements" TEXT NOT NULL,
    "experienceLevel" TEXT,
    "workplaceType" TEXT,
    "contactEmail" TEXT,
    "deadline" TIMESTAMP(3),
    "skills" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");

-- AddForeignKey
ALTER TABLE "PaymentMethod" ADD CONSTRAINT "PaymentMethod_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
