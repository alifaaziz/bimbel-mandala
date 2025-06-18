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
            id:"0196b294-4791-7c97-bfed-3d6e3e640448",
            name: 'Michelle Chloe',
            email: 'michelle@mail.com',
            password: await bcrypt.hash('password123', 10),
            role: 'siswa',
            verified: true,
        },
        {
            id:"0196b294-4791-7510-a96a-db04d94dfbdd",
            name: 'Diana Wong',
            email: 'diana@mail.com',
            password: await bcrypt.hash('password123', 10),
            role: 'siswa',
            verified: true,
        },
        {
            id: "0196b294-4791-7972-912a-33627d5b14b1",
            name: "Adi Nugroho",
            email: "adi@mail.com",
            password: await bcrypt.hash("password123", 10),
            role: "siswa",
            verified: true,
        },
        {
            id: "0196b294-4791-7972-912a-33627d5b14b2",
            name: "Sari Utami",
            email: "sari@mail.com",
            password: await bcrypt.hash("password123", 10),
            role: "siswa",
            verified: true,
        },
        {
            id: "0196b294-4791-7972-912a-33627d5b14b3",
            name: "Rudi Santoso",
            email: "rudi@mail.com",
            password: await bcrypt.hash("password123", 10),
            role: "siswa",
            verified: true,
        },
        {
            id: "0196b294-4791-7972-912a-33627d5b14b4",
            name: "Lina Agustina",
            email: "lina@mail.com",
            password: await bcrypt.hash("password123", 10),
            role: "siswa",
            verified: true,
        },
        {
            id: "0196b294-4791-7972-912a-33627d5b14b5",
            name: "Budi Hartono",
            email: "budi@mail.com",
            password: await bcrypt.hash("password123", 10),
            role: "siswa",
            verified: true,
        },
        {
            id: "0196b294-4791-7972-912a-33627d5b14b6",
            name: "Maya Putri",
            email: "maya@mail.com",
            password: await bcrypt.hash("password123", 10),
            role: "siswa",
            verified: true,
        },
        {
            id: "0196b294-4791-7972-912a-33627d5b14b7",
            name: "Yoga Pratama",
            email: "yoga@mail.com",
            password: await bcrypt.hash("password123", 10),
            role: "siswa",
            verified: true,
        },
        {
            id: "0196b294-4791-7972-912a-33627d5b14b8",
            name: "Dewi Anjani",
            email: "dewi@mail.com",
            password: await bcrypt.hash("password123", 10),
            role: "siswa",
            verified: true,
        },
        {
            id: "0196b294-4791-7972-912a-33627d5b14b9",
            name: "Tommy Wijaya",
            email: "tommy@mail.com",
            password: await bcrypt.hash("password123", 10),
            role: "siswa",
            verified: true,
        },
        {
            id: "0196b294-4791-7972-912a-33627d5b14c0",
            name: "Indah Sari",
            email: "indah@mail.com",
            password: await bcrypt.hash("password123", 10),
            role: "siswa",
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
        },
        {
            id:"0196b294-4791-7972-912a-33627d5b14a7",
            name:'Ratna Dewi M.Pd',
            email:'ratna@mail.com',
            password: await bcrypt.hash('password123', 10),
            role:'tutor',
            verified:true
        },
        {
            id: "0196b294-4791-7972-912a-33627d5b14a8",
            name: "Fajar Nugroho, S.T",
            email: "fajar@mail.com",
            password: await bcrypt.hash("password123", 10),
            role: "tutor",
            verified: true,
          },
          {
            id: "0196b294-4791-7972-912a-33627d5b14a9",
            name: "Intan Lestari, S.Si",
            email: "intan@mail.com",
            password: await bcrypt.hash("password123", 10),
            role: "tutor",
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
            userId: "0195c5ed-3fc9-71de-93d8-d850abe7b4fa", // Su Yon Oh
            phone: '1234567890',
            parentPhone: '0987654321',
            level: 'SMP',
            schoolName: 'SMP Negeri 1',
            address: 'Jl. Merdeka No. 1',
        },
        {
            id: "019618a1-68a4-7dd8-b39c-5ecd04d1c010",
            userId: "0195d575-26cb-73a9-ac9c-4395ebfb2326", // So Lie Kien
            phone: '1234567890',
            parentPhone: '0987654321',
            level: 'SMA',
            schoolName: 'SMA Negeri 2',
            address: 'Jl. Merdeka No. 2',
        },
        {
            id: "019618a1-68a4-7bdf-853b-916546c664a7",
            userId: "019618a1-68a4-7742-9471-2548f7726e86",// Ma Tor Nu Won
            phone: '1234567890',
            parentPhone: '0987654321',
            level: 'SD',
            schoolName: 'SD Negeri 3',
            address: 'Jl. Merdeka No. 3',
        },
        {
            id: "0196b294-4791-78f5-b5e0-24959d2c0582",
            userId: "0196b294-4791-7c97-bfed-3d6e3e640448",// Michelle Chloe
            phone: '1234567890',
            parentPhone: '0987654321',
            level: 'SMP',
            schoolName: 'SMP Negeri 4',
            address: 'Jl. Merdeka No. 4',
        },
        {
            id: "0196b294-4791-795e-9f05-d6ce2f38a456",
            userId: "0196b294-4791-7510-a96a-db04d94dfbdd",// Diana Wong
            phone: '1234567890',
            parentPhone: '0987654321',
            level: 'SMA',
            schoolName: 'SMA Negeri 5',
            address: 'Jl. Merdeka No. 5',
        },
        {
            id: "0196b294-4791-7b00-8000-000000000001",
            userId: "0196b294-4791-7972-912a-33627d5b14b1",// Adi Nugroho
            phone: "081234567891",
            parentPhone: "082345678901",
            level: "SMP",
            schoolName: "SMP Harapan Bangsa",
            address: "Jl. Mawar No. 4",
        },
        {
            id: "0196b294-4791-7b00-8000-000000000002",
            userId: "0196b294-4791-7972-912a-33627d5b14b2",// Sari Utami
            phone: "081234567892",
            parentPhone: "082345678902",
            level: "SMA",
            schoolName: "SMA Cendekia",
            address: "Jl. Melati No. 5",
        },
        {
            id: "0196b294-4791-7b00-8000-000000000003",
            userId: "0196b294-4791-7972-912a-33627d5b14b3",// Rudi Santoso
            phone: "081234567893",
            parentPhone: "082345678903",
            level: "SD",
            schoolName: "SD Pelita",
            address: "Jl. Anggrek No. 6",
        },
        {
            id: "0196b294-4791-7b00-8000-000000000004",
            userId: "0196b294-4791-7972-912a-33627d5b14b4",// Lina Agustina
            phone: "081234567894",
            parentPhone: "082345678904",
            level: "SMP",
            schoolName: "SMPN 5",
            address: "Jl. Kamboja No. 7",
        },
        {
            id: "0196b294-4791-7b00-8000-000000000005",
            userId: "0196b294-4791-7972-912a-33627d5b14b5",// Budi Hartono
            phone: "081234567895",
            parentPhone: "082345678905",
            level: "SMA",
            schoolName: "SMA Negeri 3",
            address: "Jl. Kenanga No. 8",
        },
        {
            id: "0196b294-4791-7b00-8000-000000000006",
            userId: "0196b294-4791-7972-912a-33627d5b14b6",// Maya Putri
            phone: "081234567896",
            parentPhone: "082345678906",
            level: "SD",
            schoolName: "SDN 1",
            address: "Jl. Flamboyan No. 9",
        },
        {
            id: "0196b294-4791-7b00-8000-000000000007",
            userId: "0196b294-4791-7972-912a-33627d5b14b7",// Yoga Pratama
            phone: "081234567897",
            parentPhone: "082345678907",
            level: "SMP",
            schoolName: "SMPN 8",
            address: "Jl. Teratai No. 10",
        },
        {
            id: "0196b294-4791-7b00-8000-000000000008",
            userId: "0196b294-4791-7972-912a-33627d5b14b8", // Dewi Anjani
            phone: "081234567898",
            parentPhone: "082345678908",
            level: "SMA",
            schoolName: "SMA Nusantara",
            address: "Jl. Sakura No. 11",
        },
        {
            id: "0196b294-4791-7b00-8000-000000000009",
            userId: "0196b294-4791-7972-912a-33627d5b14b9", // Tommy Wijaya
            phone: "081234567899",
            parentPhone: "082345678909",
            level: "SD",
            schoolName: "SD Al Azhar",
            address: "Jl. Cemara No. 12",
        },
        {
            id: "0196b294-4791-7b00-8000-000000000010",
            userId: "0196b294-4791-7972-912a-33627d5b14c0",
            phone: "081234567800",
            parentPhone: "082345678900",
            level: "SMP",
            schoolName: "SMP Kristen",
            address: "Jl. Duku No. 13",
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
            userId: "0195c5ed-3fc9-771d-bced-9c4b10afd9a2", // Dendy Wan S.Pd
            birthDate: new Date('1990-01-01'),
            gender: 'Male',
            phone: '1234567890',
            address: 'Jl. Merdeka No. 1',
            subjects: 'Matematika',
            status: 'S1',
            major: 'Pendidikan Matematika',
            school: 'Universitas Bikini Bottom',
            teachLevel: 'SMP',
            description: 'Experienced tutor in Mathematics, once guided a math competition at the rt level in mijen sub-district. hardworking and responsive.',
            photo: '/public/1.png'
        },
        {
            id: "019618a1-68a4-76ba-97fe-accd364715e8",
            userId: "019618a1-68a4-71c5-9f8d-5ef6ef4fc1aa",
            birthDate: new Date('1998-03-03'),
            gender: 'Female',
            phone: '0987654321',
            address: 'Jl. Merdeka No. 2',
            subjects: 'Bahasa Inggris',
            status: 'S1',
            major: 'Pendidikan Bahasa Inggris',
            school: 'Universitas Bikini Bottom',
            teachLevel: 'SMA',
            description: 'Experienced tutor in English, once guided an English competition at the rt level in tembalang sub-district. hardworking and responsive.',
            photo: '/public/2.png'
        },
        {
            id: "0196b294-4791-7688-b84e-d445b3c179a7",
            userId: "0196b294-4791-7972-912a-33627d5b14a7",
            birthDate: new Date('1995-05-05'),
            gender: `Female`,
            phone: '1234567890',
            address: 'Jl. Merdeka No. 3',
            subjects: 'Kimia',
            status: 'S1',
            major: 'Pendidikan Kimia',
            school: 'Universitas Bikini Bottom',
            teachLevel: 'SMA',
            description: 'Experienced tutor in Chemistry, once guided a chemistry competition at the rt level in tembalang sub-district. hardworking and responsive.',
            photo: '/public/4.png'
        },
        {
            id: "0196b294-4791-7159-8bfe-a78b6cb6d210",
            userId: "0196b294-4791-7972-912a-33627d5b14a8",
            birthDate: new Date('1998-02-02'),
            gender: 'Male',
            phone: '1234567890',
            address: 'Jl. Merdeka No. 4',
            subjects: 'Fisika',
            status: 'S1',
            major: 'Pendidikan Fisika',
            school: 'Universitas Bikini Bottom',
            teachLevel: 'SMA',
            description: 'Experienced tutor in Physics, once guided a physics competition at the rt level in tembalang sub-district. hardworking and responsive.',
            photo: '/public/3.png'
        },
        {
            id: "0196b294-4791-7793-9e50-871941b175a0",
            userId: "0196b294-4791-7972-912a-33627d5b14a9",
            birthDate: new Date('1997-04-04'),
            gender: 'Female',
            phone: '1234567890',
            address: 'Jl. Merdeka No. 5',
            subjects: 'Biologi',
            status: 'S1',
            major: 'Pendidikan Biologi',
            school: 'Universitas Bikini Bottom',
            teachLevel: 'SMA',
            description: 'Experienced tutor in Biology, once guided a biology competition at the rt level in tembalang sub-district. hardworking and responsive.',
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
        },
        {
            id: "a1111111-0000-0000-0000-000000000001",
            tutorId: "0196b294-4791-7688-b84e-d445b3c179a7", 
            daysId: "0195c5ed-3fc8-7959-bf34-26c3775d7e52",
        },
        {
            id: "a1111111-0000-0000-0000-000000000002",
            tutorId: "0196b294-4791-7688-b84e-d445b3c179a7",
            daysId: "0195c5ed-3fc8-7553-a32d-dcda3aed1d21",
        },
        {
            id: "a2222222-0000-0000-0000-000000000001",
            tutorId: "0196b294-4791-7159-8bfe-a78b6cb6d210", 
            daysId: "0195c5ed-3fc8-7496-b6b3-97e307a38413", 
        },
        {
            id: "a2222222-0000-0000-0000-000000000002",
            tutorId: "0196b294-4791-7159-8bfe-a78b6cb6d210",
            daysId: "0195c5ed-3fc8-7164-9ffd-ec049b3082a4",
        },
        {
            id: "a3333333-0000-0000-0000-000000000001",
            tutorId: "0196b294-4791-7793-9e50-871941b175a0",
            daysId: "0195c5ed-3fc8-7f0b-920f-20ddcfbb23d0",
        },
        {
            id: "a3333333-0000-0000-0000-000000000002",
            tutorId: "0196b294-4791-7793-9e50-871941b175a0",
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
            userId: "0195c5ed-3fc9-71de-93d8-d850abe7b4fa",// Su Yon Oh
            type: 'Pendaftaran Akun',
            description: 'Selamat datang di Bimbingan Belajar Mandala, selamat belajar!',
            photo: '/public/mandala.png',
        },
        {
            id: "019618a1-68a4-7d40-bcf4-ed7d4e8305ff",
            userId: "0195d575-26cb-73a9-ac9c-4395ebfb2326",// So Lie Kien
            type: 'Pendaftaran Akun',
            description: 'Selamat datang di Bimbingan Belajar Mandala, selamat belajar!',
            photo: '/public/mandala.png',
        },
        {
            id: "019618a1-68a4-725a-bd3d-e62956fbd79b",
            userId: "019618a1-68a4-7742-9471-2548f7726e86",// Ma Tor Nu Won
            type: 'Pendaftaran Akun',
            description: 'Selamat datang di Bimbingan Belajar Mandala, selamat belajar!',
            photo: '/public/mandala.png',
        },
        {
            id: "0195c5fa-413e-7927-afed-d65683fb14c0",
            userId: "0195c5ed-3fc9-771d-bced-9c4b10afd9a2", // Dendy Wan S.Pd
            type: 'Pendaftaran Akun',
            description: 'Selamat datang di Bimbingan Belajar Mandala, selamat bergabung sebagai tutor.',
            photo: '/public/mandala.png',
        },
        {
            id: "019618a1-68a4-7bff-a08a-255d2635db95",
            userId: "019618a1-68a4-71c5-9f8d-5ef6ef4fc1aa", // Venita S.Pd
            type: 'Pendaftaran Akun',
            description: 'Selamat datang di Bimbingan Belajar Mandala, selamat bergabung sebagai tutor.',
            photo: '/public/mandala.png',
        },
        {
            id: "0196b294-4791-7c97-bfed-3d6e3e640449", // ID unik
            userId: "0196b294-4791-7c97-bfed-3d6e3e640448", // Michelle Chloe
            type: 'Pendaftaran Akun',
            description: 'Selamat datang di Bimbingan Belajar Mandala, selamat belajar!',
            photo: '/public/mandala.png',
        },
        {
            id: "0196b294-4791-7510-a96a-db04d94dfbde", // ID unik
            userId: "0196b294-4791-7510-a96a-db04d94dfbdd", // Diana Wong
            type: 'Pendaftaran Akun',
            description: 'Selamat datang di Bimbingan Belajar Mandala, selamat belajar!',
            photo: '/public/mandala.png',
        },
        {
            id: "019780d6-fa98-7447-9fce-7a7b2eee0ff7", // ID unik
            userId: "0196b294-4791-7972-912a-33627d5b14b1", // Adi Nugroho
            type: 'Pendaftaran Akun',
            description: 'Selamat datang di Bimbingan Belajar Mandala, selamat belajar!',
            photo: '/public/mandala.png',
        },
        {
            id: "0196b294-4791-7972-912a-33627d5b14b3", // ID unik
            userId: "0196b294-4791-7972-912a-33627d5b14b2", // Sari Utami
            type: 'Pendaftaran Akun',
            description: 'Selamat datang di Bimbingan Belajar Mandala, selamat belajar!',
            photo: '/public/mandala.png',
        },
        {
            id: "0196b294-4791-7972-912a-33627d5b14b4", // ID unik
            userId: "0196b294-4791-7972-912a-33627d5b14b3", // Rudi Santoso
            type: 'Pendaftaran Akun',
            description: 'Selamat datang di Bimbingan Belajar Mandala, selamat belajar!',
            photo: '/public/mandala.png',
        },
        {
            id: "0196b294-4791-7972-912a-33627d5b14b5", // ID unik
            userId: "0196b294-4791-7972-912a-33627d5b14b4", // Lina Agustina
            type: 'Pendaftaran Akun',
            description: 'Selamat datang di Bimbingan Belajar Mandala, selamat belajar!',
            photo: '/public/mandala.png',
        },
        {
            id: "019780d5-a8ba-7c7f-9fec-224d26300039", // ID unik
            userId: "0196b294-4791-7972-912a-33627d5b14b5", // Budi Hartono
            type: 'Pendaftaran Akun',
            description: 'Selamat datang di Bimbingan Belajar Mandala, selamat belajar!',
            photo: '/public/mandala.png',
        },
        {
            id: "019780d5-e394-7239-9ca6-3ae5c6bdb2a9", // ID unik
            userId: "0196b294-4791-7972-912a-33627d5b14b6", // Maya Putri
            type: 'Pendaftaran Akun',
            description: 'Selamat datang di Bimbingan Belajar Mandala, selamat belajar!',
            photo: '/public/mandala.png',
        },
        {
            id: "019780b5-1d07-797a-ae32-20936b8b5767", // ID unik
            userId: "0196b294-4791-7972-912a-33627d5b14b7", // Yoga Pratama
            type: 'Pendaftaran Akun',
            description: 'Selamat datang di Bimbingan Belajar Mandala, selamat belajar!',
            photo: '/public/mandala.png',
        },
        {
            id: "0196b294-4791-7972-912a-33627d5b14b9", // ID unik
            userId: "0196b294-4791-7972-912a-33627d5b14b8", // Dewi Anjani
            type: 'Pendaftaran Akun',
            description: 'Selamat datang di Bimbingan Belajar Mandala, selamat belajar!',
            photo: '/public/mandala.png',
        },
        {
            id: "0196b294-4791-7972-912a-33627d5b14c1", // ID unik
            userId: "0196b294-4791-7972-912a-33627d5b14b9", // Tommy Wijaya
            type: 'Pendaftaran Akun',
            description: 'Selamat datang di Bimbingan Belajar Mandala, selamat belajar!',
            photo: '/public/mandala.png',
        },
        {
            id: "0196b294-4791-7972-912a-33627d5b14c2", // ID unik
            userId: "0196b294-4791-7972-912a-33627d5b14c0", // Indah Sari
            type: 'Pendaftaran Akun',
            description: 'Selamat datang di Bimbingan Belajar Mandala, selamat belajar!',
            photo: '/public/mandala.png',
        },
        {
            id: "0196b294-4791-7972-912a-33627d5b14a8", // ID unik
            userId: "0196b294-4791-7972-912a-33627d5b14a7", // Ratna Dewi M.Pd
            type: 'Pendaftaran Akun',
            description: 'Selamat datang di Bimbingan Belajar Mandala, selamat bergabung sebagai tutor.',
            photo: '/public/mandala.png',
        },
        {
            id: "0196b294-4791-7972-912a-33627d5b14a9", // ID unik
            userId: "0196b294-4791-7972-912a-33627d5b14a8", // Fajar Nugroho, S.T
            type: 'Pendaftaran Akun',
            description: 'Selamat datang di Bimbingan Belajar Mandala, selamat bergabung sebagai tutor.',
            photo: '/public/mandala.png',
        },
        {
            id: "0196b294-4791-7972-912a-33627d5b14aa", // ID unik
            userId: "0196b294-4791-7972-912a-33627d5b14a9", // Intan Lestari, S.Si
            type: 'Pendaftaran Akun',
            description: 'Selamat datang di Bimbingan Belajar Mandala, selamat bergabung sebagai tutor.',
            photo: '/public/mandala.png',
        },
        {
            id: "0196f634-6979-7231-b83b-18de51222ec6",
            userId: "0195c5ed-3fc9-71de-93d8-d850abe7b4fa", // Su Yon Oh
            type: 'Program',
            description: 'Selamat, Bimbingan belajar <strong>Matematika SMP #AAA123</strong> bersama <strong>Pak Dendy Wan, S.Pd</strong> sudah terkonfirmasi dan segera berlangsung.',
            photo: '/public/1.png',
        },
        {
            id: "0196f634-6979-7e5a-b353-4a2c95a35435",
            userId: "0195c5ed-3fc9-771d-bced-9c4b10afd9a2", // Dendy Wan S.Pd
            type: 'Program',
            description: 'Selamat, Bimbingan belajar <strong>Matematika SMP #AAA123</strong> sudah terkonfirmasi dan segera berlangsung.',
            photo: '/public/1.png',
        },
        // Bu Venita belum ada Seeder
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
            slug: 'matematika-smp-12lkop',
            userId: '0195c5ed-3fc9-771d-bced-9c4b10afd9a2', // Dendy Wan S.Pd
            discount: 10,
            isActive: false,
        },
        {
            id: "019618a1-68a4-7f67-acd4-aeccf37ca7c7",
            name: 'Bahasa Inggris',
            level: 'SMA',
            totalMeetings: 8,
            time: new Date('1970-01-01T15:00:00Z'),
            duration: 120,
            area: 'Semarang',
            slug: 'bahasa-inggris-sma-14klui',
            userId: '019618a1-68a4-71c5-9f8d-5ef6ef4fc1aa', // Venita S.Pd
        },
        {
            id: "0196b294-4791-7b00-8000-000000000011",
            name: "Kimia",
            level: "SMA",
            totalMeetings: 24, // 2 hari/minggu * 4 minggu/bulan * 3 bulan
            time: new Date("1970-01-01T15:00:00Z"),
            duration: 90,
            area: "Semarang",
            slug: "kimia-sma-dg67ty",
            userId: "0196b294-4791-7972-912a-33627d5b14a7", // Ratna Dewi M.Pd
            discount: 10,
        },
        {
            id: "0196b294-4791-7b00-8000-000000000012",
            name: "Fisika",
            level: "SMA",
            totalMeetings: 24, // 2 hari/minggu * 4 minggu/bulan * 3 bulan
            time: new Date("1970-01-01T15:00:00Z"),
            duration: 90,
            area: "Semarang",
            slug: "fisika-sma-0ki8er",
            userId: "0196b294-4791-7972-912a-33627d5b14a8", // Fajar Nugroho, S.T
            discount: 10,
        },
        {
            id: "0196b294-4791-7b00-8000-000000000013",
            name: "Biologi",
            level: "SMA",
            totalMeetings: 24, // 2 hari/minggu * 4 minggu/bulan * 3 bulan
            time: new Date("1970-01-01T15:00:00Z"),
            duration: 90,
            area: "Semarang",
            slug: "biologi-sma-l4l4qw",
            userId: "0196b294-4791-7972-912a-33627d5b14a9", // Intan Lestari, S.Si
            discount: 10,
        },
        {
            id: "0196b294-4791-7b00-8000-000000000014",
            name: "FOKUS UTBK",
            level: "SMA",
            totalMeetings: 4,
            time: new Date("1970-01-01T15:00:00Z"),
            duration: 90,
            area: "Semarang",
            slug: "fokus-utbk-sma-9j8k7l",
            userId: "0195c5ed-3fc9-771d-bced-9c4b10afd9a2", // Dendy Wan S.Pd
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
            packageId: "0195c63c-8fce-7c44-bf47-013da86078a3", // Matematika SMP
            maxStudent: 1
        },
        {
            id: "019631ed-ff7f-77c0-a7bc-6911e8e01b97",
            type: 'grup2',
            price: 2860000,
            discPrice: 2574000,
            packageId: "0195c63c-8fce-7c44-bf47-013da86078a3", // Matematika SMP
            maxStudent: 2
        },
        { 
            id: "0195c63c-8fce-73ee-beb0-f075a8d73cfc",
            type: 'grup3',
            price: 4180000,
            discPrice: 3762000,
            packageId: "0195c63c-8fce-7c44-bf47-013da86078a3", // Matematika SMP
            maxStudent: 3
        },
        { 
            id: "01963701-9f9b-7fd9-81d8-82d1e63bf5fa",
            type: 'grup4',
            price: 5500000,
            discPrice: 4950000,
            packageId: "0195c63c-8fce-7c44-bf47-013da86078a3", // Matematika SMP
            maxStudent: 4
        },
        { 
            id: "0195c63c-8fce-74a3-bb8f-c3b07e4b0cb1",
            type: 'grup5',
            price: 6820000,
            discPrice: 6138000,
            packageId: "0195c63c-8fce-7c44-bf47-013da86078a3", // Matematika SMP
            maxStudent: 5
        },
        {
            id: "019618a1-68a4-7fbd-adfa-b4f55c9c5d5c",
            type: 'privat',
            price: 580000,
            packageId: "019618a1-68a4-7f67-acd4-aeccf37ca7c7", // Bahasa Inggris SMA
            maxStudent: 1
        },
        { 
            id: "019618a1-68a4-7a75-948f-e8df29d3bb9c",
            type: 'grup2',
            price: 1020000,
            packageId: "019618a1-68a4-7f67-acd4-aeccf37ca7c7", // Bahasa Inggris SMA
            maxStudent: 2
        },
        { 
            id: "019618a1-68a4-7ddc-ad78-9f9e43be8ffb",
            type: 'grup3',
            price: 1460000,
            packageId: "019618a1-68a4-7f67-acd4-aeccf37ca7c7", // Bahasa Inggris SMA
            maxStudent: 3
        },
        { 
            id: "01963714-7d72-73a8-adf1-ba8ac656ca62",
            type: 'grup4',
            price: 1900000,
            packageId: "019618a1-68a4-7f67-acd4-aeccf37ca7c7", // Bahasa Inggris SMA
            maxStudent: 4
        },
        { 
            id: "01963714-a4a0-7260-b049-1aedc3b832f1",
            type: 'grup5',
            price: 2340000,
            packageId: "019618a1-68a4-7f67-acd4-aeccf37ca7c7", // Bahasa Inggris SMA
            maxStudent: 5
        },
        {
            id: "0196b294-4791-7b00-8000-000000000101",
            type: "privat",
            price: 2500000, // (24 * 100000) + 100000
            discPrice: 2250000, // 10% discount
            packageId: "0196b294-4791-7b00-8000-000000000011",  // Kimia SMA
            maxStudent: 1,
        },
        {
            id: "0196b294-4791-7b00-8000-000000000102",
            type: "grup2",
            price: 4900000, // (2 * 24 * 100000) + 100000
            discPrice: 4410000, // 10% discount
            packageId: "0196b294-4791-7b00-8000-000000000011", // Kimia SMA
            maxStudent: 2,
        },
        {
            id: "0196b294-4791-7b00-8000-000000000103",
            type: "grup3",
            price: 7300000, // (3 * 24 * 100000) + 100000
            discPrice: 6570000, // 10% discount
            packageId: "0196b294-4791-7b00-8000-000000000011", // Kimia SMA
            maxStudent: 3,
        },
        {
            id: "0196b294-4791-7b00-8000-000000000104",
            type: "grup4",
            price: 9700000, // (4 * 24 * 100000) + 100000
            discPrice: 8730000, // 10% discount
            packageId: "0196b294-4791-7b00-8000-000000000011",  // Kimia SMA
            maxStudent: 4,
        },
        {
            id: "0196b294-4791-7b00-8000-000000000105",
            type: "grup5",
            price: 12100000, // (5 * 24 * 100000) + 100000
            discPrice: 10890000, // 10% discount
            packageId: "0196b294-4791-7b00-8000-000000000011",  // Kimia SMA
            maxStudent: 5,
        },
    
        // For Fisika
        {
            id: "0196b294-4791-7b00-8000-000000000201",
            type: "privat",
            price: 2500000,
            discPrice: 2250000,
            packageId: "0196b294-4791-7b00-8000-000000000012", // Fisika SMA
            maxStudent: 1,
        },
        {
            id: "0196b294-4791-7b00-8000-000000000202",
            type: "grup2",
            price: 4900000,
            discPrice: 4410000,
            packageId: "0196b294-4791-7b00-8000-000000000012", // Fisika SMA
            maxStudent: 2,
        },
        {
            id: "0196b294-4791-7b00-8000-000000000203",
            type: "grup3",
            price: 7300000,
            discPrice: 6570000,
            packageId: "0196b294-4791-7b00-8000-000000000012", // Fisika SMA
            maxStudent: 3,
        },
        {
            id: "0196b294-4791-7b00-8000-000000000204",
            type: "grup4",
            price: 9700000,
            discPrice: 8730000,
            packageId: "0196b294-4791-7b00-8000-000000000012", // Fisika SMA
            maxStudent: 4,
        },
        {
            id: "0196b294-4791-7b00-8000-000000000205",
            type: "grup5",
            price: 12100000,
            discPrice: 10890000,
            packageId: "0196b294-4791-7b00-8000-000000000012", // Fisika SMA
            maxStudent: 5,
        },
    
        // For Biologi
        {
            id: "0196b294-4791-7b00-8000-000000000301",
            type: "privat",
            price: 2500000,
            discPrice: 2250000,
            packageId: "0196b294-4791-7b00-8000-000000000013", // Biologi SMA
            maxStudent: 1,
        },
        {
            id: "0196b294-4791-7b00-8000-000000000302",
            type: "grup2",
            price: 4900000,
            discPrice: 4410000,
            packageId: "0196b294-4791-7b00-8000-000000000013", // Biologi SMA
            maxStudent: 2,
        },
        {
            id: "0196b294-4791-7b00-8000-000000000303",
            type: "grup3",
            price: 7300000,
            discPrice: 6570000,
            packageId: "0196b294-4791-7b00-8000-000000000013", // Biologi SMA
            maxStudent: 3,
        },
        {
            id: "0196b294-4791-7b00-8000-000000000304",
            type: "grup4",
            price: 9700000,
            discPrice: 8730000,
            packageId: "0196b294-4791-7b00-8000-000000000013", // Biologi SMA
            maxStudent: 4,
        },
        {
            id: "0196b294-4791-7b00-8000-000000000305",
            type: "grup5",
            price: 12100000,
            discPrice: 10890000,
            packageId: "0196b294-4791-7b00-8000-000000000013", // Biologi SMA
            maxStudent: 5,
        },
        {
            id: "0196b294-4791-7b00-8000-000000000401",
            type: "kelas",
            price: 4000000, // (4 * 100000) + 100000
            packageId: "0196b294-4791-7b00-8000-000000000014", // FOKUS UTBK
            maxStudent: 20,
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
            dayId: "0195c5ed-3fc8-7496-b6b3-97e307a38413", // Selasa
        },
        {
            id: "019618a1-68a4-7f43-bba4-4e8f5b047428",
            packageId: "019618a1-68a4-7f67-acd4-aeccf37ca7c7",
            dayId: "0195c5ed-3fc8-7f0b-920f-20ddcfbb23d0", // Jumat
        },
        {
            id: "0196b294-4791-7b00-8000-000000000401",
            packageId: "0196b294-4791-7b00-8000-000000000011",
            dayId: "0195c5ed-3fc8-7959-bf34-26c3775d7e52", // Senin
        },
        {
            id: "0196b294-4791-7b00-8000-000000000402",
            packageId: "0196b294-4791-7b00-8000-000000000011",
            dayId: "0195c5ed-3fc8-7553-a32d-dcda3aed1d21", // Rabu
        },
        {
            id: "0196b294-4791-7b00-8000-000000000501",
            packageId: "0196b294-4791-7b00-8000-000000000012",
            dayId: "0195c5ed-3fc8-7496-b6b3-97e307a38413", // Selasa
        },
        {
            id: "0196b294-4791-7b00-8000-000000000502",
            packageId: "0196b294-4791-7b00-8000-000000000012",
            dayId: "0195c5ed-3fc8-7f0b-920f-20ddcfbb23d0", // Jumat
        },
        {
            id: "0196b294-4791-7b00-8000-000000000601",
            packageId: "0196b294-4791-7b00-8000-000000000013",
            dayId: "0195c5ed-3fc8-7819-8210-360b97629ef2", // Sabtu
        },
        {
            id: "0196b294-4791-7b00-8000-000000000602",
            packageId: "0196b294-4791-7b00-8000-000000000013",
            dayId: "0195c5ed-3fc8-7164-9ffd-ec049b3082a4", // Kamis
        },
        {
            id: "0196b294-4791-7b00-8000-000000000701",
            packageId: "0196b294-4791-7b00-8000-000000000014",
            dayId: "0195c5ed-3fc8-7959-bf34-26c3775d7e52", // Senin
        },
        {
            id: "0196b294-4791-7b00-8000-000000000702",
            packageId: "0196b294-4791-7b00-8000-000000000014",
            dayId: "0195c5ed-3fc8-7553-a32d-dcda3aed1d21", // Rabu
        },
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
            userId: "0195c5ed-3fc9-71de-93d8-d850abe7b4fa", // So Yon Oh
            packageId: "0195c63c-8fce-7c44-bf47-013da86078a3", // Matematika
            groupTypeId: "0195c63c-8fce-7232-990e-6d11e9ff2d02", // privat
            address: 'Jl. Merdeka No. 1',
            status: 'paid'
        },
        {
            id: "019618a1-68a4-75a4-abe4-dffa3730c045",
            userId: "019618a1-68a4-7742-9471-2548f7726e86", // Ma Tor Nu Won
            packageId: "019618a1-68a4-7f67-acd4-aeccf37ca7c7", // Bahasa Inggris
            groupTypeId: "019618a1-68a4-7a75-948f-e8df29d3bb9c", // grup2
            address: 'Jl. Merdeka No. 2',
            status: 'paid',
        },
        {
            id: "0196b2d1-ecd3-7d08-8784-4e413a3f3788",
            userId: "0196b294-4791-7972-912a-33627d5b14b2", // Sari Utami
            packageId: "0196b294-4791-7b00-8000-000000000011", // Kimia
            groupTypeId: "0196b294-4791-7b00-8000-000000000101", // privat
            address: 'Jl. Merdeka No. 3',
            status: 'pending',
        },
    ];
    for (const order of orders) {
        await prisma.order.create({
            data: order,
        });
    }

    // Seed Class
    const classes = [
        {
            id: "0196b2d1-ecd3-79d6-a088-a6e4716032d6",
            code: 'AAA123',
            status: 'berjalan',
            tutorId: "0195c5ed-3fc9-771d-bced-9c4b10afd9a2", // Dendy Wan
            orderId: "019618a1-68a4-7134-b8a7-98ba49f8e50f", // So Yon Oh - Matematika
            maxStudents: 1,
        },
        {
            id: "019618a1-68a4-7fbc-87af-6cc1cc6cffd0",
            code: 'ABC123',
            status: 'selesai',
            tutorId: "019618a1-68a4-71c5-9f8d-5ef6ef4fc1aa",
            orderId: "019618a1-68a4-75a4-abe4-dffa3730c045",// Ma Tor Nu Won - Bahasa Inggris
            maxStudents: 2,
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
            classId: "0196b2d1-ecd3-79d6-a088-a6e4716032d6",
            userId: "0195c5ed-3fc9-71de-93d8-d850abe7b4fa", // So Yon Oh
        },
        {
            id: "01961933-236b-736d-8117-8ea235547fc6",
            classId: "019618a1-68a4-7fbc-87af-6cc1cc6cffd0",
            userId: "019618a1-68a4-7742-9471-2548f7726e86", // Ma Tor Nu Won
        },
        {
            id: "01961933-236b-73b2-8a95-7e64183d1357",
            classId: "019618a1-68a4-7fbc-87af-6cc1cc6cffd0",
            userId: "0195d575-26cb-73a9-ac9c-4395ebfb2326", // So Lie Kien
        }
    ];
    for (const studentClass of studentClasses) {
        await prisma.studentClass.create({
            data: studentClass,
        });
    }

    // Seed Schedule
    await ScheduleService.createSchedules("0196b2d1-ecd3-79d6-a088-a6e4716032d6"); // Dendy Wan - Matematika

    // Seed Schedule for Class "019618a1-68a4-7fbc-87af-6cc1cc6cffd0" (Venita - Bahasa Inggris)
    const schedulesClass = [
        {
            id: "019618a1-68a4-7a00-8000-000000000001",
            classId: "019618a1-68a4-7fbc-87af-6cc1cc6cffd0",
            date: new Date('2025-04-08T15:00:00Z'),
            meet: 1,
            status: 'terjadwal',
            slug: 'bahasa-inggris-sma-ABC123-qwert11',
        },
        {
            id: "019618a1-68a4-7a00-8000-000000000002",
            classId: "019618a1-68a4-7fbc-87af-6cc1cc6cffd0",
            date: new Date('2025-04-11T15:00:00Z'),
            meet: 2,
            status: 'terjadwal',
            slug: 'bahasa-inggris-sma-ABC123-yuia11',
        },
        {
            id: "019618a1-68a4-7a00-8000-000000000003",
            classId: "019618a1-68a4-7fbc-87af-6cc1cc6cffd0",
            date: new Date('2025-04-15T15:00:00Z'),
            meet: 3,
            status: 'terjadwal',
            slug: 'bahasa-inggris-sma-ABC123-kslo11',
        },
        {
            id: "019618a1-68a4-7a00-8000-000000000004",
            classId: "019618a1-68a4-7fbc-87af-6cc1cc6cffd0",
            date: new Date('2025-04-18T15:00:00Z'),
            meet: 4,
            status: 'terjadwal',
            slug: 'bahasa-inggris-sma-ABC123-ynki23',
        },
        {
            id: "019618a1-68a4-7a00-8000-000000000005",
            classId: "019618a1-68a4-7fbc-87af-6cc1cc6cffd0",
            date: new Date('2025-04-22T15:00:00Z'),
            meet: 5,
            status: 'terjadwal',
            slug: 'bahasa-inggris-sma-ABC123-pal311',
        },
        {
            id: "019618a1-68a4-7a00-8000-000000000006",
            classId: "019618a1-68a4-7fbc-87af-6cc1cc6cffd0",
            date: new Date('2025-04-25T15:00:00Z'),
            meet: 6,
            status: 'terjadwal',
            slug: 'bahasa-inggris-sma-ABC123-3nam11',
        },
        {
            id: "019618a1-68a4-7a00-8000-000000000007",
            classId: "019618a1-68a4-7fbc-87af-6cc1cc6cffd0",
            date: new Date('2025-04-28T15:00:00Z'),
            meet: 7,
            status: 'jadwal_ulang',
            slug: 'bahasa-inggris-sma-ABC123-7uju11',
        },
        {
            id: "019618a1-68a4-7a00-8000-000000000008",
            classId: "019618a1-68a4-7fbc-87af-6cc1cc6cffd0",
            date: new Date('2025-05-02T15:00:00Z'),
            meet: 8,
            status: 'terjadwal',
            slug: 'bahasa-inggris-sma-ABC123-l4pa11',
        },
    ];
    for (const schedule of schedulesClass) {
        await prisma.schedule.create({
            data: schedule,
        });
    }

    // Seed Attendance
    const attendances = [
        // Mator Nu Won - Bahasa Inggris
        {
            id: "0196b2ee-98ca-7da3-849f-d1bc1660cf08",
            scheduleId: "019618a1-68a4-7a00-8000-000000000001",
            userId: "019618a1-68a4-7742-9471-2548f7726e86",
            status: 'masuk',
        },
        {
            id: "0196b2ee-98ca-7da3-849f-d1bc1660cf09",
            scheduleId: "019618a1-68a4-7a00-8000-000000000002",
            userId: "019618a1-68a4-7742-9471-2548f7726e86",
            status: 'masuk',
        },
        {
            id: "0196b2ee-98ca-7da3-849f-d1bc1660cf10",
            scheduleId: "019618a1-68a4-7a00-8000-000000000003",
            userId: "019618a1-68a4-7742-9471-2548f7726e86",
            status: 'masuk',
        },
        {
            id: "0196b2ee-98ca-7da3-849f-d1bc1660cf11",
            scheduleId: "019618a1-68a4-7a00-8000-000000000004",
            userId: "019618a1-68a4-7742-9471-2548f7726e86",
            status: 'masuk',
        },
        {
            id: "0196b2ee-98ca-7da3-849f-d1bc1660cf12",
            scheduleId: "019618a1-68a4-7a00-8000-000000000005",
            userId: "019618a1-68a4-7742-9471-2548f7726e86",
            status: 'izin',
            reason: 'sakit bu mau ke dokter',
        },
        {
            id: "0196b2ee-98ca-7da3-849f-d1bc1660cf13",
            scheduleId: "019618a1-68a4-7a00-8000-000000000006",
            userId: "019618a1-68a4-7742-9471-2548f7726e86",
            status: 'masuk',
        },
        {
            id: "0196b2ee-bc5d-a9c5-bd9c-fc5d9d5d9d5d",
            scheduleId: "019618a1-68a4-7a00-8000-000000000007",
            userId: "019618a1-68a4-7742-9471-2548f7726e86",
            status: 'masuk',
        },
        {
            id: "0196b2ee-bc5d-a9c5-bd9c-fc5d9d5d9d5e",
            scheduleId: "019618a1-68a4-7a00-8000-000000000008",
            userId: "019618a1-68a4-7742-9471-2548f7726e86",
            status: 'masuk',
        },
        // So Lie Kien - Bahasa Inggris
        {
            id: "0196b2ee-98ca-7da3-849f-d1bc1660cf14",
            scheduleId: "019618a1-68a4-7a00-8000-000000000001",
            userId: "0195d575-26cb-73a9-ac9c-4395ebfb2326",
            status: 'masuk',
        },
        {
            id: "0196b2ee-98ca-7da3-849f-d1bc1660cf15",
            scheduleId: "019618a1-68a4-7a00-8000-000000000002",
            userId: "0195d575-26cb-73a9-ac9c-4395ebfb2326",
            status: 'masuk',
        },
        {
            id: "0196b2ee-98ca-7da3-849f-d1bc1660cf16",
            scheduleId: "019618a1-68a4-7a00-8000-000000000003",
            userId: "0195d575-26cb-73a9-ac9c-4395ebfb2326",
            status: 'izin',
            reason: 'kucing saya mau melahirkan',
        },
        {
            id: "0196b2ee-bc5d-a9c5-bd9c-fc5d9d5d9d5f",
            scheduleId: "019618a1-68a4-7a00-8000-000000000004",
            userId: "0195d575-26cb-73a9-ac9c-4395ebfb2326",
            status: 'masuk',
        },
        {
            id: "0196b2ee-bc5d-a9c5-bd9c-fc5d9d5d9d60",
            scheduleId: "019618a1-68a4-7a00-8000-000000000005",
            userId: "0195d575-26cb-73a9-ac9c-4395ebfb2326",
            status: 'masuk',
        },
        {
            id: "0196b2ee-bc5d-a9c5-bd9c-fc5d9d5d9d61",
            scheduleId: "019618a1-68a4-7a00-8000-000000000006",
            userId: "0195d575-26cb-73a9-ac9c-4395ebfb2326",
            status: 'masuk',
        },
        {
            id: "0196b2ee-bc5d-a9c5-bd9c-fc5d9d5d9d62",
            scheduleId: "019618a1-68a4-7a00-8000-000000000007",
            userId: "0195d575-26cb-73a9-ac9c-4395ebfb2326",
            status: 'masuk',
        },
        {
            id: "0196b2ee-bc5d-a9c5-bd9c-fc5d9d5d9d63",
            scheduleId: "019618a1-68a4-7a00-8000-000000000008",
            userId: "0195d575-26cb-73a9-ac9c-4395ebfb2326",
            status: 'alpha',
        },

        // Venita - Bahasa Inggris
        {
            id: "0196b2ee-98ca-7da3-849f-d1bc1660cf17",
            scheduleId: "019618a1-68a4-7a00-8000-000000000001",
            userId: "019618a1-68a4-71c5-9f8d-5ef6ef4fc1aa",
            status: 'masuk',
        },
        {
            id: "0196b2ee-98ca-7da3-849f-d1bc1660cf18",
            scheduleId: "019618a1-68a4-7a00-8000-000000000002",
            userId: "019618a1-68a4-71c5-9f8d-5ef6ef4fc1aa",
            status: 'masuk',
        },
        {
            id: "0196b2ee-bc5d-a9c5-bd9c-fc5d9d5d9d64",
            scheduleId: "019618a1-68a4-7a00-8000-000000000003",
            userId: "019618a1-68a4-71c5-9f8d-5ef6ef4fc1aa",
            status: 'masuk',
        },
        {
            id: "0196b2ee-bc5d-a9c5-bd9c-fc5d9d5d9d65",
            scheduleId: "019618a1-68a4-7a00-8000-000000000004",
            userId: "019618a1-68a4-71c5-9f8d-5ef6ef4fc1aa",
            status: 'masuk',
        },
        {
            id: "0196b2ee-bc5d-a9c5-bd9c-fc5d9d5d9d66",
            scheduleId: "019618a1-68a4-7a00-8000-000000000005",
            userId: "019618a1-68a4-71c5-9f8d-5ef6ef4fc1aa",
            status: 'masuk',
        },
        {
            id: "0196b2ee-bc5d-a9c5-bd9c-fc5d9d5d9d67",
            scheduleId: "019618a1-68a4-7a00-8000-000000000006",
            userId: "019618a1-68a4-71c5-9f8d-5ef6ef4fc1aa",
            status: 'masuk',
        },
        {
            id: "0196b2ee-bc5d-a9c5-bd9c-fc5d9d5d9d68",
            scheduleId: "019618a1-68a4-7a00-8000-000000000007",
            userId: "019618a1-68a4-71c5-9f8d-5ef6ef4fc1aa",
            status: 'masuk',
        },
        {
            id: "0196b2ee-bc5d-a9c5-bd9c-fc5d9d5d9d69",
            scheduleId: "019618a1-68a4-7a00-8000-000000000008",
            userId: "019618a1-68a4-71c5-9f8d-5ef6ef4fc1aa",
            status: 'masuk',
        },
    ];
    for (const attendance of attendances) {
        await prisma.attendance.create({
            data: attendance,
        });
    }

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