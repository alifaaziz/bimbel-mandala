import { prisma } from '../../../utils/db.js';

async function main() {
    const days = [
        { days_name: 'Senin' },
        { days_name: 'Selasa' },
        { days_name: 'Rabu' },
        { days_name: 'Kamis' },
        { days_name: 'Jumat' },
        { days_name: 'Sabtu' },
        { days_name: 'Minggu' },
    ];

    for (const day of days) {
        await prisma.day.create({
            data: day,
        });
    }

    console.log('Days seeded successfully');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });