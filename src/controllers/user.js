import { UserService } from '../services/user.js';
import { asyncWrapper } from '../utils/asyncWrapper.js';

/** @import {Request, Response, NextFunction} from 'express' */
/** @import {User} from '@prisma/client' */
// /** @import {ValidCreateUserPayload, ValidUpdateUserPayload} from '../middlewares/validation/user.js' */

/**
 * @param {Request<{ id: string }>} _req
 * @param {Response<unknown, { user: User }>} res
 */
async function getCurrentUser(_req, res) {
    const user = res.locals.user;
    res.status(200).json({ data: user });
}

/**
 * @param {Request<unknown, unknown>} req
 * @param {Response} res
 */
async function createUser(req, res) {
    const user = await UserService.createUser(req.body);
    res.status(201).json({ data: user });
}

/**
 * @param {Request<unknown, unknown, ValidUpdateUserPayload>} req
 * @param {Response<unknown, { user: User }>} res
 */
async function updateCurrentUser(req, res) {
    await UserService.updateUser(res.locals.user.id, req.body);
    res.status(200).json({ message: 'User updated successfully' });
}

export const UserController = {
    createUser: asyncWrapper(createUser),
    getCurrentUser: asyncWrapper(getCurrentUser),
    updateCurrentUser: asyncWrapper(updateCurrentUser)
};