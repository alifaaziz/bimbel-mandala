import { jest } from '@jest/globals';

const mockPrisma = {
    user: {
        findUnique: jest.fn(),
        update: jest.fn()
    },
    passwordReset: {
        findFirst: jest.fn(),
        updateMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn()
    },
    notification: {
        create: jest.fn()
    },
    $transaction: jest.fn()
};

const mockJwt = {
    sign: jest.fn(() => 'jwt-token'),
    verify: jest.fn(),
    JsonWebTokenError: class JsonWebTokenError extends Error {}
};

const mockBcrypt = {
    hash: jest.fn(async pw => 'hashed_' + pw),
    compare: jest.fn()
};

const mockEnv = { appEnv: { JWT_SECRET: 'secret' } };
const mockHelper = { generateRandomToken: jest.fn(() => 'randomtoken') };
const mockSendResetPasswordEmail = jest.fn();

jest.unstable_mockModule('../../utils/db.js', () => ({
    prisma: mockPrisma
}));
jest.unstable_mockModule('jsonwebtoken', () => ({
    __esModule: true,
    default: mockJwt,
    ...mockJwt
}));
jest.unstable_mockModule('bcrypt', () => ({
    __esModule: true,
    default: mockBcrypt,
    ...mockBcrypt
}));
jest.unstable_mockModule('../../utils/env.js', () => mockEnv);
jest.unstable_mockModule('../../utils/helper.js', () => mockHelper);
jest.unstable_mockModule('../../utils/emails/core/password-reset.js', () => ({
    sendResetPasswordEmail: mockSendResetPasswordEmail
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

const { AuthService } = await import('../auth.js');

beforeEach(() => {
    jest.clearAllMocks();
});

describe('AuthService', () => {
    describe('login', () => {
        it('should throw if notVerifiedUser exists', async () => {
            mockPrisma.user.findUnique
                .mockResolvedValueOnce(null)
                .mockResolvedValueOnce({ id: 1 });
            await expect(AuthService.login({ email: 'a@mail.com', password: 'pw' }))
                .rejects.toThrow('Your email is not verified');
        });

        it('should throw if user not found', async () => {
            mockPrisma.user.findUnique
                .mockResolvedValueOnce(null)
                .mockResolvedValueOnce(null);
            await expect(AuthService.login({ email: 'a@mail.com', password: 'pw' }))
                .rejects.toThrow('Your email is not registered');
        });

        it('should throw if password not match', async () => {
            mockPrisma.user.findUnique
                .mockResolvedValueOnce({ id: 1, password: 'hashed', name: 'A', email: 'a@mail.com', googleId: null })
                .mockResolvedValueOnce(null);
            mockBcrypt.compare.mockResolvedValueOnce(false);
            await expect(AuthService.login({ email: 'a@mail.com', password: 'pw' }))
                .rejects.toThrow('Email or password is incorrect');
        });

        it('should return user with token if login success', async () => {
            mockPrisma.user.findUnique
                .mockResolvedValueOnce({ id: 1, password: 'hashed', name: 'A', email: 'a@mail.com', googleId: null })
                .mockResolvedValueOnce(null);
            mockBcrypt.compare.mockResolvedValueOnce(true);
            mockJwt.sign.mockReturnValueOnce('jwt-token');
            const result = await AuthService.login({ email: 'a@mail.com', password: 'pw' });
            expect(result).toMatchObject({
                id: 1,
                name: 'A',
                email: 'a@mail.com',
                token: 'jwt-token'
            });
        });
    });

    describe('hashPassword', () => {
        it('should hash password', async () => {
            const result = await AuthService.hashPassword('pw');
            expect(result).toBe('hashed_pw');
        });
    });

    describe('isPasswordMatch', () => {
        it('should compare password', async () => {
            mockBcrypt.compare.mockResolvedValueOnce(true);
            const result = await AuthService.isPasswordMatch('pw', 'hashed_pw');
            expect(result).toBe(true);
        });
    });

    describe('generateToken', () => {
        it('should generate jwt token', async () => {
            mockJwt.sign.mockReturnValueOnce('jwt-token');
            const result = await AuthService.generateToken(1);
            expect(result).toBe('jwt-token');
        });
    });

    describe('verifyToken', () => {
        it('should throw if token invalid (decode fail)', async () => {
            mockJwt.verify.mockImplementationOnce(() => ({}));
            await expect(AuthService.verifyToken('badtoken')).rejects.toThrow('Invalid token');
        });

        it('should throw if user not found', async () => {
            mockJwt.verify.mockImplementationOnce(() => ({ id: 1 }));
            mockPrisma.user.findUnique.mockResolvedValueOnce(null);
            await expect(AuthService.verifyToken('token')).rejects.toThrow('Invalid token');
        });

        it('should return user if token valid', async () => {
            mockJwt.verify.mockImplementationOnce(() => ({ id: 1 }));
            mockPrisma.user.findUnique.mockResolvedValueOnce({ id: 1, name: 'A' });
            const result = await AuthService.verifyToken('token');
            expect(result).toMatchObject({ id: 1, name: 'A' });
        });

        it('should throw if jwt error', async () => {
            const err = new mockJwt.JsonWebTokenError('fail');
            mockJwt.verify.mockImplementationOnce(() => { throw err; });
            await expect(AuthService.verifyToken('token')).rejects.toThrow('Invalid token');
        });
    });

    describe('sendPasswordResetEmail', () => {
        it('should do nothing if user not found', async () => {
            mockPrisma.user.findUnique.mockResolvedValueOnce(null);
            const result = await AuthService.sendPasswordResetEmail('notfound@mail.com');
            expect(result).toBeNull();
        });

        it('should send reset email if user found', async () => {
            mockPrisma.user.findUnique.mockResolvedValueOnce({ id: 1, name: 'A', email: 'a@mail.com' });
            mockPrisma.$transaction.mockImplementationOnce(async fn => await fn(mockPrisma));
            mockPrisma.passwordReset.create.mockResolvedValueOnce({ token: 'tok' });
            await AuthService.sendPasswordResetEmail('a@mail.com');
            expect(mockSendResetPasswordEmail).toHaveBeenCalledWith({
                name: 'A',
                email: 'a@mail.com',
                token: 'tok'
            });
        });
    });

    describe('resetPassword', () => {
        it('should throw if token invalid', async () => {
            mockPrisma.passwordReset.findFirst.mockResolvedValueOnce(null);
            await expect(AuthService.resetPassword({ token: 'bad', password: 'pw' }))
                .rejects.toThrow('Invalid or expired token');
        });

        it('should reset password and notify', async () => {
            mockPrisma.passwordReset.findFirst.mockResolvedValueOnce({ id: 1, userId: 2, used: false, expiredAt: new Date(), user: {} });
            mockBcrypt.hash.mockResolvedValueOnce('hashed_pw');
            mockPrisma.$transaction.mockImplementationOnce(async fn => await fn(mockPrisma));
            await AuthService.resetPassword({ token: 'tok', password: 'pw' });
            expect(mockPrisma.passwordReset.update).toHaveBeenCalled();
            expect(mockPrisma.user.update).toHaveBeenCalled();
            expect(mockPrisma.notification.create).toHaveBeenCalled();
        });
    });

    describe('verifyPasswordResetToken', () => {
        it('should throw if token invalid', async () => {
            mockPrisma.passwordReset.findFirst.mockResolvedValueOnce(null);
            await expect(AuthService.verifyPasswordResetToken('bad')).rejects.toThrow('Invalid or expired token');
        });

        it('should resolve if token valid', async () => {
            mockPrisma.passwordReset.findFirst.mockResolvedValueOnce({ id: 1 });
            await expect(AuthService.verifyPasswordResetToken('tok')).resolves.toBeUndefined();
        });
    });

    describe('getAuthorizationBearerToken', () => {
        it('should throw if no authorization header', () => {
            const req = { get: () => undefined };
            expect(() => AuthService.getAuthorizationBearerToken(req)).toThrow('Invalid token');
        });

        it('should throw if not Bearer type', () => {
            const req = { get: () => 'Basic abc' };
            expect(() => AuthService.getAuthorizationBearerToken(req)).toThrow('Invalid token');
        });

        it('should return token if Bearer', () => {
            const req = { get: () => 'Bearer mytoken' };
            expect(AuthService.getAuthorizationBearerToken(req)).toBe('mytoken');
        });
    });

    describe('changePassword', () => {
        it('should throw if user not found', async () => {
            mockPrisma.user.findUnique.mockResolvedValueOnce(null);
            await expect(AuthService.changePassword({ userId: 1, oldPassword: 'a', newPassword: 'b' }))
                .rejects.toThrow('User not found');
        });

        it('should throw if old password not match', async () => {
            mockPrisma.user.findUnique.mockResolvedValueOnce({ password: 'hashed' });
            mockBcrypt.compare.mockResolvedValueOnce(false);
            await expect(AuthService.changePassword({ userId: 1, oldPassword: 'a', newPassword: 'b' }))
                .rejects.toThrow('Old password is incorrect');
        });

        it('should update password and notify if old password match', async () => {
            mockPrisma.user.findUnique.mockResolvedValueOnce({ password: 'hashed' });
            mockBcrypt.compare.mockResolvedValueOnce(true);
            mockBcrypt.hash.mockResolvedValueOnce('hashed_new');
            mockPrisma.user.update.mockResolvedValueOnce({});
            mockPrisma.notification.create.mockResolvedValueOnce({});
            await AuthService.changePassword({ userId: 1, oldPassword: 'a', newPassword: 'b' });
            expect(mockPrisma.user.update).toHaveBeenCalled();
            expect(mockPrisma.notification.create).toHaveBeenCalled();
        });
    });
});