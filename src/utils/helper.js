import { randomBytes, randomInt } from 'crypto';

export function generateRandomToken(size = 12) {
    return randomBytes(size).toString('base64url');
  }

  export function generateRandomOTP() {
    return randomInt(0, 1_000_000).toString().padStart(6, '0');
  }