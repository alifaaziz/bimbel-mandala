import { z } from 'zod';

/** Validasi string tidak boleh kosong */
export const validStringSchema = z.string().trim().min(1, 'String tidak boleh kosong');

/**
 * Fungsi untuk memformat error dari Zod
 * @param {import('zod').ZodError} error - Error dari validasi Zod
 * @returns {{ message: string; errors: string[] }}
 */
export function formatZodError(error) {
  return {
    message: 'Validasi gagal',
    errors: error.errors.map(({ message, path }) => `${path.join('.')} ${message}`)
  };
}