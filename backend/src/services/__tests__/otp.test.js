import { jest } from '@jest/globals';

const mockPrisma = {
    otp: {
        count: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        updateMany: jest.fn()
    },
    user: {
        findUnique: jest.fn(),
        update: jest.fn()
    },
    $transaction: jest.fn()
};

const mockSendOtpEmail = jest.fn();
const mockGenerateRandomOTP = jest.fn(() => '123456');
const mockGenerateToken = jest.fn(() => 'token123');

jest.unstable_mockModule('../../utils/db.js', () => ({
    prisma: mockPrisma
}));
jest.unstable_mockModule('../../utils/emails/core/otp.js', () => ({
    sendOtpEmail: mockSendOtpEmail
}));
jest.unstable_mockModule('../../utils/helper.js', () => ({
    generateRandomOTP: mockGenerateRandomOTP
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
jest.unstable_mockModule('../auth.js', () => ({
    AuthService: { generateToken: mockGenerateToken }
}));

const { OtpService } = await import('../otp.js');
const { HttpError } = await import('../../utils/error.js');

beforeEach(() => {
    jest.clearAllMocks();
});

describe('OtpService', () => {
    describe('isOtpRateLimited', () => {
        it('returns true if count >= maxRequests', async () => {
            mockPrisma.otp.count.mockResolvedValueOnce(3);
            const result = await OtpService.isOtpRateLimited('user1', 3, 10);
            expect(result).toBe(true);
        });

        it('returns false if count < maxRequests', async () => {
            mockPrisma.otp.count.mockResolvedValueOnce(1);
            const result = await OtpService.isOtpRateLimited('user1', 3, 10);
            expect(result).toBe(false);
        });
    });

    describe('sendUserVerificationOtp', () => {
        it('throws if rate limited', async () => {
            mockPrisma.otp.count.mockResolvedValueOnce(3);
            await expect(
                OtpService.sendUserVerificationOtp('A', 'a@mail.com', 'user1')
            ).rejects.toThrow(HttpError);
        });

        it('sends OTP if not rate limited', async () => {
            mockPrisma.otp.count.mockResolvedValueOnce(0);
            mockPrisma.$transaction.mockImplementationOnce(async (fn) => {
                await fn({
                    otp: {
                        updateMany: jest.fn(),
                        create: jest.fn().mockResolvedValue({ otp: '123456' })
                    }
                });
            });
            await OtpService.sendUserVerificationOtp('A', 'a@mail.com', 'user1');
            expect(mockSendOtpEmail).toHaveBeenCalledWith(
                'a@mail.com',
                '123456',
                expect.any(Date)
            );
        });
    });

    describe('verifyOtp', () => {
        it('throws if otp not found', async () => {
            mockPrisma.otp.findFirst.mockResolvedValueOnce(null);
            await expect(
                OtpService.verifyOtp({ email: 'a@mail.com', otp: '123456' })
            ).rejects.toThrow(HttpError);
        });

        it('throws if user not found', async () => {
            mockPrisma.otp.findFirst.mockResolvedValueOnce({ userId: 'user1' });
            mockPrisma.user.findUnique.mockResolvedValueOnce(null);
            await expect(
                OtpService.verifyOtp({ email: 'a@mail.com', otp: '123456' })
            ).rejects.toThrow(HttpError);
        });

        it('verifies OTP and returns user with token', async () => {
            mockPrisma.otp.findFirst.mockResolvedValueOnce({ userId: 'user1' });
            mockPrisma.user.findUnique.mockResolvedValueOnce({
                id: 'user1',
                email: 'a@mail.com',
                name: 'A',
                googleId: null
            });
            mockPrisma.$transaction.mockImplementationOnce(async (fn) => {
                await fn({
                    otp: { updateMany: jest.fn() },
                    user: { update: jest.fn() }
                });
            });
            const result = await OtpService.verifyOtp({
                email: 'a@mail.com',
                otp: '123456'
            });
            expect(result).toMatchObject({
                id: 'user1',
                email: 'a@mail.com',
                name: 'A',
                token: 'token123'
            });
        });
    });

    describe('invalidateAllUserOtps', () => {
        it('calls updateMany with correct params', async () => {
            const tx = { otp: { updateMany: jest.fn() } };
            await OtpService.invalidateAllUserOtps(tx, 'user1');
            expect(tx.otp.updateMany).toHaveBeenCalledWith({
                where: { userId: 'user1', expiredAt: { gte: expect.any(Date) } },
                data: { used: true }
            });
        });
    });
});