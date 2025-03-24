import { Router } from 'express';
import { BimbelPackageController } from '../controllers/package.js';

export default (app) => {
    const router = Router();

    app.use('/packages', router);

    router.get('/', BimbelPackageController.getAllBimbelPackages);

    router.get('/:id', BimbelPackageController.getBimbelPackageById);

    router.post('/', BimbelPackageController.createBimbelPackage);
}

