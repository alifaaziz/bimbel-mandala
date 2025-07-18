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
    const application = await TutorApplicationService.applyTutor(req.body, req.file);
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

/**
 * Get tutor applications with pagination.
 * 
 * @function getTutorApplications
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Resolves with the paginated list of tutor applications.
 */
async function getTutorApplications(req, res) {
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.limit, 10) || parseInt(req.query.limit, 10) || 10;
    const result = await TutorApplicationService.getTutorApplications({ page, pageSize });
    res.status(200).json(result);
}

/**
 * Get a single tutor application by ID.
 * 
 * @function getTutorApplicationById
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Resolves with the tutor application data.
 */
async function getTutorApplicationById(req, res) {
    const { id } = req.params;
    const application = await TutorApplicationService.getTutorApplicationById(id);
    if (!application) {
        return res.status(404).json({ message: 'Tutor application not found' });
    }
    res.status(200).json({ data: application });
}

/**
 * Rejects (deletes) a tutor application by ID.
 *
 * @function rejectTutorApplication
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Resolves with a success message.
 */
async function rejectTutorApplication(req, res) {
    const { id } = req.params;
    await TutorApplicationService.rejectTutorApplication(id);
    res.status(200).json({ message: 'Tutor application rejected successfully' });
}

export const TutorApplicationController = {
    applyTutor: asyncWrapper(applyTutor),
    verifyTutor: asyncWrapper(verifyTutor),
    getTutorApplications: asyncWrapper(getTutorApplications),
    getTutorApplicationById: asyncWrapper(getTutorApplicationById),
    rejectTutorApplication: asyncWrapper(rejectTutorApplication),
};