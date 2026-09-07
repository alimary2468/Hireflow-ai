import { Router } from 'express';
import { triggerScreeningForCandidate, getJobRankings } from '../controllers/screeningController';

const router = Router();

router.post('/:candidateId', triggerScreeningForCandidate);
router.get('/jobs/:jobId/rankings', getJobRankings);

export default router;
