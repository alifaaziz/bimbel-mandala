import { Router } from 'express';
import { BimbelPackageController } from '../controllers/package.js';
import { AuthMiddleware } from '../middlewares/auth.js';
import { PackageValidationMiddleware } from '../middlewares/validation/package.js';

export default (app) => {
    const router = Router();

    app.use('/packages', router);

    router.get('/', BimbelPackageController.getActiveBimbelPackages);
    
    router.get('/populer', BimbelPackageController.getBimbelPackagesByPopularity);
    
    router.get('/filtered', BimbelPackageController.getFilteredBimbelPackages);
    
    router.get('/running', AuthMiddleware.isAuthorized, BimbelPackageController.getRunningPrograms);
    
    router.get('/recommendations', AuthMiddleware.isAuthorized, BimbelPackageController.getRecommendations);
    
    router.get('/my', AuthMiddleware.isAuthorized, BimbelPackageController.getMyPackages);
    
    router.get('/my/:slug', AuthMiddleware.isAuthorized, BimbelPackageController.getMyPackageBySlug);

    router.get('/user/:userId', AuthMiddleware.isAuthorized, AuthMiddleware.hasRole(['admin']), BimbelPackageController.getBimbelPackagesByUserId);

    router.get('/all', AuthMiddleware.isAuthorized, AuthMiddleware.hasRole(['admin']), BimbelPackageController.getAllBimbelPackages);
    
    router.get('/statistics', AuthMiddleware.isAuthorized, AuthMiddleware.hasRole(['admin']), BimbelPackageController.getBimbelPackageStatistics);
    
    router.get('/statistics/my', AuthMiddleware.isAuthorized, BimbelPackageController.getMyProgramsStatistics);

    router.get('/statistics/:userId', AuthMiddleware.isAuthorized, AuthMiddleware.hasRole(['admin']), BimbelPackageController.getProgramsStatisticsByUserId);
    
    router.get('/:slug', AuthMiddleware.isAuthorized, BimbelPackageController.getBimbelPackageBySlug);
    
    router.post('/', AuthMiddleware.isAuthorized, AuthMiddleware.hasRole(['admin']), PackageValidationMiddleware.isValidCreateBimbelPackagePayload, BimbelPackageController.createBimbelPackage);
    
    router.post('/class', AuthMiddleware.isAuthorized, AuthMiddleware.hasRole(['admin']), PackageValidationMiddleware.isValidCreateClassBimbelPackagePayload, BimbelPackageController.createClassBimbelPackage);
    
    router.patch('/:slug', AuthMiddleware.isAuthorized, AuthMiddleware.hasRole(['admin']), PackageValidationMiddleware.isValidUpdateBimbelPackagePayload, BimbelPackageController.updateBimbelPackage);
    
    router.patch('/class/:slug', AuthMiddleware.isAuthorized, AuthMiddleware.hasRole(['admin']), PackageValidationMiddleware.isValidUpdateClassBimbelPackagePayload, BimbelPackageController.updateClassBimbelPackage);

    router.delete('/:slug', AuthMiddleware.isAuthorized, AuthMiddleware.hasRole(['admin']), BimbelPackageController.deleteBimbelPackage);

    router.post('/status', AuthMiddleware.isAuthorized, AuthMiddleware.hasRole(['admin']), BimbelPackageController.updateBimbelPackageStatus);
    
}

