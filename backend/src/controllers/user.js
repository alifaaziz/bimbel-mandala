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
    await UserService.updateUser(
        { id: res.locals.user.id, role: res.locals.user.role, ...req.body },
        req.file
    );
    res.status(200).json({ message: 'User updated successfully' });
}

/**
 * Updates a user by ID (admin only).
 * 
 * @async
 * @function updateUserById
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Resolves with a success message.
 */
async function updateUserById(req, res) {
    await UserService.updateUser(
        { id: req.params.id, ...req.body, role: req.body.role },
        req.file
    );

    res.status(200).json({ message: 'User updated successfully' });
}

/**
 * Retrieves tutors sorted by the number of classes they are associated with, with pagination.
 *
 * @async
 * @function getTutorsSortedByClassCount
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Resolves with the list of tutors sorted by class count.
 */
async function getTutorsSortedByClassCount(req, res) {
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.limit, 10) || 10;
    const result = await UserService.getTutorsSortedByClassCount({ page, pageSize });
    res.status(200).json(result);
}

/**
 * Get students sorted by createdAt
 * 
 * @async
 * @function getTopStudents
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Resolves with the list of students sorted by createdAt.
*/
async function getTopStudents(req, res) {
    const students = await UserService.getTopStudents();
    res.status(200).json({ data: students });
}

/**
 * Retrieves newly registered students.
 * 
 * @async
 * @function getNewStudents
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Resolves with the list of new students.
 */
async function getNewStudents(req, res) {
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.limit, 10) || 10;
    const searchText = req.query.search || '';
    const newStudents = await UserService.getNewStudents({ page, pageSize, searchText });
    res.status(200).json({ data: newStudents });
}

/**
 * Retrieves statistics.
 * 
 * @async
 * @function getStatistics
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Resolves with the statistics data.
 */
export async function getStatistics(req, res) {
  const stats = await UserService.getStatistics();
  res.status(200).json({ data: stats });
}

/**
 * Get User by ID
 * 
 * @async
 * @function getUserById
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Resolves with the user data.
 */
async function getUserById(req, res) {
    const userId = req.params.id;
    const user = await UserService.getUserById(userId);
    res.status(200).json({ data: user });
}

/**
 * Deletes a user by ID.
 * 
 * @async
 * @function deleteUser
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Resolves with a success message.
 */
async function deleteUser(req, res) {
    const userId = req.params.id;
    await UserService.deleteUser(userId);
    res.status(200).json({ message: 'User deleted successfully' });
}

/**
 * Retrieves the 3 newest tutors.
 * 
 * @async
 * @function getNewTutors
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Resolves with the list of new tutors.
 */
async function getNewTutors(req, res) {
    const tutors = await UserService.getNewTutors();
    res.status(200).json({ data: tutors });
}

export const UserController = {
    createUser: asyncWrapper(createUser),
    getCurrentUser: asyncWrapper(getCurrentUser),
    updateCurrentUser: asyncWrapper(updateCurrentUser),
    getTutorsSortedByClassCount: asyncWrapper(getTutorsSortedByClassCount),
    getUserById: asyncWrapper(getUserById),
    getTopStudents: asyncWrapper(getTopStudents),
    getNewStudents: asyncWrapper(getNewStudents),
    getNewTutors: asyncWrapper(getNewTutors),
    getStatistics: asyncWrapper(getStatistics),
    updateUserById: asyncWrapper(updateUserById),
    deleteUser: asyncWrapper(deleteUser)
};