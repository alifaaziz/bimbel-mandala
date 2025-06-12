import { jest } from '@jest/globals';
import { setupExpressMock } from '../../utils/jest.js';

const tutorApplicationMock = { id: 1, name: 'John Doe', status: 'pending' };
const verifiedTutorMock = { id: 1, name: 'John Doe', status: 'verified' };

jest.unstable_mockModule('../../services/tutorApplication.js', () => ({
  TutorApplicationService: {
    applyTutor: jest.fn(() => Promise.resolve(tutorApplicationMock)),
    verifyTutor: jest.fn(() => Promise.resolve(verifiedTutorMock)),
  },
}));

const { TutorApplicationController } = await import('../../controllers/tutorApplication.js');
const { TutorApplicationService } = await import('../../services/tutorApplication.js');

describe('TutorApplicationController', () => {
  describe('applyTutor', () => {
    it('should apply a new tutor and return 201', async () => {
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
});