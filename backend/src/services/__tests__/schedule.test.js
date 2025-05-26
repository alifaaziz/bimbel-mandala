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
    // --- createSchedules ---
    describe('createSchedules', () => {
        it('should throw if class not found', async () => {
            mockPrisma.class.findUnique.mockResolvedValueOnce(null);
            await expect(ScheduleService.createSchedules('class1')).rejects.toThrow('Class not found');
        });

        it('should throw if totalMeetings invalid', async () => {
            mockPrisma.class.findUnique.mockResolvedValueOnce({
                order: {
                    bimbelPackage: { packageDay: [], totalMeetings: 0, time: '2024-05-20T10:00:00Z' }
                }
            });
            await expect(ScheduleService.createSchedules('class1')).rejects.toThrow('Invalid totalMeetings in bimbelPackage');
        });

        it('should throw if time invalid', async () => {
            mockPrisma.class.findUnique.mockResolvedValueOnce({
                order: {
                    bimbelPackage: { packageDay: [], totalMeetings: 2, time: 'not-a-date' }
                }
            });
            await expect(ScheduleService.createSchedules('class1')).rejects.toThrow('Invalid time format in bimbelPackage');
        });

        it('should create schedules and return them', async () => {
            mockPrisma.class.findUnique.mockResolvedValueOnce({
                order: {
                    bimbelPackage: {
                        packageDay: [{ day: { daysName: 'Senin' } }],
                        totalMeetings: 1,
                        time: new Date().toISOString()
                    }
                }
            });
            mockPrisma.schedule.createMany.mockResolvedValueOnce({});
            mockPrisma.schedule.findMany.mockResolvedValueOnce([{ id: 1, classId: 'class1' }]);
            const result = await ScheduleService.createSchedules('class1');
            expect(Array.isArray(result)).toBe(true);
            expect(result[0]).toHaveProperty('id', 1);
        });

        it('should break for loop if meet > totalMeetings', async () => {
            mockPrisma.class.findUnique.mockResolvedValueOnce({
                order: {
                    bimbelPackage: {
                        packageDay: [
                            { day: { daysName: 'Senin' } },
                            { day: { daysName: 'Selasa' } }
                        ],
                        totalMeetings: 1,
                        time: new Date().toISOString()
                    }
                }
            });
            mockPrisma.schedule.createMany.mockResolvedValueOnce({});
            mockPrisma.schedule.findMany.mockResolvedValueOnce([{ id: 1, classId: 'class1' }]);
            const result = await ScheduleService.createSchedules('class1');
            expect(result.length).toBe(1);
        });

        it('should create schedules with correct time and use getNextDate', async () => {
            mockPrisma.class.findUnique.mockResolvedValueOnce({
                order: {
                    bimbelPackage: {
                        packageDay: [
                            { day: { daysName: 'Senin' } },
                            { day: { daysName: 'Selasa' } }
                        ],
                        totalMeetings: 1,
                        time: new Date('2024-05-17T10:30:00Z').toISOString()
                    }
                }
            });
            mockPrisma.schedule.createMany.mockResolvedValueOnce({});
            mockPrisma.schedule.findMany.mockResolvedValueOnce([
                { id: 1, classId: 'class1', date: new Date(), meet: 1, status: 'terjadwal' }
            ]);
            const result = await ScheduleService.createSchedules('class1');
            expect(result.length).toBe(1);
            expect(result[0]).toHaveProperty('id', 1);
        });

        it('should create schedule when scheduleDate > currentDate', async () => {
            const now = new Date();
            const sunday = new Date(now.setDate(now.getDate() - now.getDay()));
            mockPrisma.class.findUnique.mockResolvedValueOnce({
                order: {
                    bimbelPackage: {
                        packageDay: [{ day: { daysName: 'Senin' } }],
                        totalMeetings: 1,
                        time: new Date().toISOString()
                    }
                }
            });
            mockPrisma.schedule.createMany.mockResolvedValueOnce({});
            mockPrisma.schedule.findMany.mockResolvedValueOnce([
                { id: 1, classId: 'class1', date: new Date(), meet: 1, status: 'terjadwal' }
            ]);
            const realDate = global.Date;
            class MockDate extends realDate {
                constructor(...args) {
                    if (args.length === 0) return sunday;
                    return new realDate(...args);
                }
            }
            MockDate.now = () => sunday.getTime();
            global.Date = MockDate;
            try {
                const result = await ScheduleService.createSchedules('class1');
                expect(result.length).toBe(1);
            } finally {
                global.Date = realDate;
            }
        });
    });

    // --- reschedule ---
    describe('reschedule', () => {
        it('should throw if newDate invalid', async () => {
            await expect(ScheduleService.reschedule('sch1', 'not-a-date', {}, {}, false))
                .rejects.toThrow('Invalid new date format');
        });

        it('should throw if newDate in the past', async () => {
            const pastDate = new Date(Date.now() - 86400000).toISOString();
            await expect(ScheduleService.reschedule('sch1', pastDate, {}, {}, false))
                .rejects.toThrow('New date cannot be in the past');
        });

        it('should throw if schedule not found', async () => {
            mockPrisma.schedule.findUnique.mockResolvedValueOnce(null);
            await expect(ScheduleService.reschedule('sch1', new Date(Date.now() + 86400000), {}, {}, false))
                .rejects.toThrow('Schedule not found');
        });

        it('should throw if already rescheduled', async () => {
            mockPrisma.schedule.findUnique.mockResolvedValueOnce({ status: 'jadwal_ulang', attendances: [], class: { order: { bimbelPackage: {}, user: {} } } });
            await expect(ScheduleService.reschedule('sch1', new Date(Date.now() + 86400000), {}, {}, false))
                .rejects.toThrow('Reschedule can only be done once');
        });

        it('should throw if attendance already recorded', async () => {
            mockPrisma.schedule.findUnique.mockResolvedValueOnce({
                status: 'terjadwal',
                attendances: [{ status: 'masuk' }],
                class: { order: { bimbelPackage: {}, user: {} } }
            });
            await expect(ScheduleService.reschedule('sch1', new Date(Date.now() + 86400000), {}, {}, false)).rejects.toThrow('Cannot reschedule after attendance has been recorded');
        });

        it('should throw if attendance status is masuk', async () => {
            mockPrisma.schedule.findUnique.mockResolvedValueOnce({
                status: 'terjadwal',
                attendances: [{ status: 'masuk' }],
                class: { order: { bimbelPackage: {}, user: {} } }
            });
            await expect(ScheduleService.reschedule('sch1', new Date(Date.now() + 86400000), {}, {}, false))
                .rejects.toThrow('Cannot reschedule after attendance has been recorded');
        });

        it('should throw if attendance status is izin', async () => {
            mockPrisma.schedule.findUnique.mockResolvedValueOnce({
                status: 'terjadwal',
                attendances: [{ status: 'izin' }],
                class: { order: { bimbelPackage: {}, user: {} } }
            });
            await expect(ScheduleService.reschedule('sch1', new Date(Date.now() + 86400000), {}, {}, false))
                .rejects.toThrow('Cannot reschedule after attendance has been recorded');
        });

        it('should update schedule and create notifications', async () => {
            const schedule = {
                status: 'terjadwal',
                attendances: [],
                class: {
                    code: 'C1',
                    order: {
                        bimbelPackage: { name: 'Paket', level: 'SMA', userId: 2 },
                        user: { id: 3 }
                    }
                }
            };
            mockPrisma.schedule.findUnique.mockResolvedValueOnce(schedule);
            mockPrisma.schedule.update.mockResolvedValueOnce({ id: 'sch1', status: 'jadwal_ulang' });
            mockPrisma.tutor.findUnique.mockResolvedValueOnce({ userId: 2, gender: 'Male', user: { name: 'Tutor' } });
            const res = { locals: { user: { id: 2 } } };
            mockPrisma.notification.create.mockResolvedValue({});
            const result = await ScheduleService.reschedule('sch1', new Date(Date.now() + 86400000), {}, res, false);
            expect(result).toHaveProperty('id', 'sch1');
            expect(mockPrisma.notification.create).toHaveBeenCalled();
        });

        it('should use "Anda" as actorForTutor if loggedInUser.id === tutor.userId', async () => {
            const schedule = {
                status: 'terjadwal',
                attendances: [],
                class: {
                    code: 'C1',
                    order: {
                        bimbelPackage: { name: 'Paket', level: 'SMA', userId: 2 },
                        user: { id: 3 }
                    }
                }
            };
            mockPrisma.schedule.findUnique.mockResolvedValueOnce(schedule);
            mockPrisma.schedule.update.mockResolvedValueOnce({ id: 'sch1', status: 'jadwal_ulang' });
            mockPrisma.tutor.findUnique.mockResolvedValueOnce({ userId: 2, gender: 'Male', user: { name: 'Tutor' } });
            mockPrisma.notification.create.mockResolvedValue({});
            const res = { locals: { user: { id: 2 } } };
            const result = await ScheduleService.reschedule('sch1', new Date(Date.now() + 86400000), {}, res, false);
            expect(result).toHaveProperty('id', 'sch1');
        });

        it('should use "Admin" as actorForStudent if isAdmin is true', async () => {
            const schedule = {
                status: 'terjadwal',
                attendances: [],
                class: {
                    code: 'C1',
                    order: {
                        bimbelPackage: { name: 'Paket', level: 'SMA', userId: 2 },
                        user: { id: 3 }
                    }
                }
            };
            mockPrisma.schedule.findUnique.mockResolvedValueOnce(schedule);
            mockPrisma.schedule.update.mockResolvedValueOnce({ id: 'sch1', status: 'jadwal_ulang' });
            mockPrisma.tutor.findUnique.mockResolvedValueOnce({ userId: 2, gender: 'Male', user: { name: 'Tutor' } });
            mockPrisma.notification.create.mockResolvedValue({});
            const res = { locals: { user: { id: 99 } } };
            const result = await ScheduleService.reschedule('sch1', new Date(Date.now() + 86400000), {}, res, true);
            expect(result).toHaveProperty('id', 'sch1');
        });
    });

    // --- getClosestSchedules (tutor gender mapping) ---
    describe('getClosestSchedules - tutor gender mapping', () => {
        it('should set gender to undefined if tutors is not an array', async () => {
            mockPrisma.schedule.findMany.mockResolvedValueOnce([
                {
                    id: 1,
                    classId: 'c1',
                    date: new Date(),
                    meet: 1,
                    status: 'terjadwal',
                    information: '',
                    class: { code: 'C1', tutorId: 't1' }
                }
            ]);
            mockPrisma.user.findMany.mockResolvedValueOnce([
                { id: 't1', name: 'Budi', tutors: undefined }
            ]);
            const result = await ScheduleService.getClosestSchedules();
            expect(result[0]).toHaveProperty('tutorName', 'Budi');
        });

        it('should set gender to undefined if tutors array is empty', async () => {
            mockPrisma.schedule.findMany.mockResolvedValueOnce([
                {
                    id: 2,
                    classId: 'c2',
                    date: new Date(),
                    meet: 1,
                    status: 'terjadwal',
                    information: '',
                    class: { code: 'C2', tutorId: 't2' }
                }
            ]);
            mockPrisma.user.findMany.mockResolvedValueOnce([
                { id: 't2', name: 'Siti', tutors: [] }
            ]);
            const result = await ScheduleService.getClosestSchedules();
            expect(result[0]).toHaveProperty('tutorName', 'Siti');
        });

        it('should use getTutorName if gender exists in tutors[0]', async () => {
            mockPrisma.schedule.findMany.mockResolvedValueOnce([
                {
                    id: 3,
                    classId: 'c3',
                    date: new Date(),
                    meet: 1,
                    status: 'terjadwal',
                    information: '',
                    class: { code: 'C3', tutorId: 't3' }
                }
            ]);
            mockPrisma.user.findMany.mockResolvedValueOnce([
                { id: 't3', name: 'Budi', tutors: [{ gender: 'Male' }] }
            ]);
            const result = await ScheduleService.getClosestSchedules();
            expect(result[0]).toHaveProperty('tutorName', 'Pak Budi');
        });

        it('should use getTutorName with Bu if gender is not Male', async () => {
            mockPrisma.schedule.findMany.mockResolvedValueOnce([
                {
                    id: 4,
                    classId: 'c4',
                    date: new Date(),
                    meet: 1,
                    status: 'terjadwal',
                    information: '',
                    class: { code: 'C4', tutorId: 't4' }
                }
            ]);
            mockPrisma.user.findMany.mockResolvedValueOnce([
                { id: 't4', name: 'Siti', tutors: [{ gender: 'Female' }] }
            ]);
            const result = await ScheduleService.getClosestSchedules();
            expect(result[0]).toHaveProperty('tutorName', 'Bu Siti');
        });

        it('should handle multiple schedules with different tutors', async () => {
            mockPrisma.schedule.findMany.mockResolvedValueOnce([
                {
                    id: 5,
                    classId: 'c5',
                    date: new Date(),
                    meet: 1,
                    status: 'terjadwal',
                    information: '',
                    class: { code: 'C5', tutorId: 't5' }
                },
                {
                    id: 6,
                    classId: 'c6',
                    date: new Date(),
                    meet: 1,
                    status: 'terjadwal',
                    information: '',
                    class: { code: 'C6', tutorId: 't6' }
                }
            ]);
            mockPrisma.user.findMany.mockResolvedValueOnce([
                { id: 't5', name: 'Budi', tutors: [{ gender: 'Male' }] },
                { id: 't6', name: 'Siti', tutors: [{ gender: 'Female' }] }
            ]);
            const result = await ScheduleService.getClosestSchedules();
            expect(result[0]).toHaveProperty('tutorName', 'Pak Budi');
            expect(result[1]).toHaveProperty('tutorName', 'Bu Siti');
        });
    });

    // --- getClosestSchedules (error handling) ---
    describe('getClosestSchedules - error handling', () => {
        it('should throw if no schedules found', async () => {
            mockPrisma.schedule.findMany.mockResolvedValueOnce([]);
            await expect(ScheduleService.getClosestSchedules()).rejects.toThrow('No schedules found');
        });
    });

    // --- getSchedulesForStudent ---
    describe('getSchedulesForStudent', () => {
        it('should throw if no schedules found for student', async () => {
            mockPrisma.studentClass.findMany.mockResolvedValueOnce([{ classId: 'c1' }]);
            mockPrisma.schedule.findMany.mockResolvedValueOnce([]);
            await expect(ScheduleService.getSchedulesForStudent('u1')).rejects.toThrow('No schedules found for this student');
        });

        it('should return schedules for student', async () => {
            mockPrisma.studentClass.findMany.mockResolvedValueOnce([{ classId: 'c1' }]);
            mockPrisma.schedule.findMany.mockResolvedValueOnce([
                {
                    id: 1, classId: 'c1', date: new Date(), meet: 1, status: 'terjadwal', information: '',
                    class: { id: 'c1', code: 'C1', orderId: 1, tutorId: 2 },
                    attendances: [{ status: 'masuk' }]
                }
            ]);
            const result = await ScheduleService.getSchedulesForStudent('u1');
            expect(result[0]).toHaveProperty('status', 'masuk');
        });
    });

    describe('getSchedulesForStudent - error handling', () => {
        it('should throw if student has no classes', async () => {
            mockPrisma.studentClass.findMany.mockResolvedValueOnce([]);
            await expect(ScheduleService.getSchedulesForStudent('u1')).rejects.toThrow('No classes found for this student');
        });
    });

    // --- getSchedulesForTutor ---
    describe('getSchedulesForTutor', () => {
        it('should throw if no schedules found for tutor', async () => {
            mockPrisma.schedule.findMany.mockResolvedValueOnce([]);
            await expect(ScheduleService.getSchedulesForTutor('u2')).rejects.toThrow('No schedules found for this tutor');
        });

        it('should return schedules for tutor', async () => {
            mockPrisma.schedule.findMany.mockResolvedValueOnce([
                {
                    id: 1, classId: 'c1', date: new Date(), meet: 1, status: 'terjadwal', information: '',
                    class: { id: 'c1', code: 'C1', orderId: 1, tutorId: 'u2' },
                    attendances: [{ status: 'izin' }]
                }
            ]);
            const result = await ScheduleService.getSchedulesForTutor('u2');
            expect(result[0]).toHaveProperty('status', 'izin');
        });
    });

    // --- getSchedulesByRole ---
    describe('getSchedulesByRole', () => {
        it('should throw if user not found', async () => {
            mockPrisma.user.findUnique.mockResolvedValueOnce(null);
            await expect(ScheduleService.getSchedulesByRole('u1')).rejects.toThrow('User not found');
        });

        it('should call getSchedulesForStudent if role siswa', async () => {
            mockPrisma.user.findUnique.mockResolvedValueOnce({ role: 'siswa' });
            mockPrisma.studentClass.findMany.mockResolvedValueOnce([{ classId: 'c1' }]);
            mockPrisma.schedule.findMany.mockResolvedValueOnce([
                { id: 1, classId: 'c1', date: new Date(), meet: 1, status: 'terjadwal', information: '', class: { id: 'c1', code: 'C1', orderId: 1, tutorId: 2 }, attendances: [] }
            ]);
            const result = await ScheduleService.getSchedulesByRole('u1');
            expect(Array.isArray(result)).toBe(true);
        });

        it('should call getSchedulesForTutor if role tutor', async () => {
            mockPrisma.user.findUnique.mockResolvedValueOnce({ role: 'tutor' });
            mockPrisma.schedule.findMany.mockResolvedValueOnce([
                { id: 1, classId: 'c1', date: new Date(), meet: 1, status: 'terjadwal', information: '', class: { id: 'c1', code: 'C1', orderId: 1, tutorId: 'u2' }, attendances: [] }
            ]);
            const result = await ScheduleService.getSchedulesByRole('u2');
            expect(Array.isArray(result)).toBe(true);
        });
    });

    // --- getNextDate ---
    describe('getNextDate', () => {
        it('should return the same date if currentDate is already the target day', () => {
            const monday = new Date('2024-05-20');
            const result = ScheduleService.getNextDate(monday, 1);
            expect(result.getDay()).toBe(1);
            expect(result.getDate()).toBe(monday.getDate());
        });

        it('should return the next correct day if not the target day', () => {
            const tuesday = new Date('2024-05-21');
            const result = ScheduleService.getNextDate(tuesday, 1);
            expect(result.getDay()).toBe(1);
            expect(result.getDate()).not.toBe(tuesday.getDate());
        });
    });

    // --- getTutorName ---
    describe('getTutorName', () => {
        it('should return null if tutor is undefined', () => {
            expect(ScheduleService.getTutorName(undefined)).toBeNull();
        });

        it('should return null if tutor.user is undefined', () => {
            expect(ScheduleService.getTutorName({ gender: 'Male' })).toBeNull();
        });

        it('should return name with Pak if gender Male', () => {
            expect(ScheduleService.getTutorName({ gender: 'Male', user: { name: 'Budi' } })).toBe('Pak Budi');
        });

        it('should return name with Bu if gender not Male', () => {
            expect(ScheduleService.getTutorName({ gender: 'Female', user: { name: 'Siti' } })).toBe('Bu Siti');
        });
    });
});

afterAll(() => {
  jest.clearAllTimers();
});
