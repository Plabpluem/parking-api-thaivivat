/*
  Warnings:

  - A unique constraint covering the columns `[id_car_customer]` on the table `ls_parking_lot` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `ls_parking_lot_id_car_customer_key` ON `ls_parking_lot`(`id_car_customer`);
