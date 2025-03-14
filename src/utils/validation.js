import { z } from 'zod';

/** Validasi string tidak boleh kosong */
export const validStringSchema = z.string().trim().min(1, 'String tidak boleh kosong');

/**
 * @template {boolean} T
 * @typedef {{
*   message: string;
*   errors: T extends true ? undefined : string[];
* }} FormattedZodError<T>
*/

/**
* @template {boolean} T
* @typedef {{ preferSingleError?: T; errorMessage?: string }} FormatZodErrorOptions
*/

/**
* @template {boolean} [T=false] Default is `false`
* @param {ZodError} error - The ZodError to format.
* @param {FormatZodErrorOptions<T>} [formatZodErrorOptions]
* @returns {FormattedZodError<T>} The formatted error.
*/
export function formatZodError(error, formatZodErrorOptions = {}) {
 const errors = error.errors.map(({ message, path }) => {
   const name = path.join('.');

   const result = name ? `${name} ${message}` : message;

   return result;
 });

 let parsedMessage = formatZodErrorOptions.errorMessage ?? 'Invalid body';

 /** @type {string[] | undefined} */
 let parsedErrors = errors;

 if (formatZodErrorOptions.preferSingleError) {
   parsedMessage = errors[0];
   parsedErrors = undefined;
 }

 return /** @type {FormattedZodError<T>} */ ({
   message: parsedMessage,
   errors: parsedErrors
 });
}