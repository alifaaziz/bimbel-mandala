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
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Resolves with the created bimbel package.
 */
async function createBimbelPackage(req, res) {
  const { name, level, totalMeetings, time, duration, area, tutorId, groupType, days, discount } = req.body;

  const createdPackage = await BimbelPackageService.createBimbelPackage({
    name,
    level,
    totalMeetings,
    time,
    duration,
    area,
    tutorId,
    groupType,
    days,
    discount
  });

  res.status(201).json(createdPackage);
}

/**
 * Handles the request to create a class bimbel package.
 * 
 * @async
 * @function createClassBimbelPackage
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Resolves with the created bimbel package.
 */
async function createClassBimbelPackage(req, res) {
    const packageData = req.body; 
    const newPackage = await BimbelPackageService.createClassBimbelPackage(packageData); // Panggil service
    res.status(201).json(newPackage);
}


/**
 * Update a bimbel package by ID with new data.
 * 
 * @async
 * @function updateBimbelPackage
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Resolves with the updated bimbel package.
 */
async function updateBimbelPackage(req, res) {
  const { id } = req.params;
  const { name, level, totalMeetings, time, duration, area, tutorId, groupType, days, discount } = req.body;

  const updatedPackage = await BimbelPackageService.updateBimbelPackage(id, {
    name,
    level,
    totalMeetings,
    time,
    duration,
    area,
    tutorId,
    groupType,
    days,
    discount
  });

  res.status(200).json(updatedPackage);
}

/**
 * Updates a class bimbel package by ID with new data.
 *
 * @async
 * @function updateClassBimbelPackage
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Resolves with the updated class bimbel package.
 */
async function updateClassBimbelPackage(req, res) {
  const { id } = req.params;
  const { name, level, totalMeetings, time, duration, area, tutorId, groupType, days, discount } = req.body;

  if (!groupType || !groupType.price) {
    return res.status(400).json({ message: 'Group type price is required' });
  }

  const updatedPackage = await BimbelPackageService.updateClassBimbelPackage(id, {
    name,
    level,
    totalMeetings,
    time,
    duration,
    area,
    tutorId,
    groupType,
    days,
    discount
  });

  res.status(200).json(updatedPackage);
}

/**
 * Delete a bimbel package by ID.
 * 
 * @async
 * @function deleteBimbelPackage
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Resolves with the deletion result.
 */
async function deleteBimbelPackage(req, res) {
    const { id } = req.params;
    await BimbelPackageService.deleteBimbelPackage(id);
    res.status(200).json({ message: 'Bimbel package deleted successfully' });
}

/**
 * Update bimbel package isActive when all schedule have been attended
 *
 * @async
 * @function updateBimbelPackageStatus
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Resolves with the updated bimbel package.
 */
async function updateBimbelPackageStatus(req, res) {
  const { packageId } = req.body;
  const updatedPackage = await BimbelPackageService.updateBimbelPackageStatus(packageId);
  res.status(200).json(updatedPackage);
}

/**
 * Handles the request to get bimbel packages sorted by popularity (number of orders).
 *
 * @async
 * @function getBimbelPackagesByPopularity
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Resolves with the list of bimbel packages sorted by popularity.
 */
async function getBimbelPackagesByPopularity(_req, res) {
  const packages = await BimbelPackageService.getBimbelPackagesByPopularity();
  res.status(200).json(packages);
}

export const BimbelPackageController = {
    getAllBimbelPackages: asyncWrapper(getAllBimbelPackages),
    getBimbelPackageById: asyncWrapper(getBimbelPackageById),
    createBimbelPackage: asyncWrapper(createBimbelPackage),
    createClassBimbelPackage: asyncWrapper(createClassBimbelPackage),
    updateBimbelPackage: asyncWrapper(updateBimbelPackage),
    updateClassBimbelPackage: asyncWrapper(updateClassBimbelPackage),
    deleteBimbelPackage: asyncWrapper(deleteBimbelPackage),
    updateBimbelPackageStatus: asyncWrapper(updateBimbelPackageStatus),
    getBimbelPackagesByPopularity: asyncWrapper(getBimbelPackagesByPopularity),
};