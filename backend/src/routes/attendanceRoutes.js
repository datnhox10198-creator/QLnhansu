import express from 'express';
import { checkIn, checkOut, listAttendance, todayAttendance } from '../controllers/attendanceController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.get('/', listAttendance);
router.get('/today', todayAttendance);
router.post('/check-in', checkIn);
router.post('/check-out', checkOut);

export default router;
