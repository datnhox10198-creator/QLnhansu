import express from 'express';
import { adminStats, userStats } from '../controllers/dashboardController.js';
import { authorize, protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/admin', protect, authorize('admin'), adminStats);
router.get('/user', protect, authorize('user'), userStats);

export default router;
