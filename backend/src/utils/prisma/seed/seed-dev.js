import { date } from 'zod';
import { prisma } from '../../../utils/db.js';
import bcrypt from 'bcrypt';
import { ScheduleService } from '../../../services/schedule.js';

async function main() {
    // Seed days
    const days = [
        { id: "0195c5ed-3fc8-7959-bf34-26c3775d7e52", daysName: 'Senin' },
        { id: "0195c5ed-3fc8-7496-b6b3-97e307a38413", daysName: 'Selasa' },
        { id: "0195c5ed-3fc8-7553-a32d-dcda3aed1d21", daysName: 'Rabu' },
        { id: "0195c5ed-3fc8-7164-9ffd-ec049b3082a4", daysName: 'Kamis' },
        { id: "0195c5ed-3fc8-7f0b-920f-20ddcfbb23d0", daysName: 'Jumat' },
        { id: "0195c5ed-3fc8-7819-8210-360b97629ef2", daysName: 'Sabtu' },
        { id: "0195c5ed-3fc8-79f2-9084-48030730bdba", daysName: 'Minggu' },
    ];

    for (const day of days) {
        await prisma.day.create({
            data: day,
        });
    }

    // Seed users
    const users = [
        {
            id: "0195c5ed-3fc8-705b-8a17-dcef7de62796",
            name: 'Admin Development',
            email: 'admin@mail.com',
            password: await bcrypt.hash('password123', 10),
            role: 'admin',
            verified: true,
        },
        {
            id: "0195c5ed-3fc9-71de-93d8-d850abe7b4fa",
            name: 'Su Yon Oh',
            email: 'suyono@mail.com',
            password: await bcrypt.hash('password123', 10),
            role: 'siswa',
            verified: true,
        },
        {
            id: "0195d575-26cb-73a9-ac9c-4395ebfb2326",
            name: 'So Lie Kien',
            email: 'solikin@mail.com',
            password: await bcrypt.hash('password123', 10),
            role: 'siswa',
            verified: true,
        },
        {
            id: "019618a1-68a4-7742-9471-2548f7726e86",
            name: 'Ma Tor Nu Won',
            email: 'maturnuwun@mail.com',
            password: await bcrypt.hash('password123', 10),
            role: 'siswa',
            verified: true,
        },
        {
            id: "0195c5ed-3fc9-771d-bced-9c4b10afd9a2",
            name: 'Dendy Wan S.Pd',
            email: 'dendy@mail.com',
            password: await bcrypt.hash('password123', 10),
            role: 'tutor',
            verified: true,
        },
        {
            id: "019618a1-68a4-71c5-9f8d-5ef6ef4fc1aa",
            name: 'Venita S.Pd',
            email: 'venita@mail.com',
            password: await bcrypt.hash('password123', 10),
            role: 'tutor',
            verified: true,
        }
    ];

    for (const user of users) {
        await prisma.user.create({
            data: user,
        });
    }

    // Seed students
    const students = [
        {
            id: "0195c5ed-3fc9-748b-9fde-426f41730565",
            userId: "0195c5ed-3fc9-71de-93d8-d850abe7b4fa", 
            phone: '1234567890',
            parentPhone: '0987654321',
            level: 'SMP',
            schoolName: 'SMP Negeri 1',
            address: 'Jl. Merdeka No. 1',
        },
        {
            id: "019618a1-68a4-7dd8-b39c-5ecd04d1c010",
            userId: "0195d575-26cb-73a9-ac9c-4395ebfb2326",
            phone: '1234567890',
            parentPhone: '0987654321',
            level: 'SMA',
            schoolName: 'SMA Negeri 2',
            address: 'Jl. Merdeka No. 2',
        },
        {
            id: "019618a1-68a4-7bdf-853b-916546c664a7",
            userId: "019618a1-68a4-7742-9471-2548f7726e86",
            phone: '1234567890',
            parentPhone: '0987654321',
            level: 'SD',
            schoolName: 'SD Negeri 3',
            address: 'Jl. Merdeka No. 3',
        },
    ];

    for (const student of students) {
        await prisma.student.create({
            data: student,
        });
    }

    // Seed tutors
    const tutors = [
        {
            id: "0195c5ed-3fc9-7a1f-92ed-f2a421fd5fac",
            userId: "0195c5ed-3fc9-771d-bced-9c4b10afd9a2", 
            birthDate: new Date('1990-01-01'),
            gender: 'Male',
            phone: '1234567890',
            subjects: 'Matematika',
            status: 'S1',
            major: 'Pendidikan Matematika',
            school: 'Universitas Bikini Bottom',
            teachLevel: 'SMP',
            description: 'Experienced tutor in Mathematics, once guided a math competition at the rt level in mijen sub-district. hardworking and responsive.',
        },
        {
            id: "019618a1-68a4-76ba-97fe-accd364715e8",
            userId: "019618a1-68a4-71c5-9f8d-5ef6ef4fc1aa",
            birthDate: new Date('1998-03-03'),
            gender: 'Female',
            phone: '0987654321',
            subjects: 'Bahasa Inggris',
            status: 'S1',
            major: 'Pendidikan Bahasa Inggris',
            school: 'Universitas Bikini Bottom',
            teachLevel: 'SMA',
            description: 'Experienced tutor in English, once guided an English competition at the rt level in tembalang sub-district. hardworking and responsive.',
        }
    ];

    for (const tutor of tutors) {
        await prisma.tutor.create({
            data: tutor,
        });
    }

    // Seed tutor days
    const tutorDays = [
        {
            id: "0195c5ed-3fc9-74cd-bfeb-3d928c1ffd93",
            tutorId: "0195c5ed-3fc9-7a1f-92ed-f2a421fd5fac", 
            daysId: "0195c5ed-3fc8-7959-bf34-26c3775d7e52", 
        },
        {
            id: "0195c5ed-3fc9-7f04-be58-f58a0ee62af0",
            tutorId: "0195c5ed-3fc9-7a1f-92ed-f2a421fd5fac", 
            daysId: "0195c5ed-3fc8-7553-a32d-dcda3aed1d21",
        },
        {
            id: "0195c5f7-7d94-7b2c-920e-fb544ef4e926",
            tutorId: "0195c5ed-3fc9-7a1f-92ed-f2a421fd5fac", 
            daysId: "0195c5ed-3fc8-7819-8210-360b97629ef2",
        },
        {
            id: "019618a1-68a4-7f81-8724-1236b9138665",
            tutorId: "019618a1-68a4-76ba-97fe-accd364715e8",
            daysId: "0195c5ed-3fc8-7496-b6b3-97e307a38413",
        },
        {
            id: "019618a1-68a4-70e1-948f-618b94aa3bdb",
            tutorId: "019618a1-68a4-76ba-97fe-accd364715e8",
            daysId: "0195c5ed-3fc8-7f0b-920f-20ddcfbb23d0",
        }
    ];

    for (const tutorDay of tutorDays) {
        await prisma.tutorDay.create({
            data: tutorDay,
        });
    }

    // Seed notifications
    const notifications = [
        {
            id: "0195c5ed-3fc9-7254-aaef-e5136c6b8606",
            userId: "0195c5ed-3fc9-71de-93d8-d850abe7b4fa",
            type: 'Pendaftaran Akun',
            description: 'Selamat datang di Bimbingan Belajar Mandala, selamat belajar!',
        },
        {
            id: "019618a1-68a4-7d40-bcf4-ed7d4e8305ff",
            userId: "0195d575-26cb-73a9-ac9c-4395ebfb2326",
            type: 'Pendaftaran Akun',
            description: 'Selamat datang di Bimbingan Belajar Mandala, selamat belajar!',
        },
        {
            id: "019618a1-68a4-725a-bd3d-e62956fbd79b",
            userId: "019618a1-68a4-7742-9471-2548f7726e86",
            type: 'Pendaftaran Akun',
            description: 'Selamat datang di Bimbingan Belajar Mandala, selamat belajar!',
        },
        {
            id: "0195c5fa-413e-7927-afed-d65683fb14c0",
            userId: "0195c5ed-3fc9-771d-bced-9c4b10afd9a2",
            type: 'Pendaftaran Akun',
            description: 'Selamat datang di Bimbingan Belajar Mandala, selamat bergabung sebagai tutor.',
        },
        {
            id: "019618a1-68a4-7bff-a08a-255d2635db95",
            userId: "019618a1-68a4-71c5-9f8d-5ef6ef4fc1aa",
            type: 'Pendaftaran Akun',
            description: 'Selamat datang di Bimbingan Belajar Mandala, selamat bergabung sebagai tutor.',
        },
    ];

    for (const notification of notifications) {
        await prisma.notification.create({
            data: notification,
        });
    }

    // Seed Bimbel Packages
    const bimbelPackages = [
        {
            id: "0195c63c-8fce-7c44-bf47-013da86078a3",
            name: 'Matematika',
            level: 'SMP',
            totalMeetings: 24,
            time: new Date('1970-01-01T15:00:00Z'),
            duration: 90,
            area: 'Semarang',
            userId: '0195c5ed-3fc9-771d-bced-9c4b10afd9a2',
            discount: 10
        },
        {
            id: "019618a1-68a4-7f67-acd4-aeccf37ca7c7",
            name: 'Bahasa Inggris',
            level: 'SMA',
            totalMeetings: 8,
            time: new Date('1970-01-01T15:00:00Z'),
            duration: 120,
            area: 'Semarang',
            userId: '019618a1-68a4-71c5-9f8d-5ef6ef4fc1aa'
        },
    ];

    for (const bimbelPackage of bimbelPackages) {
        await prisma.bimbelPackage.create({
            data: bimbelPackage,
        });
    }

    //Seed Group Types
    const groupTypes = [
        { 
            id: "0195c63c-8fce-7232-990e-6d11e9ff2d02",
            type: 'privat',
            price: 1540000,
            discPrice: 1386000,
            packageId: "0195c63c-8fce-7c44-bf47-013da86078a3",
            maxStudent: 1
        },
        {
            id: "019631ed-ff7f-77c0-a7bc-6911e8e01b97",
            type: 'grup2',
            price: 2860000,
            discPrice: 2574000,
            packageId: "0195c63c-8fce-7c44-bf47-013da86078a3",
            maxStudent: 2
        },
        { 
            id: "0195c63c-8fce-73ee-beb0-f075a8d73cfc",
            type: 'grup3',
            price: 4180000,
            discPrice: 3762000,
            packageId: "0195c63c-8fce-7c44-bf47-013da86078a3",
            maxStudent: 3
        },
        { 
            id: "01963701-9f9b-7fd9-81d8-82d1e63bf5fa",
            type: 'grup4',
            price: 5500000,
            discPrice: 4950000,
            packageId: "0195c63c-8fce-7c44-bf47-013da86078a3",
            maxStudent: 4
        },
        { 
            id: "0195c63c-8fce-74a3-bb8f-c3b07e4b0cb1",
            type: 'grup5',
            price: 6820000,
            discPrice: 6138000,
            packageId: "0195c63c-8fce-7c44-bf47-013da86078a3",
            maxStudent: 5
        },
        {
            id: "019618a1-68a4-7fbd-adfa-b4f55c9c5d5c",
            type: 'privat',
            price: 580000,
            packageId: "019618a1-68a4-7f67-acd4-aeccf37ca7c7",
            maxStudent: 1
        },
        { 
            id: "019618a1-68a4-7a75-948f-e8df29d3bb9c",
            type: 'grup2',
            price: 1020000,
            packageId: "019618a1-68a4-7f67-acd4-aeccf37ca7c7",
            maxStudent: 2
        },
        { 
            id: "019618a1-68a4-7ddc-ad78-9f9e43be8ffb",
            type: 'grup3',
            price: 1460000,
            packageId: "019618a1-68a4-7f67-acd4-aeccf37ca7c7",
            maxStudent: 3
        },
        { 
            id: "01963714-7d72-73a8-adf1-ba8ac656ca62",
            type: 'grup4',
            price: 1900000,
            packageId: "019618a1-68a4-7f67-acd4-aeccf37ca7c7",
            maxStudent: 4
        },
        { 
            id: "01963714-a4a0-7260-b049-1aedc3b832f1",
            type: 'grup5',
            price: 2340000,
            packageId: "019618a1-68a4-7f67-acd4-aeccf37ca7c7",
            maxStudent: 5
        }
    ];

    for (const groupType of groupTypes) {
        await prisma.groupType.create({
            data: groupType,
        });
    }

    // Seed Packages Day
    const packagesDays = [
        {
            id : "0195c714-07f8-752f-9851-39965d06919e",
            packageId: "0195c63c-8fce-7c44-bf47-013da86078a3",
            dayId: "0195c5ed-3fc8-7959-bf34-26c3775d7e52"
        },
        {
            id : "0195c714-07f8-7774-8c05-0b5addb724b0",
            packageId: "0195c63c-8fce-7c44-bf47-013da86078a3",
            dayId: "0195c5ed-3fc8-7553-a32d-dcda3aed1d21"
        },
        {
            id : "0195c714-07f8-74ac-8c81-b47289e3596b",
            packageId: "0195c63c-8fce-7c44-bf47-013da86078a3",
            dayId: "0195c5ed-3fc8-7819-8210-360b97629ef2"
        },
        {
            id: "019618a1-68a4-75d2-b3c6-a0879be13185",
            packageId: "019618a1-68a4-7f67-acd4-aeccf37ca7c7",
            dayId: "0195c5ed-3fc8-7496-b6b3-97e307a38413",
        },
        {
            id: "019618a1-68a4-7f43-bba4-4e8f5b047428",
            packageId: "019618a1-68a4-7f67-acd4-aeccf37ca7c7",
            dayId: "0195c5ed-3fc8-7f0b-920f-20ddcfbb23d0",
        }
    ]

    for (const packageDay of packagesDays) {
        await prisma.packageDay.create({
            data: packageDay,
        });
    }

    // Seed Orders
    const orders = [
        {
            id: "019618a1-68a4-7134-b8a7-98ba49f8e50f",
            userId: "0195c5ed-3fc9-71de-93d8-d850abe7b4fa",
            packageId: "0195c63c-8fce-7c44-bf47-013da86078a3",
            groupTypeId: "0195c63c-8fce-7232-990e-6d11e9ff2d02",
            address: 'Jl. Merdeka No. 1',
            status: 'pending'
        },
        {
            id: "019618a1-68a4-75a4-abe4-dffa3730c045",
            userId: "019618a1-68a4-7742-9471-2548f7726e86",
            packageId: "019618a1-68a4-7f67-acd4-aeccf37ca7c7",
            groupTypeId: "019618a1-68a4-7a75-948f-e8df29d3bb9c",
            address: 'Jl. Merdeka No. 2',
            status: 'paid',
        }
    ];
    for (const order of orders) {
        await prisma.order.create({
            data: order,
        });
    }

    // Seed Class
    const classes = [
        {
            id: "019618a1-68a4-7fbc-87af-6cc1cc6cffd0",
            code: 'ABC123',
            tutorId: "019618a1-68a4-71c5-9f8d-5ef6ef4fc1aa",
            orderId: "019618a1-68a4-75a4-abe4-dffa3730c045",
        },
    ];
    for (const classData of classes) {
        await prisma.class.create({
            data: classData,
        });
    }

    // Seed Student Class
    const studentClasses = [
        {
            id: "019618a1-68a4-740e-b6dd-a6c779e631b1",
            classId: "019618a1-68a4-7fbc-87af-6cc1cc6cffd0",
            userId: "0195c5ed-3fc9-71de-93d8-d850abe7b4fa",
        },
        {
            id: "01961933-236b-736d-8117-8ea235547fc6",
            classId: "019618a1-68a4-7fbc-87af-6cc1cc6cffd0",
            userId: "019618a1-68a4-7742-9471-2548f7726e86",
        },
        {
            id: "01961933-236b-73b2-8a95-7e64183d1357",
            classId: "019618a1-68a4-7fbc-87af-6cc1cc6cffd0",
            userId: "0195d575-26cb-73a9-ac9c-4395ebfb2326",
        }
    ];
    for (const studentClass of studentClasses) {
        await prisma.studentClass.create({
            data: studentClass,
        });
    }

    // Seed Schedule
    await ScheduleService.createSchedules("019618a1-68a4-7fbc-87af-6cc1cc6cffd0");

    // Seed Salary
    await prisma.salary.create({
        data: {
            id: "01965b4e-ec32-791f-b338-25cd592ed5e8",
            userId: "019618a1-68a4-71c5-9f8d-5ef6ef4fc1aa",
            orderId: "019618a1-68a4-75a4-abe4-dffa3730c045",
            total: 918000,
            status: 'pending',
        }
    });

    console.log('Development data seeded successfully');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });