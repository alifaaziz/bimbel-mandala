import { jest } from '@jest/globals';
import { setupExpressMock } from '../../utils/jest.js';

jest.unstable_mockModule('../../services/tutorApplication.js', () => ({
  TutorApplicationService: {
    applyTutor: jest.fn(),
    verifyTutor: jest.fn(),
    getTutorApplications: jest.fn(),
    getTutorApplicationById: jest.fn(),
    rejectTutorApplication: jest.fn(),
  },
}));

const { TutorApplicationController } = await import('../../controllers/tutorApplication.js');
const { TutorApplicationService } = await import('../../services/tutorApplication.js');

const tutorApplicationMock = { id: 1, name: 'John Doe', status: 'pending' };
const verifiedTutorMock = { id: 1, name: 'John Doe', status: 'verified' };

beforeEach(() => {
  jest.clearAllMocks();
});

describe('TutorApplicationController', () => {
  describe('applyTutor', () => {
    it('should apply a new tutor and return 201', async () => {
      TutorApplicationService.applyTutor.mockResolvedValue(tutorApplicationMock);

      const { req, res } = setupExpressMock({
        req: {
          body: { name: 'John Doe', email: 'john.doe@example.com' },
          file: { filename: 'resume.pdf' },
        },
      });

      await TutorApplicationController.applyTutor(req, res);

      expect(TutorApplicationService.applyTutor).toHaveBeenCalledWith(
        { name: 'John Doe', email: 'john.doe@example.com' },
        { filename: 'resume.pdf' }
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Tutor applied successfully',
        data: tutorApplicationMock,
      });
    });
  });

  describe('verifyTutor', () => {
    it('should verify a tutor application and return 200', async () => {
      TutorApplicationService.verifyTutor.mockResolvedValue(verifiedTutorMock);

      const { req, res } = setupExpressMock({
        req: { params: { id: 1 } },
      });

      await TutorApplicationController.verifyTutor(req, res);

      expect(TutorApplicationService.verifyTutor).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Tutor verified successfully',
        data: verifiedTutorMock,
      });
    });
  });

  describe('getTutorApplications', () => {
    it('should return paginated tutor applications and return 200', async () => {
      const resultMock = { data: [{ id: 1 }], total: 1, page: 2, pageSize: 5 };
      TutorApplicationService.getTutorApplications.mockResolvedValue(resultMock);

      const { req, res } = setupExpressMock({
        req: { query: { page: '2', limit: '5' } },
      });

      await TutorApplicationController.getTutorApplications(req, res);

      expect(TutorApplicationService.getTutorApplications).toHaveBeenCalledWith({ page: 2, pageSize: 5 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(resultMock);
    });

    it('should use default pagination if query is missing', async () => {
      const resultMock = { data: [], total: 0, page: 1, pageSize: 10 };
      TutorApplicationService.getTutorApplications.mockResolvedValue(resultMock);

      const { req, res } = setupExpressMock({
        req: { query: {} },
      });

      await TutorApplicationController.getTutorApplications(req, res);

      expect(TutorApplicationService.getTutorApplications).toHaveBeenCalledWith({ page: 1, pageSize: 10 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(resultMock);
    });
  });

  describe('getTutorApplicationById', () => {
    it('should return tutor application data if found', async () => {
      TutorApplicationService.getTutorApplicationById.mockResolvedValue(tutorApplicationMock);

      const { req, res } = setupExpressMock({
        req: { params: { id: 1 } },
      });

      await TutorApplicationController.getTutorApplicationById(req, res);

      expect(TutorApplicationService.getTutorApplicationById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: tutorApplicationMock });
    });

    it('should return 404 if tutor application not found', async () => {
      TutorApplicationService.getTutorApplicationById.mockResolvedValue(null);

      const { req, res } = setupExpressMock({
        req: { params: { id: 99 } },
      });

      await TutorApplicationController.getTutorApplicationById(req, res);

      expect(TutorApplicationService.getTutorApplicationById).toHaveBeenCalledWith(99);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Tutor application not found' });
    });
  });

  describe('rejectTutorApplication', () => {
    it('should reject (delete) a tutor application and return 200', async () => {
      TutorApplicationService.rejectTutorApplication.mockResolvedValue();

      const { req, res } = setupExpressMock({
        req: { params: { id: 1 } },
      });

      await TutorApplicationController.rejectTutorApplication(req, res);

      expect(TutorApplicationService.rejectTutorApplication).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Tutor application rejected successfully' });
    });
  });
});