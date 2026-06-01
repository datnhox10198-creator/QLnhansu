import express from 'express';
import { body } from 'express-validator';
import { createDepartment, deleteDepartment, listDepartments, updateDepartment } from '../controllers/departmentController.js';
import { authorize, protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.use(protect);
router.get('/', listDepartments);
router.post('/', authorize('admin'), [body('departmentName').notEmpty(), body('managerId').optional({ checkFalsy: true }).isMongoId()], validate, createDepartment);
router.put('/:id', authorize('admin'), [body('departmentName').notEmpty(), body('managerId').optional({ checkFalsy: true }).isMongoId()], validate, updateDepartment);
router.delete('/:id', authorize('admin'), deleteDepartment);

export default router;
