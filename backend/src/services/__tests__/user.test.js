import { jest } from '@jest/globals';

// ==== MOCK DATA ====
const mockUser = {
    id: 1,
    name: 'Test User',
    email: 'test@mail.com',
    password: 'hashedpass',
    role: 'siswa',
    googleId: null,
    verified: true,
    createdAt: new Date(),
    students: [{ level: 'SMA' }],
    tutors: [],
    _count: { class: 2, studentClass: 3 }
};

const mockTutor = {
    id: 2,
    name: 'Tutor User',
    email: 'tutor@mail.com',
    password: 'hashedpass',
    role: 'tutor',
    googleId: null,
    verified: true,
    createdAt: new Date(),
    students: [],
    tutors: [{
        subjects: 'Math',
        teachLevel: 'SMA',
        description: 'desc',
        photo: 'photo.jpg',
        tutorDay: [{ day: { daysName: 'Senin' } }]
    }],
    _count: { class: 5 }
};

const mockStudent = {
    id: 3,
    name: 'Student User',
    email: 'student@mail.com',
    password: 'hashedpass',
    role: 'siswa',
    googleId: null,
    verified: true,
    createdAt: new Date(),
    students: [{ level: 'SMP' }],
    tutors: [],
    _count: { studentClass: 4 }
};

// ==== MOCK PRISMA ====
const mockPrisma = {
    user: {
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn()
    },
    student: {
        create: jest.fn(),
        update: jest.fn()
    },
    tutor: {
        create: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn()
    },
    notification: {
        create: jest.fn()
    },
    tutorDay: {
        deleteMany: jest.fn(),
        create: jest.fn()
    },
    day: {
        findFirst: jest.fn()
    },
    bimbelPackage: {
        count: jest.fn()
    }
};

// ==== MOCK MODULES ====
jest.unstable_mockModule('../../utils/db.js', () => ({
    prisma: mockPrisma
}));

const mockHashPassword = jest.fn(async (pw) => 'hashed_' + pw);
const mockSendUserVerificationOtp = jest.fn();
const mockSavePhoto = jest.fn();

jest.unstable_mockModule('../auth.js', () => ({
    AuthService: {
        hashPassword: mockHashPassword
    }
}));

jest.unstable_mockModule('../otp.js', () => ({
    OtpService: {
        sendUserVerificationOtp: mockSendUserVerificationOtp
    }
}));

jest.unstable_mockModule('../../utils/error.js', () => ({
    HttpError: class HttpError extends Error {
        constructor(status, data) {
            super(data?.message || 'error');
            this.statusCode = status;
            this.data = data;
        }
    }
}));

jest.unstable_mockModule('../../utils/helper.js', () => ({
    savePhoto: mockSavePhoto
}));

// ==== IMPORTS ====
const { UserService } = await import('../user.js');
const { HttpError } = await import('../../utils/error.js');

// ==== SETUP ====
beforeEach(() => {
    jest.clearAllMocks();
});

