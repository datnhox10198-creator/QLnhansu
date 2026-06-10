import express from 'express';
import { body } from 'express-validator';
import { createEmployee, deleteEmployee, getEmployee, listEmployees, updateEmployee, updateMyProfile } from '../controllers/employeeController.js';
import { authorize, protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();
const employeeRules = [
  body('employeeCode').notEmpty(),
  body('fullName').notEmpty(),
  body('gender').isIn(['Male', 'Female', 'Other']),
  body('birthDate').isISO8601(),
  body('email').isEmail(),
  body('position').isIn(['Nhân sự', 'Trưởng phòng']),
  body('salary').isNumeric(),
  body('departmentId').isMongoId(),
  body('password').optional().isLength({ min: 6 })
];

router.use(protect);
router.get('/', authorize('admin'), listEmployees);
router.get('/:id', authorize('admin'), getEmployee);
router.post('/', authorize('admin'), employeeRules, validate, createEmployee);
router.put('/me/profile', authorize('user'), [body('birthDate').optional().isISO8601()], validate, updateMyProfile);
router.put('/:id', authorize('admin'), employeeRules, validate, updateEmployee);
router.delete('/:id', authorize('admin'), deleteEmployee);

export default router;
