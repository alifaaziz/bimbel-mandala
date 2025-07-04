import { Router } from 'express';
import { BimbelPackageController } from '../controllers/package.js';
import { AuthMiddleware } from '../middlewares/auth.js';

export default (app) => {
    const router = Router();

    app.use('/packages', router);

    router.get('/', BimbelPackageController.getActiveBimbelPackages);

    router.get('/all', BimbelPackageController.getAllBimbelPackages);

    router.get('/populer', BimbelPackageController.getBimbelPackagesByPopularity);
    
    router.get('/filtered', BimbelPackageController.getFilteredBimbelPackages);
    
    router.get('/running', AuthMiddleware.isAuthorized, BimbelPackageController.getRunningPrograms);

    router.get('/recommendations', AuthMiddleware.isAuthorized, BimbelPackageController.getRecommendations);
    
    router.get('/my', AuthMiddleware.isAuthorized, BimbelPackageController.getMyPackages);
    
    router.get('/my/:slug', AuthMiddleware.isAuthorized, BimbelPackageController.getMyPackageBySlug);
    
    router.get('/statistics', AuthMiddleware.isAuthorized, AuthMiddleware.hasRole(['admin']), BimbelPackageController.getBimbelPackageStatistics);
    
    router.get('/statistics/my', AuthMiddleware.isAuthorized, BimbelPackageController.getMyProgramsStatistics);
    
    router.get('/:slug', AuthMiddleware.isAuthorized, BimbelPackageController.getBimbelPackageBySlug);
    
    router.post('/', AuthMiddleware.isAuthorized, AuthMiddleware.hasRole(['admin']), BimbelPackageController.createBimbelPackage);
    
    router.post('/class', AuthMiddleware.isAuthorized, AuthMiddleware.hasRole(['admin']), BimbelPackageController.createClassBimbelPackage);
    
    router.patch('/:slug', AuthMiddleware.isAuthorized, AuthMiddleware.hasRole(['admin']), BimbelPackageController.updateBimbelPackage);
    
    router.patch('/class/:id', AuthMiddleware.isAuthorized, AuthMiddleware.hasRole(['admin']), BimbelPackageController.updateClassBimbelPackage);
    
    router.delete('/:id', AuthMiddleware.isAuthorized, AuthMiddleware.hasRole(['admin']), BimbelPackageController.deleteBimbelPackage);
    
    router.post('/status', AuthMiddleware.isAuthorized, AuthMiddleware.hasRole(['admin']), BimbelPackageController.updateBimbelPackageStatus);
    
}