// ==== TESTS ====
describe('UserService', () => {
    // --- createStudent ---
    describe('createStudent', () => {
        it('should throw if verified user exists', async () => {
            mockPrisma.user.findFirst.mockResolvedValueOnce({ ...mockUser, verified: true });
            await expect(UserService.createStudent({
                name: 'A', email: 'a@mail.com', password: 'pw'
            })).rejects.toThrow(HttpError);
        });

        it('should throw if unverified user exists', async () => {
            mockPrisma.user.findFirst
                .mockResolvedValueOnce(null)
                .mockResolvedValueOnce({ ...mockUser, verified: false });
            await expect(UserService.createStudent({
                name: 'A', email: 'a@mail.com', password: 'pw'
            })).rejects.toThrow(HttpError);
        });

        it('should create user, student, and send OTP', async () => {
            mockPrisma.user.findFirst
                .mockResolvedValueOnce(null)
                .mockResolvedValueOnce(null);
            mockPrisma.user.create.mockResolvedValueOnce({ ...mockUser, id: 10 });
            mockPrisma.student.create.mockResolvedValueOnce({});
            mockSendUserVerificationOtp.mockResolvedValueOnce();

            const result = await UserService.createStudent({
                name: 'A', email: 'a@mail.com', password: 'pw'
            });

            expect(mockPrisma.user.create).toHaveBeenCalled();
            expect(mockPrisma.student.create).toHaveBeenCalledWith({ data: { userId: 10 } });
            expect(mockSendUserVerificationOtp).toHaveBeenCalled();
            expect(result).toHaveProperty('id', 10);
        });

        it('should create user and student with password null if password not provided', async () => {
            mockPrisma.user.findFirst.mockResolvedValueOnce(null);
            mockPrisma.user.findFirst.mockResolvedValueOnce(null);
            mockPrisma.user.create.mockResolvedValueOnce({ ...mockUser, id: 11, password: null });
            mockPrisma.student.create.mockResolvedValueOnce({});
            mockSendUserVerificationOtp.mockResolvedValueOnce();

            const result = await UserService.createStudent({
                name: 'NoPass', email: 'nopass@mail.com'
            });

            expect(mockPrisma.user.create).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({ password: null })
            }));
            expect(result).toHaveProperty('id', 11);
        });
    });

    // --- createUserWithRole ---
    describe('createUserWithRole', () => {
        it('should throw if role is not tutor or admin', async () => {
            await expect(UserService.createUserWithRole({
                name: 'A', email: 'a@mail.com', password: 'pw', role: 'siswa'
            })).rejects.toThrow(HttpError);
        });

        it('should throw if user already exists', async () => {
            mockPrisma.user.findFirst.mockResolvedValueOnce({ ...mockUser });
            await expect(UserService.createUserWithRole({
                name: 'A', email: 'a@mail.com', password: 'pw', role: 'admin'
            })).rejects.toThrow(HttpError);
        });

        it('should create admin user', async () => {
            mockPrisma.user.findFirst.mockResolvedValueOnce(null);
            mockPrisma.user.create.mockResolvedValueOnce({ ...mockUser, role: 'admin', id: 20 });

            const result = await UserService.createUserWithRole({
                name: 'A', email: 'a@mail.com', password: 'pw', role: 'admin'
            });

            expect(mockPrisma.user.create).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({ name: 'A', email: 'a@mail.com', role: 'admin' })
            }));
            expect(result).toHaveProperty('role', 'admin');
        });

        it('should create tutor user and related data', async () => {
            mockPrisma.user.findFirst.mockResolvedValueOnce(null);
            mockPrisma.user.create.mockResolvedValueOnce({ ...mockTutor, id: 30 });
            mockPrisma.tutor.create.mockResolvedValueOnce({});
            mockPrisma.notification.create.mockResolvedValueOnce({});

            const result = await UserService.createUserWithRole({
                name: 'Tutor', email: 'tutor@mail.com', password: 'pw', role: 'tutor', subjects: 'Math'
            });

            expect(mockPrisma.tutor.create).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({ userId: 30, subjects: 'Math' })
            }));
            expect(mockPrisma.notification.create).toHaveBeenCalled();
            expect(result).toHaveProperty('role', 'tutor');
        });
    });

    // --- updateUser ---
    describe('updateUser', () => {
        it('should update user and student if role siswa', async () => {
            mockPrisma.user.update.mockResolvedValueOnce({});
            mockPrisma.student.update.mockResolvedValueOnce({});
            mockPrisma.user.findUnique.mockResolvedValueOnce({ ...mockUser, id: 1 });

            const result = await UserService.updateUser({
                id: 1, name: 'Updated', email: 'updated@mail.com', role: 'siswa', level: 'SMA'
            });

            expect(mockPrisma.user.update).toHaveBeenCalled();
            expect(mockPrisma.student.update).toHaveBeenCalled();
            expect(result).toHaveProperty('id', 1);
        });

        it('should update user and tutor if role tutor', async () => {
            mockPrisma.user.update.mockResolvedValueOnce({});
            mockPrisma.tutor.update.mockResolvedValueOnce({});
            mockPrisma.user.findUnique.mockResolvedValueOnce({ ...mockTutor, id: 2 });

            const result = await UserService.updateUser({
                id: 2, name: 'Tutor', email: 'tutor@mail.com', role: 'tutor', subjects: 'Math'
            });

            expect(mockPrisma.user.update).toHaveBeenCalled();
            expect(mockPrisma.tutor.update).toHaveBeenCalled();
            expect(result).toHaveProperty('id', 2);
        });

        it('should update only user if no role', async () => {
            mockPrisma.user.update.mockResolvedValueOnce({});
            mockPrisma.user.findUnique.mockResolvedValueOnce({ ...mockUser, id: 1 });

            const result = await UserService.updateUser({
                id: 1, name: 'Updated', email: 'updated@mail.com'
            });

            expect(mockPrisma.user.update).toHaveBeenCalled();
            expect(result).toHaveProperty('id', 1);
        });

        it('should remove undefined fields from update payload', async () => {
            mockPrisma.user.update.mockResolvedValueOnce({});
            mockPrisma.user.findUnique.mockResolvedValueOnce({ ...mockUser, id: 1 });

            const result = await UserService.updateUser({
                id: 1,
                name: undefined,
                email: 'updated@mail.com'
            });

            expect(mockPrisma.user.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: {
                    email: 'updated@mail.com'
                }
            });
            expect(result).toHaveProperty('id', 1);
        });

        it('should update tutor days if daysName is provided', async () => {
            mockPrisma.user.update.mockResolvedValueOnce({});
            mockPrisma.tutor.update.mockResolvedValueOnce({});
            mockPrisma.user.findUnique.mockResolvedValueOnce({ ...mockTutor, id: 2 });
            mockPrisma.tutor.findUnique.mockResolvedValueOnce({ id: 2 });
            mockPrisma.tutorDay.deleteMany.mockResolvedValueOnce({});
            mockPrisma.day.findFirst.mockResolvedValueOnce({ id: 1, daysName: 'Senin' });
            mockPrisma.tutorDay.create.mockResolvedValueOnce({});

            const result = await UserService.updateUser({
                id: 2,
                name: 'Tutor',
                email: 'tutor@mail.com',
                role: 'tutor',
                subjects: 'Math',
                daysName: ['Senin']
            });

            expect(mockPrisma.tutorDay.deleteMany).toHaveBeenCalled();
            expect(mockPrisma.day.findFirst).toHaveBeenCalledWith({ where: { daysName: 'Senin' } });
            expect(mockPrisma.tutorDay.create).toHaveBeenCalledWith({
                data: { tutorId: 2, daysId: 1 }
            });
            expect(result).toHaveProperty('id', 2);
        });

        it('should update photo if file is provided', async () => {
            mockPrisma.user.update.mockResolvedValueOnce({});
            mockPrisma.tutor.update.mockResolvedValueOnce({});
            mockPrisma.user.findUnique.mockResolvedValueOnce({ ...mockTutor, id: 2 });
            mockSavePhoto.mockResolvedValueOnce('/public/photo.jpg');

            const file = { originalname: 'photo.jpg', path: '/tmp/photo.jpg' };

            const result = await UserService.updateUser({
                id: 2,
                name: 'Tutor',
                email: 'tutor@mail.com',
                role: 'tutor',
                subjects: 'Math'
            }, file);

            expect(mockSavePhoto).toHaveBeenCalled();
            expect(result).toHaveProperty('id', 2);
        });

        it('should use userDb.name as userName if not provided when saving photo', async () => {
            // Simulate no name in payload, so userDb.name is used
            mockPrisma.user.findUnique.mockResolvedValueOnce({ name: 'DbName' });
            mockSavePhoto.mockResolvedValueOnce('/public/photo.jpg');
            mockPrisma.user.update.mockResolvedValueOnce({});
            mockPrisma.tutor.update.mockResolvedValueOnce({});
            mockPrisma.user.findUnique.mockResolvedValueOnce({ ...mockTutor, id: 2 });

            const file = { originalname: 'photo.jpg', path: '/tmp/photo.jpg' };

            const result = await UserService.updateUser({
            id: 2,
            email: 'tutor@mail.com',
            role: 'tutor',
            subjects: 'Math'
            // no name in payload
            }, file);

            expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 2 } });
            expect(mockSavePhoto).toHaveBeenCalledWith(file, 'DbName');
            expect(result).toHaveProperty('id', 2);
        });

        it('should use id as userName if userDb.name is falsy when saving photo', async () => {
            // Simulate userDb.name is undefined, so id is used
            mockPrisma.user.findUnique.mockResolvedValueOnce({ name: undefined });
            mockSavePhoto.mockResolvedValueOnce('/public/photo.jpg');
            mockPrisma.user.update.mockResolvedValueOnce({});
            mockPrisma.tutor.update.mockResolvedValueOnce({});
            mockPrisma.user.findUnique.mockResolvedValueOnce({ ...mockTutor, id: 2 });

            const file = { originalname: 'photo.jpg', path: '/tmp/photo.jpg' };

            const result = await UserService.updateUser({
            id: 2,
            email: 'tutor@mail.com',
            role: 'tutor',
            subjects: 'Math'
            // no name in payload
            }, file);

            expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 2 } });
            expect(mockSavePhoto).toHaveBeenCalledWith(file, 2);
            expect(result).toHaveProperty('id', 2);
        });

        it('should use "tutor" as userName if userDb.name and id are falsy when saving photo', async () => {
            // Simulate userDb.name and id are undefined/null, so 'tutor' is used
            mockPrisma.user.findUnique.mockResolvedValueOnce({ name: undefined });
            mockSavePhoto.mockResolvedValueOnce('/public/photo.jpg');
            mockPrisma.user.update.mockResolvedValueOnce({});
            mockPrisma.tutor.update.mockResolvedValueOnce({});
            mockPrisma.user.findUnique.mockResolvedValueOnce({ ...mockTutor, id: undefined });

            const file = { originalname: 'photo.jpg', path: '/tmp/photo.jpg' };

            const result = await UserService.updateUser({
            id: undefined,
            email: 'tutor@mail.com',
            role: 'tutor',
            subjects: 'Math'
            // no name in payload
            }, file);

            expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { id: undefined } });
            expect(mockSavePhoto).toHaveBeenCalledWith(file, 'tutor');
            expect(result).toHaveProperty('id', undefined);
        });
    });

    // --- updateUser branch coverage ---
    describe('updateUser branch coverage', () => {
        it('should NOT update user if no name, email, googleId, or password', async () => {
            mockPrisma.user.update.mockResolvedValueOnce({});
            mockPrisma.user.findUnique.mockResolvedValueOnce({ ...mockUser, id: 1 });

            const result = await UserService.updateUser({ id: 1, role: 'admin' });
            expect(mockPrisma.user.update).not.toHaveBeenCalled();
            expect(result).toHaveProperty('id', 1);
        });

        it('should not update student/tutor if role is not siswa/tutor', async () => {
            mockPrisma.user.update.mockResolvedValueOnce({});
            mockPrisma.user.findUnique.mockResolvedValueOnce({ ...mockUser, id: 1 });

            const result = await UserService.updateUser({ id: 1, name: 'A', role: 'admin' });
            expect(mockPrisma.student.update).not.toHaveBeenCalled();
            expect(mockPrisma.tutor.update).not.toHaveBeenCalled();
            expect(result).toHaveProperty('id', 1);
        });
    });

    // --- getTutorsSortedByClassCount ---
    describe('getTutorsSortedByClassCount', () => {
        it('should return tutors sorted by class count', async () => {
            mockPrisma.user.findMany.mockResolvedValueOnce([
                { id: 2, name: 'Tutor', _count: { class: 5 } }
            ]);
            mockPrisma.tutor.findMany.mockResolvedValueOnce([
                { userId: 2, subjects: 'Math', teachLevel: 'SMA', description: 'desc', photo: 'photo.jpg' }
            ]);
            const result = await UserService.getTutorsSortedByClassCount();
            expect(result[0]).toMatchObject({
                id: 2,
                name: 'Tutor',
                subject: 'Math',
                teachLevel: 'SMA',
                description: 'desc',
                photo: 'photo.jpg',
                classCount: 5
            });
        });

        it('should return null for tutor details if not found', async () => {
            mockPrisma.user.findMany.mockResolvedValueOnce([
                { id: 99, name: 'NoDetailTutor', _count: { class: 0 } }
            ]);
            mockPrisma.tutor.findMany.mockResolvedValueOnce([]);

            const result = await UserService.getTutorsSortedByClassCount();
            expect(result[0]).toMatchObject({
                id: 99,
                name: 'NoDetailTutor',
                subject: null,
                teachLevel: null,
                description: null,
                photo: null,
                classCount: 0
            });
        });
    });

    // --- getUserById ---
    describe('getUserById', () => {
        it('should return user if found', async () => {
            mockPrisma.user.findUnique.mockResolvedValueOnce({ ...mockTutor, id: 2 });
            const result = await UserService.getUserById(2);
            expect(result).toHaveProperty('id', 2);
            expect(result.tutors[0]).toHaveProperty('daysName', ['Senin']);
        });

        it('should throw if user not found', async () => {
            mockPrisma.user.findUnique.mockResolvedValueOnce(null);
            await expect(UserService.getUserById(999)).rejects.toThrow(HttpError);
        });
    });

    // --- getTopStudents ---
    describe('getTopStudents', () => {
        it('should return top students', async () => {
            mockPrisma.user.findMany.mockResolvedValueOnce([
                { id: 3, name: 'Student', students: [{ level: 'SMP' }], _count: { studentClass: 4 } }
            ]);
            const result = await UserService.getTopStudents();
            expect(result[0]).toMatchObject({
                id: 3,
                name: 'Student',
                level: 'SMP',
                classCount: 4
            });
        });

        it('should handle student with no students or classCount', async () => {
            mockPrisma.user.findMany.mockResolvedValueOnce([
                { id: 5, name: 'NoClassStudent', students: [], _count: {} }
            ]);
            const result = await UserService.getTopStudents();
            expect(result[0]).toMatchObject({
                id: 5,
                name: 'NoClassStudent',
                level: null,
                classCount: 0
            });
        });
    });

    // --- getNewStudents ---
    describe('getNewStudents', () => {
        it('should return paginated new students', async () => {
            mockPrisma.user.findMany.mockResolvedValueOnce([
                { id: 4, name: 'New Student', createdAt: new Date(), students: [{ level: 'SMA' }], _count: { studentClass: 2 } }
            ]);
            mockPrisma.user.count.mockResolvedValueOnce(1);

            const result = await UserService.getNewStudents({ page: 1, pageSize: 1 });
            expect(result.data[0]).toMatchObject({
                id: 4,
                name: 'New Student',
                level: 'SMA',
                classCount: 2
            });
            expect(result.total).toBe(1);
            expect(result.page).toBe(1);
            expect(result.pageSize).toBe(1);
        });

        it('should use default pagination when no params given', async () => {
            mockPrisma.user.findMany.mockResolvedValueOnce([]);
            mockPrisma.user.count.mockResolvedValueOnce(0);

            const result = await UserService.getNewStudents();
            expect(result.data).toEqual([]);
            expect(result.total).toBe(0);
            expect(result.page).toBe(1);
            expect(result.pageSize).toBe(10);
        });

        it('should handle new student with no students or classCount', async () => {
            mockPrisma.user.findMany.mockResolvedValueOnce([
                { id: 6, name: 'NoClassStudent', createdAt: new Date(), students: [], _count: {} }
            ]);
            mockPrisma.user.count.mockResolvedValueOnce(1);

            const result = await UserService.getNewStudents({ page: 1, pageSize: 1 });
            expect(result.data[0]).toMatchObject({
                id: 6,
                name: 'NoClassStudent',
                level: null,
                classCount: 0
            });
        });
    });

    // --- getStatistics ---
    describe('getStatistics', () => {
        it('should return correct statistics', async () => {
            mockPrisma.user.count.mockResolvedValueOnce(10); // tutorCount
            mockPrisma.user.count.mockResolvedValueOnce(20); // studentCount
            mockPrisma.bimbelPackage.count.mockResolvedValueOnce(30); // packageCount
            mockPrisma.bimbelPackage.count.mockResolvedValueOnce(15); // activePackageCount

            const result = await UserService.getStatistics();

            expect(result).toEqual({
                tutorCount: 10,
                studentCount: 20,
                packageCount: 30,
                activePackageCount: 15
            });
        });

        it('should handle zero counts gracefully', async () => {
            mockPrisma.user.count.mockResolvedValueOnce(0); // tutorCount
            mockPrisma.user.count.mockResolvedValueOnce(0); // studentCount
            mockPrisma.bimbelPackage.count.mockResolvedValueOnce(0); // packageCount
            mockPrisma.bimbelPackage.count.mockResolvedValueOnce(0); // activePackageCount

            const result = await UserService.getStatistics();

            expect(result).toEqual({
                tutorCount: 0,
                studentCount: 0,
                packageCount: 0,
                activePackageCount: 0
            });
        });
    });
});