import { TutorApplicationService } from '../services/tutorApplication.js';
import { asyncWrapper } from '../utils/asyncWrapper.js';

/**
 * Apply a new tutor.
 * 
 * @function registerTutor
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} Resolves with no value.
 * @throws {Error} Throws an error if application fails.
 */
async function applyTutor(req, res) {
    const application = await TutorApplicationService.applyTutor(req.body);
    res.status(201).json({ message: 'Tutor applied successfully', data: application });
}

/**
 * Verifies a tutor application.
 * 
 * @function verifyTutor
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} Resolves with no value.
 * @throws {Error} Throws an error if verification fails.
 */
async function verifyTutor(req, res) {
    const { id } = req.params;
    const user = await TutorApplicationService.verifyTutor(id);
    res.status(200).json({ message: 'Tutor verified successfully', data: user });
}

export const TutorApplicationController = {
    applyTutor: asyncWrapper(applyTutor),
    verifyTutor: asyncWrapper(verifyTutor),
};