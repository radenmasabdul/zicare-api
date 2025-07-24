/*
  Warnings:

  - You are about to drop the column `location` on the `EnvironmentSensor` table. All the data in the column will be lost.
  - You are about to drop the column `parameter` on the `EnvironmentSensor` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `EnvironmentSensor` table. All the data in the column will be lost.
  - Added the required column `locationId` to the `EnvironmentSensor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parameterId` to the `EnvironmentSensor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "EnvironmentSensor" DROP COLUMN "location",
DROP COLUMN "parameter",
DROP COLUMN "unit",
ADD COLUMN     "locationId" INTEGER NOT NULL,
ADD COLUMN     "parameterId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parameter" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "unit" TEXT NOT NULL,

    CONSTRAINT "Parameter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Location_name_key" ON "Location"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Parameter_name_key" ON "Parameter"("name");

-- AddForeignKey
ALTER TABLE "EnvironmentSensor" ADD CONSTRAINT "EnvironmentSensor_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnvironmentSensor" ADD CONSTRAINT "EnvironmentSensor_parameterId_fkey" FOREIGN KEY ("parameterId") REFERENCES "Parameter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
