-- CreateTable
CREATE TABLE "OrderSequence" (
    "id" TEXT NOT NULL,
    "value" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "OrderSequence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "cityId" TEXT NOT NULL,
    "deliveryType" TEXT NOT NULL,
    "pickupLocationId" TEXT,
    "address" TEXT,
    "clientType" TEXT NOT NULL,
    "companyName" TEXT,
    "comment" TEXT,
    "items" JSONB NOT NULL,
    "calculation" JSONB NOT NULL,
    "assemblyEnabled" BOOLEAN,
    "paymentMethod" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "paymentStatus" TEXT NOT NULL DEFAULT 'none',
    "paymentId" TEXT,
    "paidAmountRub" INTEGER,
    "chargeAmountRub" INTEGER,
    "managerNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");

-- CreateIndex
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "Order_status_idx" ON "Order"("status");
