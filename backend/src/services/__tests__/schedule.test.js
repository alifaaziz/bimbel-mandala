import { jest } from '@jest/globals';

const mockPrisma = {
    class: { findUnique: jest.fn() },
    schedule: {
        createMany: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn()
    },
    tutor: { findUnique: jest.fn() },
    notification: { create: jest.fn() },
    studentClass: { findMany: jest.fn() },
    user: { findUnique: jest.fn(), findMany: jest.fn() }
};

jest.unstable_mockModule('../../utils/db.js', () => ({
    prisma: mockPrisma
}));

const { ScheduleService } = await import('../schedule.js');

beforeEach(() => {
    jest.clearAllMocks();
});

describe('ScheduleService', () => {
    describe('createSchedules', () => {
        it('should create schedules and return them', async () => {
            mockPrisma.class.findUnique.mockResolvedValueOnce({
                code: 'C1',
                order: {
                    bimbelPackage: {
                        name: 'Paket A',
                        level: 'SMA',
                        packageDay: [{ day: { daysName: 'Senin' } }],
                        totalMeetings: 2,
                        time: '10:00'
                    }
                }
            });
            mockPrisma.schedule.findUnique.mockResolvedValueOnce(null); // Mock slug uniqueness check
            mockPrisma.schedule.createMany.mockResolvedValueOnce({});
            mockPrisma.schedule.findMany.mockResolvedValueOnce([
                { id: 1, classId: 'class1', date: new Date(), meet: 1, status: 'terjadwal' }
            ]);

            const result = await ScheduleService.createSchedules('class1');
            expect(Array.isArray(result)).toBe(true);
            expect(result[0]).toHaveProperty('id', 1);
        });

        it('should throw an error if class is not found', async () => {
            mockPrisma.class.findUnique.mockResolvedValueOnce(null);
            await expect(ScheduleService.createSchedules('class1')).rejects.toThrow('Class not found');
        });

        it('should throw an error if totalMeetings is invalid', async () => {
            mockPrisma.class.findUnique.mockResolvedValueOnce({
                code: 'C1',
                order: {
                    bimbelPackage: {
                        name: 'Paket A',
                        level: 'SMA',
                        packageDay: [{ day: { daysName: 'Senin' } }],
                        totalMeetings: 0,
                        time: '10:00'
                    }
                }
            });
            await expect(ScheduleService.createSchedules('class1')).rejects.toThrow('Invalid totalMeetings in bimbelPackage');
        });
    });

    describe('reschedule', () => {
        it('should throw if new date is in the past', async () => {
            const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
            await expect(
                ScheduleService.reschedule('sch1', yesterday, {}, {}, false)
            ).rejects.toThrow('New date cannot be in the past');
        });

        it('should update schedule and create notifications', async () => {
            mockPrisma.schedule.findUnique.mockResolvedValueOnce({
                id: 'sch1',
                status: 'terjadwal',
                attendances: [],
                class: {
                    code: 'C1',
                    order: {
                        bimbelPackage: { name: 'Paket', level: 'SMA', userId: 2 },
                        user: { id: 3 }
                    }
                }
            });
            mockPrisma.schedule.update.mockResolvedValueOnce({ id: 'sch1', status: 'jadwal_ulang' });
            mockPrisma.tutor.findUnique.mockResolvedValueOnce({ userId: 2, gender: 'Male', user: { name: 'Tutor' } });
            mockPrisma.notification.create.mockResolvedValue({});
            const res = { locals: { user: { id: 2 } } };
            const result = await ScheduleService.reschedule('sch1', new Date(Date.now() + 86400000), {}, res, false);
            expect(result).toHaveProperty('id', 'sch1');
            expect(mockPrisma.notification.create).toHaveBeenCalled();
        });
    });

    describe('getClosestSchedules', () => {
        it('should return closest schedules with tutor names', async () => {
            mockPrisma.schedule.findMany.mockResolvedValueOnce([
                {
                    id: 1,
                    classId: 'c1',
                    date: new Date(),
                    meet: 1,
                    status: 'terjadwal',
                    class: {
                        code: 'C1',
                        tutor: { name: 'Budi', tutors: [{ gender: 'Male' }] },
                        order: {
                            bimbelPackage: { name: 'Paket A', level: 'SMA', duration: 90 },
                            groupType: { type: 'Privat' }
                        }
                    }
                }
            ]);
            const result = await ScheduleService.getClosestSchedules();
            expect(result[0]).toHaveProperty('tutorName', 'Pak Budi');
            expect(result[0]).toHaveProperty('classCode', 'C1');
        });

        it('should throw if no schedules found', async () => {
            mockPrisma.schedule.findMany.mockResolvedValueOnce([]);
            await expect(ScheduleService.getClosestSchedules()).rejects.toThrow('No schedules found');
        });
    });

    describe('getSchedulesForStudent', () => {
        it('should return schedules for student', async () => {
            mockPrisma.studentClass.findMany.mockResolvedValueOnce([{ classId: 'c1' }]);
            mockPrisma.schedule.findMany.mockResolvedValueOnce([
                {
                    id: 1,
                    classId: 'c1',
                    date: new Date(),
                    meet: 1,
                    status: 'terjadwal',
                    class: {
                        code: 'C1',
                        tutor: { name: 'Budi', tutors: [{ gender: 'Male' }] },
                        order: {
                            bimbelPackage: { name: 'Paket A', level: 'SMA', duration: 90 },
                            groupType: { type: 'Privat' }
                        }
                    },
                    attendances: [{ status: 'masuk' }]
                }
            ]);
            const result = await ScheduleService.getSchedulesForStudent('u1');
            expect(result[0]).toHaveProperty('status', 'masuk');
        });

        it('should throw if no schedules found for student', async () => {
            mockPrisma.studentClass.findMany.mockResolvedValueOnce([]);
            await expect(ScheduleService.getSchedulesForStudent('u1')).rejects.toThrow('No classes found for this student');
        });
    });

    describe('getSchedulesForTutor', () => {
        it('should return schedules for tutor', async () => {
            mockPrisma.schedule.findMany.mockResolvedValueOnce([
                {
                    id: 1,
                    classId: 'c1',
                    date: new Date(),
                    meet: 1,
                    status: 'terjadwal',
                    class: {
                        code: 'C1',
                        tutor: { name: 'Budi', tutors: [{ gender: 'Male' }] },
                        order: {
                            bimbelPackage: { name: 'Paket A', level: 'SMA', duration: 90 },
                            groupType: { type: 'Privat' }
                        }
                    },
                    attendances: [{ status: 'izin' }]
                }
            ]);
            const result = await ScheduleService.getSchedulesForTutor('u2');
            expect(result[0]).toHaveProperty('status', 'izin');
        });

        it('should throw if no schedules found for tutor', async () => {
            mockPrisma.schedule.findMany.mockResolvedValueOnce([]);
            await expect(ScheduleService.getSchedulesForTutor('u2')).rejects.toThrow('No schedules found for this tutor');
        });
    });

    describe('getScheduleBySlug', () => {
        it('should return schedule details by slug', async () => {
            mockPrisma.schedule.findUnique.mockResolvedValueOnce({
                id: 1,
                class: {
                    code: 'C1',
                    tutor: { name: 'Budi', tutors: [{ gender: 'Male' }] },
                    order: {
                        bimbelPackage: { name: 'Paket A', level: 'SMA', duration: 90 },
                        groupType: { type: 'Privat' }
                    }
                },
                status: 'terjadwal',
                slug: 'schedule-slug'
            });
            const result = await ScheduleService.getScheduleBySlug('schedule-slug');
            expect(result).toHaveProperty('classCode', 'C1');
            expect(result).toHaveProperty('tutorName', 'Pak Budi');
        });

        it('should throw if schedule not found', async () => {
            mockPrisma.schedule.findUnique.mockResolvedValueOnce(null);
            await expect(ScheduleService.getScheduleBySlug('invalid-slug')).rejects.toThrow('Schedule not found');
        });
    });
});

afterAll(() => {
  jest.clearAllTimers();
});
