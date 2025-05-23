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

export const ClassController = {
  createClass: asyncWrapper(createClass),
  joinClass: asyncWrapper(joinClass)
};