import { Router } from 'express';
import {
  getTasks, createTask, updateTask, deleteTask,
  getActivities, createActivity,
} from '../controllers/workspaceController.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/tasks', requireAdmin, getTasks);
router.post('/tasks', requireAdmin, createTask);
router.put('/tasks/:id', requireAdmin, updateTask);
router.delete('/tasks/:id', requireAdmin, deleteTask);

router.get('/activities', requireAdmin, getActivities);
router.post('/activities', requireAdmin, createActivity);

export default router;
