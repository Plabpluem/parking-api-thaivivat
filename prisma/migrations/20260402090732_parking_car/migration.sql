-- CreateTable
CREATE TABLE `ls_parking_lot` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `number` INTEGER NOT NULL,
    `is_available` BOOLEAN NOT NULL DEFAULT true,
    `id_car_customer` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ls_parking_lot_uuid_key`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ls_car_customer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `plate_number` VARCHAR(191) NOT NULL,
    `size` ENUM('small', 'medium', 'large') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ls_car_customer_uuid_key`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ls_parking_lot` ADD CONSTRAINT `ls_parking_lot_id_car_customer_fkey` FOREIGN KEY (`id_car_customer`) REFERENCES `ls_car_customer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
