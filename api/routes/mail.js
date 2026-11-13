import { Router } from 'express';
import {
  listThreads,
  getThread,
  sendLetter,
  markThreadRead,
  deleteThread,
  syncNow,
  gmailConnect,
  gmailCallback,
  gmailStatusHandler,
  gmailDisconnect,
} from '../controllers/mailController.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// OAuth callback must run without requireAdmin (no JSON session check issues
// for top-level navigation), but the handler itself verifies the admin session.
router.get('/gmail/callback', gmailCallback);
router.use(requireAdmin);
router.get('/gmail/connect', gmailConnect);
router.get('/gmail/status', gmailStatusHandler);
router.delete('/gmail/disconnect', gmailDisconnect);
router.get('/threads', listThreads);
router.get('/threads/:id', getThread);
router.post('/send', sendLetter);
router.patch('/threads/:id/read', markThreadRead);
router.delete('/threads/:id', deleteThread);
router.post('/sync', syncNow);

export default router;
