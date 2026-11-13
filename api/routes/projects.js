import { Router } from 'express';
import { getAll, getBySlug, create, update, remove } from '../controllers/projectsController.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', getAll);
router.get('/:slug', getBySlug);
router.post('/', requireAdmin, create);
router.put('/:id', requireAdmin, update);
router.delete('/:id', requireAdmin, remove);

export default router;
