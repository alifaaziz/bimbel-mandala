import { jest } from '@jest/globals';

const mockPrisma = {
  user: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    delete: jest.fn()
  },
  student: {
    create: jest.fn(),
    update: jest.fn(),
    deleteMany: jest.fn()
  },
  tutor: {
    create: jest.fn(),
    update: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    deleteMany: jest.fn()
  },
  notification: {
    create: jest.fn(),
    deleteMany: jest.fn()
  },
  tutorDay: {
    deleteMany: jest.fn(),
    create: jest.fn()
  },
  day: {
    findFirst: jest.fn()
  },
  attendance: { deleteMany: jest.fn() },
  studentClass: { deleteMany: jest.fn() },
  bimbelPackage: {
    count: jest.fn(),
    findMany: jest.fn(),
    delete: jest.fn()
  },
  groupType: { findMany: jest.fn(), deleteMany: jest.fn() },
  order: { deleteMany: jest.fn(), findMany: jest.fn() },
  packageDay: { deleteMany: jest.fn() },
  passwordReset: { deleteMany: jest.fn() },
  otp: { deleteMany: jest.fn() },
  salary: { deleteMany: jest.fn() },
  class: { deleteMany: jest.fn() }
};

const mockAuthService = {
  hashPassword: jest.fn(async pw => 'hashed_' + pw)
};
const mockOtpService = { sendUserVerificationOtp: jest.fn() };
const mockSavePhoto = jest.fn(async () => '/photo/path.jpg');
const mockHttpError = class HttpError extends Error {
  constructor(status, data) {
    super(data?.message || 'error');
    this.statusCode = status;
    this.data = data;
  }
};

jest.unstable_mockModule('../../utils/db.js', () => ({
  prisma: mockPrisma
}));
jest.unstable_mockModule('../auth.js', () => ({
  AuthService: mockAuthService
}));
jest.unstable_mockModule('../otp.js', () => ({
  OtpService: mockOtpService
}));
jest.unstable_mockModule('../../utils/helper.js', () => ({
  savePhoto: mockSavePhoto
}));
jest.unstable_mockModule('../../utils/error.js', () => ({
  HttpError: mockHttpError
}));

