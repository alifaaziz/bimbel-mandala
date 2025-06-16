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
 * Handles only active bimbel packages.
 * 
 * @async
 * @function getActiveBimbelPackages
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Resolves with the list of active bimbel packages. 
 */
async function getActiveBimbelPackages(_req, res) {
    const packages = await BimbelPackageService.getActiveBimbelPackages();
    res.status(200).json(packages);
}

/**
 * Handles the request to get a bimbel package by ID.
 *
 * @async
 * @function getBimbelPackageBySlug
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Resolves with the bimbel package.
 */
async function getBimbelPackageBySlug(req, res) {
    const { slug } = req.params;
    const packages = await BimbelPackageService.getBimbelPackageBySlug(slug);
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

/**
 * Handles the request to get running programs with incomplete schedules.
 *
 * @async
 * @function getRunningPrograms
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Resolves with the list of running programs.
 */
async function getRunningPrograms(_req, res) {
  const runningPrograms = await BimbelPackageService.getRunningPrograms();
  res.status(200).json(runningPrograms);
}

/**
 * Handles the request to get bimbel packages associated with the logged-in tutor.
 *
 * @async
 * @function getMyPackages
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Resolves with the list of bimbel packages for the tutor.
 */
async function getMyPackages(req, res) {
  const user = res.locals.user;
  const packages = await BimbelPackageService.getMyPackages(user);
  res.status(200).json(packages);
}

/**
 * Handles the request to get a bimbel package by ID associated with the logged-in user.
 *
 * @async
 * @function getMyPackageBySlug
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Resolves with the bimbel package or an error if not found.
 */
async function getMyPackageBySlug(req, res) {
  const { slug } = req.params;
  const user = res.locals.user;
  const pkg = await BimbelPackageService.getMyPackageBySlug(slug, user);

  if (!pkg) {
    return res.status(404).json({ error: 'Bimbel package not found or not associated with the user' });
  }

  res.status(200).json(pkg);
}

/**
 * Handles the request to get statistics for bimbel packages.
 *
 * @async
 * @function getBimbelPackageStatistics
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Resolves with the statistics data.
 */
async function getBimbelPackageStatistics(_req, res) {
  const statistics = await BimbelPackageService.getBimbelPackageStatistics();
  res.status(200).json(statistics);
}

/**
 * Handles the request to get statistics for logged-in user.
 * 
 * @async
 * @function getMyProgramsStatistics
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
async function getMyProgramsStatistics(req, res) {
  const user = res.locals.user; // Retrieve user from auth middleware
  const statistics = await BimbelPackageService.getMyProgramsStatistics(user);
  res.status(200).json(statistics);
}

/**
 * Handles the request to get recommended bimbel packages for the logged-in user.
 *
 * @async
 * @function getRecommendations
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} Resolves with the list of recommended bimbel packages or null if not a student.
 */
async function getRecommendations(req, res) {
  const user = res.locals.user;
  const recommendations = await BimbelPackageService.getRecommendations(user);

  if (!recommendations) {
    return res.status(200).json({ message: 'No recommendations available for this user.' });
  }

  res.status(200).json(recommendations);
}

export const BimbelPackageController = {
    getAllBimbelPackages: asyncWrapper(getAllBimbelPackages),
    getActiveBimbelPackages: asyncWrapper(getActiveBimbelPackages),
    getBimbelPackageBySlug: asyncWrapper(getBimbelPackageBySlug),
    createBimbelPackage: asyncWrapper(createBimbelPackage),
    createClassBimbelPackage: asyncWrapper(createClassBimbelPackage),
    updateBimbelPackage: asyncWrapper(updateBimbelPackage),
    updateClassBimbelPackage: asyncWrapper(updateClassBimbelPackage),
    deleteBimbelPackage: asyncWrapper(deleteBimbelPackage),
    updateBimbelPackageStatus: asyncWrapper(updateBimbelPackageStatus),
    getBimbelPackagesByPopularity: asyncWrapper(getBimbelPackagesByPopularity),
    getRunningPrograms: asyncWrapper(getRunningPrograms),
    getMyPackages: asyncWrapper(getMyPackages),
    getMyPackageBySlug: asyncWrapper(getMyPackageBySlug),
    getBimbelPackageStatistics: asyncWrapper(getBimbelPackageStatistics),
    getMyProgramsStatistics: asyncWrapper(getMyProgramsStatistics),
    getRecommendations: asyncWrapper(getRecommendations)
};