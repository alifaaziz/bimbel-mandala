import { Router } from 'express';

export default (app) => {
  const router = Router();

  app.use('/', router);

  router.get('/', (_req, res) => {
    res.redirect('/docs');
  });
};
