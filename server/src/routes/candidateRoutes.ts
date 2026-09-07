import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { uploadAndScreenCV, getCandidates, getCandidateById, updateCandidateStatus } from '../controllers/candidateController';

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowed = ['.pdf', '.doc', '.docx', '.txt'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, and DOCX formats are supported.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

const router = Router();

router.post('/upload', upload.single('cv'), uploadAndScreenCV);
router.get('/', getCandidates);
router.get('/:id', getCandidateById);
router.put('/:id/status', updateCandidateStatus);

export default router;
