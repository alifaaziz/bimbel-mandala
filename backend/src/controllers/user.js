import { UserService } from '../services/user.js';
import { asyncWrapper } from '../utils/asyncWrapper.js';

/**
 * Retrieves the current user.
 * 
 * @function getCurrentUser
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} Resolves with no value.
 * @throws {Error} Throws an error if retrieval fails.
 */
async function getCurrentUser(_req, res) {
    const userId = res.locals.user.id;
    const user = await UserService.getUserById(userId);
    res.status(200).json({ data: user });
}

/**
 * Creates a new user.
 * 
 * @function createUser
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} Resolves with no value.
 * @throws {Error} Throws an error if user creation fails.
 */
async function createUser(req, res) {
    const user = await UserService.createUser(req.body);
    res.status(201).json({ data: user });
}

/**
 * Updates the current user.
 * 
 * @function updateCurrentUser
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} Resolves with no value.
 * @throws {Error} Throws an error if update fails.
 */
async function updateCurrentUser(req, res) {
    await UserService.updateUser({ id: res.locals.user.id, role: res.locals.user.role, ...req.body });
    res.status(200).json({ message: 'User updated successfully' });
}

/**
 * Retrieves tutors sorted by the number of classes they are associated with.
 *
 * @async
 * @function getTutorsSortedByClassCount
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Resolves with the list of tutors sorted by class count.
 */
async function getTutorsSortedByClassCount(req, res) {
    try {
        const tutors = await UserService.getTutorsSortedByClassCount();
        res.status(200).json({ data: tutors });
    } catch (error) {
        console.error('Error in getTutorsSortedByClassCount:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const UserController = {
    createUser: asyncWrapper(createUser),
    getCurrentUser: asyncWrapper(getCurrentUser),
    updateCurrentUser: asyncWrapper(updateCurrentUser),
    getTutorsSortedByClassCount: asyncWrapper(getTutorsSortedByClassCount)
};