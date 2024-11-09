import { Router } from 'express';
import {
  createActivityController,
  getAllActivitiesController,
  getActivityController,
  updateActivityController,
  deleteActivityController,
  trackAttendancesController,
  getActivityReportController,
  createMilestoneController,
} from '@/v1/controllers';

const router = Router();

router.get('/activities', getAllActivitiesController);
router.post('/activities', createActivityController);
router.get('/activities/:id', getActivityController);
router.put('/activities/:id', updateActivityController);
router.delete('/activities/:id', deleteActivityController);

router.post('/attendances', trackAttendancesController);
router.post('/milestones', createMilestoneController);

router.get('/activities/:id/report', getActivityReportController);

export default router;
