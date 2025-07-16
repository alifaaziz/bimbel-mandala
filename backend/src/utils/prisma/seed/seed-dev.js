import { prisma } from '../../../utils/db.js';
import bcrypt from 'bcrypt';
import { ScheduleService } from '../../../services/schedule.js';

async function main() {
    // Seed Payments
    const payments =[{
            id: "01980001-0000-0000-0000-000000000006",
            platform: "BNI",
            accountNumber: "1234567890",
        },
        {
            id: "01980001-0000-0000-0000-000000000007",
            platform: "BRI",
            accountNumber: "0987654321",
        },
        {
            id: "01980001-0000-0000-0000-000000000008",
            platform: "Mandiri",
            accountNumber: "1122334455",
        },
        {
            id: "01980001-0000-0000-0000-000000000009",
            platform: "BCA",
            accountNumber: "5566778899",
        },
        {
            id: "01980001-0000-0000-0000-000000000010",
            platform: "OVO",
            accountNumber: "1234567890",
        },
        {
            id: "01980001-0000-0000-0000-000000000011",
            platform: "Gopay",
            accountNumber: "0987654321",
        },
        {
            id: "01980001-0000-0000-0000-000000000012",
            platform: "Dana",
            accountNumber: "1122334455",
        },
        {
            id: "01980001-0000-0000-0000-000000000013",
            platform: "Linkaja",
            accountNumber: "5566778899",
        },
        {
            id: "01980001-0000-0000-0000-000000000014",
            platform: "ShopeePay",
            accountNumber: "1234567890",
        }
    ];

    for (const payment of payments) {
        await prisma.payment.create({
            data: payment,
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
          {
            id:"01979a81-cc2d-76ff-8ec8-7ad40efe4999",
            name: "Ahmad Fadli, S.Pd.I",
            email: "ahmadfadli@mail.com",
            password: await bcrypt.hash("password123", 10),
            role: "tutor",
            verified: true,
          },
          {
            id: "01979a8a-d5c8-71ba-9bd5-75e76b166429",
            name:"Siti Aisyah, S.Pd",
            email: "siti@mail.com",
            password: await bcrypt.hash("password123", 10),
            role: "tutor",
            verified: true,
          },
          {
            id: "01979a8b-e9c9-709a-a8d6-c741b8a14abc",
            name: "Rina Kartika, S.Pd",
            email: "rina@mail.com",
            password: await bcrypt.hash("password123", 10),
            role: "tutor",
            verified: true,
          },
          {
            id:"01979a8d-7e80-7055-a1b1-93c5b270acbd",
            name: "Dimas Prasetyo, S.Pd",
            email: "dimas@mail.com",
            password: await bcrypt.hash("password123", 10),
            role: "tutor",
            verified: true,
          },
          {
            id: "01979a8d-ae94-73cb-8864-ce9f864fc1a0",
            name: "Mega Ayuningtyas, S.Pd",
            email: "mega@mail.com",
            password: await bcrypt.hash("password123", 10),
            role: "tutor",
            verified: true,
          },
          {
            id:"01979a8f-4a1a-7693-83e2-ff00c9e31fac",
            name:"Hendri Setiawan, S.Pd",
            email: "hendri@mail.com",
            password: await bcrypt.hash("password123", 10),
            role: "tutor",
            verified: true,
          },
          {
            id: "01979a90-8fd7-734e-a4a7-43ef668ce7ca",
            name: "Siti Rahmawati, S.Pd",
            email: "sitirahmawati@mail.com",
            password: await bcrypt.hash("password123", 10),
            role: "tutor",
            verified: true,
          },
          {
            id:"01979a91-6fde-7196-ba74-891549333b26",
            name: "Anastasia Widya, S.Pd",
            email: "anastasia@mail.com",
            password: await bcrypt.hash("password123", 10),
            role: "tutor",
            verified: true,
          },
        {
            id: "0197b421-92cc-7d21-b0e6-0ce4adb7af6e",
            name: "Ahmad Fauzi, S.Pd.",
            email: "ahmadfauzi@mail.com",
            password: await bcrypt.hash("password123", 10),
            role: "tutor",
            verified: true,
        },
        {
            id: "0197b421-92cc-7b38-8e52-f786b7603fb2",
            name: "Lestari Widyaningsih, S.Pd.",
            email: "lestariwidya@mail.com",
            password: await bcrypt.hash("password123", 10),
            role: "tutor",
            verified: true,
        },
        {
            id: "0197b421-92cc-717d-99d0-e595f2c5b6e2",
            name: "Dedi Prasetyo, S.Pd.",
            email: "dediprasetyo@mail.com",
            password: await bcrypt.hash("password123", 10),
            role: "tutor",
            verified: true,
        },
        {
            id: "0197b421-92cc-7e5b-addd-fe579bc048c2",
            name: "Ratna Melani, S.Pd.",
            email: "ratnamelani@mail.com",
            password: await bcrypt.hash("password123", 10),
            role: "tutor",
            verified: true,
        },
        {
            id: "0197b421-92cc-70a9-ab90-c53667ebee61",
            name: "Budi Santoso, S.Pd.",
            email: "budisantoso@mail.com",
            password: await bcrypt.hash("password123", 10),
            role: "tutor",
            verified: true,
        },
        {
            id: "0197b421-92cc-765b-a22a-ab51d0b2d6c4",
            name: "Siti Nurhaliza, S.Pd.I",
            email: "sitinurhaliza@mail.com",
            password: await bcrypt.hash("password123", 10),
            role: "tutor",
            verified: true,
        },
        {
            id: "0197b421-92cc-7085-88f1-366574bd9a17",
            name: "Agustinus Yulianto, S.Pd.K",
            email: "agustinusyulianto@mail.com",
            password: await bcrypt.hash("password123", 10),
            role: "tutor",
            verified: true,
        },
        {
            id: "0197b421-92cc-7854-a588-26af45c3cf3a",
            name: "Yohana Maria, S.Pd.",
            email: "yohanamaria@mail.com",
            password: await bcrypt.hash("password123", 10),
            role: "tutor",
            verified: true,
        },
        {
            id: "0197b421-92cc-7bea-b2c8-b38bb12ce3e9",
            name: "Rudi Hartono, S.Or.",
            email: "rudihartono@mail.com",
            password: await bcrypt.hash("password123", 10),
            role: "tutor",
            verified: true,
        },
        {
            id: "0197b421-92cc-732e-b902-d6fb4363579e",
            name: "Diana Prameswari, S.Pd.",
            email: "dianaprameswari@mail.com",
            password: await bcrypt.hash("password123", 10),
            role: "tutor",
            verified: true,
        },
        {
            id: "0197b421-92cc-730c-9985-10f25a88fd83",
            name: "Erwin Saputra, S.Sn.",
            email: "erwinsaputra@mail.com",
            password: await bcrypt.hash("password123", 10),
            role: "tutor",
            verified: true,
        },
        {
            id: "0197b421-92cc-7ca6-b637-cb8f6eeead5c",
            name: "Maya Lestari, S.Sn.",
            email: "mayalestari@mail.com",
            password: await bcrypt.hash("password123", 10),
            role: "tutor",
            verified: true,
        },
        {
            id: "0197b421-92cc-7bfa-bec7-df624300ad89",
            name: "Anjar Widodo, S.Pd.",
            email: "anjarwidodo@mail.com",
            password: await bcrypt.hash("password123", 10),
            role: "tutor",
            verified: true,
        },
        {
            id: "0197b421-92cc-776c-8070-d476ed031f5b",
            name: "Novi Rachmawati, S.Pd.",
            email: "novirachmawati@mail.com",
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
            photo: '/tutors/1.png',
            percent: 70,
            days: JSON.stringify([
                "Senin",
                "Rabu",
                "Kamis"
            ])
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
            photo: '/tutors/2.png',
            percent: 60,
            days: JSON.stringify([
                "Selasa",
                "Jumat"
            ])
        },
        {
            id: "0196b294-4791-7688-b84e-d445b3c179a7",
            userId: "0196b294-4791-7972-912a-33627d5b14a7", // Ratna Dewi M.Pd
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
            photo: '/tutors/4.png',
            percent: 60,
            days: JSON.stringify([
                "Senin",
                "Rabu"
            ])
        },
        {
            id: "0196b294-4791-7159-8bfe-a78b6cb6d210",
            userId: "0196b294-4791-7972-912a-33627d5b14a8", // Fajar Nugroho, S.T
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
            photo: '/tutors/3.png',
            percent: 60,
            days: JSON.stringify([
                "Selasa",
                "Jumat"
            ])
        },
        {
            id: "0196b294-4791-7793-9e50-871941b175a0",
            userId: "0196b294-4791-7972-912a-33627d5b14a9", // Intan Lestari, S.Si
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
            percent: 60,
            days: JSON.stringify([
                "Jumat",
                "Sabtu"
            ])
        },
        {
            id: "01979a81-cc2d-76ff-8ec8-7ad40efe4999",
            userId: "01979a81-cc2d-76ff-8ec8-7ad40efe4999", // Ahmad Fadli, S.Pd.I
            birthDate: new Date('1992-06-15'),
            gender: 'Male',
            phone: '081234567890',
            address: 'Jl. Merdeka No. 6',
            subjects: 'Pendidikan Agama Islam & Budi Pekerti',
            status: 'S1',
            major: 'Pendidikan Agama Islam',
            school: 'Universitas Bina Sekolah',
            teachLevel: 'SD',
            description: 'Experienced tutor in Islamic studies, dedicated and passionate about teaching.',
            percent: 60,
            days: JSON.stringify([
                "Senin",
                "Selasa"
            ])
        },
        {
            id: "01979a8a-d5c8-71ba-9bd5-75e76b166429",
            userId: "01979a8a-d5c8-71ba-9bd5-75e76b166429", // Siti Aisyah, S.Pd
            birthDate: new Date('1993-07-21'),
            gender: 'Female',
            phone: '081234567891',
            address: 'Jl. Merdeka No. 7',
            subjects: 'Pendidikan Pancasila',
            status: 'S1',
            major: 'Pendidikan Guru Sekolah Dasar',
            school: 'Universitas Bina Sekolah',
            teachLevel: 'SD',
            description: 'Experienced tutor in Pendidikan Pancasila, dedicated and passionate about teaching.',
            percent: 60,
            days: JSON.stringify([
                "Rabu",
                "Jumat"
            ])
        },
        {
            id: "01979a92-eefe-7aef-8175-49e2c7f8da9b",
            userId: "01979a8b-e9c9-709a-a8d6-c741b8a14abc",// Rina Kartika, S.Pd
            birthDate: new Date('1994-08-12'),
            gender: 'Female',
            phone: '081234567892',
            address: 'Jl. Merdeka No. 8',
            subjects: 'Bahasa Indonesia',
            status: 'S1',
            major: 'Pendidikan Guru Sekolah Dasar',
            school: 'Universitas Bina Sekolah',
            teachLevel: 'SD',
            description: 'Experienced tutor in Bahasa Indonesia, passionate about teaching at elementary level.',
            percent: 60,
            days: JSON.stringify([
                "Sabtu",
                "Kamis"
            ])
        },
        {
            id: "01979a92-eefe-79cd-b645-e1c1566f0ddf",
            userId: "01979a8d-7e80-7055-a1b1-93c5b270acbd",// Dimas Prasetyo, S.Pd
            birthDate: new Date('1995-09-15'),
            gender: 'Male',
            phone: '081234567893',
            address: 'Jl. Merdeka No. 9',
            subjects: 'Matematika',
            status: 'S1',
            major: 'Pendidikan Guru Sekolah Dasar',
            school: 'Universitas Bina Sekolah',
            teachLevel: 'SD',
            description: 'Experienced tutor in Mathematics, dedicated to helping elementary students excel.',
            percent: 60,
            days: JSON.stringify([
                "Senin",
                "Jumat"
            ])
        },
        {
            id: "01979a92-eefe-7965-91b4-0139dcd8ad1a",
            userId: "01979a8d-ae94-73cb-8864-ce9f864fc1a0",// Mega Ayuningtyas, S.Pd
            birthDate: new Date('1996-10-20'),
            gender: 'Female',
            phone: '081234567894',
            address: 'Jl. Merdeka No. 10',
            subjects: 'PJOK',
            status: 'S1',
            major: 'Pendidikan Guru Sekolah Dasar',
            school: 'Universitas Bina Sekolah',
            teachLevel: 'SD',
            description: 'Experienced tutor in PJOK, enthusiastic about physical education for young learners.',
            percent: 60,
            days: JSON.stringify([
                "Selasa",
                "Sabtu"
            ])
        },
        {
            id: "01979a92-eefe-79b7-a33f-92d802fb9bac",
            userId: "01979a8f-4a1a-7693-83e2-ff00c9e31fac",// Hendri Setiawan, S.Pd
            birthDate: new Date('1994-11-25'),
            gender: 'Male',
            phone: '081234567895',
            address: 'Jl. Merdeka No. 11',
            subjects: 'Seni Budaya',
            status: 'S1',
            major: 'Pendidikan Guru Sekolah Dasar',
            school: 'Universitas Bina Sekolah',
            teachLevel: 'SD',
            description: 'Experienced tutor in Seni Budaya, creative and passionate about arts education.',
            percent: 60,
            days: JSON.stringify([
                "Rabu",
                "Jumat"
            ])
        },
        {
            id: "01979a92-eefe-7d78-b9ac-e570ddc914e2",
            userId: "01979a90-8fd7-734e-a4a7-43ef668ce7ca",// Siti Rahmawati, S.Pd
            birthDate: new Date('1993-12-30'),
            gender: 'Female',
            phone: '081234567896',
            address: 'Jl. Merdeka No. 12',
            subjects: 'IPAS',
            status: 'S1',
            major: 'Pendidikan Guru Sekolah Dasar',
            school: 'Universitas Bina Sekolah',
            teachLevel: 'SD',
            description: 'Experienced tutor in IPAS, committed to science education for elementary students.',
            percent: 60,
            days: JSON.stringify([
                "Kamis",
                "Sabtu"
            ])
        },
        {
            id: "01979a92-eefe-783c-a68e-2066ef410830",
            userId: "01979a91-6fde-7196-ba74-891549333b26",// Anastasia Widya, S.Pd
            birthDate: new Date('1992-07-18'),
            gender: 'Female',
            phone: '081234567897',
            address: 'Jl. Merdeka No. 13',
            subjects: 'Bahasa Inggris',
            status: 'S1',
            major: 'Pendidikan Bahasa Inggris',
            school: 'Universitas Bina Sekolah',
            teachLevel: 'SD',
            description: 'Experienced tutor in Bahasa Inggris, passionate about teaching English to young learners.',
            percent: 60,
            days: JSON.stringify([
                "Senin",
                "Selasa"
            ])
        },
        {
            id: "0197b421-92cc-7d21-b0e6-0ce4adb7af6e",
            userId: "0197b421-92cc-7d21-b0e6-0ce4adb7af6e", // Ahmad Fauzi, S.Pd.
            birthDate: new Date('1991-01-01'),
            gender: 'Male',
            phone: '081234567900',
            address: 'Jl. Merdeka No. 14',
            subjects: 'Bahasa Indonesia',
            status: 'S1',
            major: 'Pendidikan Bahasa Indonesia',
            school: 'Universitas Negeri Semarang',
            teachLevel: 'SMP',
            description: 'Berpengalaman mengajar Bahasa Indonesia tingkat SMP dan SMA.',
            percent: 60,
            days: JSON.stringify([
                "Senin",
                "Rabu",
                "Sabtu"
            ])
        },
        {
            id: "0197b421-92cc-7b38-8e52-f786b7603fb2",
            userId: "0197b421-92cc-7b38-8e52-f786b7603fb2",// Lestari Widyaningsih, S.Pd.
            birthDate: new Date('1992-02-02'),
            gender: 'Female',
            phone: '081234567901',
            address: 'Jl. Merdeka No. 15',
            subjects: 'Matematika',
            status: 'S1',
            major: 'Pendidikan Matematika',
            school: 'Universitas Negeri Semarang',
            teachLevel: 'SMP',
            description: 'Berpengalaman mengajar Matematika tingkat SMP dan SMA.',
            percent: 60,
            days: JSON.stringify([
                "Selasa",
                "Jumat"
            ])
        },
        {
            id: "0197b421-92cc-717d-99d0-e595f2c5b6e2",
            userId: "0197b421-92cc-717d-99d0-e595f2c5b6e2", // Dedi Prasetyo, S.Pd.
            birthDate: new Date('1993-03-03'),
            gender: 'Male',
            phone: '081234567902',
            address: 'Jl. Merdeka No. 16',
            subjects: 'Ilmu Pengetahuan Alam',
            status: 'S1',
            major: 'Pendidikan Kimia',
            school: 'Universitas Negeri Semarang',
            teachLevel: 'SMP',
            description: 'Berpengalaman mengajar IPA tingkat SMP.',
            percent: 60,
            days: JSON.stringify([
                "Sabtu",
                "Kamis"
            ])
        },
        {
            id: "0197b421-92cc-7e5b-addd-fe579bc048c2",
            userId: "0197b421-92cc-7e5b-addd-fe579bc048c2", // Ratna Melani, S.Pd.
            birthDate: new Date('1994-04-04'),
            gender: 'Female',
            phone: '081234567903',
            address: 'Jl. Merdeka No. 17',
            subjects: 'Ilmu Pengetahuan Sosial',
            status: 'S1',
            major: 'Pendidikan IPS',
            school: 'Universitas Negeri Semarang',
            teachLevel: 'SMP',
            description: 'Berpengalaman mengajar IPS tingkat SMP.',
            percent: 60,
            days: JSON.stringify([
                "Selasa",
                "Jumat"
            ])
        },
        {
            id: "0197b421-92cc-70a9-ab90-c53667ebee61",
            userId: "0197b421-92cc-70a9-ab90-c53667ebee61", // Budi Santoso, S.Pd.
            birthDate: new Date('1995-05-05'),
            gender: 'Male',
            phone: '081234567904',
            address: 'Jl. Merdeka No. 18',
            subjects: 'PPKn',
            status: 'S1',
            major: 'Pendidikan Pancasila dan Kewarganegaraan',
            school: 'Universitas Negeri Semarang',
            teachLevel: 'SMP',
            description: 'Berpengalaman mengajar PPKn tingkat SMP.',
            percent: 60,
            days: JSON.stringify([
                "Senin",
                "Rabu"
            ])
        },
        {
            id: "0197b421-92cc-765b-a22a-ab51d0b2d6c4",
            userId: "0197b421-92cc-765b-a22a-ab51d0b2d6c4", // Siti Nurhaliza, S.Pd.I
            birthDate: new Date('1996-06-06'),
            gender: 'Female',
            phone: '081234567905',
            address: 'Jl. Merdeka No. 19',
            subjects: 'Pendidikan Agama Islam',
            status: 'S1',
            major: 'Pendidikan Agama Islam',
            school: 'Universitas Negeri Semarang',
            teachLevel: 'SMP',
            description: 'Berpengalaman mengajar Pendidikan Agama Islam tingkat SMP.',
            percent: 60,
            days: JSON.stringify([
                "Selasa",
                "Jumat"
            ])
        },
        {
            id: "0197b421-92cc-7085-88f1-366574bd9a17",
            userId: "0197b421-92cc-7085-88f1-366574bd9a17", // Agustinus Yulianto, S.Pd.K
            birthDate: new Date('1997-07-07'),
            gender: 'Male',
            phone: '081234567906',
            address: 'Jl. Merdeka No. 20',
            subjects: 'Pendidikan Agama Kristen',
            status: 'S1',
            major: 'Pendidikan Agama Kristen',
            school: 'Universitas Negeri Semarang',
            teachLevel: 'SMP',
            description: 'Berpengalaman mengajar Pendidikan Agama Kristen tingkat SMP.',
            percent: 60,
            days: JSON.stringify([
                "Sabtu",
                "Kamis"
            ])
        },
        {
            id: "0197b421-92cc-7854-a588-26af45c3cf3a",
            userId: "0197b421-92cc-7854-a588-26af45c3cf3a", // Yohana Maria, S.Pd.
            birthDate: new Date('1998-08-08'),
            gender: 'Female',
            phone: '081234567907',
            address: 'Jl. Merdeka No. 21',
            subjects: 'Bahasa Inggris',
            status: 'S1',
            major: 'Pendidikan Bahasa Inggris',
            school: 'Universitas Negeri Semarang',
            teachLevel: 'SMP',
            description: 'Berpengalaman mengajar Bahasa Inggris tingkat SMP.',
            percent: 60,
            days: JSON.stringify([
                "Senin",
                "Selasa"
            ])
        },
        {
            id: "0197b421-92cc-7bea-b2c8-b38bb12ce3e9",
            userId: "0197b421-92cc-7bea-b2c8-b38bb12ce3e9", // Ahmad Fauzi, S.Pd.
            birthDate: new Date('1999-09-09'),
            gender: 'Male',
            phone: '081234567908',
            address: 'Jl. Merdeka No. 22',
            subjects: 'PJOK',
            status: 'S1',
            major: 'Pendidikan Jasmani, Kesehatan, dan Rekreasi',
            school: 'Universitas Negeri Semarang',
            teachLevel: 'SMP',
            description: 'Berpengalaman mengajar PJOK tingkat SMP.',
            percent: 60,
            days: JSON.stringify([
                "Rabu",
                "Jumat"
            ])
        },
        {
            id: "0197b421-92cc-732e-b902-d6fb4363579e",
            userId: "0197b421-92cc-732e-b902-d6fb4363579e", // Diana Prameswari, S.Pd.
            birthDate: new Date('1990-10-10'),
            gender: 'Female',
            phone: '081234567909',
            address: 'Jl. Merdeka No. 23',
            subjects: 'Informatika',
            status: 'S1',
            major: 'Pendidikan Teknik Informatika',
            school: 'Universitas Negeri Semarang',
            teachLevel: 'SMP',
            description: 'Berpengalaman mengajar Informatika tingkat SMP.',
            percent: 60,
            days: JSON.stringify([
                "Sabtu",
                "Kamis"
            ])
        },
        {
            id: "0197b421-92cc-730c-9985-10f25a88fd83",
            userId: "0197b421-92cc-730c-9985-10f25a88fd83", // Erwin Saputra, S.Sn.
            birthDate: new Date('1991-11-11'),
            gender: 'Male',
            phone: '081234567910',
            address: 'Jl. Merdeka No. 24',
            subjects: 'Seni Musik',
            status: 'S1',
            major: 'Seni Musik',
            school: 'Universitas Negeri Semarang',
            teachLevel: 'SMP',
            description: 'Berpengalaman mengajar Seni Musik tingkat SMP.',
            percent: 60,
            days: JSON.stringify([
                "Senin",
                "Selasa"
            ])
        },
        {
            id: "0197b421-92cc-7ca6-b637-cb8f6eeead5c",
            userId: "0197b421-92cc-7ca6-b637-cb8f6eeead5c", // Maya Lestari, S.Sn.
            birthDate: new Date('1992-12-12'),
            gender: 'Female',
            phone: '081234567911',
            address: 'Jl. Merdeka No. 25',
            subjects: 'Seni Rupa',
            status: 'S1',
            major: 'Seni Rupa',
            school: 'Universitas Negeri Semarang',
            teachLevel: 'SMP',
            description: 'Berpengalaman mengajar Seni Rupa tingkat SMP.',
            percent: 60,
            days: JSON.stringify([
                "Rabu",
                "Jumat"
            ])
        },
        {
            id: "0197b421-92cc-7bfa-bec7-df624300ad89",
            userId: "0197b421-92cc-7bfa-bec7-df624300ad89", // Anjar Widodo, S.Pd.
            birthDate: new Date('1993-08-13'),
            gender: 'Male',
            phone: '081234567912',
            address: 'Jl. Merdeka No. 26',
            subjects: 'Prakarya',
            status: 'S1',
            major: 'Pendidikan Kesejahteraan Keluarga',
            school: 'Universitas Negeri Semarang',
            teachLevel: 'SMP',
            description: 'Berpengalaman mengajar Prakarya tingkat SMP.',
            percent: 60,
            days: JSON.stringify([
                "Sabtu",
                "Kamis"
            ])
        },
        {
            id: "0197b421-92cc-776c-8070-d476ed031f5b",
            userId: "0197b421-92cc-776c-8070-d476ed031f5b", // Novi Rachmawati, S.Pd.
            birthDate: new Date('1994-09-14'),
            gender: 'Female',
            phone: '081234567913',
            address: 'Jl. Merdeka No. 27',
            subjects: 'Muatan Lokal Bahasa Jawa',
            status: 'S1',
            major: 'Pendidikan Bahasa Daerah',
            school: 'Universitas Negeri Semarang',
            teachLevel: 'SMP',
            description: 'Berpengalaman mengajar Bahasa Jawa tingkat SMP.',
            percent: 60,
            days: JSON.stringify([
                "Senin",
                "Selasa"
            ])
        }
    ];

    for (const tutor of tutors) {
        await prisma.tutor.create({
            data: tutor,
        });
    }

    // Seed notifications
    const notifications = [
        {
            id: "0195c5ed-3fc9-7254-aaef-e5136c6b8606",
            userId: "0195c5ed-3fc9-71de-93d8-d850abe7b4fa",// Su Yon Oh
            type: 'Pendaftaran Akun',
            description: 'Selamat datang di Bimbingan Belajar Mandala, selamat belajar!',
            photo: '/mandala.png',
        },
        {
            id: "019618a1-68a4-7d40-bcf4-ed7d4e8305ff",
            userId: "0195d575-26cb-73a9-ac9c-4395ebfb2326",// So Lie Kien
            type: 'Pendaftaran Akun',
            description: 'Selamat datang di Bimbingan Belajar Mandala, selamat belajar!',
            photo: '/mandala.png',
        },
        {
            id: "019618a1-68a4-725a-bd3d-e62956fbd79b",
            userId: "019618a1-68a4-7742-9471-2548f7726e86",// Ma Tor Nu Won
            type: 'Pendaftaran Akun',
            description: 'Selamat datang di Bimbingan Belajar Mandala, selamat belajar!',
            photo: '/mandala.png',
        },
        {
            id: "0195c5fa-413e-7927-afed-d65683fb14c0",
            userId: "0195c5ed-3fc9-771d-bced-9c4b10afd9a2", // Dendy Wan S.Pd
            type: 'Pendaftaran Akun',
            description: 'Selamat datang di Bimbingan Belajar Mandala, selamat bergabung sebagai tutor.',
            photo: '/mandala.png',
        },
        {
            id: "019618a1-68a4-7bff-a08a-255d2635db95",
            userId: "019618a1-68a4-71c5-9f8d-5ef6ef4fc1aa", // Venita S.Pd
            type: 'Pendaftaran Akun',
            description: 'Selamat datang di Bimbingan Belajar Mandala, selamat bergabung sebagai tutor.',
            photo: '/mandala.png',
        },
        {
            id: "0196b294-4791-7c97-bfed-3d6e3e640449", // ID unik
            userId: "0196b294-4791-7c97-bfed-3d6e3e640448", // Michelle Chloe
            type: 'Pendaftaran Akun',
            description: 'Selamat datang di Bimbingan Belajar Mandala, selamat belajar!',
            photo: '/mandala.png',
        },
        {
            id: "0196b294-4791-7510-a96a-db04d94dfbde", // ID unik
            userId: "0196b294-4791-7510-a96a-db04d94dfbdd", // Diana Wong
            type: 'Pendaftaran Akun',
            description: 'Selamat datang di Bimbingan Belajar Mandala, selamat belajar!',
            photo: '/mandala.png',
        },
        {
            id: "019780d6-fa98-7447-9fce-7a7b2eee0ff7", // ID unik
            userId: "0196b294-4791-7972-912a-33627d5b14b1", // Adi Nugroho
            type: 'Pendaftaran Akun',
            description: 'Selamat datang di Bimbingan Belajar Mandala, selamat belajar!',
            photo: '/mandala.png',
        },
        {
            id: "0196b294-4791-7972-912a-33627d5b14b3", // ID unik
            userId: "0196b294-4791-7972-912a-33627d5b14b2", // Sari Utami
            type: 'Pendaftaran Akun',
            description: 'Selamat datang di Bimbingan Belajar Mandala, selamat belajar!',
            photo: '/mandala.png',
        },
        {
            id: "0196b294-4791-7972-912a-33627d5b14b4", // ID unik
            userId: "0196b294-4791-7972-912a-33627d5b14b3", // Rudi Santoso
            type: 'Pendaftaran Akun',
            description: 'Selamat datang di Bimbingan Belajar Mandala, selamat belajar!',
            photo: '/mandala.png',
        },
        {
            id: "0196b294-4791-7972-912a-33627d5b14b5", // ID unik
            userId: "0196b294-4791-7972-912a-33627d5b14b4", // Lina Agustina
            type: 'Pendaftaran Akun',
            description: 'Selamat datang di Bimbingan Belajar Mandala, selamat belajar!',
            photo: '/mandala.png',
        },
        {
            id: "019780d5-a8ba-7c7f-9fec-224d26300039", // ID unik
            userId: "0196b294-4791-7972-912a-33627d5b14b5", // Budi Hartono
            type: 'Pendaftaran Akun',
            description: 'Selamat datang di Bimbingan Belajar Mandala, selamat belajar!',
            photo: '/mandala.png',
        },
        {
            id: "019780d5-e394-7239-9ca6-3ae5c6bdb2a9", // ID unik
            userId: "0196b294-4791-7972-912a-33627d5b14b6", // Maya Putri
            type: 'Pendaftaran Akun',
            description: 'Selamat datang di Bimbingan Belajar Mandala, selamat belajar!',
            photo: '/mandala.png',
        },
        {
            id: "019780b5-1d07-797a-ae32-20936b8b5767", // ID unik
            userId: "0196b294-4791-7972-912a-33627d5b14b7", // Yoga Pratama
            type: 'Pendaftaran Akun',
            description: 'Selamat datang di Bimbingan Belajar Mandala, selamat belajar!',
            photo: '/mandala.png',
        },
        {
            id: "0196b294-4791-7972-912a-33627d5b14b9", // ID unik
            userId: "0196b294-4791-7972-912a-33627d5b14b8", // Dewi Anjani
            type: 'Pendaftaran Akun',
            description: 'Selamat datang di Bimbingan Belajar Mandala, selamat belajar!',
            photo: '/mandala.png',
        },
        {
            id: "0196b294-4791-7972-912a-33627d5b14c1", // ID unik
            userId: "0196b294-4791-7972-912a-33627d5b14b9", // Tommy Wijaya
            type: 'Pendaftaran Akun',
            description: 'Selamat datang di Bimbingan Belajar Mandala, selamat belajar!',
            photo: '/mandala.png',
        },
        {
            id: "0196b294-4791-7972-912a-33627d5b14c2", // ID unik
            userId: "0196b294-4791-7972-912a-33627d5b14c0", // Indah Sari
            type: 'Pendaftaran Akun',
            description: 'Selamat datang di Bimbingan Belajar Mandala, selamat belajar!',
            photo: '/mandala.png',
        },
        {
            id: "0196b294-4791-7972-912a-33627d5b14a8", // ID unik
            userId: "0196b294-4791-7972-912a-33627d5b14a7", // Ratna Dewi M.Pd
            type: 'Pendaftaran Akun',
            description: 'Selamat datang di Bimbingan Belajar Mandala, selamat bergabung sebagai tutor.',
            photo: '/mandala.png',
        },
        {
            id: "0196b294-4791-7972-912a-33627d5b14a9", // ID unik
            userId: "0196b294-4791-7972-912a-33627d5b14a8", // Fajar Nugroho, S.T
            type: 'Pendaftaran Akun',
            description: 'Selamat datang di Bimbingan Belajar Mandala, selamat bergabung sebagai tutor.',
            photo: '/mandala.png',
        },
        {
            id: "0196b294-4791-7972-912a-33627d5b14aa", // ID unik
            userId: "0196b294-4791-7972-912a-33627d5b14a9", // Intan Lestari, S.Si
            type: 'Pendaftaran Akun',
            description: 'Selamat datang di Bimbingan Belajar Mandala, selamat bergabung sebagai tutor.',
            photo: '/mandala.png',
        },
        {
            id: "0196f634-6979-7231-b83b-18de51222ec6",
            userId: "0195c5ed-3fc9-71de-93d8-d850abe7b4fa", // Su Yon Oh
            type: 'Program',
            description: 'Selamat, Bimbingan belajar <strong>Matematika SMP #AAA123</strong> bersama <strong>Pak Dendy Wan, S.Pd</strong> sudah terkonfirmasi dan segera berlangsung.',
            photo: '/tutors/1.png',
        },
        {
            id: "0196f634-6979-7e5a-b353-4a2c95a35435",
            userId: "0195c5ed-3fc9-771d-bced-9c4b10afd9a2", // Dendy Wan S.Pd
            type: 'Program',
            description: 'Selamat, Bimbingan belajar <strong>Matematika SMP #AAA123</strong> sudah terkonfirmasi dan segera berlangsung.',
            photo: '/tutors/1.png',
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
            time: new Date('1970-01-01T08:00:00Z'),
            duration: 90,
            area: 'Semarang',
            slug: 'matematika-smp-12lkop',
            userId: '0195c5ed-3fc9-771d-bced-9c4b10afd9a2', // Dendy Wan S.Pd
            discount: 10,
            isActive: false,
            days: JSON.stringify([
                "Senin",
                "Rabu",
                "Sabtu"
            ]),
        },
        {
            id: "019618a1-68a4-7f67-acd4-aeccf37ca7c7",
            name: 'Bahasa Inggris',
            level: 'SMA',
            totalMeetings: 8,
            time: new Date('1970-01-01T08:00:00Z'),
            duration: 120,
            area: 'Semarang',
            slug: 'bahasa-inggris-sma-14klui',
            userId: '019618a1-68a4-71c5-9f8d-5ef6ef4fc1aa', // Venita S.Pd
            days: JSON.stringify([
                "Selasa",
                "Jumat"
            ]),
        },
        {
            id: "0196b294-4791-7b00-8000-000000000011",
            name: "Kimia",
            level: "SMA",
            totalMeetings: 24,
            time: new Date("1970-01-01T08:00:00Z"),
            duration: 90,
            area: "Semarang",
            slug: "kimia-sma-dg67ty",
            userId: "0196b294-4791-7972-912a-33627d5b14a7", // Ratna Dewi M.Pd
            discount: 10,
            days: JSON.stringify([
                "Senin",
                "Rabu"
            ]),
        },
        {
            id: "0196b294-4791-7b00-8000-000000000012",
            name: "Fisika",
            level: "SMA",
            totalMeetings: 24,
            time: new Date("1970-01-01T08:00:00Z"),
            duration: 90,
            area: "Semarang",
            slug: "fisika-sma-0ki8er",
            userId: "0196b294-4791-7972-912a-33627d5b14a8", // Fajar Nugroho, S.T
            discount: 10,
            days: JSON.stringify([
                "Selasa",
                "Jumat"
            ]),
        },
        {
            id: "0196b294-4791-7b00-8000-000000000013",
            name: "Biologi",
            level: "SMA",
            totalMeetings: 24,
            time: new Date("1970-01-01T08:00:00Z"),
            duration: 90,
            area: "Semarang",
            slug: "biologi-sma-l4l4qw",
            userId: "0196b294-4791-7972-912a-33627d5b14a9", // Intan Lestari, S.Si
            discount: 10,
            days: JSON.stringify([
                "Sabtu",
                "Kamis"
            ]),
        },
        {
            id: "0196b294-4791-7b00-8000-000000000014",
            name: "FOKUS UTBK",
            level: "SMA",
            totalMeetings: 4,
            time: new Date("1970-01-01T08:00:00Z"),
            duration: 90,
            area: "Jl. Pemuda No.150, Sekayu, Kec. Semarang Tengah",
            slug: "fokus-utbk-sma-9j8k7l",
            userId: "0195c5ed-3fc9-771d-bced-9c4b10afd9a2", // Dendy Wan S.Pd
            startDate: new Date("2024-07-21T08:00:00Z"),
            days: JSON.stringify([
                "Senin",
                "Rabu"
            ]),
        },
        {
            id: "01979a8a-d5c8-71ba-9bd5-75e76b166430",
            name: "Pendidikan Pancasila",
            level: "SD",
            totalMeetings: 12,
            time: new Date("1970-01-01T08:00:00Z"),
            duration: 60,
            area: "Semarang",
            slug: "pendidikan-pancasila-sd-1a2b3c",
            userId: "01979a8a-d5c8-71ba-9bd5-75e76b166429", // Siti Aisyah, S.Pd
            discount: 0,
            isActive: true,
            days: JSON.stringify([
                "Rabu",
                "Jumat"
            ]),
        },
        {
            id: "01979a8b-e9c9-709a-a8d6-c741b8a14abd",
            name: "Bahasa Indonesia",
            level: "SD",
            totalMeetings: 12,
            time: new Date("1970-01-01T08:00:00Z"),
            duration: 60,
            area: "Semarang",
            slug: "bahasa-indonesia-sd-4d5e6f",
            userId: "01979a8b-e9c9-709a-a8d6-c741b8a14abc", // Rina Kartika, S.Pd
            discount: 0,
            isActive: true,
            days: JSON.stringify([
                "Sabtu",
                "Kamis"
            ]),
        },
        {
            id: "01979a8d-7e80-7055-a1b1-93c5b270acbe",
            name: "Matematika",
            level: "SD",
            totalMeetings: 12,
            time: new Date("1970-01-01T08:00:00Z"),
            duration: 60,
            area: "Semarang",
            slug: "matematika-sd-7g8h9i",
            userId: "01979a8d-7e80-7055-a1b1-93c5b270acbd", // Dimas Prasetyo, S.Pd
            discount: 0,
            isActive: true,
            days: JSON.stringify([
                "Senin",
                "Jumat"
            ]),
        },
        {
            id: "01979a8d-ae94-73cb-8864-ce9f864fc1a1",
            name: "PJOK",
            level: "SD",
            totalMeetings: 12,
            time: new Date("1970-01-01T08:00:00Z"),
            duration: 60,
            area: "Semarang",
            slug: "pjok-sd-0j1k2l",
            userId: "01979a8d-ae94-73cb-8864-ce9f864fc1a0", // Mega Ayuningtyas, S.Pd
            discount: 0,
            isActive: true,
            days: JSON.stringify([
                "Selasa",
                "Sabtu"
            ]),
        },
        {
            id: "01979a8f-4a1a-7693-83e2-ff00c9e31fad",
            name: "Seni Budaya",
            level: "SD",
            totalMeetings: 12,
            time: new Date("1970-01-01T08:00:00Z"),
            duration: 60,
            area: "Semarang",
            slug: "seni-budaya-sd-3m4n5o",
            userId: "01979a8f-4a1a-7693-83e2-ff00c9e31fac", // Hendri Setiawan, S.Pd
            discount: 0,
            isActive: true,
            days: JSON.stringify([
                "Rabu",
                "Jumat"
            ]),
        },
        {
            id: "01979a90-8fd7-734e-a4a7-43ef668ce7cb",
            name: "IPAS",
            level: "SD",
            totalMeetings: 12,
            time: new Date("1970-01-01T08:00:00Z"),
            duration: 60,
            area: "Semarang",
            slug: "ipas-sd-6p7q8r",
            userId: "01979a90-8fd7-734e-a4a7-43ef668ce7ca", // Siti Rahmawati, S.Pd
            discount: 0,
            isActive: true,
            days: JSON.stringify([
                "Kamis",
                "Sabtu"
            ]),
        },
        {
            id: "01979a91-6fde-7196-ba74-891549333b27",
            name: "Bahasa Inggris",
            level: "SD",
            totalMeetings: 12,
            time: new Date("1970-01-01T08:00:00Z"),
            duration: 60,
            area: "Semarang",
            slug: "bahasa-inggris-sd-9s0t1u",
            userId: "01979a91-6fde-7196-ba74-891549333b26", // Anastasia Widya, S.Pd
            discount: 0,
            isActive: true,
            days: JSON.stringify([
                "Senin",
                "Selasa"
            ]),
        },
        {
            id: "01979a81-cc2d-76ff-8ec8-7ad40efe499a",
            name: "Pendidikan Agama Islam & Budi Pekerti",
            level: "SD",
            totalMeetings: 12,
            time: new Date("1970-01-01T08:00:00Z"),
            duration: 60,
            area: "Semarang",
            slug: "pai-budi-pekerti-sd-2b3c4d",
            userId: "01979a81-cc2d-76ff-8ec8-7ad40efe4999", // Ahmad Fadli, S.Pd.I
            discount: 0,
            isActive: true,
            days: JSON.stringify([
                "Senin",
                "Selasa"
            ]),
        },
        {
            id: "0197b421-92cc-7d21-b0e6-0ce4adb7af6f",
            name: "Bahasa Indonesia",
            level: "SMP",
            totalMeetings: 24,
            time: new Date("1970-01-01T08:00:00Z"),
            duration: 90,
            area: "Semarang",
            slug: "bahasa-indonesia-smp-1fauzi",
            userId: "0197b421-92cc-7d21-b0e6-0ce4adb7af6e",
            discount: 10,
            isActive: true,
            days: JSON.stringify([
                "Senin",
                "Rabu",
                "Sabtu"
            ]),
        },
        {
            id: "0197b421-92cc-7b38-8e52-f786b7603fb3",
            name: "Matematika",
            level: "SMP",
            totalMeetings: 24,
            time: new Date("1970-01-01T08:00:00Z"),
            duration: 90,
            area: "Semarang",
            slug: "matematika-smp-1lestari",
            userId: "0197b421-92cc-7b38-8e52-f786b7603fb2",
            discount: 5,
            isActive: true,
            days: JSON.stringify([
                "Selasa",
                "Jumat"
            ]),
        },
        {
            id: "0197b421-92cc-717d-99d0-e595f2c5b6e3",
            name: "Ilmu Pengetahuan Alam",
            level: "SMP",
            totalMeetings: 24,
            time: new Date("1970-01-01T08:00:00Z"),
            duration: 90,
            area: "Semarang",
            slug: "ipa-smp-1dedi",
            userId: "0197b421-92cc-717d-99d0-e595f2c5b6e2",
            discount: 0,
            isActive: true,
            days: JSON.stringify([
                "Sabtu",
                "Kamis"
            ]),
        },
        {
            id: "0197b421-92cc-7e5b-addd-fe579bc048c3",
            name: "Ilmu Pengetahuan Sosial",
            level: "SMP",
            totalMeetings: 24,
            time: new Date("1970-01-01T08:00:00Z"),
            duration: 90,
            area: "Semarang",
            slug: "ips-smp-1ratna",
            userId: "0197b421-92cc-7e5b-addd-fe579bc048c2",
            discount: 5,
            isActive: true,
            days: JSON.stringify([
                "Selasa",
                "Jumat"
            ]),
        },
        {
            id: "0197b421-92cc-70a9-ab90-c53667ebee62",
            name: "PPKn",
            level: "SMP",
            totalMeetings: 24,
            time: new Date("1970-01-01T08:00:00Z"),
            duration: 90,
            area: "Semarang",
            slug: "ppkn-smp-1budi",
            userId: "0197b421-92cc-70a9-ab90-c53667ebee61",
            discount: 0,
            isActive: true,
            days: JSON.stringify([
                "Senin",
                "Rabu"
            ]),
        },
        {
            id: "0197b421-92cc-765b-a22a-ab51d0b2d6c5",
            name: "Pendidikan Agama Islam",
            level: "SMP",
            totalMeetings: 24,
            time: new Date("1970-01-01T08:00:00Z"),
            duration: 90,
            area: "Semarang",
            slug: "pai-smp-1nurhaliza",
            userId: "0197b421-92cc-765b-a22a-ab51d0b2d6c4",
            discount: 10,
            isActive: true,
            days: JSON.stringify([
                "Selasa",
                "Jumat"
            ]),
        },
        {
            id: "0197b421-92cc-7085-88f1-366574bd9a18",
            name: "Pendidikan Agama Kristen",
            level: "SMP",
            totalMeetings: 24,
            time: new Date("1970-01-01T08:00:00Z"),
            duration: 90,
            area: "Semarang",
            slug: "pak-smp-1agustinus",
            userId: "0197b421-92cc-7085-88f1-366574bd9a17",
            discount: 0,
            isActive: true,
            days: JSON.stringify([
                "Sabtu",
                "Kamis"
            ]),
        },
        {
            id: "0197b421-92cc-7854-a588-26af45c3cf3b",
            name: "Bahasa Inggris",
            level: "SMP",
            totalMeetings: 24,
            time: new Date("1970-01-01T08:00:00Z"),
            duration: 90,
            area: "Semarang",
            slug: "bahasa-inggris-smp-1yohana",
            userId: "0197b421-92cc-7854-a588-26af45c3cf3a",
            discount: 5,
            isActive: true,
            days: JSON.stringify([
                "Senin",
                "Selasa"
            ]),
        },
        {
            id: "0197b421-92cc-7bea-b2c8-b38bb12ce3ea",
            name: "PJOK",
            level: "SMP",
            totalMeetings: 24,
            time: new Date("1970-01-01T08:00:00Z"),
            duration: 90,
            area: "Semarang",
            slug: "pjok-smp-1rudi",
            userId: "0197b421-92cc-7bea-b2c8-b38bb12ce3e9",
            discount: 0,
            isActive: true,
            days: JSON.stringify([
                "Rabu",
                "Jumat"
            ]),
        },
        {
            id: "0197b421-92cc-732e-b902-d6fb4363579f",
            name: "Informatika",
            level: "SMP",
            totalMeetings: 24,
            time: new Date("1970-01-01T08:00:00Z"),
            duration: 90,
            area: "Semarang",
            slug: "informatika-smp-1diana",
            userId: "0197b421-92cc-732e-b902-d6fb4363579e",
            discount: 10,
            isActive: true,
            days: JSON.stringify([
                "Sabtu",
                "Kamis"
            ]),
        },
        {
            id: "0197b421-92cc-730c-9985-10f25a88fd84",
            name: "Seni Musik",
            level: "SMP",
            totalMeetings: 24,
            time: new Date("1970-01-01T08:00:00Z"),
            duration: 90,
            area: "Semarang",
            slug: "seni-musik-smp-1erwin",
            userId: "0197b421-92cc-730c-9985-10f25a88fd83",
            isActive: true,
            days: JSON.stringify([
                "Senin",
                "Selasa"
            ]),
        },
        {
            id: "0197b421-92cc-7ca6-b637-cb8f6eeead5d",
            name: "Seni Rupa",
            level: "SMP",
            totalMeetings: 24,
            time: new Date("1970-01-01T08:00:00Z"),
            duration: 90,
            area: "Semarang",
            slug: "seni-rupa-smp-1maya",
            userId: "0197b421-92cc-7ca6-b637-cb8f6eeead5c",
            discount: 5,
            isActive: true,
            days: JSON.stringify([
                "Rabu",
                "Jumat"
            ]),
        },
        {
            id: "0197b421-92cc-7bfa-bec7-df624300ad8a",
            name: "Prakarya",
            level: "SMP",
            totalMeetings: 24,
            time: new Date("1970-01-01T08:00:00Z"),
            duration: 90,
            area: "Semarang",
            slug: "prakarya-smp-1anjar",
            userId: "0197b421-92cc-7bfa-bec7-df624300ad89",
            discount: 0,
            isActive: true,
            days: JSON.stringify([
                "Sabtu",
                "Kamis"
            ]),
        },
        {
            id: "0197b421-92cc-776c-8070-d476ed031f5c",
            name: "Muatan Lokal Bahasa Jawa",
            level: "SMP",
            totalMeetings: 24,
            time: new Date("1970-01-01T08:00:00Z"),
            duration: 90,
            area: "Semarang",
            slug: "bahasa-jawa-smp-1novi",
            userId: "0197b421-92cc-776c-8070-d476ed031f5b",
            discount: 10,
            isActive: true,
            days: JSON.stringify([
                "Senin",
                "Selasa"
            ]),
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
        },
        // Bahasa Inggris SD
        {
            id: "01979a91-6fde-7196-ba74-891549333b28",
            type: "privat",
            price: (1 * 12 * 60000) + 100000,
            packageId: "01979a91-6fde-7196-ba74-891549333b27",
            maxStudent: 1,
        },
        {
            id: "01979a91-6fde-7196-ba74-891549333b29",
            type: "grup2",
            price: (2 * 12 * 60000) + 100000,
            packageId: "01979a91-6fde-7196-ba74-891549333b27",
            maxStudent: 2,
        },
        {
            id: "01979a91-6fde-7196-ba74-891549333b2a",
            type: "grup3",
            price: (3 * 12 * 60000) + 100000,
            packageId: "01979a91-6fde-7196-ba74-891549333b27",
            maxStudent: 3,
        },
        {
            id: "01979a91-6fde-7196-ba74-891549333b2b",
            type: "grup4",
            price: (4 * 12 * 60000) + 100000,
            packageId: "01979a91-6fde-7196-ba74-891549333b27",
            maxStudent: 4,
        },
        {
            id: "01979a91-6fde-7196-ba74-891549333b2c",
            type: "grup5",
            price: (5 * 12 * 60000) + 100000,
            packageId: "01979a91-6fde-7196-ba74-891549333b27",
            maxStudent: 5,
        },

        // IPAS SD
        {
            id: "01979a90-8fd7-734e-a4a7-43ef668ce7cc",
            type: "privat",
            price: (1 * 12 * 60000) + 100000,
            packageId: "01979a90-8fd7-734e-a4a7-43ef668ce7cb",
            maxStudent: 1,
        },
        {
            id: "01979a90-8fd7-734e-a4a7-43ef668ce7cd",
            type: "grup2",
            price: (2 * 12 * 60000) + 100000,
            packageId: "01979a90-8fd7-734e-a4a7-43ef668ce7cb",
            maxStudent: 2,
        },
        {
            id: "01979a90-8fd7-734e-a4a7-43ef668ce7ce",
            type: "grup3",
            price: (3 * 12 * 60000) + 100000,
            packageId: "01979a90-8fd7-734e-a4a7-43ef668ce7cb",
            maxStudent: 3,
        },
        {
            id: "01979a90-8fd7-734e-a4a7-43ef668ce7cf",
            type: "grup4",
            price: (4 * 12 * 60000) + 100000,
            packageId: "01979a90-8fd7-734e-a4a7-43ef668ce7cb",
            maxStudent: 4,
        },
        {
            id: "01979a90-8fd7-734e-a4a7-43ef668ce7d0",
            type: "grup5",
            price: (5 * 12 * 60000) + 100000,
            packageId: "01979a90-8fd7-734e-a4a7-43ef668ce7cb",
            maxStudent: 5,
        },

        // Seni Budaya SD
        {
            id: "01979a8f-4a1a-7693-83e2-ff00c9e31fae",
            type: "privat",
            price: (1 * 12 * 60000) + 100000,
            packageId: "01979a8f-4a1a-7693-83e2-ff00c9e31fad",
            maxStudent: 1,
        },
        {
            id: "01979a8f-4a1a-7693-83e2-ff00c9e31faf",
            type: "grup2",
            price: (2 * 12 * 60000) + 100000,
            packageId: "01979a8f-4a1a-7693-83e2-ff00c9e31fad",
            maxStudent: 2,
        },
        {
            id: "01979a8f-4a1a-7693-83e2-ff00c9e31fb0",
            type: "grup3",
            price: (3 * 12 * 60000) + 100000,
            packageId: "01979a8f-4a1a-7693-83e2-ff00c9e31fad",
            maxStudent: 3,
        },
        {
            id: "01979a8f-4a1a-7693-83e2-ff00c9e31fb1",
            type: "grup4",
            price: (4 * 12 * 60000) + 100000,
            packageId: "01979a8f-4a1a-7693-83e2-ff00c9e31fad",
            maxStudent: 4,
        },
        {
            id: "01979a8f-4a1a-7693-83e2-ff00c9e31fb2",
            type: "grup5",
            price: (5 * 12 * 60000) + 100000,
            packageId: "01979a8f-4a1a-7693-83e2-ff00c9e31fad",
            maxStudent: 5,
        },

        // PJOK SD
        {
            id: "01979a8d-ae94-73cb-8864-ce9f864fc1a2",
            type: "privat",
            price: (1 * 12 * 60000) + 100000,
            packageId: "01979a8d-ae94-73cb-8864-ce9f864fc1a1",
            maxStudent: 1,
        },
        {
            id: "01979a8d-ae94-73cb-8864-ce9f864fc1a3",
            type: "grup2",
            price: (2 * 12 * 60000) + 100000,
            packageId: "01979a8d-ae94-73cb-8864-ce9f864fc1a1",
            maxStudent: 2,
        },
        {
            id: "01979a8d-ae94-73cb-8864-ce9f864fc1a4",
            type: "grup3",
            price: (3 * 12 * 60000) + 100000,
            packageId: "01979a8d-ae94-73cb-8864-ce9f864fc1a1",
            maxStudent: 3,
        },
        {
            id: "01979a8d-ae94-73cb-8864-ce9f864fc1a5",
            type: "grup4",
            price: (4 * 12 * 60000) + 100000,
            packageId: "01979a8d-ae94-73cb-8864-ce9f864fc1a1",
            maxStudent: 4,
        },
        {
            id: "01979a8d-ae94-73cb-8864-ce9f864fc1a6",
            type: "grup5",
            price: (5 * 12 * 60000) + 100000,
            packageId: "01979a8d-ae94-73cb-8864-ce9f864fc1a1",
            maxStudent: 5,
        },

        // Matematika SD
        {
            id: "01979a8d-7e80-7055-a1b1-93c5b270acbf",
            type: "privat",
            price: (1 * 12 * 60000) + 100000,
            packageId: "01979a8d-7e80-7055-a1b1-93c5b270acbe",
            maxStudent: 1,
        },
        {
            id: "01979a8d-7e80-7055-a1b1-93c5b270acc0",
            type: "grup2",
            price: (2 * 12 * 60000) + 100000,
            packageId: "01979a8d-7e80-7055-a1b1-93c5b270acbe",
            maxStudent: 2,
        },
        {
            id: "01979a8d-7e80-7055-a1b1-93c5b270acc1",
            type: "grup3",
            price: (3 * 12 * 60000) + 100000,
            packageId: "01979a8d-7e80-7055-a1b1-93c5b270acbe",
            maxStudent: 3,
        },
        {
            id: "01979a8d-7e80-7055-a1b1-93c5b270acc2",
            type: "grup4",
            price: (4 * 12 * 60000) + 100000,
            packageId: "01979a8d-7e80-7055-a1b1-93c5b270acbe",
            maxStudent: 4,
        },
        {
            id: "01979a8d-7e80-7055-a1b1-93c5b270acc3",
            type: "grup5",
            price: (5 * 12 * 60000) + 100000,
            packageId: "01979a8d-7e80-7055-a1b1-93c5b270acbe",
            maxStudent: 5,
        },

        // Bahasa Indonesia SD
        {
            id: "01979a8b-e9c9-709a-a8d6-c741b8a14abe",
            type: "privat",
            price: (1 * 12 * 60000) + 100000,
            packageId: "01979a8b-e9c9-709a-a8d6-c741b8a14abd",
            maxStudent: 1,
        },
        {
            id: "01979a8b-e9c9-709a-a8d6-c741b8a14abf",
            type: "grup2",
            price: (2 * 12 * 60000) + 100000,
            packageId: "01979a8b-e9c9-709a-a8d6-c741b8a14abd",
            maxStudent: 2,
        },
        {
            id: "01979a8b-e9c9-709a-a8d6-c741b8a14ac0",
            type: "grup3",
            price: (3 * 12 * 60000) + 100000,
            packageId: "01979a8b-e9c9-709a-a8d6-c741b8a14abd",
            maxStudent: 3,
        },
        {
            id: "01979a8b-e9c9-709a-a8d6-c741b8a14ac1",
            type: "grup4",
            price: (4 * 12 * 60000) + 100000,
            packageId: "01979a8b-e9c9-709a-a8d6-c741b8a14abd",
            maxStudent: 4,
        },
        {
            id: "01979a8b-e9c9-709a-a8d6-c741b8a14ac2",
            type: "grup5",
            price: (5 * 12 * 60000) + 100000,
            packageId: "01979a8b-e9c9-709a-a8d6-c741b8a14abd",
            maxStudent: 5,
        },

        // Pendidikan Pancasila SD
        {
            id: "01979a8a-d5c8-71ba-9bd5-75e76b166431",
            type: "privat",
            price: (1 * 12 * 60000) + 100000,
            packageId: "01979a8a-d5c8-71ba-9bd5-75e76b166430",
            maxStudent: 1,
        },
        {
            id: "01979a8a-d5c8-71ba-9bd5-75e76b166432",
            type: "grup2",
            price: (2 * 12 * 60000) + 100000,
            packageId: "01979a8a-d5c8-71ba-9bd5-75e76b166430",
            maxStudent: 2,
        },
        {
            id: "01979a8a-d5c8-71ba-9bd5-75e76b166433",
            type: "grup3",
            price: (3 * 12 * 60000) + 100000,
            packageId: "01979a8a-d5c8-71ba-9bd5-75e76b166430",
            maxStudent: 3,
        },
        {
            id: "01979a8a-d5c8-71ba-9bd5-75e76b166434",
            type: "grup4",
            price: (4 * 12 * 60000) + 100000,
            packageId: "01979a8a-d5c8-71ba-9bd5-75e76b166430",
            maxStudent: 4,
        },
        {
            id: "01979a8a-d5c8-71ba-9bd5-75e76b166435",
            type: "grup5",
            price: (5 * 12 * 60000) + 100000,
            packageId: "01979a8a-d5c8-71ba-9bd5-75e76b166430",
            maxStudent: 5,
        },

        // Pendidikan Agama Islam & Budi Pekerti SD
        {
            id: "01979a81-cc2d-76ff-8ec8-7ad40efe499b",
            type: "privat",
            price: (1 * 12 * 60000) + 100000,
            packageId: "01979a81-cc2d-76ff-8ec8-7ad40efe499a",
            maxStudent: 1,
        },
        {
            id: "01979a81-cc2d-76ff-8ec8-7ad40efe499c",
            type: "grup2",
            price: (2 * 12 * 60000) + 100000,
            packageId: "01979a81-cc2d-76ff-8ec8-7ad40efe499a",
            maxStudent: 2,
        },
        {
            id: "01979a81-cc2d-76ff-8ec8-7ad40efe499d",
            type: "grup3",
            price: (3 * 12 * 60000) + 100000,
            packageId: "01979a81-cc2d-76ff-8ec8-7ad40efe499a",
            maxStudent: 3,
        },
        {
            id: "01979a81-cc2d-76ff-8ec8-7ad40efe499e",
            type: "grup4",
            price: (4 * 12 * 60000) + 100000,
            packageId: "01979a81-cc2d-76ff-8ec8-7ad40efe499a",
            maxStudent: 4,
        },
        {
            id: "01979a81-cc2d-76ff-8ec8-7ad40efe499f",
            type: "grup5",
            price: (5 * 12 * 60000) + 100000,
            packageId: "01979a81-cc2d-76ff-8ec8-7ad40efe499a",
            maxStudent: 5,
        },
        {
            id: "0197b421-92cc-7d21-b0e6-0ce4adb7af70",
            type: "privat",
            price: (1 * 24 * 80000) + 100000, // 2020000
            discPrice: 1818000, // 10% discount
            packageId: "0197b421-92cc-7d21-b0e6-0ce4adb7af6f",
            maxStudent: 1,
        },
        {
            id: "0197b421-92cc-7d21-b0e6-0ce4adb7af71",
            type: "grup2",
            price: (2 * 24 * 80000) + 100000, // 3940000
            discPrice: 3546000, // 10% discount
            packageId: "0197b421-92cc-7d21-b0e6-0ce4adb7af6f",
            maxStudent: 2,
        },
        {
            id: "0197b421-92cc-7d21-b0e6-0ce4adb7af72",
            type: "grup3",
            price: (3 * 24 * 80000) + 100000, // 5860000
            discPrice: 5274000, // 10% discount
            packageId: "0197b421-92cc-7d21-b0e6-0ce4adb7af6f",
            maxStudent: 3,
        },
        {
            id: "0197b421-92cc-7d21-b0e6-0ce4adb7af73",
            type: "grup4",
            price: (4 * 24 * 80000) + 100000, // 7780000
            discPrice: 7002000, // 10% discount
            packageId: "0197b421-92cc-7d21-b0e6-0ce4adb7af6f",
            maxStudent: 4,
        },
        {
            id: "0197b421-92cc-7d21-b0e6-0ce4adb7af74",
            type: "grup5",
            price: (5 * 24 * 80000) + 100000, // 9700000
            discPrice: 8730000, // 10% discount
            packageId: "0197b421-92cc-7d21-b0e6-0ce4adb7af6f",
            maxStudent: 5,
        },

        {
            id: "0197b421-92cc-7b38-8e52-f786b7603fb4",
            type: "privat",
            price: (1 * 24 * 80000) + 100000, // 2020000
            discPrice: 1929000, // 5% discount
            packageId: "0197b421-92cc-7b38-8e52-f786b7603fb3",
            maxStudent: 1,
        },
        {
            id: "0197b421-92cc-7b38-8e52-f786b7603fb5",
            type: "grup2",
            price: (2 * 24 * 80000) + 100000, // 3940000
            discPrice: 3743000, // 5% discount
            packageId: "0197b421-92cc-7b38-8e52-f786b7603fb3",
            maxStudent: 2,
        },
        {
            id: "0197b421-92cc-7b38-8e52-f786b7603fb6",
            type: "grup3",
            price: (3 * 24 * 80000) + 100000, // 5860000
            discPrice: 5567000, // 5% discount
            packageId: "0197b421-92cc-7b38-8e52-f786b7603fb3",
            maxStudent: 3,
        },
        {
            id: "0197b421-92cc-7b38-8e52-f786b7603fb7",
            type: "grup4",
            price: (4 * 24 * 80000) + 100000, // 7780000
            discPrice: 7391000, // 5% discount
            packageId: "0197b421-92cc-7b38-8e52-f786b7603fb3",
            maxStudent: 4,
        },
        {
            id: "0197b421-92cc-7b38-8e52-f786b7603fb8",
            type: "grup5",
            price: (5 * 24 * 80000) + 100000, // 9700000
            discPrice: 9215000, // 5% discount
            packageId: "0197b421-92cc-7b38-8e52-f786b7603fb3",
            maxStudent: 5,
        },

        {
            id: "0197b421-92cc-717d-99d0-e595f2c5b6e4",
            type: "privat",
            price: (1 * 24 * 80000) + 100000, // 2020000
            packageId: "0197b421-92cc-717d-99d0-e595f2c5b6e3",
            maxStudent: 1,
        },
        {
            id: "0197b421-92cc-717d-99d0-e595f2c5b6e5",
            type: "grup2",
            price: (2 * 24 * 80000) + 100000, // 3940000
            packageId: "0197b421-92cc-717d-99d0-e595f2c5b6e3",
            maxStudent: 2,
        },
        {
            id: "0197b421-92cc-717d-99d0-e595f2c5b6e6",
            type: "grup3",
            price: (3 * 24 * 80000) + 100000, // 5860000
            packageId: "0197b421-92cc-717d-99d0-e595f2c5b6e3",
            maxStudent: 3,
        },
        {
            id: "0197b421-92cc-717d-99d0-e595f2c5b6e7",
            type: "grup4",
            price: (4 * 24 * 80000) + 100000, // 7780000
            packageId: "0197b421-92cc-717d-99d0-e595f2c5b6e3",
            maxStudent: 4,
        },
        {
            id: "0197b421-92cc-717d-99d0-e595f2c5b6e8",
            type: "grup5",
            price: (5 * 24 * 80000) + 100000, // 9700000
            packageId: "0197b421-92cc-717d-99d0-e595f2c5b6e3",
            maxStudent: 5,
        },

        {
            id: "0197b421-92cc-7e5b-addd-fe579bc048c4",
            type: "privat",
            price: (1 * 24 * 80000) + 100000, // 2020000
            discPrice: 1929000, // 5% discount
            packageId: "0197b421-92cc-7e5b-addd-fe579bc048c3",
            maxStudent: 1,
        },
        {
            id: "0197b421-92cc-7e5b-addd-fe579bc048c5",
            type: "grup2",
            price: (2 * 24 * 80000) + 100000, // 3940000
            discPrice: 3743000, // 5% discount
            packageId: "0197b421-92cc-7e5b-addd-fe579bc048c3",
            maxStudent: 2,
        },
        {
            id: "0197b421-92cc-7e5b-addd-fe579bc048c6",
            type: "grup3",
            price: (3 * 24 * 80000) + 100000, // 5860000
            discPrice: 5567000, // 5% discount
            packageId: "0197b421-92cc-7e5b-addd-fe579bc048c3",
            maxStudent: 3,
        },
        {
            id: "0197b421-92cc-7e5b-addd-fe579bc048c7",
            type: "grup4",
            price: (4 * 24 * 80000) + 100000, // 7780000
            discPrice: 7391000, // 5% discount
            packageId: "0197b421-92cc-7e5b-addd-fe579bc048c3",
            maxStudent: 4,
        },
        {
            id: "0197b421-92cc-7e5b-addd-fe579bc048c8",
            type: "grup5",
            price: (5 * 24 * 80000) + 100000, // 9700000
            discPrice: 9215000, // 5% discount
            packageId: "0197b421-92cc-7e5b-addd-fe579bc048c3",
            maxStudent: 5,
        },

        {
            id: "0197b421-92cc-70a9-ab90-c53667ebee63",
            type: "privat",
            price: (1 * 24 * 80000) + 100000, // 2020000
            packageId: "0197b421-92cc-70a9-ab90-c53667ebee62",
            maxStudent: 1,
        },
        {
            id: "0197b421-92cc-70a9-ab90-c53667ebee64",
            type: "grup2",
            price: (2 * 24 * 80000) + 100000, // 3940000
            packageId: "0197b421-92cc-70a9-ab90-c53667ebee62",
            maxStudent: 2,
        },
        {
            id: "0197b421-92cc-70a9-ab90-c53667ebee65",
            type: "grup3",
            price: (3 * 24 * 80000) + 100000, // 5860000
            packageId: "0197b421-92cc-70a9-ab90-c53667ebee62",
            maxStudent: 3,
        },
        {
            id: "0197b421-92cc-70a9-ab90-c53667ebee66",
            type: "grup4",
            price: (4 * 24 * 80000) + 100000, // 7780000
            packageId: "0197b421-92cc-70a9-ab90-c53667ebee62",
            maxStudent: 4,
        },
        {
            id: "0197b421-92cc-70a9-ab90-c53667ebee67",
            type: "grup5",
            price: (5 * 24 * 80000) + 100000, // 9700000
            packageId: "0197b421-92cc-70a9-ab90-c53667ebee62",
            maxStudent: 5,
        },

        {
            id: "0197b421-92cc-765b-a22a-ab51d0b2d6c6",
            type: "privat",
            price: (1 * 24 * 80000) + 100000, // 2020000
            discPrice: 1818000, // 10% discount
            packageId: "0197b421-92cc-765b-a22a-ab51d0b2d6c5",
            maxStudent: 1,
        },
        {
            id: "0197b421-92cc-765b-a22a-ab51d0b2d6c7",
            type: "grup2",
            price: (2 * 24 * 80000) + 100000, // 3940000
            discPrice: 3546000, // 10% discount
            packageId: "0197b421-92cc-765b-a22a-ab51d0b2d6c5",
            maxStudent: 2,
        },
        {
            id: "0197b421-92cc-765b-a22a-ab51d0b2d6c8",
            type: "grup3",
            price: (3 * 24 * 80000) + 100000, // 5860000
            discPrice: 5274000, // 10% discount
            packageId: "0197b421-92cc-765b-a22a-ab51d0b2d6c5",
            maxStudent: 3,
        },
        {
            id: "0197b421-92cc-765b-a22a-ab51d0b2d6c9",
            type: "grup4",
            price: (4 * 24 * 80000) + 100000, // 7780000
            discPrice: 7002000, // 10% discount
            packageId: "0197b421-92cc-765b-a22a-ab51d0b2d6c5",
            maxStudent: 4,
        },
        {
            id: "0197b421-92cc-765b-a22a-ab51d0b2d6ca",
            type: "grup5",
            price: (5 * 24 * 80000) + 100000, // 9700000
            discPrice: 8730000, // 10% discount
            packageId: "0197b421-92cc-765b-a22a-ab51d0b2d6c5",
            maxStudent: 5,
        },

        {
            id: "0197b421-92cc-7085-88f1-366574bd9a19",
            type: "privat",
            price: (1 * 24 * 80000) + 100000, // 2020000
            packageId: "0197b421-92cc-7085-88f1-366574bd9a18",
            maxStudent: 1,
        },
        {
            id: "0197b421-92cc-7085-88f1-366574bd9a1a",
            type: "grup2",
            price: (2 * 24 * 80000) + 100000, // 3940000
            packageId: "0197b421-92cc-7085-88f1-366574bd9a18",
            maxStudent: 2,
        },
        {
            id: "0197b421-92cc-7085-88f1-366574bd9a1b",
            type: "grup3",
            price: (3 * 24 * 80000) + 100000, // 5860000
            packageId: "0197b421-92cc-7085-88f1-366574bd9a18",
            maxStudent: 3,
        },
        {
            id: "0197b421-92cc-7085-88f1-366574bd9a1c",
            type: "grup4",
            price: (4 * 24 * 80000) + 100000, // 7780000
            packageId: "0197b421-92cc-7085-88f1-366574bd9a18",
            maxStudent: 4,
        },
        {
            id: "0197b421-92cc-7085-88f1-366574bd9a1d",
            type: "grup5",
            price: (5 * 24 * 80000) + 100000, // 9700000
            packageId: "0197b421-92cc-7085-88f1-366574bd9a18",
            maxStudent: 5,
        },

        {
            id: "0197b421-92cc-7854-a588-26af45c3cf3c",
            type: "privat",
            price: (1 * 24 * 80000) + 100000, // 2020000
            discPrice: 1929000, // 5% discount
            packageId: "0197b421-92cc-7854-a588-26af45c3cf3b",
            maxStudent: 1,
        },
        {
            id: "0197b421-92cc-7854-a588-26af45c3cf3d",
            type: "grup2",
            price: (2 * 24 * 80000) + 100000, // 3940000
            discPrice: 3743000, // 5% discount
            packageId: "0197b421-92cc-7854-a588-26af45c3cf3b",
            maxStudent: 2,
        },
        {
            id: "0197b421-92cc-7854-a588-26af45c3cf3e",
            type: "grup3",
            price: (3 * 24 * 80000) + 100000, // 5860000
            discPrice: 5567000, // 5% discount
            packageId: "0197b421-92cc-7854-a588-26af45c3cf3b",
            maxStudent: 3,
        },
        {
            id: "0197b421-92cc-7854-a588-26af45c3cf3f",
            type: "grup4",
            price: (4 * 24 * 80000) + 100000, // 7780000
            discPrice: 7391000, // 5% discount
            packageId: "0197b421-92cc-7854-a588-26af45c3cf3b",
            maxStudent: 4,
        },
        {
            id: "0197b421-92cc-7854-a588-26af45c3cf40",
            type: "grup5",
            price: (5 * 24 * 80000) + 100000, // 9700000
            discPrice: 9215000, // 5% discount
            packageId: "0197b421-92cc-7854-a588-26af45c3cf3b",
            maxStudent: 5,
        },

        {
            id: "0197b421-92cc-7bea-b2c8-b38bb12ce3eb",
            type: "privat",
            price: (1 * 24 * 80000) + 100000, // 2020000
            packageId: "0197b421-92cc-7bea-b2c8-b38bb12ce3ea",
            maxStudent: 1,
        },
        {
            id: "0197b421-92cc-7bea-b2c8-b38bb12ce3ec",
            type: "grup2",
            price: (2 * 24 * 80000) + 100000, // 3940000
            packageId: "0197b421-92cc-7bea-b2c8-b38bb12ce3ea",
            maxStudent: 2,
        },
        {
            id: "0197b421-92cc-7bea-b2c8-b38bb12ce3ed",
            type: "grup3",
            price: (3 * 24 * 80000) + 100000, // 5860000
            packageId: "0197b421-92cc-7bea-b2c8-b38bb12ce3ea",
            maxStudent: 3,
        },
        {
            id: "0197b421-92cc-7bea-b2c8-b38bb12ce3ee",
            type: "grup4",
            price: (4 * 24 * 80000) + 100000, // 7780000
            packageId: "0197b421-92cc-7bea-b2c8-b38bb12ce3ea",
            maxStudent: 4,
        },
        {
            id: "0197b421-92cc-7bea-b2c8-b38bb12ce3ef",
            type: "grup5",
            price: (5 * 24 * 80000) + 100000, // 9700000
            packageId: "0197b421-92cc-7bea-b2c8-b38bb12ce3ea",
            maxStudent: 5,
        },

        {
            id: "0197b421-92cc-732e-b902-d6fb436357a0",
            type: "privat",
            price: (1 * 24 * 80000) + 100000, // 2020000
            discPrice: 1818000, // 10% discount
            packageId: "0197b421-92cc-732e-b902-d6fb4363579f",
            maxStudent: 1,
        },
        {
            id: "0197b421-92cc-732e-b902-d6fb436357a1",
            type: "grup2",
            price: (2 * 24 * 80000) + 100000, // 3940000
            discPrice: 3546000, // 10% discount
            packageId: "0197b421-92cc-732e-b902-d6fb4363579f",
            maxStudent: 2,
        },
        {
            id: "0197b421-92cc-732e-b902-d6fb436357a2",
            type: "grup3",
            price: (3 * 24 * 80000) + 100000, // 5860000
            discPrice: 5274000, // 10% discount
            packageId: "0197b421-92cc-732e-b902-d6fb4363579f",
            maxStudent: 3,
        },
        {
            id: "0197b421-92cc-732e-b902-d6fb436357a3",
            type: "grup4",
            price: (4 * 24 * 80000) + 100000, // 7780000
            discPrice: 7002000, // 10% discount
            packageId: "0197b421-92cc-732e-b902-d6fb4363579f",
            maxStudent: 4,
        },
        {
            id: "0197b421-92cc-732e-b902-d6fb436357a4",
            type: "grup5",
            price: (5 * 24 * 80000) + 100000, // 9700000
            discPrice: 8730000, // 10% discount
            packageId: "0197b421-92cc-732e-b902-d6fb4363579f",
            maxStudent: 5,
        },

        {
            id: "0197b421-92cc-730c-9985-10f25a88fd85",
            type: "privat",
            price: (1 * 24 * 80000) + 100000, // 2020000
            packageId: "0197b421-92cc-730c-9985-10f25a88fd84",
            maxStudent: 1,
        },
        {
            id: "0197b421-92cc-730c-9985-10f25a88fd86",
            type: "grup2",
            price: (2 * 24 * 80000) + 100000, // 3940000
            packageId: "0197b421-92cc-730c-9985-10f25a88fd84",
            maxStudent: 2,
        },
        {
            id: "0197b421-92cc-730c-9985-10f25a88fd87",
            type: "grup3",
            price: (3 * 24 * 80000) + 100000, // 5860000
            packageId: "0197b421-92cc-730c-9985-10f25a88fd84",
            maxStudent: 3,
        },
        {
            id: "0197b421-92cc-730c-9985-10f25a88fd88",
            type: "grup4",
            price: (4 * 24 * 80000) + 100000, // 7780000
            packageId: "0197b421-92cc-730c-9985-10f25a88fd84",
            maxStudent: 4,
        },
        {
            id: "0197b421-92cc-730c-9985-10f25a88fd89",
            type: "grup5",
            price: (5 * 24 * 80000) + 100000, // 9700000
            packageId: "0197b421-92cc-730c-9985-10f25a88fd84",
            maxStudent: 5,
        },

        {
            id: "0197b421-92cc-7ca6-b637-cb8f6eeead5e",
            type: "privat",
            price: (1 * 24 * 80000) + 100000, // 2020000
            discPrice: 1929000, // 5% discount
            packageId: "0197b421-92cc-7ca6-b637-cb8f6eeead5d",
            maxStudent: 1,
        },
        {
            id: "0197b421-92cc-7ca6-b637-cb8f6eeead5f",
            type: "grup2",
            price: (2 * 24 * 80000) + 100000, // 3940000
            discPrice: 3743000, // 5% discount
            packageId: "0197b421-92cc-7ca6-b637-cb8f6eeead5d",
            maxStudent: 2,
        },
        {
            id: "0197b421-92cc-7ca6-b637-cb8f6eeead60",
            type: "grup3",
            price: (3 * 24 * 80000) + 100000, // 5860000
            discPrice: 5567000, // 5% discount
            packageId: "0197b421-92cc-7ca6-b637-cb8f6eeead5d",
            maxStudent: 3,
        },
        {
            id: "0197b421-92cc-7ca6-b637-cb8f6eeead61",
            type: "grup4",
            price: (4 * 24 * 80000) + 100000, // 7780000
            discPrice: 7391000, // 5% discount
            packageId: "0197b421-92cc-7ca6-b637-cb8f6eeead5d",
            maxStudent: 4,
        },
        {
            id: "0197b421-92cc-7ca6-b637-cb8f6eeead62",
            type: "grup5",
            price: (5 * 24 * 80000) + 100000, // 9700000
            discPrice: 9215000, // 5% discount
            packageId: "0197b421-92cc-7ca6-b637-cb8f6eeead5d",
            maxStudent: 5,
        },

        {
            id: "0197b421-92cc-7bfa-bec7-df624300ad8b",
            type: "privat",
            price: (1 * 24 * 80000) + 100000, // 2020000
            packageId: "0197b421-92cc-7bfa-bec7-df624300ad8a",
            maxStudent: 1,
        },
        {
            id: "0197b421-92cc-7bfa-bec7-df624300ad8c",
            type: "grup2",
            price: (2 * 24 * 80000) + 100000, // 3940000
            packageId: "0197b421-92cc-7bfa-bec7-df624300ad8a",
            maxStudent: 2,
        },
        {
            id: "0197b421-92cc-7bfa-bec7-df624300ad8d",
            type: "grup3",
            price: (3 * 24 * 80000) + 100000, // 5860000
            packageId: "0197b421-92cc-7bfa-bec7-df624300ad8a",
            maxStudent: 3,
        },
        {
            id: "0197b421-92cc-7bfa-bec7-df624300ad8e",
            type: "grup4",
            price: (4 * 24 * 80000) + 100000, // 7780000
            packageId: "0197b421-92cc-7bfa-bec7-df624300ad8a",
            maxStudent: 4,
        },
        {
            id: "0197b421-92cc-7bfa-bec7-df624300ad8f",
            type: "grup5",
            price: (5 * 24 * 80000) + 100000, // 9700000
            packageId: "0197b421-92cc-7bfa-bec7-df624300ad8a",
            maxStudent: 5,
        },

        {
            id: "0197b421-92cc-776c-8070-d476ed031f5d",
            type: "privat",
            price: (1 * 24 * 80000) + 100000, // 2020000
            discPrice: 1818000, // 10% discount
            packageId: "0197b421-92cc-776c-8070-d476ed031f5c",
            maxStudent: 1,
        },
        {
            id: "0197b421-92cc-776c-8070-d476ed031f5e",
            type: "grup2",
            price: (2 * 24 * 80000) + 100000, // 3940000
            discPrice: 3546000, // 10% discount
            packageId: "0197b421-92cc-776c-8070-d476ed031f5c",
            maxStudent: 2,
        },
        {
            id: "0197b421-92cc-776c-8070-d476ed031f5f",
            type: "grup3",
            price: (3 * 24 * 80000) + 100000, // 5860000
            discPrice: 5274000, // 10% discount
            packageId: "0197b421-92cc-776c-8070-d476ed031f5c",
            maxStudent: 3,
        },
        {
            id: "0197b421-92cc-776c-8070-d476ed031f60",
            type: "grup4",
            price: (4 * 24 * 80000) + 100000, // 7780000
            discPrice: 7002000, // 10% discount
            packageId: "0197b421-92cc-776c-8070-d476ed031f5c",
            maxStudent: 4,
        },
        {
            id: "0197b421-92cc-776c-8070-d476ed031f61",
            type: "grup5",
            price: (5 * 24 * 80000) + 100000, // 9700000
            discPrice: 8730000, // 10% discount
            packageId: "0197b421-92cc-776c-8070-d476ed031f5c",
            maxStudent: 5,
        },
    ];

    for (const groupType of groupTypes) {
        await prisma.groupType.create({
            data: groupType,
        });
    }

    // Seed Orders
    const orders = [
        {
            id: "019618a1-68a4-7134-b8a7-98ba49f8e50f",
            userId: "0195c5ed-3fc9-71de-93d8-d850abe7b4fa", // So Yon Oh
            packageId: "0195c63c-8fce-7c44-bf47-013da86078a3", // Matematika
            groupTypeId: "0195c63c-8fce-7232-990e-6d11e9ff2d02", // privat
            amount: 1386000, // 10% discount applied
            address: 'Jl. Merdeka No. 1',
            paymentId: "01980001-0000-0000-0000-000000000006", //BNI
            status: 'paid'
        },
        {
            id: "019618a1-68a4-75a4-abe4-dffa3730c045",
            userId: "019618a1-68a4-7742-9471-2548f7726e86", // Ma Tor Nu Won
            packageId: "019618a1-68a4-7f67-acd4-aeccf37ca7c7", // Bahasa Inggris
            groupTypeId: "019618a1-68a4-7a75-948f-e8df29d3bb9c", // grup2
            address: 'Jl. Merdeka No. 2',
            amount: 1020000,
            paymentId: "01980001-0000-0000-0000-000000000007", // BCA
            status: 'paid',
        },
        {
            id: "0196b2d1-ecd3-7d08-8784-4e413a3f3788",
            userId: "0196b294-4791-7972-912a-33627d5b14b2", // Sari Utami
            packageId: "0196b294-4791-7b00-8000-000000000011", // Kimia
            groupTypeId: "0196b294-4791-7b00-8000-000000000101", // privat
            amount: 2250000, // 10% discount applied
            address: 'Jl. Merdeka No. 3',
            paymentId: "01980001-0000-0000-0000-000000000008", // Mandiri
            status: 'pending',
        },
        {
            id: "0197d446-707c-76a7-8021-d1364ebf1e47",
            userId: "0195c5ed-3fc9-771d-bced-9c4b10afd9a2", // Dendy Wan
            packageId: "0196b294-4791-7b00-8000-000000000014", // FOKUS UTBK
            groupTypeId: "0196b294-4791-7b00-8000-000000000401", // kelas
            address: 'Jl. Pemuda No.150, Sekayu, Kec. Semarang Tengah, Kota Semarang',
            status: 'kelas',
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
        {
            id: "0197d448-6d6a-7183-a1d1-ce1979666720",
            code: 'CLS-DEF456',
            status: 'berjalan',
            tutorId: "0195c5ed-3fc9-771d-bced-9c4b10afd9a2", // Dendy Wan
            orderId: "0197d446-707c-76a7-8021-d1364ebf1e47", // Dendy Wan - FOKUS UTBK
            maxStudents: 20,
        }
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
            date: new Date('2025-04-08T08:00:00Z'),
            meet: 1,
            status: 'terjadwal',
            slug: 'bahasa-inggris-sma-ABC123-qwert11',
        },
        {
            id: "019618a1-68a4-7a00-8000-000000000002",
            classId: "019618a1-68a4-7fbc-87af-6cc1cc6cffd0",
            date: new Date('2025-04-11T08:00:00Z'),
            meet: 2,
            status: 'terjadwal',
            slug: 'bahasa-inggris-sma-ABC123-yuia11',
        },
        {
            id: "019618a1-68a4-7a00-8000-000000000003",
            classId: "019618a1-68a4-7fbc-87af-6cc1cc6cffd0",
            date: new Date('2025-04-15T08:00:00Z'),
            meet: 3,
            status: 'terjadwal',
            slug: 'bahasa-inggris-sma-ABC123-kslo11',
        },
        {
            id: "019618a1-68a4-7a00-8000-000000000004",
            classId: "019618a1-68a4-7fbc-87af-6cc1cc6cffd0",
            date: new Date('2025-04-18T08:00:00Z'),
            meet: 4,
            status: 'terjadwal',
            slug: 'bahasa-inggris-sma-ABC123-ynki23',
        },
        {
            id: "019618a1-68a4-7a00-8000-000000000005",
            classId: "019618a1-68a4-7fbc-87af-6cc1cc6cffd0",
            date: new Date('2025-04-22T08:00:00Z'),
            meet: 5,
            status: 'terjadwal',
            slug: 'bahasa-inggris-sma-ABC123-pal311',
        },
        {
            id: "019618a1-68a4-7a00-8000-000000000006",
            classId: "019618a1-68a4-7fbc-87af-6cc1cc6cffd0",
            date: new Date('2025-04-25T08:00:00Z'),
            meet: 6,
            status: 'terjadwal',
            slug: 'bahasa-inggris-sma-ABC123-3nam11',
        },
        {
            id: "019618a1-68a4-7a00-8000-000000000007",
            classId: "019618a1-68a4-7fbc-87af-6cc1cc6cffd0",
            date: new Date('2025-04-28T08:00:00Z'),
            meet: 7,
            status: 'jadwal_ulang',
            slug: 'bahasa-inggris-sma-ABC123-7uju11',
        },
        {
            id: "019618a1-68a4-7a00-8000-000000000008",
            classId: "019618a1-68a4-7fbc-87af-6cc1cc6cffd0",
            date: new Date('2025-07-10T08:00:00Z'),
            meet: 8,
            status: 'terjadwal',
            slug: 'bahasa-inggris-sma-ABC123-l4pa11',
        },
        {
            id: "0197d449-8bd0-7e6f-a77f-0b9be7400001",
            classId: "0197d448-6d6a-7183-a1d1-ce1979666720",
            date: new Date('2025-07-21T08:00:00Z'),
            meet: 1,
            status: 'terjadwal',
            slug: 'fokus-utbk-sma-ask123',
        },
        {
            id: "0197d449-8bd0-7e6f-a77f-0b9be7400002",
            classId: "0197d448-6d6a-7183-a1d1-ce1979666720",
            date: new Date('2025-07-23T08:00:00Z'),
            meet: 2,
            status: 'terjadwal',
            slug: 'fokus-utbk-sma-ask456',
        },
        {
            id: "0197d449-8bd0-7e6f-a77f-0b9be7400003",
            classId: "0197d448-6d6a-7183-a1d1-ce1979666720",
            date: new Date('2025-07-28T08:00:00Z'),
            meet: 3,
            status: 'terjadwal',
            slug: 'fokus-utbk-sma-ask789',
        },
        {
            id: "0197d449-8bd0-7e6f-a77f-0b9be7400004",
            classId: "0197d448-6d6a-7183-a1d1-ce1979666720",
            date: new Date('2025-07-30T08:00:00Z'),
            meet: 4,
            status: 'terjadwal',
            slug: 'fokus-utbk-sma-ask987',
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
            status: 'alpha',
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
            status: 'alpha',
        },

        // Venita - Bahasa Inggris
        {
            id: "0196b2ee-98ca-7da3-849f-d1bc1660cf17",
            scheduleId: "019618a1-68a4-7a00-8000-000000000001",
            userId: "019618a1-68a4-71c5-9f8d-5ef6ef4fc1aa",
            status: 'masuk',
            createdAt: new Date('2025-04-08T15:05:00Z'),
        },
        {
            id: "0196b2ee-98ca-7da3-849f-d1bc1660cf18",
            scheduleId: "019618a1-68a4-7a00-8000-000000000002",
            userId: "019618a1-68a4-71c5-9f8d-5ef6ef4fc1aa",
            status: 'masuk',
            createdAt: new Date('2025-04-11T15:35:00Z'),
        },
        {
            id: "0196b2ee-bc5d-a9c5-bd9c-fc5d9d5d9d64",
            scheduleId: "019618a1-68a4-7a00-8000-000000000003",
            userId: "019618a1-68a4-71c5-9f8d-5ef6ef4fc1aa",
            status: 'masuk',
            createdAt: new Date('2025-04-15T15:10:00Z'),
        },
        {
            id: "0196b2ee-bc5d-a9c5-bd9c-fc5d9d5d9d65",
            scheduleId: "019618a1-68a4-7a00-8000-000000000004",
            userId: "019618a1-68a4-71c5-9f8d-5ef6ef4fc1aa",
            status: 'masuk',
            createdAt: new Date('2025-04-18T18:40:00Z'),
        },
        {
            id: "0196b2ee-bc5d-a9c5-bd9c-fc5d9d5d9d66",
            scheduleId: "019618a1-68a4-7a00-8000-000000000005",
            userId: "019618a1-68a4-71c5-9f8d-5ef6ef4fc1aa",
            status: 'masuk',
            createdAt: new Date('2025-04-22T15:00:00Z'),
        },
        {
            id: "0196b2ee-bc5d-a9c5-bd9c-fc5d9d5d9d67",
            scheduleId: "019618a1-68a4-7a00-8000-000000000006",
            userId: "019618a1-68a4-71c5-9f8d-5ef6ef4fc1aa",
            status: 'masuk',
            createdAt: new Date('2025-04-25T15:00:00Z'),
        },
        {
            id: "0196b2ee-bc5d-a9c5-bd9c-fc5d9d5d9d68",
            scheduleId: "019618a1-68a4-7a00-8000-000000000007",
            userId: "019618a1-68a4-71c5-9f8d-5ef6ef4fc1aa",
            status: 'masuk',
            createdAt: new Date('2025-04-28T15:00:00Z'),
        },
        {
            id: "0196b2ee-bc5d-a9c5-bd9c-fc5d9d5d9d69",
            scheduleId: "019618a1-68a4-7a00-8000-000000000008",
            userId: "019618a1-68a4-71c5-9f8d-5ef6ef4fc1aa",
            status: 'masuk',
            createdAt: new Date('2025-07-10T15:00:00Z'),
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
            total: 612000,
            payroll: 61200,
            status: 'pending',
        }
    });

    // Seed Tutor Applications
    const tutorApplications = [
        {
            id: "01980001-0000-0000-0000-000000000001",
            name: "Andi Saputra",
            email: "andi.saputra@mail.com",
            birthDate: new Date("1992-05-10"),
            gender: "Male",
            phone: "081234567800",
            address: "Jl. Melati No. 10",
            subjects: "Matematika",
            status: "S1",
            major: "Pendidikan Matematika",
            school: "Universitas Negeri Semarang",
            teachLevel: "SMP",
            description: "Saya memiliki pengalaman mengajar Matematika SMP selama 3 tahun.",
            days: JSON.stringify(["Senin", "Kamis"])
        },
        {
            id: "01980001-0000-0000-0000-000000000002",
            name: "Budi Hartanto",
            email: "budi.hartanto@mail.com",
            birthDate: new Date("1990-08-21"),
            gender: "Male",
            phone: "081234567801",
            address: "Jl. Kenanga No. 11",
            subjects: "Fisika",
            status: "S2",
            major: "Fisika",
            school: "Universitas Diponegoro",
            teachLevel: "SMA",
            description: "Berpengalaman mengajar Fisika SMA dan aktif dalam komunitas guru.",
            days: JSON.stringify(["Selasa", "Jumat"])
        },
        {
            id: "01980001-0000-0000-0000-000000000003",
            name: "Citra Dewi",
            email: "citra.dewi@mail.com",
            birthDate: new Date("1995-03-15"),
            gender: "Female",
            phone: "081234567802",
            address: "Jl. Anggrek No. 12",
            subjects: "Bahasa Inggris",
            status: "S1",
            major: "Pendidikan Bahasa Inggris",
            school: "Universitas Negeri Semarang",
            teachLevel: "SMP",
            description: "Lulusan S1 Pendidikan Bahasa Inggris, suka mengajar anak-anak.",
            days: JSON.stringify(["Rabu", "Sabtu"])
        },
        {
            id: "01980001-0000-0000-0000-000000000004",
            name: "Dewi Lestari",
            email: "dewi.lestari@mail.com",
            birthDate: new Date("1993-11-30"),
            gender: "Female",
            phone: "081234567803",
            address: "Jl. Flamboyan No. 13",
            subjects: "Biologi",
            status: "S1",
            major: "Pendidikan Biologi",
            school: "Universitas Gadjah Mada",
            teachLevel: "SMA",
            description: "Berpengalaman mengajar Biologi SMA dan aktif di kegiatan sains.",
            days: JSON.stringify(["Jumat", "Sabtu"])
        },
        {
            id: "01980001-0000-0000-0000-000000000005",
            name: "Eko Prasetyo",
            email: "eko.prasetyo@mail.com",
            birthDate: new Date("1994-07-22"),
            gender: "Male",
            phone: "081234567804",
            address: "Jl. Duku No. 14",
            subjects: "Kimia",
            status: "S1",
            major: "Kimia",
            school: "Universitas Indonesia",
            teachLevel: "SMA",
            description: "Pernah menjadi asisten dosen Kimia dan mengajar privat.",
            days: JSON.stringify(["Rabu", "Kamis"])
        },
    ];

    for (const tutorApplication of tutorApplications) {
        await prisma.tutorApplication.create({
            data: tutorApplication,
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