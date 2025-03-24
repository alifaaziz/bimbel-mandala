import { BimbelPackageService } from '../services/package.js';
import { asyncWrapper } from '../utils/asyncWrapper.js';

/**
 * Handles the request to get all bimbel packages.
 *
 * @async
 * @function getAllBimbelPackages
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Resolves with the list of bimbel packages.
 */
async function getAllBimbelPackages(_req, res) {
    const packages = await BimbelPackageService.getAllBimbelPackages();
    res.status(200).json(packages);
}

/**
 * Handles the request to get a bimbel package by ID.
 *
 * @async
 * @function getBimbelPackageById
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Resolves with the bimbel package.
 */
async function getBimbelPackageById(req, res) {
    const { id } = req.params;
    const packages = await BimbelPackageService.getBimbelPackageById(id);
    res.status(200).json(packages);
}

/**
 * Handles the request to create a new bimbel package.
 * 
 * @async
 * @function createBimbelPackage
 */
async function createBimbelPackage(req, res) {
    const packageData = req.body;
    const newPackage = await BimbelPackageService.createBimbelPackage(packageData);
    res.status(201).json(newPackage);
}

export const BimbelPackageController = {
    getAllBimbelPackages: asyncWrapper(getAllBimbelPackages),
    getBimbelPackageById: asyncWrapper(getBimbelPackageById),
    createBimbelPackage: asyncWrapper(createBimbelPackage)
};