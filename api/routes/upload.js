import { Router } from 'express';
import multer from 'multer';
import { uploadFile, serveFile, ALLOWED_MIMES } from '../controllers/uploadController.js';
import { requireAdmin } from '../middleware/auth.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    // First gate (client claim). Second gate is magic-byte sniffing in the controller.
    // SVG deliberately rejected — it is XML and can embed scripts.
    const mime = file.mimetype === 'image/jpg' ? 'image/jpeg' : file.mimetype;
    if (ALLOWED_MIMES.has(mime)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, WebP or GIF images allowed'));
    }
  },
});

// Wrap multer so filter/limit errors return JSON (not an HTML 500 page).
const uploadSingle = (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    next();
  });
};

const router = Router();

router.post('/', requireAdmin, uploadSingle, uploadFile);
// Public: serve image bytes from DB (no auth, so <img> works).
// Served bytes are magic-byte verified + nosniff + sandboxed (see controller).
router.get('/:id/file', serveFile);

export default router;
