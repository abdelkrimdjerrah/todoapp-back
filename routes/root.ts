import { Router } from 'express';
import path from 'path';

const router: Router = Router();

router.get(['^/$', '/index(.html)?'], (req: any, res: any) => {
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

module.exports = router;