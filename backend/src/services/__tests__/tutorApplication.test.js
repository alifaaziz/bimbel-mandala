import { jest } from '@jest/globals';

const mockPrisma = {
  tutorApplication: {
    findUnique: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  tutor: {
    create: jest.fn(),
  },
  notification: {
    create: jest.fn(),
  },
  $transaction: jest.fn(),
};

const mockBcrypt = {
  hash: jest.fn(),
};

const mockSendTutorVerificationEmail = jest.fn();

jest.unstable_mockModule('../../utils/db.js', () => ({
  prisma: mockPrisma,
}));
jest.unstable_mockModule('bcrypt', () => ({
  __esModule: true,
  default: mockBcrypt,
  ...mockBcrypt
}));
jest.unstable_mockModule('../../utils/emails/core/tutor.js', () => ({
  sendTutorVerificationEmail: mockSendTutorVerificationEmail,
}));
jest.unstable_mockModule('../../utils/error.js', () => ({
  HttpError: class HttpError extends Error {
    constructor(status, data) {
      super(data?.message || 'error');
      this.statusCode = status;
      this.data = data;
    }
  },
}));
jest.unstable_mockModule('fs/promises', () => ({
  __esModule: true,
  default: {
    mkdir: jest.fn(),
    rename: jest.fn(),
  },
  mkdir: jest.fn(),
  rename: jest.fn(),
}));
jest.unstable_mockModule('path', () => ({
  __esModule: true,
  default: {
    extname: jest.fn(() => '.jpg'),
    resolve: jest.fn(() => '/public'),
    join: jest.fn((...args) => args.join('/')),
  },
  extname: jest.fn(() => '.jpg'),
  resolve: jest.fn(() => '/public'),
  join: jest.fn((...args) => args.join('/')),
}));

const { TutorApplicationService } = await import('../tutorApplication.js');
const { HttpError } = await import('../../utils/error.js');

beforeEach(() => {
  jest.clearAllMocks();
});

describe('TutorApplicationService', () => {
  describe('applyTutor', () => {
    it('should throw if email already used in tutorApplication', async () => {
      mockPrisma.tutorApplication.findUnique.mockResolvedValueOnce({ id: 1 });
      await expect(
        TutorApplicationService.applyTutor({ email: 'a@mail.com', name: 'A' })
      ).rejects.toThrow(HttpError);
    });

    it('should throw if email already used in user', async () => {
      mockPrisma.tutorApplication.findUnique.mockResolvedValueOnce(null);
      mockPrisma.user.findUnique.mockResolvedValueOnce({ id: 2 });
      await expect(
        TutorApplicationService.applyTutor({ email: 'a@mail.com', name: 'A' })
      ).rejects.toThrow(HttpError);
    });

    it('should create tutor application without photo', async () => {
      mockPrisma.tutorApplication.findUnique.mockResolvedValueOnce(null);
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      mockPrisma.tutorApplication.create.mockResolvedValueOnce({ id: 3, email: 'a@mail.com' });

      const result = await TutorApplicationService.applyTutor({ email: 'a@mail.com', name: 'A' });
      expect(mockPrisma.tutorApplication.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ email: 'a@mail.com', photo: null }) })
      );
      expect(result).toHaveProperty('id', 3);
    });

    it('should create tutor application with photo', async () => {
      mockPrisma.tutorApplication.findUnique.mockResolvedValueOnce(null);
      mockPrisma.user.findUnique.mockResolvedValueOnce(null);
      mockPrisma.tutorApplication.create.mockResolvedValueOnce({ id: 4, email: 'b@mail.com', photo: '/public/photo.jpg' });

      const file = { originalname: 'photo.jpg', path: '/tmp/photo.jpg' };

      const result = await TutorApplicationService.applyTutor({ email: 'b@mail.com', name: 'B' }, file);
      expect(result).toHaveProperty('photo', '/public/photo.jpg');
    });
  });

  describe('verifyTutor', () => {
    it('should throw if tutor application not found', async () => {
      mockPrisma.$transaction.mockImplementationOnce(async (cb) =>
        cb({
          tutorApplication: { findUnique: jest.fn().mockResolvedValueOnce(null) },
        })
      );
      await expect(TutorApplicationService.verifyTutor(123)).rejects.toThrow(HttpError);
    });

    it('should create user, tutor, delete application, notify, and send email', async () => {
      const fakeApp = {
        id: 5,
        name: 'Tutor',
        email: 'tutor@mail.com',
        birthDate: '2000-01-01',
        gender: 'L',
        phone: '123',
        subjects: 'Math',
        status: 'active',
        major: 'Math',
        school: 'School',
        teachLevel: 'SMA',
        description: 'desc',
        photo: '/public/photo.jpg',
      };
      const fakeUser = { id: 10, email: fakeApp.email, name: fakeApp.name };

      mockBcrypt.hash.mockResolvedValueOnce('hashedpw');
      mockPrisma.$transaction.mockImplementationOnce(async (cb) =>
        cb({
          tutorApplication: { findUnique: jest.fn().mockResolvedValueOnce(fakeApp), delete: jest.fn() },
          user: { create: jest.fn().mockResolvedValueOnce(fakeUser) },
          tutor: { create: jest.fn() },
          notification: { create: jest.fn() },
        })
      );

      const result = await TutorApplicationService.verifyTutor(5);
      expect(result).toHaveProperty('id', 10);
      expect(mockBcrypt.hash).toHaveBeenCalled();
      expect(mockSendTutorVerificationEmail).toHaveBeenCalledWith(
        fakeApp.email,
        fakeApp.name,
        'bimbelmandala'
      );
    });
  });

  describe('saveApplicantPhoto', () => {
    it('should return null if file is not provided', async () => {
      const result = await TutorApplicationService.saveApplicantPhoto(undefined, 'Test Name');
      expect(result).toBeNull();
    });
  });
});