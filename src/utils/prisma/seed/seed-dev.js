import { prisma } from '../../../utils/db.js';

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
            email: 'admin@admin.com',
            password: 'password123',
            role: 'admin',
            verified: true,
        },
        {
            id: "0195c5ed-3fc9-71de-93d8-d850abe7b4fa",
            name: 'Su Yon Oh',
            email: 'suyono@mail.com',
            password: 'password123',
            role: 'siswa',
            verified: true,
        },
        {
            id: "0195c5ed-3fc9-771d-bced-9c4b10afd9a2",
            name: 'Dendy Wan S.Pd',
            email: 'dendy@example.com',
            password: 'password123',
            role: 'tutor',
            verified: true,
        },
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
            id: "0195c5fa-413e-7927-afed-d65683fb14c0",
            userId: "0195c5ed-3fc9-771d-bced-9c4b10afd9a2",
            type: 'Pendaftaran Akun',
            description: 'Selamat datang di Bimbingan Belajar Mandala, selamat bergabung sebagai tutor.',
        },
    ];

    for (const notification of notifications) {
        await prisma.notification.create({
            data: notification,
        });
    }

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