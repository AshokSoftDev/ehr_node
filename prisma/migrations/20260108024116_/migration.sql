-- AlterTable
ALTER TABLE "public"."Invoice" ADD COLUMN     "coupon_discount_amount" DECIMAL(65,30) NOT NULL DEFAULT 0;
