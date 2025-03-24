import { z } from 'zod';

export const validStringSchema = z.string().trim().min(1, 'String tidak boleh kosong');

export function formatZodError(error, formatZodErrorOptions = {}) {
 const errors = error.errors.map(({ message, path }) => {
   const name = path.join('.');

   const result = name ? `${name} ${message}` : message;

   return result;
 });

 let parsedMessage = formatZodErrorOptions.errorMessage ?? 'Invalid body';

 let parsedErrors = errors;

 if (formatZodErrorOptions.preferSingleError) {
   parsedMessage = errors[0];
   parsedErrors = undefined;
 }

 return ({
   message: parsedMessage,
   errors: parsedErrors
 });
}