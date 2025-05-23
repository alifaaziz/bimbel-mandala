import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { appEnv } from '../utils/env.js';
import { prisma } from '../utils/db.js';
import { HttpError } from '../utils/error.js';
import { generateRandomToken } from '../utils/helper.js';
import { sendResetPasswordEmail } from '../utils/emails/core/password-reset.js';

/**
 * Logs in a user using the provided email and password.
 *
 * @async
 * @function login
 * @param {Object} payload - The login payload.
 * @param {string} payload.email - The user's email.
 * @param {string} payload.password - The user's password.
 * @returns {Promise<Object>} The user object with a token.
 * @throws {HttpError} Throws an error if the email or password is incorrect.
 */ 
async function login(payload) {
  const { email, password } = payload;

  const user = await prisma.user.findUnique({
    where: {
      email,
      verified: true
    },
    select: {
      id: true,
      email: true,
      password: true,
      name: true,
      googleId: true
    }
  });

  const notVerifiedUser = await prisma.user.findUnique({
    where: {
      email,
      verified: false
    }
  });

  if (notVerifiedUser) {
    throw new HttpError(401, {
      message: 'Your email is not verified, please check your email'
    });
  }

  if (!user) {
    throw new HttpError(401, {
      message: 'Your email is not registered, please sign up'
    });
  }

  const isMatch = await isPasswordMatch(password, user.password);

  if (!isMatch) {
    throw new HttpError(401, {
      message: 'Email or password is incorrect, please try again'
    });
  }

  const token = await generateToken(user.id);

  const { password: _, ...userWithoutPassword } = user;

  const userWithToken = {
    ...userWithoutPassword,
    token
  };

  return userWithToken;
}

/**
 * Hashes a password using bcrypt.
 * 
 * @async
 * @function hashPassword
 * @param {string} password - The password to hash.
 * @param {number} [salt=10] - The salt rounds to use.
 * @returns {Promise<string>} The hashed password.
 */ 
async function hashPassword(password, salt = 10) {
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

/**
 * Compares a password with a hashed password.
 *
 * @async
 * @function isPasswordMatch
 * @param {string} password - The password to compare.
 * @param {string} hashedPassword - The hashed password to compare.
 * @returns {Promise<boolean>} A boolean indicating whether the password matches the hashed password.
 */
async function isPasswordMatch(password, hashedPassword) {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
}

/**
 * Generates a JWT token for the user.
 *
 * @async
 * @function generateToken
 * @param {number} id - The user ID to include in the token.
 * @returns {Promise<string>} The generated JWT token.
 */
async function generateToken(id) {
  const token = jwt.sign({ id }, appEnv.JWT_SECRET, {
    expiresIn: '7d'
  });

  return token;
}

/**
 * Verifies a JWT token and returns the user.
 * 
 * @async
 * @function verifyToken
 * @param {string} token - The token to verify.
 * @returns {Promise<Object>} The user object.
 * @throws {HttpError} Throws an error if the token is invalid.
 */
async function verifyToken(token) {
  try {
    const decodedToken = jwt.verify(token, appEnv.JWT_SECRET);

    const validToken = typeof decodedToken === 'object' && decodedToken.id;

    if (!validToken) {
      throw new HttpError(401, { message: 'Invalid token' });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: decodedToken.id
      }
    });

    if (!user) {
      throw new HttpError(401, { message: 'Invalid token' });
    }

    return user;
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      throw new HttpError(401, { message: 'Invalid token' });
    }

    throw err;
  }
}

/**
 * Finds a valid password reset token.
 *
 * @async
 * @function findValidPasswordResetToken
 * @param {string} token - The token to find.
 * @param {boolean} [withUser=false] - Whether to include user data.
 * @returns {Promise<Object|null>} The password reset data or null.
 */
async function findValidPasswordResetToken(token, withUser = false) {
  return prisma.passwordReset.findFirst({
    where: {
      token,
      used: false,
      expiredAt: {
        gte: new Date()
      }
    },
    ...(withUser && { include: { user: true } })
  });
}

/**
 * Sends a password reset email to the user.
 *
 * @async
 * @function sendPasswordResetEmail
 * @param {string} email - The email address of the user.
 * @returns {Promise<void>} Resolves when the email has been sent.
 */
