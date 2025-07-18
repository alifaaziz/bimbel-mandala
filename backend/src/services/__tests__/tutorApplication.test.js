import { jest } from '@jest/globals';

const mockPrisma = {
  tutorApplication: {
    findUnique: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    delete: jest.fn()
  },
  user: {
    findUnique: jest.fn(),
    create: jest.fn()
  },
  tutor: {
    create: jest.fn()
  },
  notification: {
    create: jest.fn()
  },
  $transaction: jest.fn()
};

const mockBcrypt = {
  hash: jest.fn(async pw => 'hashed_' + pw)
};

const mockSendTutorVerificationEmail = jest.fn();
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
jest.unstable_mockModule('bcrypt', () => ({
  __esModule: true,
  default: mockBcrypt,
  ...mockBcrypt
}));
jest.unstable_mockModule('../../utils/emails/core/tutor.js', () => ({
  sendTutorVerificationEmail: mockSendTutorVerificationEmail
}));
jest.unstable_mockModule('../../utils/helper.js', () => ({
  savePhoto: mockSavePhoto
}));
jest.unstable_mockModule('../../utils/error.js', () => ({
  HttpError: mockHttpError
}));

const { TutorApplicationService } = await import('../tutorApplication.js');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('TutorApplicationService', () => {
  describe('applyTutor', () => {
    it('throws if email already used in tutorApplication', async () => {
      mockPrisma.tutorApplication.findUnique.mockResolvedValueOnce({ id: 1 });
      await expect(TutorApplicationService.applyTutor({ email: 'a@mail.com' }))
        .rejects.toThrow('Email sudah digunakan untuk pendaftaran tutor.');
    });

    it('throws if email already used in user', async () => {
      mockPrisma.tutorApplication.findUnique.mockResolvedValueOnce(null);
      mockPrisma.user.findUnique.mockResolvedValueOnce({ id: 2 });
      await expect(TutorApplicationService.applyTutor({ email: 'a@mail.com' }))
        .rejects.toThrow('Email sudah terdaftar sebagai pengguna.');
    });

    it('saves photo if file provided', async () => {
      mockPrisma.tutorApplication.findUnique.mockResolvedValueOnce(null);
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      mockPrisma.tutorApplication.create.mockResolvedValueOnce({ id: 3, name: 'A' });
      const file = { buffer: Buffer.from('img'), originalname: 'img.jpg' };
      const result = await TutorApplicationService.applyTutor({ email: 'a@mail.com', name: 'A' }, file);
      expect(mockSavePhoto).toHaveBeenCalled();
      expect(result).toMatchObject({ id: 3, name: 'A' });
    });

    it('creates application if email not used', async () => {
      mockPrisma.tutorApplication.findUnique.mockResolvedValueOnce(null);
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      mockPrisma.tutorApplication.create.mockResolvedValueOnce({ id: 4, name: 'B' });
      const result = await TutorApplicationService.applyTutor({ email: 'b@mail.com', name: 'B' });
      expect(mockPrisma.tutorApplication.create).toHaveBeenCalled();
      expect(result).toMatchObject({ id: 4, name: 'B' });
    });

    it('saves photo with "tutor" if data.name is not provided', async () => {
      mockPrisma.tutorApplication.findUnique.mockResolvedValueOnce(null);
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      mockPrisma.tutorApplication.create.mockResolvedValueOnce({ id: 5, name: undefined, photo: '/photo/path.jpg' });
      const file = { buffer: Buffer.from('img'), originalname: 'img.jpg' };
      await TutorApplicationService.applyTutor({ email: 'c@mail.com' }, file);
      expect(mockSavePhoto).toHaveBeenCalledWith(file, 'tutor');
    });

    it('saves days as JSON string if array is given', async () => {
      mockPrisma.tutorApplication.findUnique.mockResolvedValueOnce(null);
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      mockPrisma.tutorApplication.create.mockResolvedValueOnce({ id: 6, days: '["Senin","Kamis"]' });
      const result = await TutorApplicationService.applyTutor({
        email: 'd@mail.com',
        name: 'D',
        days: ['Senin', 'Kamis']
      });
      expect(mockPrisma.tutorApplication.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            days: JSON.stringify(['Senin', 'Kamis'])
          })
        })
      );
      expect(result).toMatchObject({ id: 6, days: '["Senin","Kamis"]' });
    });
  });

  describe('verifyTutor', () => {
    it('throws if application not found', async () => {
      mockPrisma.$transaction.mockImplementationOnce(async fn => {
        return await fn({
          tutorApplication: { findUnique: jest.fn().mockResolvedValueOnce(null) }
        });
      });
      await expect(TutorApplicationService.verifyTutor('notfound'))
        .rejects.toThrow('Tutor application not found');
    });

    it('creates user, tutor, deletes application, sends email and notification', async () => {
      const fakeApp = {
        id: 'app1',
        name: 'T',
        email: 't@mail.com',
        birthDate: '2000-01-01',
        gender: 'Male',
        phone: '0812',
        subjects: 'Math',
        status: 'active',
        major: 'Math',
        school: 'SMA',
        teachLevel: 'SMA',
        description: 'desc',
        photo: '/photo.jpg'
      };
      const fakeUser = { id: 10, email: 't@mail.com', name: 'T' };
      mockPrisma.$transaction.mockImplementationOnce(async fn => {
        return await fn({
          tutorApplication: {
            findUnique: jest.fn().mockResolvedValueOnce(fakeApp),
            delete: jest.fn().mockResolvedValueOnce({})
          },
          user: {
            create: jest.fn().mockResolvedValueOnce(fakeUser)
          },
          tutor: {
            create: jest.fn().mockResolvedValueOnce({})
          },
          notification: {
            create: jest.fn().mockResolvedValueOnce({})
          }
        });
      });
      mockBcrypt.hash.mockResolvedValueOnce('hashed_pw');
      const result = await TutorApplicationService.verifyTutor('app1');
      expect(result).toMatchObject({ id: 10, email: 't@mail.com', name: 'T' });
      expect(mockSendTutorVerificationEmail).toHaveBeenCalledWith('t@mail.com', 'bimbelmandala');
    });

    it('creates tutorDay for each valid day in application.days', async () => {
      const fakeApp = {
        id: 'app2',
        name: 'T',
        email: 't@mail.com',
        birthDate: '2000-01-01',
        gender: 'Male',
        phone: '0812',
        subjects: 'Math',
        status: 'active',
        major: 'Math',
        school: 'SMA',
        teachLevel: 'SMA',
        description: 'desc',
        photo: '/photo.jpg',
        days: JSON.stringify(['Senin', 'Kamis'])
      };
      const fakeUser = { id: 11, email: 't@mail.com', name: 'T' };
      const mockDayFindFirst = jest.fn()
        .mockResolvedValueOnce({ id: 1, daysName: 'Senin' })
        .mockResolvedValueOnce({ id: 2, daysName: 'Kamis' });
      const mockTutorDayCreate = jest.fn();

      mockPrisma.$transaction.mockImplementationOnce(async fn => {
        return await fn({
          tutorApplication: {
            findUnique: jest.fn().mockResolvedValueOnce(fakeApp),
            delete: jest.fn().mockResolvedValueOnce({})
          },
          user: {
            create: jest.fn().mockResolvedValueOnce(fakeUser)
          },
          tutor: {
            create: jest.fn().mockResolvedValueOnce({id : 123})
          },
          day: {
            findFirst: mockDayFindFirst
          },
          tutorDay: {
            create: mockTutorDayCreate
          },
          notification: {
            create: jest.fn().mockResolvedValueOnce({})
          }
        });
      });
      mockBcrypt.hash.mockResolvedValueOnce('hashed_pw');
      await TutorApplicationService.verifyTutor('app2');
      expect(mockDayFindFirst).toHaveBeenCalledWith({ where: { daysName: 'Senin' } });
      expect(mockDayFindFirst).toHaveBeenCalledWith({ where: { daysName: 'Kamis' } });
      expect(mockTutorDayCreate).toHaveBeenCalledWith({ data: { tutorId: expect.anything(), daysId: 1 } });
      expect(mockTutorDayCreate).toHaveBeenCalledWith({ data: { tutorId: expect.anything(), daysId: 2 } });
    });

    it('handles invalid days JSON gracefully', async () => {
      const fakeApp = {
        id: 'app3',
        name: 'T',
        email: 't@mail.com',
        birthDate: '2000-01-01',
        gender: 'Male',
        phone: '0812',
        subjects: 'Math',
        status: 'active',
        major: 'Math',
        school: 'SMA',
        teachLevel: 'SMA',
        description: 'desc',
        photo: '/photo.jpg',
        days: 'not-a-json'
      };
      const fakeUser = { id: 12, email: 't@mail.com', name: 'T' };
    
      const mockTutorDayCreate = jest.fn();
    
      mockPrisma.$transaction.mockImplementationOnce(async fn => {
        return await fn({
          tutorApplication: {
            findUnique: jest.fn().mockResolvedValueOnce(fakeApp),
            delete: jest.fn().mockResolvedValueOnce({})
          },
          user: {
            create: jest.fn().mockResolvedValueOnce(fakeUser)
          },
          tutor: {
            create: jest.fn().mockResolvedValueOnce({ id: 124 })
          },
          day: {
            findFirst: jest.fn()
          },
          tutorDay: {
            create: mockTutorDayCreate
          },
          notification: {
            create: jest.fn().mockResolvedValueOnce({})
          }
        });
      });
      mockBcrypt.hash.mockResolvedValueOnce('hashed_pw');
      await TutorApplicationService.verifyTutor('app3');
      // Tidak ada pemanggilan ke tutorDay.create karena daysArr = []
      expect(mockTutorDayCreate).not.toHaveBeenCalled();
    });
  });

  describe('getTutorApplications', () => {
    it('returns paginated applications', async () => {
      mockPrisma.tutorApplication.findMany.mockResolvedValueOnce([
        { id: 1, name: 'A' },
        { id: 2, name: 'B' }
      ]);
      mockPrisma.tutorApplication.count.mockResolvedValueOnce(2);
      const result = await TutorApplicationService.getTutorApplications({ page: 1, pageSize: 2 });
      expect(result.data).toEqual([
        { id: 1, name: 'A' },
        { id: 2, name: 'B' }
      ]);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(2);
    });

    it('returns empty array if no applications', async () => {
      mockPrisma.tutorApplication.findMany.mockResolvedValueOnce([]);
      mockPrisma.tutorApplication.count.mockResolvedValueOnce(0);
      const result = await TutorApplicationService.getTutorApplications({ page: 1, pageSize: 2 });
      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
    });

    it('uses default pagination if no parameter is given', async () => {
      mockPrisma.tutorApplication.findMany.mockResolvedValueOnce([]);
      mockPrisma.tutorApplication.count.mockResolvedValueOnce(0);
      const result = await TutorApplicationService.getTutorApplications();
      expect(mockPrisma.tutorApplication.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'asc' },
      });
      expect(result).toMatchObject({ data: [], total: 0, page: 1, pageSize: 10 });
    });
    
    it('uses default pagination if empty object is given', async () => {
      mockPrisma.tutorApplication.findMany.mockResolvedValueOnce([]);
      mockPrisma.tutorApplication.count.mockResolvedValueOnce(0);
      const result = await TutorApplicationService.getTutorApplications({});
      expect(mockPrisma.tutorApplication.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'asc' },
      });
      expect(result).toMatchObject({ data: [], total: 0, page: 1, pageSize: 10 });
    });
    
    it('uses provided page and pageSize', async () => {
      mockPrisma.tutorApplication.findMany.mockResolvedValueOnce([{ id: 1, name: 'A' }]);
      mockPrisma.tutorApplication.count.mockResolvedValueOnce(1);
      const result = await TutorApplicationService.getTutorApplications({ page: 2, pageSize: 5 });
      expect(mockPrisma.tutorApplication.findMany).toHaveBeenCalledWith({
        skip: 5,
        take: 5,
        orderBy: { createdAt: 'asc' },
      });
      expect(result).toMatchObject({ data: [{ id: 1, name: 'A' }], total: 1, page: 2, pageSize: 5 });
    });

    it('skips tutorDay creation if day not found', async () => {
      const fakeApp = {
        id: 'app4',
        name: 'T',
        email: 't@mail.com',
        birthDate: '2000-01-01',
        gender: 'Male',
        phone: '0812',
        subjects: 'Math',
        status: 'active',
        major: 'Math',
        school: 'SMA',
        teachLevel: 'SMA',
        description: 'desc',
        photo: '/photo.jpg',
        days: JSON.stringify(['Senin', 'Kamis'])
      };
      const fakeUser = { id: 13, email: 't@mail.com', name: 'T' };
      const mockDayFindFirst = jest.fn().mockResolvedValue(null);
      const mockTutorDayCreate = jest.fn();
    
      mockPrisma.$transaction.mockImplementationOnce(async fn => {
        return await fn({
          tutorApplication: {
            findUnique: jest.fn().mockResolvedValueOnce(fakeApp),
            delete: jest.fn().mockResolvedValueOnce({})
          },
          user: {
            create: jest.fn().mockResolvedValueOnce(fakeUser)
          },
          tutor: {
            create: jest.fn().mockResolvedValueOnce({ id: 125 })
          },
          day: {
            findFirst: mockDayFindFirst
          },
          tutorDay: {
            create: mockTutorDayCreate
          },
          notification: {
            create: jest.fn().mockResolvedValueOnce({})
          }
        });
      });
      mockBcrypt.hash.mockResolvedValueOnce('hashed_pw');
      await TutorApplicationService.verifyTutor('app4');
      expect(mockDayFindFirst).toHaveBeenCalledTimes(2);
      expect(mockTutorDayCreate).not.toHaveBeenCalled();
    });

    it('does not call tutorDay.create if daysArr is not an array', async () => {
      const fakeApp = {
        id: 'app5',
        name: 'T',
        email: 't@mail.com',
        birthDate: '2000-01-01',
        gender: 'Male',
        phone: '0812',
        subjects: 'Math',
        status: 'active',
        major: 'Math',
        school: 'SMA',
        teachLevel: 'SMA',
        description: 'desc',
        photo: '/photo.jpg',
        days: JSON.stringify("Senin") // <-- ini string, bukan array!
      };
      const fakeUser = { id: 14, email: 't@mail.com', name: 'T' };
      const mockDayFindFirst = jest.fn();
      const mockTutorDayCreate = jest.fn();
    
      mockPrisma.$transaction.mockImplementationOnce(async fn => {
        return await fn({
          tutorApplication: {
            findUnique: jest.fn().mockResolvedValueOnce(fakeApp),
            delete: jest.fn().mockResolvedValueOnce({})
          },
          user: {
            create: jest.fn().mockResolvedValueOnce(fakeUser)
          },
          tutor: {
            create: jest.fn().mockResolvedValueOnce({ id: 126 })
          },
          day: {
            findFirst: mockDayFindFirst
          },
          tutorDay: {
            create: mockTutorDayCreate
          },
          notification: {
            create: jest.fn().mockResolvedValueOnce({})
          }
        });
      });
      mockBcrypt.hash.mockResolvedValueOnce('hashed_pw');
      await TutorApplicationService.verifyTutor('app5');
      expect(mockTutorDayCreate).not.toHaveBeenCalled();
      expect(mockDayFindFirst).not.toHaveBeenCalled();
    });
  });

  describe('getTutorApplicationById', () => {
    it('returns application if found', async () => {
      mockPrisma.tutorApplication.findUnique.mockResolvedValueOnce({ id: 1, name: 'A' });
      const result = await TutorApplicationService.getTutorApplicationById(1);
      expect(result).toMatchObject({ id: 1, name: 'A' });
    });

    it('returns null if not found', async () => {
      mockPrisma.tutorApplication.findUnique.mockResolvedValueOnce(null);
      const result = await TutorApplicationService.getTutorApplicationById('notfound');
      expect(result).toBeNull();
    });
  });

  describe('rejectTutorApplication', () => {
    it('deletes application if found', async () => {
      mockPrisma.tutorApplication.findUnique.mockResolvedValueOnce({ id: 7 });
      mockPrisma.tutorApplication.delete.mockResolvedValueOnce({});
      await TutorApplicationService.rejectTutorApplication(7);
      expect(mockPrisma.tutorApplication.delete).toHaveBeenCalledWith({ where: { id: 7 } });
    });

    it('throws if application not found', async () => {
      mockPrisma.tutorApplication.findUnique.mockResolvedValueOnce(null);
      await expect(TutorApplicationService.rejectTutorApplication(8))
        .rejects.toThrow('Tutor application not found');
    });
  });
});