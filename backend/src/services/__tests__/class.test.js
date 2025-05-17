import { jest } from '@jest/globals';

const mockPrisma = {
    order: { findUnique: jest.fn() },
    class: { create: jest.fn(), findUnique: jest.fn() },
    studentClass: { createMany: jest.fn(), findFirst: jest.fn(), create: jest.fn(), findMany: jest.fn() }
};

jest.unstable_mockModule('../../utils/db.js', () => ({
    prisma: mockPrisma
}));

jest.unstable_mockModule('crypto', () => ({
    default: {
        randomBytes: () => ({
            toString: () => 'abcdef'
        })
    }
}));

const { ClassService } = await import('../class.js');

beforeEach(() => {
    jest.clearAllMocks();
});

describe('ClassService', () => {
    describe('createClass', () => {
        it('should throw if order not found', async () => {
            mockPrisma.order.findUnique.mockResolvedValueOnce(null);
            await expect(ClassService.createClass({ orderId: 1 })).rejects.toThrow('Order not found');
        });

        it('should create class and studentClass', async () => {
            mockPrisma.order.findUnique.mockResolvedValueOnce({
                id: 1,
                userId: 10,
                bimbelPackage: { userId: 20 }
            });
            mockPrisma.class.create.mockResolvedValueOnce({ id: 100, code: 'ABCDEF' });
            mockPrisma.studentClass.createMany.mockResolvedValueOnce({});
            const result = await ClassService.createClass({ orderId: 1 });
            expect(mockPrisma.class.create).toHaveBeenCalledWith({
                data: { code: expect.any(String), orderId: 1, tutorId: 20 }
            });
            expect(mockPrisma.studentClass.createMany).toHaveBeenCalledWith({
                data: [{ userId: 10, classId: 100 }]
            });
            expect(result).toHaveProperty('id', 100);
        });
    });

    describe('joinClass', () => {
        it('should throw if class not found', async () => {
            mockPrisma.class.findUnique.mockResolvedValueOnce(null);
            await expect(ClassService.joinClass({ code: 'ABC', userId: 1 })).rejects.toThrow('Class not found');
        });

        it('should throw if user already in class', async () => {
            mockPrisma.class.findUnique.mockResolvedValueOnce({ id: 2 });
            mockPrisma.studentClass.findFirst.mockResolvedValueOnce({ id: 3 });
            await expect(ClassService.joinClass({ code: 'ABC', userId: 1 })).rejects.toThrow('User is already in the class');
        });

        it('should create studentClass if not already joined', async () => {
            mockPrisma.class.findUnique.mockResolvedValueOnce({ id: 2 });
            mockPrisma.studentClass.findFirst.mockResolvedValueOnce(null);
            mockPrisma.studentClass.create.mockResolvedValueOnce({ id: 4, userId: 1, classId: 2 });
            const result = await ClassService.joinClass({ code: 'ABC', userId: 1 });
            expect(mockPrisma.studentClass.create).toHaveBeenCalledWith({
                data: { userId: 1, classId: 2 }
            });
            expect(result).toMatchObject({ id: 4, userId: 1, classId: 2 });
        });
    });

    describe('getMyClass', () => {
        it('should return mapped class data with all fields', async () => {
            mockPrisma.studentClass.findMany.mockResolvedValueOnce([
                {
                    class: {
                        status: 'aktif',
                        tutor: {
                            name: 'Budi',
                            tutors: [{ gender: 'Male' }]
                        },
                        order: {
                            groupType: { type: 'Reguler' },
                            bimbelPackage: {
                                name: 'Paket A',
                                level: 'SMA',
                                time: '10:00',
                                duration: 90,
                                packageDay: [
                                    { day: { daysName: 'Senin' } },
                                    { day: { daysName: 'Rabu' } }
                                ]
                            }
                        }
                    }
                }
            ]);
            const result = await ClassService.getMyClass('user1');
            expect(result[0]).toMatchObject({
                status: 'aktif',
                tutorName: 'Pak Budi',
                programName: 'Paket A SMA',
                groupType: 'Reguler',
                days: 'Senin, Rabu',
                time: '10:00',
                duration: 90
            });
        });

        it('should handle missing tutor and packageDay', async () => {
            mockPrisma.studentClass.findMany.mockResolvedValueOnce([
                {
                    class: {
                        status: 'aktif',
                        tutor: {},
                        order: {
                            groupType: null,
                            bimbelPackage: {
                                name: 'Paket B',
                                level: 'SMP',
                                time: null,
                                duration: null,
                                packageDay: null
                            }
                        }
                    }
                }
            ]);
            const result = await ClassService.getMyClass('user2');
            expect(result[0]).toMatchObject({
                status: 'aktif',
                tutorName: 'Bu undefined',
                programName: 'Paket B SMP',
                groupType: null,
                days: null,
                time: null,
                duration: null
            });
        });

        it('should handle null bimbelPackage', async () => {
            mockPrisma.studentClass.findMany.mockResolvedValueOnce([
                {
                    class: {
                        status: 'aktif',
                        tutor: {},
                        order: {
                            groupType: null,
                            bimbelPackage: null
                        }
                    }
                }
            ]);
            const result = await ClassService.getMyClass('user3');
            expect(result[0]).toMatchObject({
                status: 'aktif',
                tutorName: 'Bu undefined',
                programName: null,
                groupType: null,
                days: null,
                time: null,
                duration: null
            });
        });
    });
});
