import { Router } from 'express';
import {
  submitMessage,
  listMessages,
  unreadCount,
  setRead,
  removeMessage,
} from '../controllers/contactController.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.post('/', submitMessage);
router.get('/', requireAdmin, listMessages);
router.get('/unread-count', requireAdmin, unreadCount);
router.patch('/:id', requireAdmin, setRead);
router.delete('/:id', requireAdmin, removeMessage);

export default router;