const { UserService } = await import('../user.js');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('UserService', () => {
  describe('createStudent', () => {
    it('throws if verified user exists', async () => {
      mockPrisma.user.findFirst.mockResolvedValueOnce({ id: 1 }); // verified user
      await expect(UserService.createStudent({
        name: 'A', email: 'a@mail.com', password: 'pw', role: 'siswa'
      })).rejects.toThrow('Email already exists');
    });

    it('throws if unverified user exists', async () => {
      mockPrisma.user.findFirst
        .mockResolvedValueOnce(null) // verified
        .mockResolvedValueOnce({ id: 2 }); // unverified
      await expect(UserService.createStudent({
        name: 'A', email: 'a@mail.com', password: 'pw', role: 'siswa'
      })).rejects.toThrow('Email already exists but not verified');
    });

    it('creates user and student, sends OTP if not skipOtp', async () => {
      mockPrisma.user.findFirst
        .mockResolvedValueOnce(null) // verified
        .mockResolvedValueOnce(null); // unverified
      mockPrisma.user.create.mockResolvedValueOnce({ id: 3, name: 'A', email: 'a@mail.com' });
      mockPrisma.student.create.mockResolvedValueOnce({});
      await UserService.createStudent({
        name: 'A', email: 'a@mail.com', password: 'pw', role: 'siswa'
      });
      expect(mockPrisma.user.create).toHaveBeenCalled();
      expect(mockPrisma.student.create).toHaveBeenCalled();
      expect(mockOtpService.sendUserVerificationOtp).toHaveBeenCalled();
    });

    it('creates user and student, does not send OTP if skipOtp', async () => {
      mockPrisma.user.findFirst
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);
      mockPrisma.user.create.mockResolvedValueOnce({ id: 4, name: 'A', email: 'a@mail.com' });
      mockPrisma.student.create.mockResolvedValueOnce({});
      await UserService.createStudent({
        name: 'A', email: 'a@mail.com', password: 'pw', role: 'siswa'
      }, { skipOtp: true });
      expect(mockOtpService.sendUserVerificationOtp).not.toHaveBeenCalled();
    });

    it('creates user with hashed password if password is provided', async () => {
      mockPrisma.user.findFirst.mockResolvedValueOnce(null); // verified
      mockPrisma.user.findFirst.mockResolvedValueOnce(null); // unverified
      mockPrisma.user.create.mockResolvedValueOnce({ id: 10, name: 'A', email: 'a@mail.com' });
      mockPrisma.student.create.mockResolvedValueOnce({});
      await UserService.createStudent({
        name: 'A', email: 'a@mail.com', password: 'pw', role: 'siswa'
      });
      expect(mockAuthService.hashPassword).toHaveBeenCalledWith('pw');
      expect(mockPrisma.user.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({ password: 'hashed_pw' })
      }));
    });
    
    it('creates user with null password if password is not provided', async () => {
      mockPrisma.user.findFirst.mockResolvedValueOnce(null); // verified
      mockPrisma.user.findFirst.mockResolvedValueOnce(null); // unverified
      mockPrisma.user.create.mockResolvedValueOnce({ id: 11, name: 'B', email: 'b@mail.com' });
      mockPrisma.student.create.mockResolvedValueOnce({});
      await UserService.createStudent({
        name: 'B', email: 'b@mail.com', role: 'siswa'
      });
      expect(mockAuthService.hashPassword).not.toHaveBeenCalled();
      expect(mockPrisma.user.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({ password: null })
      }));
    });
  });

  describe('createUserWithRole', () => {
    it('throws if role is not tutor or admin', async () => {
      await expect(UserService.createUserWithRole({
        name: 'A', email: 'a@mail.com', password: 'pw', role: 'siswa'
      })).rejects.toThrow('Invalid role for this function');
    });

    it('throws if email already exists', async () => {
      mockPrisma.user.findFirst.mockResolvedValueOnce({ id: 1 });
      await expect(UserService.createUserWithRole({
        name: 'A', email: 'a@mail.com', password: 'pw', role: 'tutor'
      })).rejects.toThrow('Email already exists');
    });

    it('creates tutor and notification if role is tutor', async () => {
      mockPrisma.user.findFirst.mockResolvedValueOnce(null);
      mockPrisma.user.create.mockResolvedValueOnce({ id: 2, name: 'T', email: 't@mail.com' });
      mockPrisma.tutor.create.mockResolvedValueOnce({});
      mockPrisma.notification.create.mockResolvedValueOnce({});
      const result = await UserService.createUserWithRole({
        name: 'T', email: 't@mail.com', password: 'pw', role: 'tutor', school: 'SMA'
      });
      expect(mockPrisma.tutor.create).toHaveBeenCalled();
      expect(mockPrisma.notification.create).toHaveBeenCalled();
      expect(result).toMatchObject({ id: 2, name: 'T' });
    });

    it('creates user only if role is admin', async () => {
      mockPrisma.user.findFirst.mockResolvedValueOnce(null);
      mockPrisma.user.create.mockResolvedValueOnce({ id: 3, name: 'Admin', email: 'admin@mail.com' });
      const result = await UserService.createUserWithRole({
        name: 'Admin', email: 'admin@mail.com', password: 'pw', role: 'admin'
      });
      expect(mockPrisma.tutor.create).not.toHaveBeenCalled();
      expect(result).toMatchObject({ id: 3, name: 'Admin' });
    });

    it('creates tutor with photo if file is provided', async () => {
      mockPrisma.user.findFirst.mockResolvedValueOnce(null);
      mockPrisma.user.create.mockResolvedValueOnce({ id: 20, name: 'T', email: 't@mail.com' });
      mockPrisma.tutor.create.mockResolvedValueOnce({});
      mockPrisma.notification.create.mockResolvedValueOnce({});
      const file = { buffer: Buffer.from('img'), originalname: 'img.jpg' };
      await UserService.createUserWithRole({
        name: 'T', email: 't@mail.com', password: 'pw', role: 'tutor', school: 'SMA'
      }, file);
      expect(mockSavePhoto).toHaveBeenCalledWith(file, 'T');
      expect(mockPrisma.tutor.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({ photo: '/photo/path.jpg' })
      }));
    });
    
    it('creates tutor without photo if file is not provided', async () => {
      mockPrisma.user.findFirst.mockResolvedValueOnce(null);
      mockPrisma.user.create.mockResolvedValueOnce({ id: 21, name: 'T2', email: 't2@mail.com' });
      mockPrisma.tutor.create.mockResolvedValueOnce({});
      mockPrisma.notification.create.mockResolvedValueOnce({});
      await UserService.createUserWithRole({
        name: 'T2', email: 't2@mail.com', password: 'pw', role: 'tutor', school: 'SMA'
      });
      expect(mockSavePhoto).not.toHaveBeenCalled();
      expect(mockPrisma.tutor.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.not.objectContaining({ photo: expect.anything() })
      }));
    });

    it('creates tutorDay for each valid day in days array', async () => {
      mockPrisma.user.findFirst.mockResolvedValueOnce(null);
      mockPrisma.user.create.mockResolvedValueOnce({ id: 30, name: 'T', email: 't@mail.com' });
      mockPrisma.tutor.create.mockResolvedValueOnce({ id: 300 });
      mockPrisma.notification.create.mockResolvedValueOnce({});
      mockPrisma.day.findFirst
        .mockResolvedValueOnce({ id: 1, daysName: 'Senin' })
        .mockResolvedValueOnce({ id: 2, daysName: 'Selasa' });
      mockPrisma.tutorDay.create.mockResolvedValue({});
      await UserService.createUserWithRole({
        name: 'T', email: 't@mail.com', password: 'pw', role: 'tutor', days: ['Senin', 'Selasa']
      });
      expect(mockPrisma.tutorDay.create).toHaveBeenCalledTimes(2);
      expect(mockPrisma.tutorDay.create).toHaveBeenCalledWith({ data: { tutorId: 300, daysId: 1 } });
      expect(mockPrisma.tutorDay.create).toHaveBeenCalledWith({ data: { tutorId: 300, daysId: 2 } });
    });
    
    it('does not create tutorDay for days that do not exist', async () => {
      mockPrisma.user.findFirst.mockResolvedValueOnce(null);
      mockPrisma.user.create.mockResolvedValueOnce({ id: 31, name: 'T', email: 't@mail.com' });
      mockPrisma.tutor.create.mockResolvedValueOnce({ id: 301 });
      mockPrisma.notification.create.mockResolvedValueOnce({});
      mockPrisma.day.findFirst
        .mockResolvedValueOnce({ id: 1, daysName: 'Senin' })
        .mockResolvedValueOnce(null);
      mockPrisma.tutorDay.create.mockResolvedValue({});
      await UserService.createUserWithRole({
        name: 'T', email: 't@mail.com', password: 'pw', role: 'tutor', days: ['Senin', 'Rabu']
      });
      expect(mockPrisma.tutorDay.create).toHaveBeenCalledTimes(1);
      expect(mockPrisma.tutorDay.create).toHaveBeenCalledWith({ data: { tutorId: 301, daysId: 1 } });
    });
  });

  describe('updateUser', () => {
    it('updates user fields if provided', async () => {
      mockPrisma.user.update.mockResolvedValueOnce({});
      mockPrisma.user.findUnique.mockResolvedValueOnce({ id: 1, name: 'A' });
      mockPrisma.user.findUnique.mockResolvedValueOnce({ id: 1, name: 'A', students: [], tutors: [] });
      const result = await UserService.updateUser({
        id: 1, name: 'A', email: 'a@mail.com', password: 'pw', role: 'siswa', level: 'Dasar'
      });
      expect(mockPrisma.user.update).toHaveBeenCalled();
      expect(result).toMatchObject({ id: 1, name: 'A' });
    });

    it('updates student if role is siswa', async () => {
      mockPrisma.user.findUnique.mockReset();
      mockPrisma.user.findUnique
        .mockResolvedValueOnce({ id: 2, name: 'B' }) // untuk ambil nama user (jika perlu)
        .mockResolvedValueOnce({ id: 2, name: 'B', students: [], tutors: [] }); // untuk return akhir
      mockPrisma.student.update.mockResolvedValueOnce({});
      const result = await UserService.updateUser({
        id: 2, role: 'siswa', level: 'Dasar', address: 'Jl. A'
      });
      expect(mockPrisma.student.update).toHaveBeenCalled();
      expect(result).toMatchObject({ id: 2, name: 'B' });
    });

    it('updates tutor and tutorDay if role is tutor and daysName provided', async () => {
      mockPrisma.user.findUnique.mockReset();
      mockPrisma.user.findUnique
        .mockResolvedValueOnce({ id: 3, name: 'C' }) // untuk ambil nama user (jika perlu)
        .mockResolvedValueOnce({ id: 3, name: 'C', students: [], tutors: [] }); // untuk return akhir
      mockPrisma.tutor.update.mockResolvedValueOnce({});
      mockPrisma.tutor.findUnique.mockResolvedValueOnce({ id: 10 });
      mockPrisma.tutorDay.deleteMany.mockResolvedValueOnce({});
      mockPrisma.day.findFirst.mockResolvedValueOnce({ id: 20 });
      mockPrisma.tutorDay.create.mockResolvedValueOnce({});
      const result = await UserService.updateUser({
        id: 3, role: 'tutor', school: 'SMA', daysName: ['Senin']
      });
      expect(mockPrisma.tutor.update).toHaveBeenCalled();
      expect(mockPrisma.tutorDay.create).toHaveBeenCalled();
      expect(result).toMatchObject({ id: 3, name: 'C' });
    });

    it('updates photo if file provided', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({ id: 4, name: 'D' });
      mockPrisma.user.findUnique.mockResolvedValueOnce({ id: 4, name: 'D', students: [], tutors: [] });
      const file = { buffer: Buffer.from('img'), originalname: 'img.jpg' };
      await UserService.updateUser({ id: 4, role: 'tutor', school: 'SMA' }, file);
      expect(mockSavePhoto).toHaveBeenCalled();
    });

    it('creates tutorDay only for days that exist', async () => {
      mockPrisma.user.findUnique.mockReset();
      mockPrisma.user.findUnique
        .mockResolvedValueOnce({ id: 5, name: 'Tutor5' })
        .mockResolvedValueOnce({ id: 5, name: 'Tutor5', students: [], tutors: [] });
      mockPrisma.tutor.update.mockResolvedValueOnce({});
      mockPrisma.tutor.findUnique.mockResolvedValueOnce({ id: 50 });
      mockPrisma.tutorDay.deleteMany.mockResolvedValueOnce({});
      mockPrisma.day.findFirst
        .mockResolvedValueOnce({ id: 100, daysName: 'Senin' }) 
        .mockResolvedValueOnce(null); 
      mockPrisma.tutorDay.create.mockResolvedValueOnce({});
      await UserService.updateUser({
        id: 5, role: 'tutor', school: 'SMA', daysName: ['Senin', 'Selasa']
      });
      expect(mockPrisma.tutorDay.create).toHaveBeenCalledWith({
        data: { tutorId: 50, daysId: 100 }
      });
      expect(mockPrisma.tutorDay.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('getTutorsSortedByClassCount', () => {
    it('returns tutors with class count and details', async () => {
      mockPrisma.user.findMany.mockResolvedValueOnce([
        { id: 1, name: 'T1', createdAt: new Date(), _count: { class: 2 } },
        { id: 2, name: 'T2', createdAt: new Date(), _count: { class: 1 } }
      ]);
      mockPrisma.user.count.mockResolvedValueOnce(2);
      mockPrisma.tutor.findMany.mockResolvedValueOnce([
        { userId: 1, subjects: 'Math', teachLevel: 'SMA', description: 'desc', photo: 'p.jpg', birthDate: '2000-01-01', phone: '0812' },
        { userId: 2, subjects: 'Bio', teachLevel: 'SMP', description: null, photo: null, birthDate: null, phone: null }
      ]);
      const result = await UserService.getTutorsSortedByClassCount({ page: 1, pageSize: 2 });
      expect(result.data.length).toBe(2);
      expect(result.data[0]).toMatchObject({ id: 1, subject: 'Math', classCount: 2, age: expect.any(Number) });
      expect(result.data[1]).toMatchObject({ id: 2, subject: 'Bio', classCount: 1, age: null });
    });

    it('returns correct age if birthday already passed this year', async () => {
      const now = new Date();
      const birthDate = new Date(now.getFullYear() - 30, now.getMonth() - 1, now.getDate());
      mockPrisma.user.findMany.mockResolvedValueOnce([
        { id: 1, name: 'T1', createdAt: now, _count: { class: 2 } }
      ]);
      mockPrisma.user.count.mockResolvedValueOnce(1);
      mockPrisma.tutor.findMany.mockResolvedValueOnce([
        { userId: 1, subjects: 'Math', teachLevel: 'SMA', description: 'desc', photo: 'p.jpg', birthDate: birthDate.toISOString(), phone: '0812' }
      ]);
      const result = await UserService.getTutorsSortedByClassCount({ page: 1, pageSize: 1 });
      expect(result.data[0].age).toBe(30);
    });
    
    it('returns correct age if birthday not yet passed this year', async () => {
      const now = new Date();
      const birthDate = new Date(now.getFullYear() - 30, now.getMonth() + 1, now.getDate());
      mockPrisma.user.findMany.mockResolvedValueOnce([
        { id: 2, name: 'T2', createdAt: now, _count: { class: 1 } }
      ]);
      mockPrisma.user.count.mockResolvedValueOnce(1);
      mockPrisma.tutor.findMany.mockResolvedValueOnce([
        { userId: 2, subjects: 'Bio', teachLevel: 'SMP', description: null, photo: null, birthDate: birthDate.toISOString(), phone: null }
      ]);
      const result = await UserService.getTutorsSortedByClassCount({ page: 1, pageSize: 1 });
      expect(result.data[0].age).toBe(29);
    });
    
    it('returns correct age if birthday month is this month but day not yet passed', async () => {
      const now = new Date();
      const birthDate = new Date(now.getFullYear() - 25, now.getMonth(), now.getDate() + 1);
      mockPrisma.user.findMany.mockResolvedValueOnce([
        { id: 3, name: 'T3', createdAt: now, _count: { class: 1 } }
      ]);
      mockPrisma.user.count.mockResolvedValueOnce(1);
      mockPrisma.tutor.findMany.mockResolvedValueOnce([
        { userId: 3, subjects: 'Kimia', teachLevel: 'SMA', description: null, photo: null, birthDate: birthDate.toISOString(), phone: null }
      ]);
      const result = await UserService.getTutorsSortedByClassCount({ page: 1, pageSize: 1 });
      expect(result.data[0].age).toBe(24);
    });
    
    it('returns null age if birthDate is undefined', async () => {
        const now = new Date();
        mockPrisma.user.findMany.mockResolvedValueOnce([
            { id: 5, name: 'T5', createdAt: now, _count: { class: 1 } }
        ]);
        mockPrisma.user.count.mockResolvedValueOnce(1);
        mockPrisma.tutor.findMany.mockResolvedValueOnce([
            { userId: 5, subjects: 'Geo', teachLevel: 'SMA', description: null, photo: null, birthDate: null,  phone: null }
        ]);
        const result = await UserService.getTutorsSortedByClassCount({ page: 1, pageSize: 1 });
        expect(result.data[0].age).toBeNull();
        });

    it('returns null for all detail fields if tutorDetailsMap[tutor.id] is undefined', async () => {
      const now = new Date();
      mockPrisma.user.findMany.mockResolvedValueOnce([
        { id: 99, name: 'NoDetail', createdAt: now, _count: { class: 0 } }
      ]);
      mockPrisma.user.count.mockResolvedValueOnce(1);
      mockPrisma.tutor.findMany.mockResolvedValueOnce([]); // Tidak ada detail sama sekali
      const result = await UserService.getTutorsSortedByClassCount({ page: 1, pageSize: 1 });
      expect(result.data[0]).toMatchObject({
        id: 99,
        name: 'NoDetail',
        joinDate: now,
        subject: null,
        teachLevel: null,
        description: null,
        photo: null,
        classCount: 0,
        phone: null,
        age: null
      });
    });

    it('returns null for missing fields in detail', async () => {
      const now = new Date();
      mockPrisma.user.findMany.mockResolvedValueOnce([
        { id: 100, name: 'Partial', createdAt: now, _count: { class: 1 } }
      ]);
      mockPrisma.user.count.mockResolvedValueOnce(1);
      mockPrisma.tutor.findMany.mockResolvedValueOnce([
        { userId: 100, subjects: null, teachLevel: undefined, description: null, photo: undefined, birthDate: null, phone: undefined }
      ]);
      const result = await UserService.getTutorsSortedByClassCount({ page: 1, pageSize: 1 });
      expect(result.data[0]).toMatchObject({
        id: 100,
        name: 'Partial',
        subject: null,
        teachLevel: null,
        description: null,
        photo: null,
        phone: null,
        age: null
      });
    });

    it('returns all detail fields if present', async () => {
      const now = new Date();
      const birthDate = new Date(now.getFullYear() - 20, now.getMonth(), now.getDate());
      mockPrisma.user.findMany.mockResolvedValueOnce([
        { id: 101, name: 'Full', createdAt: now, _count: { class: 2 } }
      ]);
      mockPrisma.user.count.mockResolvedValueOnce(1);
      mockPrisma.tutor.findMany.mockResolvedValueOnce([
        {
          userId: 101,
          subjects: 'Math',
          teachLevel: 'SMA',
          description: 'desc',
          photo: '/photo.jpg',
          birthDate: birthDate.toISOString(),
          phone: '0812'
        }
      ]);
      const result = await UserService.getTutorsSortedByClassCount({ page: 1, pageSize: 1 });
      expect(result.data[0]).toMatchObject({
        id: 101,
        name: 'Full',
        subject: 'Math',
        teachLevel: 'SMA',
        description: 'desc',
        photo: '/photo.jpg',
        phone: '0812',
        age: 20
      });
    });

    it('uses default pagination if no parameter is given', async () => {
      mockPrisma.user.findMany.mockResolvedValueOnce([]);
      mockPrisma.user.count.mockResolvedValueOnce(0);
      mockPrisma.tutor.findMany.mockResolvedValueOnce([]);
      const result = await UserService.getTutorsSortedByClassCount();
      expect(mockPrisma.user.findMany).toHaveBeenCalledWith(expect.objectContaining({
        skip: 0,
        take: 10,
      }));
      expect(result).toMatchObject({ data: [], total: 0, page: 1, pageSize: 10 });
    });
    
    it('uses default pagination if empty object is given', async () => {
      mockPrisma.user.findMany.mockResolvedValueOnce([]);
      mockPrisma.user.count.mockResolvedValueOnce(0);
      mockPrisma.tutor.findMany.mockResolvedValueOnce([]);
      const result = await UserService.getTutorsSortedByClassCount({});
      expect(mockPrisma.user.findMany).toHaveBeenCalledWith(expect.objectContaining({
        skip: 0,
        take: 10,
      }));
      expect(result).toMatchObject({ data: [], total: 0, page: 1, pageSize: 10 });
    });
    
    it('uses provided page and pageSize', async () => {
      mockPrisma.user.findMany.mockResolvedValueOnce([
        { id: 1, name: 'T1', createdAt: new Date(), _count: { class: 2 } }
      ]);
      mockPrisma.user.count.mockResolvedValueOnce(1);
      mockPrisma.tutor.findMany.mockResolvedValueOnce([
        { userId: 1, subjects: 'Math', teachLevel: 'SMA', description: 'desc', photo: 'p.jpg', birthDate: '2000-01-01', phone: '0812' }
      ]);
      const result = await UserService.getTutorsSortedByClassCount({ page: 2, pageSize: 5 });
      expect(mockPrisma.user.findMany).toHaveBeenCalledWith(expect.objectContaining({
        skip: 5,
        take: 5,
      }));
      expect(result.page).toBe(2);
      expect(result.pageSize).toBe(5);
    });
  });

  describe('getUserById', () => {
    it('throws if user not found', async () => {
      mockPrisma.user.findUnique.mockReset();
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      await expect(UserService.getUserById('notfound')).rejects.toThrow('User not found');
    });

    it('returns user with tutor daysName if role tutor', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 1,
        role: 'tutor',
        tutors: [
          {
            tutorDay: [
              { day: { daysName: 'Senin' } },
              { day: { daysName: 'Selasa' } }
            ]
          }
        ],
        students: [] 
      });
      const result = await UserService.getUserById(1);
      expect(result.tutors[0].daysName).toEqual(['Senin', 'Selasa']);
    });

    it('returns user with students if role siswa', async () => {
      mockPrisma.user.findUnique.mockResolvedValueOnce({
        id: 2,
        role: 'siswa',
        students: [{ level: 'Dasar' }],
        tutors: []
      });
      const result = await UserService.getUserById(2);
      expect(result.students[0].level).toBe('Dasar');
    });
  });

  describe('getTopStudents', () => {
    it('returns students sorted by class count', async () => {
      mockPrisma.user.findMany.mockResolvedValueOnce([
        {
          id: 1,
          name: 'S1',
          students: [{ level: 'Dasar' }],
          _count: { studentClass: 2 }
        },
        {
          id: 2,
          name: 'S2',
          students: [],
          _count: { studentClass: 0 }
        }
      ]);
      const result = await UserService.getTopStudents();
      expect(result[0]).toMatchObject({ id: 1, name: 'S1', level: 'Dasar', classCount: 2 });
      expect(result[1]).toMatchObject({ id: 2, name: 'S2', level: null, classCount: 0 });
    });
  });

  describe('getNewStudents', () => {
    it('uses default pagination if no parameter is given', async () => {
      mockPrisma.user.findMany.mockResolvedValueOnce([]);
      mockPrisma.user.count.mockResolvedValueOnce(0);
      const result = await UserService.getNewStudents();
      expect(mockPrisma.user.findMany).toHaveBeenCalledWith(expect.objectContaining({
        skip: 0,
        take: 10,
      }));
      expect(result).toMatchObject({ data: [], total: 0, page: 1, pageSize: 10 });
    });
    
    it('uses default pagination if empty object is given', async () => {
      mockPrisma.user.findMany.mockResolvedValueOnce([]);
      mockPrisma.user.count.mockResolvedValueOnce(0);
      const result = await UserService.getNewStudents({});
      expect(mockPrisma.user.findMany).toHaveBeenCalledWith(expect.objectContaining({
        skip: 0,
        take: 10,
      }));
      expect(result).toMatchObject({ data: [], total: 0, page: 1, pageSize: 10 });
    });
    
    it('uses provided page and pageSize', async () => {
      mockPrisma.user.findMany.mockResolvedValueOnce([{ id: 1, name: 'A', createdAt: new Date(), students: [{ level: 'Dasar', phone: '0812' }], _count: { studentClass: 2 } }]);
      mockPrisma.user.count.mockResolvedValueOnce(1);
      const result = await UserService.getNewStudents({ page: 2, pageSize: 5 });
      expect(mockPrisma.user.findMany).toHaveBeenCalledWith(expect.objectContaining({
        skip: 5,
        take: 5,
      }));
      expect(result).toMatchObject({ data: [expect.any(Object)], total: 1, page: 2, pageSize: 5 });
    });

    it('returns paginated newest students', async () => {
      mockPrisma.user.findMany.mockResolvedValueOnce([
        {
          id: 1,
          name: 'S1',
          createdAt: new Date(),
          students: [{ level: 'Dasar', phone: '0812' }],
          _count: { studentClass: 2 }
        }
      ]);
      mockPrisma.user.count.mockResolvedValueOnce(1);
      const result = await UserService.getNewStudents({ page: 1, pageSize: 1 });
      expect(result.data[0]).toMatchObject({
        id: 1,
        name: 'S1',
        level: 'Dasar',
        phone: '0812',
        classCount: 2
      });
      expect(result.total).toBe(1);
    });

    it('returns level and phone if students[0] exists and has value', async () => {
      mockPrisma.user.findMany.mockResolvedValueOnce([
        {
          id: 1,
          name: 'S1',
          createdAt: new Date(),
          students: [{ level: 'Dasar', phone: '0812' }],
          _count: { studentClass: 2 }
        }
      ]);
      mockPrisma.user.count.mockResolvedValueOnce(1);
      const result = await UserService.getNewStudents({ page: 1, pageSize: 1 });
      expect(result.data[0]).toMatchObject({
        level: 'Dasar',
        phone: '0812',
        classCount: 2
      });
    });

    it('returns null for level and phone if students array is empty', async () => {
      mockPrisma.user.findMany.mockResolvedValueOnce([
        {
          id: 2,
          name: 'S2',
          createdAt: new Date(),
          students: [],
          _count: { studentClass: 1 }
        }
      ]);
      mockPrisma.user.count.mockResolvedValueOnce(1);
      const result = await UserService.getNewStudents({ page: 1, pageSize: 1 });
      expect(result.data[0]).toMatchObject({
        level: null,
        phone: null,
        classCount: 1
      });
    });

    it('returns null for level and phone if students[0] is missing level/phone', async () => {
      mockPrisma.user.findMany.mockResolvedValueOnce([
        {
          id: 3,
          name: 'S3',
          createdAt: new Date(),
          students: [{}],
          _count: { studentClass: 3 }
        }
      ]);
      mockPrisma.user.count.mockResolvedValueOnce(1);
      const result = await UserService.getNewStudents({ page: 1, pageSize: 1 });
      expect(result.data[0]).toMatchObject({
        level: null,
        phone: null,
        classCount: 3
      });
    });

    it('returns classCount 0 if _count.studentClass is missing', async () => {
      mockPrisma.user.findMany.mockResolvedValueOnce([
        {
          id: 4,
          name: 'S4',
          createdAt: new Date(),
          students: [{ level: 'Dasar', phone: '0812' }],
          _count: {}
        }
      ]);
      mockPrisma.user.count.mockResolvedValueOnce(1);
      const result = await UserService.getNewStudents({ page: 1, pageSize: 1 });
      expect(result.data[0]).toMatchObject({
        classCount: 0
      });
    });
  });

  describe('getStatistics', () => {
    it('returns statistics', async () => {
      mockPrisma.user.count.mockResolvedValueOnce(2); // tutor
      mockPrisma.user.count.mockResolvedValueOnce(3); // siswa
      mockPrisma.bimbelPackage.count.mockResolvedValueOnce(4); // package
      mockPrisma.bimbelPackage.count.mockResolvedValueOnce(2); // active
      const result = await UserService.getStatistics();
      expect(result).toMatchObject({
        tutorCount: 2,
        studentCount: 3,
        packageCount: 4,
        activePackageCount: 2
      });
    });
  });

  describe('deleteUser', () => {
    it('deletes all related data for student', async () => {
      mockPrisma.tutor.findUnique.mockResolvedValueOnce(null);
      mockPrisma.bimbelPackage.findMany.mockResolvedValueOnce([]);
      mockPrisma.user.delete.mockResolvedValueOnce({});
      await UserService.deleteUser('student1');
      expect(mockPrisma.studentClass.deleteMany).toHaveBeenCalled();
      expect(mockPrisma.attendance.deleteMany).toHaveBeenCalled();
      expect(mockPrisma.student.deleteMany).toHaveBeenCalled();
      expect(mockPrisma.user.delete).toHaveBeenCalled();
    });

    it('deletes all related data for tutor and packages', async () => {
      mockPrisma.tutor.findUnique.mockResolvedValueOnce({ id: 10 });
      mockPrisma.tutorDay.deleteMany.mockResolvedValueOnce({});
      mockPrisma.bimbelPackage.findMany.mockResolvedValueOnce([
        { id: 1 }, { id: 2 }
      ]);
      mockPrisma.groupType.findMany.mockResolvedValue([]); 
      mockPrisma.groupType.deleteMany.mockResolvedValueOnce({});
      mockPrisma.packageDay.deleteMany.mockResolvedValueOnce({});
      mockPrisma.order.deleteMany.mockResolvedValue({});
      mockPrisma.class.deleteMany.mockResolvedValue({});
      mockPrisma.bimbelPackage.delete.mockResolvedValue({});
      mockPrisma.user.delete.mockResolvedValue({});
      mockPrisma.order.findMany.mockResolvedValue([]);
      await UserService.deleteUser('tutor1');
      expect(mockPrisma.tutorDay.deleteMany).toHaveBeenCalled();
      expect(mockPrisma.bimbelPackage.delete).toHaveBeenCalled();
      expect(mockPrisma.user.delete).toHaveBeenCalled();
    });

    it('deletes class for each order in package', async () => {
      mockPrisma.tutor.findUnique.mockResolvedValueOnce({ id: 10 });
      mockPrisma.tutorDay.deleteMany.mockResolvedValueOnce({});
      mockPrisma.bimbelPackage.findMany.mockResolvedValueOnce([
        { id: 1 }
      ]);
      mockPrisma.groupType.findMany.mockResolvedValue([]); 
      mockPrisma.groupType.deleteMany.mockResolvedValueOnce({});
      mockPrisma.packageDay.deleteMany.mockResolvedValueOnce({});
      mockPrisma.order.deleteMany.mockResolvedValue({});
      mockPrisma.class.deleteMany.mockResolvedValue({});
      mockPrisma.bimbelPackage.delete.mockResolvedValue({});
      mockPrisma.user.delete.mockResolvedValue({});
      // orders array berisi dua order
      mockPrisma.order.findMany.mockResolvedValueOnce([
        { id: 'order1' },
        { id: 'order2' }
      ]);
      await UserService.deleteUser('tutor1');
      // Harus dipanggil dua kali, satu untuk setiap order
      expect(mockPrisma.class.deleteMany).toHaveBeenCalledWith({ where: { orderId: 'order1' } });
      expect(mockPrisma.class.deleteMany).toHaveBeenCalledWith({ where: { orderId: 'order2' } });
    });

    it('does not delete class if orders is empty', async () => {
      mockPrisma.tutor.findUnique.mockResolvedValueOnce({ id: 10 });
      mockPrisma.tutorDay.deleteMany.mockResolvedValueOnce({});
      mockPrisma.bimbelPackage.findMany.mockResolvedValueOnce([
        { id: 2 }
      ]);
      mockPrisma.groupType.findMany.mockResolvedValue([]); 
      mockPrisma.groupType.deleteMany.mockResolvedValueOnce({});
      mockPrisma.packageDay.deleteMany.mockResolvedValueOnce({});
      mockPrisma.order.deleteMany.mockResolvedValue({});
      mockPrisma.class.deleteMany.mockResolvedValue({});
      mockPrisma.bimbelPackage.delete.mockResolvedValue({});
      mockPrisma.user.delete.mockResolvedValue({});
      // orders array kosong
      mockPrisma.order.findMany.mockResolvedValueOnce([]);
      await UserService.deleteUser('tutor2');
      // Tidak ada pemanggilan class.deleteMany dengan orderId
      expect(mockPrisma.class.deleteMany).not.toHaveBeenCalledWith({ where: { orderId: expect.any(String) } });
    });

    it('deletes order for each groupType in package', async () => {
      mockPrisma.tutor.findUnique.mockResolvedValueOnce({ id: 10 });
      mockPrisma.tutorDay.deleteMany.mockResolvedValueOnce({});
      mockPrisma.bimbelPackage.findMany.mockResolvedValueOnce([
        { id: 1 }
      ]);
      // groupTypes array berisi dua groupType
      mockPrisma.groupType.findMany.mockResolvedValueOnce([
        { id: 'gt1' },
        { id: 'gt2' }
      ]);
      mockPrisma.order.deleteMany.mockResolvedValue({});
      mockPrisma.groupType.deleteMany.mockResolvedValueOnce({});
      mockPrisma.packageDay.deleteMany.mockResolvedValueOnce({});
      mockPrisma.order.deleteMany.mockResolvedValue({});
      mockPrisma.order.findMany.mockResolvedValueOnce([]);
      mockPrisma.class.deleteMany.mockResolvedValue({});
      mockPrisma.bimbelPackage.delete.mockResolvedValue({});
      mockPrisma.user.delete.mockResolvedValue({});
      await UserService.deleteUser('tutor1');
      // Harus dipanggil dua kali, satu untuk setiap groupType
      expect(mockPrisma.order.deleteMany).toHaveBeenCalledWith({ where: { groupTypeId: 'gt1' } });
      expect(mockPrisma.order.deleteMany).toHaveBeenCalledWith({ where: { groupTypeId: 'gt2' } });
    });

    it('does not delete order if groupTypes is empty', async () => {
      mockPrisma.tutor.findUnique.mockResolvedValueOnce({ id: 10 });
      mockPrisma.tutorDay.deleteMany.mockResolvedValueOnce({});
      mockPrisma.bimbelPackage.findMany.mockResolvedValueOnce([
        { id: 2 }
      ]);
      // groupTypes array kosong
      mockPrisma.groupType.findMany.mockResolvedValueOnce([]);
      mockPrisma.order.deleteMany.mockResolvedValue({});
      mockPrisma.groupType.deleteMany.mockResolvedValueOnce({});
      mockPrisma.packageDay.deleteMany.mockResolvedValueOnce({});
      mockPrisma.order.deleteMany.mockResolvedValue({});
      mockPrisma.order.findMany.mockResolvedValueOnce([]);
      mockPrisma.class.deleteMany.mockResolvedValue({});
      mockPrisma.bimbelPackage.delete.mockResolvedValue({});
      mockPrisma.user.delete.mockResolvedValue({});
      await UserService.deleteUser('tutor2');
      // Tidak ada pemanggilan order.deleteMany dengan groupTypeId
      expect(mockPrisma.order.deleteMany).not.toHaveBeenCalledWith({ where: { groupTypeId: expect.any(String) } });
    });
  });

  describe('getNewTutors', () => {
    it('returns 3 newest tutors with name, createdAt, and teachLevel', async () => {
      const mockTutors = [
        { name: 'A', createdAt: new Date('2023-01-01'), tutors: [{ teachLevel: 'SMA' }] },
        { name: 'B', createdAt: new Date('2023-01-02'), tutors: [{ teachLevel: 'SMP' }] },
        { name: 'C', createdAt: new Date('2023-01-03'), tutors: [{ teachLevel: 'SD' }] }
      ];
      mockPrisma.user.findMany.mockResolvedValueOnce(mockTutors);

      const result = await UserService.getNewTutors();

      expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
        where: { role: 'tutor' },
        select: {
          name: true,
          createdAt: true,
          tutors: { select: { teachLevel: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 3
      });
      expect(result).toEqual([
        { name: 'A', createdAt: new Date('2023-01-01'), teachLevel: 'SMA' },
        { name: 'B', createdAt: new Date('2023-01-02'), teachLevel: 'SMP' },
        { name: 'C', createdAt: new Date('2023-01-03'), teachLevel: 'SD' }
      ]);
    });

    it('returns teachLevel null if tutors array is empty', async () => {
      const mockTutors = [
        { name: 'D', createdAt: new Date('2023-01-04'), tutors: [] }
      ];
      mockPrisma.user.findMany.mockResolvedValueOnce(mockTutors);

      const result = await UserService.getNewTutors();
      expect(result[0]).toMatchObject({ name: 'D', teachLevel: null });
    });
  });
});