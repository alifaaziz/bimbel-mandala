import { jest } from '@jest/globals';
import { setupExpressMock } from '../../utils/jest.js';
import { TutorApplicationController } from '../../controllers/tutorApplication.js';
import { TutorApplicationService } from '../../services/tutorApplication.js';

const applicationMock = { id: 1, name: 'Tutor Baru' };
const userMock = { id: 2, name: 'Tutor Verified' };

jest.unstable_mockModule('../../services/tutorApplication.js', () => ({
  TutorApplicationService: {
    applyTutor: jest.fn(() => Promise.resolve(applicationMock)),
    verifyTutor: jest.fn(() => Promise.resolve(userMock)),
  },
}));


describe('TutorApplicationController', () => {
  describe('applyTutor', () => {
    it('should apply tutor and return 201', async () => {
      TutorApplicationService.applyTutor.mockResolvedValue(applicationMock);

      const { req, res } = setupExpressMock({
        req: { body: { name: 'Tutor Baru' }, file: { filename: 'cv.pdf' } },
      });

      await TutorApplicationController.applyTutor(req, res);

      expect(TutorApplicationService.applyTutor).toHaveBeenCalledWith({ name: 'Tutor Baru' }, { filename: 'cv.pdf' });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Tutor applied successfully',
        data: applicationMock,
      });
    });
  });

  describe('verifyTutor', () => {
    it('should verify tutor and return 200', async () => {
      TutorApplicationService.verifyTutor.mockResolvedValue(userMock);

      const { req, res } = setupExpressMock({
        req: { params: { id: 2 } },
      });

      await TutorApplicationController.verifyTutor(req, res);

      expect(TutorApplicationService.verifyTutor).toHaveBeenCalledWith(2);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Tutor verified successfully',
        data: userMock,
      });
    });
  });
});