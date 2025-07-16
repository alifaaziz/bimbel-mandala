-- CreateTable
CREATE TABLE `attendances` (
    `id` VARCHAR(191) NOT NULL,
    `schedule_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `status` ENUM('masuk', 'izin', 'alpha') NOT NULL,
    `reason` VARCHAR(191) NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bimbel_packages` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `level` ENUM('SD', 'SMP', 'SMA', 'Umum') NOT NULL,
    `total_meetings` INTEGER NOT NULL,
    `time` DATETIME(3) NOT NULL,
    `duration` INTEGER NOT NULL,
    `area` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `discount` DECIMAL(10, 2) NULL,
    `slug` VARCHAR(191) NOT NULL,
    `start_date` DATETIME(3) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `days` VARCHAR(191) NULL,
    `deleted_at` DATETIME(3) NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE INDEX `bimbel_packages_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `class` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `status` ENUM('berjalan', 'selesai') NOT NULL,
    `order_id` VARCHAR(191) NULL,
    `tutor_id` VARCHAR(191) NULL,
    `max_students` INTEGER NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE INDEX `class_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `group_types` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('privat', 'grup2', 'grup3', 'grup4', 'grup5', 'kelas') NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `discPrice` DECIMAL(10, 2) NULL,
    `package_id` VARCHAR(191) NOT NULL,
    `max_student` DECIMAL(65, 30) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `viewed` BOOLEAN NOT NULL DEFAULT false,
    `description` VARCHAR(191) NULL,
    `reason` VARCHAR(191) NULL,
    `photo` VARCHAR(191) NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orders` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `package_id` VARCHAR(191) NOT NULL,
    `group_type_id` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(10, 2) NULL,
    `address` VARCHAR(191) NULL,
    `payment_id` VARCHAR(191) NULL,
    `status` ENUM('pending', 'paid', 'cancel', 'kelas') NOT NULL DEFAULT 'pending',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `otps` (
    `id` VARCHAR(191) NOT NULL,
    `otp` VARCHAR(191) NOT NULL,
    `used` BOOLEAN NOT NULL DEFAULT false,
    `expired_at` TIMESTAMP NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `password_reset` (
    `id` VARCHAR(191) NOT NULL,
    `used` BOOLEAN NOT NULL DEFAULT false,
    `token` VARCHAR(191) NOT NULL,
    `expired_at` TIMESTAMP NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `id` VARCHAR(191) NOT NULL,
    `platform` VARCHAR(191) NOT NULL,
    `accountNumber` VARCHAR(191) NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Salary` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `orderId` VARCHAR(191) NOT NULL,
    `total` DECIMAL(10, 2) NOT NULL,
    `payroll` DECIMAL(10, 2) NOT NULL,
    `status` ENUM('terbayar', 'pending') NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `schedules` (
    `id` VARCHAR(191) NOT NULL,
    `class_id` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `meet` INTEGER NOT NULL,
    `status` ENUM('jadwal_ulang', 'terjadwal', 'masuk', 'izin', 'alpha') NOT NULL,
    `information` VARCHAR(191) NULL,
    `slug` VARCHAR(191) NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE INDEX `schedules_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_class` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `class_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `students` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `parent_phone` VARCHAR(191) NULL,
    `level` ENUM('SD', 'SMP', 'SMA', 'Umum') NULL,
    `school_name` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE INDEX `students_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tutor_application` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `birth_date` DATETIME(3) NULL,
    `gender` ENUM('Male', 'Female') NULL,
    `phone` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `subjects` VARCHAR(191) NULL,
    `status` ENUM('TH1', 'TH2', 'TH3', 'TH4', 'TH5', 'S1', 'S2', 'S3') NULL,
    `major` VARCHAR(191) NULL,
    `school` VARCHAR(191) NULL,
    `teach_level` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `photo` VARCHAR(191) NULL,
    `days` VARCHAR(191) NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE INDEX `tutor_application_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tutors` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `birth_date` DATETIME(3) NULL,
    `gender` ENUM('Male', 'Female') NULL,
    `phone` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `subjects` VARCHAR(191) NULL,
    `status` ENUM('TH1', 'TH2', 'TH3', 'TH4', 'TH5', 'S1', 'S2', 'S3') NULL,
    `major` VARCHAR(191) NULL,
    `school` VARCHAR(191) NULL,
    `teach_level` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `photo` VARCHAR(191) NULL,
    `percent` DECIMAL(10, 2) NOT NULL,
    `days` VARCHAR(191) NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE INDEX `tutors_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NULL,
    `role` ENUM('siswa', 'tutor', 'admin') NOT NULL DEFAULT 'siswa',
    `verified` BOOLEAN NOT NULL DEFAULT false,
    `google_id` VARCHAR(191) NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `attendances` ADD CONSTRAINT `attendances_schedule_id_fkey` FOREIGN KEY (`schedule_id`) REFERENCES `schedules`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attendances` ADD CONSTRAINT `attendances_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bimbel_packages` ADD CONSTRAINT `bimbel_packages_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `class` ADD CONSTRAINT `class_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `class` ADD CONSTRAINT `class_tutor_id_fkey` FOREIGN KEY (`tutor_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `group_types` ADD CONSTRAINT `group_types_package_id_fkey` FOREIGN KEY (`package_id`) REFERENCES `bimbel_packages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_package_id_fkey` FOREIGN KEY (`package_id`) REFERENCES `bimbel_packages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_group_type_id_fkey` FOREIGN KEY (`group_type_id`) REFERENCES `group_types`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_payment_id_fkey` FOREIGN KEY (`payment_id`) REFERENCES `Payment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `otps` ADD CONSTRAINT `otps_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `password_reset` ADD CONSTRAINT `password_reset_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Salary` ADD CONSTRAINT `Salary_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Salary` ADD CONSTRAINT `Salary_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `schedules` ADD CONSTRAINT `schedules_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `class`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_class` ADD CONSTRAINT `student_class_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_class` ADD CONSTRAINT `student_class_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `class`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `students` ADD CONSTRAINT `students_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tutors` ADD CONSTRAINT `tutors_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
