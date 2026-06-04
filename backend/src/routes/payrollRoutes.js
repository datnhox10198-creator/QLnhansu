import express from 'express';
import { departmentPayrollSummary, myPayrollSlip } from '../controllers/payrollController.js';
import { authorize, protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.get('/me', myPayrollSlip);
router.get('/departments', authorize('admin'), departmentPayrollSummary);

export default router;
