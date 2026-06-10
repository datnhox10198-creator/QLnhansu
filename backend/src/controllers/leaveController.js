import Employee from '../models/Employee.js';
import Department from '../models/Department.js';
import LeaveRequest from '../models/LeaveRequest.js';
import { ensureEnglishTranslation, translateFields, translateToEnglish } from '../utils/translation.js';

const getApprovalContext = async (user) => {
  const employee = await Employee.findOne({ userId: user._id });
  if (!employee) return { employee: null, managedDepartmentIds: [], managedEmployeeIds: [] };

  const managedDepartments = await Department.find({ managerId: employee._id }).select('_id');
  const managedDepartmentIds = managedDepartments.map((department) => department._id);
  const managedEmployees = managedDepartmentIds.length
    ? await Employee.find({ departmentId: { $in: managedDepartmentIds } }).select('_id')
    : [];

  return {
    employee,
    managedDepartmentIds,
    managedEmployeeIds: managedEmployees.map((item) => item._id)
  };
};

const canApproveLeave = (leave, user, managedEmployeeIds) => {
  if (user.role === 'admin') return true;
  return managedEmployeeIds.some((employeeId) => leave.employeeId?._id?.equals(employeeId) || leave.employeeId?.equals(employeeId));
};

export const listLeaves = async (req, res) => {
  const filter = {};
  const context = req.user.role === 'user' ? await getApprovalContext(req.user) : null;

  if (req.user.role === 'user') {
    if (!context.employee) return res.json([]);
    filter.employeeId = context.managedEmployeeIds.length
      ? { $in: context.managedEmployeeIds }
      : context.employee._id;
  }

  const leaves = await LeaveRequest.find(filter)
    .populate({ path: 'employeeId', populate: { path: 'departmentId', populate: { path: 'managerId' } } })
    .sort({ createdAt: -1 });
  await Promise.all(leaves.map((leave) => ensureEnglishTranslation(leave, ['reason'])));

  res.json(leaves.map((leave) => ({
    ...leave.toObject(),
    canApprove: canApproveLeave(leave, req.user, context?.managedEmployeeIds || [])
  })));
};

export const createLeave = async (req, res) => {
  const employee = req.user.role === 'admin'
    ? await Employee.findById(req.body.employeeId)
    : await Employee.findOne({ userId: req.user._id });

  if (!employee) return res.status(404).json({ message: 'Khong tim thay nhan vien' });

  const leave = await LeaveRequest.create({
    employeeId: employee._id,
    leaveDate: req.body.leaveDate,
    reason: req.body.reason,
    translations: { en: await translateFields(req.body, ['reason']) }
  });

  res.status(201).json(await leave.populate('employeeId'));
};

export const updateLeave = async (req, res) => {
  const leave = await LeaveRequest.findById(req.params.id);
  if (!leave) return res.status(404).json({ message: 'Khong tim thay don nghi phep' });

  if (req.user.role === 'admin') {
    leave.status = req.body.status ?? leave.status;
    leave.leaveDate = req.body.leaveDate ?? leave.leaveDate;
    leave.reason = req.body.reason ?? leave.reason;
    if (req.body.reason) leave.set('translations.en.reason', await translateToEnglish(req.body.reason));
  } else {
    const context = await getApprovalContext(req.user);
    const isManagerOfLeave = canApproveLeave(leave, req.user, context.managedEmployeeIds);

    if (req.body.status && isManagerOfLeave && leave.status === 'Pending') {
      leave.status = req.body.status;
      await leave.save();
      const populated = await leave.populate({ path: 'employeeId', populate: { path: 'departmentId', populate: { path: 'managerId' } } });
      return res.json({ ...populated.toObject(), canApprove: true });
    }

    if (!context.employee || !leave.employeeId.equals(context.employee._id) || leave.status !== 'Pending') {
      return res.status(403).json({ message: 'Khong the sua don nay' });
    }
    leave.leaveDate = req.body.leaveDate ?? leave.leaveDate;
    leave.reason = req.body.reason ?? leave.reason;
    if (req.body.reason) leave.set('translations.en.reason', await translateToEnglish(req.body.reason));
  }

  await leave.save();
  const populated = await leave.populate({ path: 'employeeId', populate: { path: 'departmentId', populate: { path: 'managerId' } } });
  res.json({
    ...populated.toObject(),
    canApprove: req.user.role === 'admin'
  });
};

export const deleteLeave = async (req, res) => {
  const leave = await LeaveRequest.findById(req.params.id);
  if (!leave) return res.status(404).json({ message: 'Khong tim thay don nghi phep' });

  if (req.user.role === 'user') {
    const employee = await Employee.findOne({ userId: req.user._id });
    if (!employee || !leave.employeeId.equals(employee._id) || leave.status !== 'Pending') {
      return res.status(403).json({ message: 'Khong the xoa don nay' });
    }
  }

  await leave.deleteOne();
  res.json({ message: 'Da xoa don nghi phep' });
};
