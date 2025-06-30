import { ClassService } from '../services/class.js';
import { asyncWrapper } from '../utils/asyncWrapper.js';

/**
 * Handles the request to create a new class.
 *
 * @async
 * @function createClass
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Resolves with the created class.
 */
async function createClass(req, res) {
  const classData = req.body;
  const newClass = await ClassService.createClass(classData);
  res.status(201).json({ data: newClass });
}

/**
 * Handles the request to join a class using a code.
 *
 * @async
 * @function joinClass
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Resolves with the joined class.
 */
async function joinClass(req, res) {
  const { code } = req.body;
  const userId = res.locals.user.id;
  const joinedClass = await ClassService.joinClass({ code, userId });
  res.status(200).json({ data: joinedClass });
}

/**
 * Handles the request to get user classes.
 * 
 * @async
 * @function getMyClass
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Resolves with the user's classes.
 */
async function getMyClass(req, res) {
  const userId = res.locals.user.id;
  const role = res.locals.user.role; 
  const classes = await ClassService.getMyClass(userId, role);
  res.status(200).json({ data: classes });
}

/**
 * Handles the request to get running classes.
 *
 * @async
 * @function getRunningClass
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Resolves with the running classes.
 */
async function getRunningClass(req, res) {
  const classes = await ClassService.getRunningClass();
  res.status(200).json({ data: classes });
}

/**
 * Handles the request to get student classes by user ID.
 * 
 * @async
 * @function getStudentClassesByUserId
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Resolves with the student's classes.
 */
async function getStudentClassesByUserId(req, res) {
  const userId = req.params.userId;
  const studentClasses = await ClassService.getStudentClassesByUserId(userId);
  res.status(200).json({ data: studentClasses });
}

export const ClassController = {
  createClass: asyncWrapper(createClass),
  joinClass: asyncWrapper(joinClass),
  getMyClass: asyncWrapper(getMyClass),
  getRunningClass: asyncWrapper(getRunningClass),
  getStudentClassesByUserId: asyncWrapper(getStudentClassesByUserId)
};