async function sendPasswordResetEmail(email) {
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  });

  if (!user) return null;

  await prisma.$transaction(async (tx) => {
    await tx.passwordReset.updateMany({
      where: {
        userId: user.id,
        used: false,
        expiredAt: {
          gte: new Date()
        }
      },
      data: {
        used: true
      }
    });

    const nextHourDate = new Date();
    nextHourDate.setHours(nextHourDate.getHours() + 1);

    const newVerifyResetPassword = await tx.passwordReset.create({
      data: {
        used: false,
        token: generateRandomToken(),
        userId: user.id,
        expiredAt: nextHourDate
      }
    });

    await sendResetPasswordEmail({
      name: user.name,
      email: user.email,
      token: newVerifyResetPassword.token
    });
  });
}

/**
 * Resets the user's password using the provided token and new password.
 * 
 * @async
 * @function resetPassword
 * @param {Object} params - The parameters for resetting the password.
 * @param {string} params.token - The token used to validate the password reset request.
 * @param {string} params.password - The new password to set for the user.
 * @throws {HttpError} Throws an error if the token is invalid or expired.
 * @returns {Promise<void>} Resolves when the password has been successfully reset.
 */
async function resetPassword({ token, password }) {
  const resetPasswordData = await findValidPasswordResetToken(token, true);

  if (!resetPasswordData) {
    throw new HttpError(400, { message: 'Invalid or expired token' });
  }

  const hashedPassword = await hashPassword(password);

  await prisma.$transaction(async (tx) => {
    await tx.passwordReset.update({
      where: {
        id: resetPasswordData.id
      },
      data: {
        used: true
      }
    });

    await tx.user.update({
      where: {
        id: resetPasswordData.userId
      },
      data: {
        password: hashedPassword
      }
    });

    await tx.notification.create({
      data: {
        userId: resetPasswordData.userId,
        type: 'Perubahan Akun',
        description: 'Password akun Anda berhasil diubah, jika Anda tidak merasa melakukan perubahan ini, segera hubungi kami.'
      }
    });
  });
}

/**
 * Verifies the password reset token.
 *
 * @async
 * @function verifyPasswordResetToken
 * @param {string} token - The token to verify.
 * @throws {HttpError} Throws an error if the token is invalid or expired.
 * @returns {Promise<void>} Resolves when the token is valid.
 */
async function verifyPasswordResetToken(token) {
  const resetPasswordData = await findValidPasswordResetToken(token);

  if (!resetPasswordData) {
    throw new HttpError(400, { message: 'Invalid or expired token' });
  }
}

/**
 * Extracts the Bearer token from the request headers.
 *
 * @function getAuthorizationBearerToken
 * @param {Object} req - The request object.
 * @returns {string} The Bearer token.
 * @throws {HttpError} Throws an error if the token is invalid.
 */
function getAuthorizationBearerToken(req) {
  const authorization = req.get('authorization');

  if (!authorization) {
    throw new HttpError(401, { message: 'Invalid token' });
  }

  const [type, token] = authorization.split(' ');

  if (type.toLocaleLowerCase() !== 'bearer') {
    throw new HttpError(401, { message: 'Invalid token' });
  }

  return token;
}

/**
 * Changes the user's password.
 *
 * @async
 * @function changePassword
 * @param {Object} params - The parameters for changing the password.
 * @throws {HttpError} Throws an error if the old password is incorrect.
 * @returns {Promise<void>} Resolves when the password has been successfully changed.
 */
async function changePassword({ userId, oldPassword, newPassword }) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { password: true }
  });

  if (!user) {
    throw new HttpError(404, { message: 'User not found' });
  }

  const isMatch = await isPasswordMatch(oldPassword, user.password);
  if (!isMatch) {
    throw new HttpError(400, { message: 'Old password is incorrect' });
  }

  const hashedNewPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedNewPassword }
  });

  await prisma.notification.create({
    data: {
      userId,
      type: 'Perubahan Akun',
      description: 'Password akun Anda berhasil diubah, jika Anda tidak merasa melakukan perubahan ini, segera hubungi kami.',
      photo: '/public/mandala.png'
    }
  });
}

export const AuthService = {
  login,
  hashPassword,
  isPasswordMatch,
  generateToken,
  verifyToken,
  sendPasswordResetEmail,
  resetPassword,
  verifyPasswordResetToken,
  getAuthorizationBearerToken,
  changePassword
};