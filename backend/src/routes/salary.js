import { Router } from 'express';
import { SalaryController } from '../controllers/salary.js';
import { AuthMiddleware } from '../middlewares/auth.js';

const router = Router();

export default (app) => {
    app.use('/salaries', router);

    router.post(
        '/',
        AuthMiddleware.isAuthorized,
        AuthMiddleware.hasRole(['admin']),
        SalaryController.updateSalaryStatus
    );

    router.get(
        '/stats',
        AuthMiddleware.isAuthorized,
        AuthMiddleware.hasRole(['admin']),
        SalaryController.getFinanceStats
    );

    router.get(
        '/recap',
        AuthMiddleware.isAuthorized,
        AuthMiddleware.hasRole(['admin']),
        SalaryController.getFinanceRecap
    );
};