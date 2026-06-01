import express from 'express';
import { body } from 'express-validator';
import { createLeave, deleteLeave, listLeaves, updateLeave } from '../controllers/leaveController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.use(protect);
router.get('/', listLeaves);
router.post('/', [body('leaveDate').isISO8601(), body('reason').notEmpty()], validate, createLeave);
router.put('/:id', [body('status').optional().isIn(['Pending', 'Approved', 'Rejected'])], validate, updateLeave);
router.delete('/:id', deleteLeave);

export default router;
