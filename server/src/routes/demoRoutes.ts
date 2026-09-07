import { Router } from 'express';
import { resetAndSeedDemo } from '../controllers/demoController';

const router = Router();

router.post('/seed', resetAndSeedDemo);

export default router;
