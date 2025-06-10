import { jest } from '@jest/globals';

const mockPrisma = {
    attendance: { create: jest.fn(), findFirst: jest.fn() },
    schedule: { findUnique: jest.fn(), findMany: jest.fn() },
    class: { findMany: jest.fn(), findUnique: jest.fn() },
    studentClass: { findMany: jest.fn() },
    salary: { findFirst: jest.fn() },
    user: { findUnique: jest.fn() },
    notification: { create: jest.fn() }
};

const mockSalaryService = {
    createSalary: jest.fn()
};

jest.unstable_mockModule('../../utils/db.js', () => ({
    prisma: mockPrisma
}));
jest.unstable_mockModule('../salary.js', () => ({
    SalaryService: mockSalaryService
}));

const { AttendanceService } = await import('../attendance.js');

beforeEach(() => {
    jest.clearAllMocks();
});

describe('AttendanceService', () => {
    describe('createAttendance', () => {
        it('should throw error if attendance already exists', async () => {
            mockPrisma.attendance.findFirst.mockResolvedValueOnce({ id: 1 });
            await expect(AttendanceService.createAttendance({
                scheduleId: 'sch1',
                userId: 'user1',
                status: 'masuk'
            })).rejects.toThrow('Attendance can only be done once');
        });

        it('should throw error if schedule not found', async () => {
            mockPrisma.attendance.findFirst.mockResolvedValueOnce(null);
            mockPrisma.schedule.findUnique.mockResolvedValueOnce(null);
            await expect(AttendanceService.createAttendance({
                scheduleId: 'sch1',
                userId: 'user1',
                status: 'masuk'
            })).rejects.toThrow('Schedule not found');
        });

        it('should throw error if attendance is not on the schedule date', async () => {
            mockPrisma.attendance.findFirst.mockResolvedValueOnce(null);
            mockPrisma.schedule.findUnique.mockResolvedValueOnce({
                id: 'sch1',
                date: new Date(Date.now() + 86400000), // Tomorrow
                class: { tutor: { id: 'tutor1' } }
            });
            await expect(AttendanceService.createAttendance({
                scheduleId: 'sch1',
                userId: 'user1',
                status: 'masuk'
            })).rejects.toThrow('Attendance can only be done on the schedule date');
        });

        it('should throw error if student tries to attend before tutor', async () => {
            mockPrisma.attendance.findFirst.mockResolvedValueOnce(null);
            mockPrisma.user.findUnique.mockResolvedValueOnce({ id: 'student1', role: 'siswa' });
            mockPrisma.schedule.findUnique.mockResolvedValueOnce({
                id: 'sch1',
                date: new Date(),
                class: { tutor: { id: 'tutor1' } }
            });
            mockPrisma.attendance.findFirst.mockResolvedValueOnce(null); // Tutor has not attended
            await expect(AttendanceService.createAttendance({
                scheduleId: 'sch1',
                userId: 'student1',
                status: 'masuk'
            })).rejects.toThrow('Tutors must take attendance first');
        });

        it('should create attendance successfully', async () => {
            mockPrisma.attendance.findFirst.mockResolvedValueOnce(null);
            mockPrisma.user.findUnique.mockResolvedValueOnce({ id: 'user1', role: 'tutor' });
            mockPrisma.schedule.findUnique.mockResolvedValueOnce({
                id: 'sch1',
                date: new Date(),
                class: { tutor: { id: 'tutor1' } }
            });
            mockPrisma.attendance.create.mockResolvedValueOnce({ id: 'att1' });

            const result = await AttendanceService.createAttendance({
                scheduleId: 'sch1',
                userId: 'user1',
                status: 'masuk'
            });

            expect(result).toEqual({ id: 'att1' });
        });
    });

    describe('markAlphaForMissedSchedules', () => {
        it('should mark alpha for all students and tutor', async () => {
            mockPrisma.schedule.findMany.mockResolvedValueOnce([
                {
                    id: 'sch1',
                    class: {
                        studentClasses: [
                            { user: { id: 'student1' } },
                            { user: { id: 'student2' } }
                        ],
                        tutorId: 'tutor1'
                    }
                }
            ]);

            await AttendanceService.markAlphaForMissedSchedules();

            expect(mockPrisma.attendance.create).toHaveBeenCalledWith({
                data: { scheduleId: 'sch1', userId: 'student1', status: 'alpha', reason: null }
            });
            expect(mockPrisma.attendance.create).toHaveBeenCalledWith({
                data: { scheduleId: 'sch1', userId: 'student2', status: 'alpha', reason: null }
            });
            expect(mockPrisma.attendance.create).toHaveBeenCalledWith({
                data: { scheduleId: 'sch1', userId: 'tutor1', status: 'alpha', reason: null }
            });

            expect(mockPrisma.attendance.create).toHaveBeenCalledTimes(3);
        });

        it('should not mark alpha if attendance already exists', async () => {
            mockPrisma.schedule.findMany.mockResolvedValueOnce([]);
            await AttendanceService.markAlphaForMissedSchedules();
            expect(mockPrisma.attendance.create).not.toHaveBeenCalled();
        });
    });

    describe('getAttendanceStatistics', () => {
        it('should return attendance statistics for classes', async () => {
            mockPrisma.class.findMany.mockResolvedValueOnce([
                {
                    id: 'cls1',
                    code: 'CLS1',
                    tutor: { id: 'tutor1', name: 'Tutor 1' },
                    studentClasses: [
                        { user: { id: 'student1', name: 'Student 1' } }
                    ],
                    schedules: [
                        { attendances: [{ userId: 'tutor1', status: 'masuk' }, { userId: 'student1', status: 'izin' }] }
                    ]
                }
            ]);

            const result = await AttendanceService.getAttendanceStatistics();

            expect(result[0]).toMatchObject({
                classId: 'cls1',
                classCode: 'CLS1',
                tutorStats: expect.objectContaining({ name: 'Tutor 1', masuk: 1 }),
                studentStats: [expect.objectContaining({ name: 'Student 1', izin: 1 })]
            });
        });
    });

    describe('getMyAttendanceStatistics', () => {
        it('should throw error if role is not supported', async () => {
            await expect(AttendanceService.getMyAttendanceStatistics({ id: 'user1', role: 'admin' }))
                .rejects.toThrow('Role not supported for this operation');
        });

        it('should return statistics for tutor', async () => {
            mockPrisma.class.findMany.mockResolvedValueOnce([
                {
                    id: 'cls1',
                    code: 'CLS1',
                    schedules: [
                        { attendances: [{ userId: 'tutor1', status: 'masuk' }] }
                    ],
                    order: {
                        groupType: { price: 10000 },
                        bimbelPackage: { name: 'Paket A', level: 'SMA' }
                    }
                }
            ]);
            mockPrisma.salary.findFirst.mockResolvedValueOnce({ status: 'paid' });

            const result = await AttendanceService.getMyAttendanceStatistics({ id: 'tutor1', role: 'tutor', name: 'Tutor 1' });

            expect(result[0]).toHaveProperty('tutorStats.status', 'paid');
        });

        it('should return statistics for student', async () => {
            mockPrisma.studentClass.findMany.mockResolvedValueOnce([
                {
                    class: {
                        id: 'cls2',
                        code: 'CLS2',
                        schedules: [
                            { attendances: [{ userId: 'student1', status: 'masuk' }] }
                        ],
                        tutor: { id: 'tutor2', name: 'Tutor 2' },
                        order: {
                            bimbelPackage: { name: 'Paket B', level: 'SMA' }
                        }
                    }
                }
            ]);

            const result = await AttendanceService.getMyAttendanceStatistics({ id: 'student1', role: 'siswa', name: 'Student 1' });

            expect(result[0]).toMatchObject({
                classId: 'cls2',
                classCode: 'CLS2',
                bimbelPackage: { name: 'Paket B', level: 'SMA' },
                tutorStats: expect.objectContaining({ name: 'Tutor 2' }),
                studentStats: expect.objectContaining({ masuk: 1 })
            });
        });
    });

    describe('getRekapKelasById', () => {
        it('should throw error if class not found', async () => {
            mockPrisma.class.findUnique.mockResolvedValueOnce(null);
            await expect(AttendanceService.getRekapKelasById('cls999')).rejects.toThrow('Kelas tidak ditemukan');
        });

        it('should return rekap data for class', async () => {
            mockPrisma.class.findUnique.mockResolvedValueOnce({
                id: 'cls1',
                code: 'CLS1',
                schedules: [
                    { attendances: [{ userId: 'tutor1', status: 'masuk' }, { userId: 'student1', status: 'izin' }] }
                ],
                tutor: { id: 'tutor1', name: 'Tutor 1' },
                order: { bimbelPackage: { name: 'Paket A', level: 'SMA' } },
                studentClasses: [
                    { user: { id: 'student1', name: 'Student 1' } }
                ]
            });

            const result = await AttendanceService.getRekapKelasById('cls1');

            expect(result).toMatchObject({
                name: 'Paket A',
                level: 'SMA',
                classCode: 'CLS1',
                tutorName: 'Tutor 1',
                tutorMasuk: 1,
                tutorIzin: 0,
                tutorAlpha: 0,
                students: [expect.objectContaining({ name: 'Student 1', izin: 1 })],
                pertemuan: 1,
                kosong: 0,
                progress: 100,
                absensi: 100
            });
        });
    });
});
