import { Router } from 'express';
import { scheduleInterview, getInterviews, updateInterview } from '../controllers/interviewController';

const router = Router();

router.post('/', scheduleInterview);
router.get('/', getInterviews);
router.put('/:id', updateInterview);

export default router;
