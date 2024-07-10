import express from 'express';
import multer from 'multer';
import { getData, login, addData } from '../controllers/dataController.js'; // Corrija o caminho se necessário

const router = express.Router();
const upload = multer();

router.get('/data', getData);
router.post('/login', login);
router.post('/data', upload.none(), addData);

export default router;