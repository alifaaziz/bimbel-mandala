import { randomBytes, randomInt } from 'crypto';
import fs from 'fs/promises';
import path from 'path';

export function generateRandomToken(size = 12) {
    return randomBytes(size).toString('base64url');
}

export function generateRandomOTP() {
    return randomInt(0, 1_000_000).toString().padStart(6, '0');
}

export async function savePhoto(file, name) {
    if (!file) return null;
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const safeName = name.replace(/\s+/g, '-').toLowerCase();
    const filename = `${safeName}-${timestamp}${ext}`;
    const destDir = path.resolve('public');
    const destPath = path.join(destDir, filename);

    await fs.mkdir(destDir, { recursive: true });
    await fs.rename(file.path, destPath);

    return `/public/${filename}`;
}