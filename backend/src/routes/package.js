import { Router } from 'express';
import { BimbelPackageController } from '../controllers/package.js';
import { AuthMiddleware } from '../middlewares/auth.js';

export default (app) => {
    const router = Router();

    app.use('/packages', router);

    router.get('/', BimbelPackageController.getAllBimbelPackages);

    router.get('/populer', BimbelPackageController.getBimbelPackagesByPopularity);
    
    router.get('/running', AuthMiddleware.isAuthorized, BimbelPackageController.getRunningPrograms);
    
    router.get('/running/my', AuthMiddleware.isAuthorized, BimbelPackageController.getMyRunningPrograms);
    
    router.get('/my', AuthMiddleware.isAuthorized, BimbelPackageController.getMyPackages);
    
    router.get('/completed', AuthMiddleware.isAuthorized, BimbelPackageController.getCompletedPrograms);

    router.get('/completed/my', AuthMiddleware.isAuthorized, BimbelPackageController.getMyCompletedPrograms);
    
    router.get('/:id', AuthMiddleware.isAuthorized, BimbelPackageController.getBimbelPackageById);
    
    router.get('/completed', AuthMiddleware.isAuthorized, BimbelPackageController.getCompletedPrograms);
    
    router.post('/', AuthMiddleware.isAuthorized, AuthMiddleware.hasRole(['admin']), BimbelPackageController.createBimbelPackage);
    
    router.post('/class', AuthMiddleware.isAuthorized, AuthMiddleware.hasRole(['admin']), BimbelPackageController.createClassBimbelPackage);
    
    router.patch('/:id', AuthMiddleware.isAuthorized, AuthMiddleware.hasRole(['admin']), BimbelPackageController.updateBimbelPackage);
    
    router.patch('/class/:id', AuthMiddleware.isAuthorized, AuthMiddleware.hasRole(['admin']), BimbelPackageController.updateClassBimbelPackage);
    
    router.delete('/:id', AuthMiddleware.isAuthorized, AuthMiddleware.hasRole(['admin']), BimbelPackageController.deleteBimbelPackage);
    
    router.post('/status', AuthMiddleware.isAuthorized, AuthMiddleware.hasRole(['admin']), BimbelPackageController.updateBimbelPackageStatus);
    
}

