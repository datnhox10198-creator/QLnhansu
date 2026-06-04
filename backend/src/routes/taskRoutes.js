import express from 'express';
import { body } from 'express-validator';
import { createTask, listTasks, taskContext, updateMyTaskStatus } from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.use(protect);
router.get('/context', taskContext);
router.get('/', listTasks);
router.post(
  '/',
  [
    body('title').notEmpty(),
    body('description').notEmpty(),
    body('workDate').isISO8601(),
    body('assignedEmployeeIds').custom((value, { req }) => req.user.role === 'admin' || (Array.isArray(value) && value.length >= 1 && value.length <= 5)),
    body('assignedEmployeeIds.*').optional().isMongoId(),
    body('departmentIds').custom((value, { req }) => req.user.role !== 'admin' || (Array.isArray(value) && value.length >= 1)),
    body('departmentIds.*').optional().isMongoId()
  ],
  validate,
  createTask
);
router.patch('/:id/status', [body('status').isIn(['Doing', 'Done'])], validate, updateMyTaskStatus);

export default router;
