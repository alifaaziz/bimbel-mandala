import { jest } from '@jest/globals';
import { setupExpressMock } from '../../utils/jest.js';

const userMock = { id: 1, name: 'User', email: 'user@mail.com' };
const tokenMock = 'token123';

jest.unstable_mockModule('../../services/user.js', () => ({
  UserService: {
    createStudent: jest.fn(() => Promise.resolve()),
    createUserWithRole: jest.fn(() => Promise.resolve(userMock)),
  },
}));
jest.unstable_mockModule('../../services/auth.js', () => ({
  AuthService: {
    login: jest.fn(() => Promise.resolve({ ...userMock, token: tokenMock })),
    sendPasswordResetEmail: jest.fn(() => Promise.resolve()),
    resetPassword: jest.fn(() => Promise.resolve()),
    verifyPasswordResetToken: jest.fn(() => Promise.resolve()),
    changePassword: jest.fn(() => Promise.resolve()),
  },
}));
jest.unstable_mockModule('../../services/otp.js', () => ({
  OtpService: {
    sendUserVerificationOtp: jest.fn(() => Promise.resolve()),
    verifyOtp: jest.fn(() => Promise.resolve({ ...userMock, token: tokenMock })),
  },
}));

const { AuthController } = await import('../../controllers/auth.js');
const { AuthService } = await import('../../services/auth.js');
const { UserService } = await import('../../services/user.js');
const { OtpService } = await import('../../services/otp.js');

describe('AuthController', () => {
  describe('login', () => {
    it('should login user and return token', async () => {
      AuthService.login.mockResolvedValue({ ...userMock, token: tokenMock });

      const { req, res } = setupExpressMock({
        req: { body: { email: 'user@mail.com', password: 'pass' } },
      });

      await AuthController.login(req, res);

      expect(AuthService.login).toHaveBeenCalledWith({ email: 'user@mail.com', password: 'pass' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: { ...userMock, token: tokenMock } });
    });
  });

  describe('register', () => {
    it('should register user and return message', async () => {
      UserService.createStudent.mockResolvedValue();

      const { req, res } = setupExpressMock({
        req: { body: { email: 'user@mail.com', password: 'pass' } },
      });

      await AuthController.register(req, res);

      expect(UserService.createStudent).toHaveBeenCalledWith({ email: 'user@mail.com', password: 'pass' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: { message: 'Register success, waiting for OTP verification' },
      });
    });
  });

  describe('createUserWithRole', () => {
    it('should create admin user and return 201', async () => {
      UserService.createUserWithRole.mockResolvedValue(userMock);

      const { req, res } = setupExpressMock({
        req: { body: { name: 'Admin', role: 'admin' } },
      });

      await AuthController.createUserWithRole(req, res);

      expect(UserService.createUserWithRole).toHaveBeenCalledWith(
        { name: 'Admin', role: 'admin' },
        undefined
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ data: userMock });
    });
  });

  describe('sendPasswordResetEmail', () => {
    it('should send password reset email', async () => {
      AuthService.sendPasswordResetEmail.mockResolvedValue();

      const { req, res } = setupExpressMock({
        req: { body: { email: 'user@mail.com' } },
      });

      await AuthController.sendPasswordResetEmail(req, res);

      expect(AuthService.sendPasswordResetEmail).toHaveBeenCalledWith('user@mail.com');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Password reset has been sent in your email' });
    });
  });

  describe('resetPassword', () => {
    it('should reset password', async () => {
      AuthService.resetPassword.mockResolvedValue();

      const { req, res } = setupExpressMock({
        req: { body: { email: 'user@mail.com', password: 'newpass' } },
      });

      await AuthController.resetPassword(req, res);

      expect(AuthService.resetPassword).toHaveBeenCalledWith({ email: 'user@mail.com', password: 'newpass' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Password reset successful' });
    });
  });

  describe('verifyPasswordResetToken', () => {
    it('should verify password reset token', async () => {
      AuthService.verifyPasswordResetToken.mockResolvedValue();

      const { req, res } = setupExpressMock({
        req: { params: { token: 'token123' } },
      });

      await AuthController.verifyPasswordResetToken(req, res);

      expect(AuthService.verifyPasswordResetToken).toHaveBeenCalledWith('token123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Password reset token is valid' });
    });
  });

  describe('sendUserVerificationOtp', () => {
    it('should send user verification otp', async () => {
      OtpService.sendUserVerificationOtp.mockResolvedValue();

      const { req, res } = setupExpressMock({
        res: { locals: { user: { id: 1, name: 'User', email: 'user@mail.com' } } },
      });

      await AuthController.sendUserVerificationOtp(req, res);

      expect(OtpService.sendUserVerificationOtp).toHaveBeenCalledWith('User', 'user@mail.com', 1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'OTP sent successfully' });
    });
  });

  describe('verifyUserVerificationOtp', () => {
    it('should verify user verification otp', async () => {
      OtpService.verifyOtp.mockResolvedValue({ ...userMock, token: tokenMock });

      const { req, res } = setupExpressMock({
        req: { body: { email: 'user@mail.com', otp: '123456' } },
      });

      await AuthController.verifyUserVerificationOtp(req, res);

      expect(OtpService.verifyOtp).toHaveBeenCalledWith({ email: 'user@mail.com', otp: '123456' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'OTP verified successfully',
        data: { ...userMock, token: tokenMock },
      });
    });
  });

  describe('changePassword', () => {
    it('should change password', async () => {
      AuthService.changePassword.mockResolvedValue();

      const { req, res } = setupExpressMock({
        req: { body: { oldPassword: 'old', newPassword: 'new' } },
        res: { locals: { user: { id: 1 } } },
      });

      await AuthController.changePassword(req, res);

      expect(AuthService.changePassword).toHaveBeenCalledWith({
        userId: 1,
        oldPassword: 'old',
        newPassword: 'new',
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Password changed successfully' });
    });
  });

  describe('addStudentByAdmin', () => {
    it('should add student with skipOtp true if user is admin', async () => {
      UserService.createStudent.mockResolvedValue({ id: 2, name: 'Student' });

      const { req, res } = setupExpressMock({
        req: { body: { name: 'Student', email: 'student@mail.com' } },
      });
      res.locals.user = { id: 1, role: 'admin' };

      await AuthController.addStudentByAdmin(req, res);

      expect(UserService.createStudent).toHaveBeenCalledWith(
        { name: 'Student', email: 'student@mail.com' },
        { skipOtp: true }
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Student added successfully' });
    });

    it('should add student with skipOtp false if user is not admin', async () => {
      UserService.createStudent.mockResolvedValue({ id: 2, name: 'Student' });

      const { req, res } = setupExpressMock({
        req: { body: { name: 'Student', email: 'student@mail.com' } },
      });
      res.locals.user = { id: 1, role: 'student' };

      await AuthController.addStudentByAdmin(req, res);

      expect(UserService.createStudent).toHaveBeenCalledWith(
        { name: 'Student', email: 'student@mail.com' },
        { skipOtp: false }
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Student added successfully' });
    });
  });
});