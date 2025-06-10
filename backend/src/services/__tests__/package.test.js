import { jest } from '@jest/globals';

const mockPrisma = {
    bimbelPackage: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn()
    },
    groupType: { deleteMany: jest.fn() },
    packageDay: { deleteMany: jest.fn() },
    day: { findMany: jest.fn() },
    order: { groupBy: jest.fn() },
    class: { findMany: jest.fn() },
    studentClass: { findMany: jest.fn() }
};

jest.unstable_mockModule('../../utils/db.js', () => ({
    prisma: mockPrisma
}));

const { BimbelPackageService } = await import('../package.js');

beforeEach(() => {
    jest.clearAllMocks();
});

describe('BimbelPackageService', () => {
    describe('getActiveBimbelPackages', () => {
        it('should return active bimbel packages with correct structure', async () => {
            mockPrisma.bimbelPackage.findMany.mockResolvedValueOnce([
                {
                    name: 'Paket A',
                    level: 'SMA',
                    totalMeetings: 10,
                    time: '10:00',
                    duration: 90,
                    area: 'Jakarta',
                    isActive: true,
                    user: { name: 'Tutor A', tutors: [{ photo: 'photo.jpg' }] },
                    groupType: [{ type: 'privat', price: 100000, discPrice: 90000 }],
                    packageDay: [{ day: { daysName: 'Senin' } }]
                }
            ]);
            mockPrisma.bimbelPackage.count.mockResolvedValueOnce(1);

            const result = await BimbelPackageService.getActiveBimbelPackages({ page: 1, pageSize: 10 });

            expect(result.data[0]).toMatchObject({
                name: 'Paket A',
                level: 'SMA',
                totalMeetings: 10,
                time: '10:00',
                duration: 90,
                area: 'Jakarta',
                isActive: true,
                tutorName: 'Tutor A',
                photo: 'photo.jpg',
                groupType: [expect.objectContaining({ type: 'privat', price: 100000, discPrice: 90000 })],
                days: ['Senin']
            });
            expect(result.total).toBe(1);
        });

        it('should return empty array if no active packages', async () => {
            mockPrisma.bimbelPackage.findMany.mockResolvedValueOnce([]);
            mockPrisma.bimbelPackage.count.mockResolvedValueOnce(0);

            const result = await BimbelPackageService.getActiveBimbelPackages({ page: 1, pageSize: 10 });

            expect(result.data).toEqual([]);
            expect(result.total).toBe(0);
        });
    });

    describe('createBimbelPackage', () => {
        it('throws if days invalid', async () => {
            mockPrisma.user.findUnique.mockResolvedValueOnce({ id: 1 });
            mockPrisma.day.findMany.mockResolvedValueOnce([]);
            await expect(BimbelPackageService.createBimbelPackage({
                name: 'Paket D', level: 'SMA', totalMeetings: 10, time: '10:00', duration: 90, area: 'Jakarta',
                tutorId: 1, groupType: [{ type: 'privat', price: 100000 }], days: ['Sabtu'], discount: 10
            })).rejects.toThrow('Invalid days provided');
        });

        it('throws if tutor not found', async () => {
            mockPrisma.user.findUnique.mockResolvedValueOnce(null);
            await expect(BimbelPackageService.createBimbelPackage({
                name: 'Paket X', level: 'SMA', totalMeetings: 10, time: '10:00', duration: 90, area: 'Jakarta',
                tutorId: 999, groupType: [{ type: 'privat', price: 100000 }], days: ['Senin'], discount: 10
            })).rejects.toThrow('Tutor (user) tidak ditemukan');
        });

        it('returns created data', async () => {
            mockPrisma.user.findUnique.mockResolvedValueOnce({ id: 1 });
            mockPrisma.day.findMany.mockResolvedValueOnce([{ id: 1 }]);
            mockPrisma.bimbelPackage.create.mockResolvedValueOnce({ id: 'pkg2', groupType: [], packageDay: [] });
            const result = await BimbelPackageService.createBimbelPackage({
                name: 'Paket E', level: 'SMA', totalMeetings: 10, time: '10:00', duration: 90, area: 'Jakarta',
                tutorId: 1, groupType: [{ type: 'privat', price: 100000 }], days: ['Sabtu', 'Minggu'], discount: 10
            });
            expect(result).toHaveProperty('message');
            expect(result.data).toHaveProperty('id', 'pkg2');
            expect(result.data).not.toBeNull();
        });
    });

    describe('updateBimbelPackage', () => {
        it('throws if days invalid', async () => {
            mockPrisma.day.findMany.mockResolvedValueOnce([]);
            await expect(BimbelPackageService.updateBimbelPackage('pkg3', {
                name: 'Paket F', level: 'SMA', totalMeetings: 10, time: '10:00', duration: 90, area: 'Jakarta',
                tutorId: 1, groupType: [{ type: 'privat', price: 100000 }], days: ['Sabtu'], discount: 10
            })).rejects.toThrow('Invalid days provided');
        });

        it('returns updated data', async () => {
            mockPrisma.day.findMany.mockResolvedValueOnce([{ id: 1 }]);
            mockPrisma.bimbelPackage.update.mockResolvedValueOnce({ id: 'pkg4', groupType: [], packageDay: { day: {} } });
            const result = await BimbelPackageService.updateBimbelPackage('pkg4', {
                name: 'Paket G', level: 'SMA', totalMeetings: 10, time: '10:00', duration: 90, area: 'Jakarta',
                tutorId: 1, groupType: [{ type: 'privat', price: 100000 }], days: ['Sabtu'], discount: 10
            });
            expect(result).toHaveProperty('message');
            expect(result.data).toHaveProperty('id', 'pkg4');
        });
    });

    describe('deleteBimbelPackage', () => {
        it('should delete a bimbel package successfully', async () => {
            mockPrisma.groupType.deleteMany.mockResolvedValueOnce();
            mockPrisma.packageDay.deleteMany.mockResolvedValueOnce();
            mockPrisma.bimbelPackage.delete.mockResolvedValueOnce();

            const result = await BimbelPackageService.deleteBimbelPackage('pkg1');

            expect(result).toHaveProperty('message', 'Bimbel package deleted successfully');
        });

        it('should throw an error if deletion fails', async () => {
            mockPrisma.groupType.deleteMany.mockResolvedValueOnce();
            mockPrisma.packageDay.deleteMany.mockResolvedValueOnce();
            mockPrisma.bimbelPackage.delete.mockRejectedValueOnce(new Error('Delete failed'));

            await expect(BimbelPackageService.deleteBimbelPackage('pkg1')).rejects.toThrow('Delete failed');
        });
    });

    describe('getBimbelPackageStatistics', () => {
        it('should return correct statistics', async () => {
            mockPrisma.bimbelPackage.count.mockResolvedValueOnce(10).mockResolvedValueOnce(4);

            const result = await BimbelPackageService.getBimbelPackageStatistics();

            expect(result).toEqual({
                totalPackages: 10,
                activePackages: 4,
                inactivePackages: 6
            });
        });
    });
});