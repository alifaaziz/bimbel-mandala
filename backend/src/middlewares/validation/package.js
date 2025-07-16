import { z } from 'zod';
import { HttpError } from '../../utils/error.js';
import { formatZodError } from '../../utils/validation.js';

const groupTypeSchema = z.array(z.object({
    type: z.string().min(3),
    price: z.number().min(0),
    maxStudent: z.number().min(1).optional(),
    discPrice: z.number().min(0).optional()
}));

const daysSchema = z.union([
    z.string(), // "Senin,Kamis" atau '["Senin","Kamis"]'
    z.array(z.string()) // ["Senin", "Kamis"]
]);

const validCreateBimbelPackagePayload = z.object({
    name: z.string().min(2),
    level: z.string().min(2),
    totalMeetings: z.number().min(1),
    time: z.string().min(1),
    duration: z.number().min(1),
    area: z.string().min(2),
    tutorId: z.string().min(1),
    groupType: groupTypeSchema,
    days: daysSchema,
    discount: z.number().min(0).max(100).optional()
});

const validCreateClassBimbelPackagePayload = z.object({
    name: z.string().min(2),
    level: z.string().min(2),
    totalMeetings: z.number().min(1),
    time: z.string().min(1),
    duration: z.number().min(1),
    area: z.string().min(2),
    tutorId: z.string().min(1),
    price: z.number().min(0),
    maxStudent: z.number().min(1),
    days: daysSchema,
    discount: z.number().min(0).max(100).optional(),
    startDate: z.string().optional()
});

const validUpdateBimbelPackagePayload = validCreateBimbelPackagePayload.partial();
const validUpdateClassBimbelPackagePayload = validCreateClassBimbelPackagePayload.partial();

/**
 * Validates the payload for creating a bimbel package.
 */
function isValidCreateBimbelPackagePayload(req, _res, next) {
    const { success, error } = validCreateBimbelPackagePayload.safeParse(req.body);
    if (!success) throw new HttpError(400, formatZodError(error));
    next();
}

/**
 * Validates the payload for creating a class bimbel package.
 */
function isValidCreateClassBimbelPackagePayload(req, _res, next) {
    const { success, error } = validCreateClassBimbelPackagePayload.safeParse(req.body);
    if (!success) throw new HttpError(400, formatZodError(error));
    next();
}

/**
 * Validates the payload for updating a bimbel package.
 */
function isValidUpdateBimbelPackagePayload(req, _res, next) {
    const { success, error } = validUpdateBimbelPackagePayload.safeParse(req.body);
    if (!success) throw new HttpError(400, formatZodError(error));
    next();
}

/**
 * Validates the payload for updating a class bimbel package.
 */
function isValidUpdateClassBimbelPackagePayload(req, _res, next) {
    const { success, error } = validUpdateClassBimbelPackagePayload.safeParse(req.body);
    if (!success) throw new HttpError(400, formatZodError(error));
    next();
}

export const PackageValidationMiddleware = {
    isValidCreateBimbelPackagePayload,
    isValidCreateClassBimbelPackagePayload,
    isValidUpdateBimbelPackagePayload,
    isValidUpdateClassBimbelPackagePayload
};