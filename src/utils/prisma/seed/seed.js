import { prisma } from '../../../utils/db.js';

async function main() {
    const days = [
        { daysName: 'Senin' },
        { daysName: 'Selasa' },
        { daysName: 'Rabu' },
        { daysName: 'Kamis' },
        { daysName: 'Jumat' },
        { daysName: 'Sabtu' },
        { daysName: 'Minggu' },
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