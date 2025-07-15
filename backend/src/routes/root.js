import { Router } from 'express';

export default (app) => {
  const router = Router();

  app.use('/', router);

  router.get('/', (_req, res) => {
    res.redirect('/docs');
  });

  // router.get('/', (_req, res) => {
  //   const __filename = fileURLToPath(import.meta.url);
  //   const __dirname = path.dirname(__filename);
  //   res.sendFile(path.resolve(__dirname, '../../public/index.html'));
  // });
};
