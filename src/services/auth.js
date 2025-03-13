import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { prisma } from '../utils/db.js';
import { appEnv } from '../utils/env.js';
import { HttpError } from '../utils/error.js';

// /** @import {ValidLoginPayload} from '../middlewares/validation/auth.js' */

/** @param {ValidLoginPayload} payload */
async function login({ email, password }) {
  const user = await prisma.user.findUnique({
    where: { email, verified: true },
    select: { id: true, email: true, password: true, name: true }
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new HttpError(401, { message: 'Email or password is incorrect' });
  }

  const token = generateToken(user.id);
  return { ...user, token };
}

/** @param {string} password */
async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

/** @param {string} id */
function generateToken(id) {
  return jwt.sign({ id }, appEnv.JWT_SECRET, { expiresIn: '7d' });
}

/** @param {string} token */
async function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, appEnv.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) throw new HttpError(401, { message: 'Invalid token' });
    return user;
  } catch {
    throw new HttpError(401, { message: 'Invalid token' });
  }
}

export const AuthService = { login, hashPassword, generateToken, verifyToken };
