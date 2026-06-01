import Employee from '../models/Employee.js';
import Department from '../models/Department.js';
import User from '../models/User.js';

export const listEmployees = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 8;
  const skip = (page - 1) * limit;
  const filter = {};

  if (req.query.search) filter.fullName = { $regex: req.query.search, $options: 'i' };
  if (req.query.departmentId) filter.departmentId = req.query.departmentId;

  const [items, total] = await Promise.all([
    Employee.find(filter).populate('departmentId').sort({ createdAt: -1 }).skip(skip).limit(limit),
    Employee.countDocuments(filter)
  ]);

  res.json({ items, total, page, pages: Math.ceil(total / limit) || 1 });
};

export const getEmployee = async (req, res) => {
  const employee = await Employee.findById(req.params.id).populate('departmentId');
  if (!employee) return res.status(404).json({ message: 'Khong tim thay nhan vien' });
  res.json(employee);
};

export const createEmployee = async (req, res) => {
  const employee = await Employee.create(req.body);
  res.status(201).json(await employee.populate('departmentId'));
};

export const updateEmployee = async (req, res) => {
  const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('departmentId');
  if (!employee) return res.status(404).json({ message: 'Khong tim thay nhan vien' });
  res.json(employee);
};

export const updateMyProfile = async (req, res) => {
  const employee = await Employee.findOneAndUpdate(
    { userId: req.user._id },
    {
      phone: req.body.phone,
      address: req.body.address,
      birthDate: req.body.birthDate
    },
    { new: true, runValidators: true }
  ).populate('departmentId');

  if (!employee) return res.status(404).json({ message: 'Khong tim thay ho so nhan vien' });
  await User.findByIdAndUpdate(req.user._id, { phone: req.body.phone });
  res.json(employee);
};

export const deleteEmployee = async (req, res) => {
  const employee = await Employee.findByIdAndDelete(req.params.id);
  if (!employee) return res.status(404).json({ message: 'Khong tim thay nhan vien' });
  await Department.updateMany({ managerId: employee._id }, { $set: { managerId: null } });
  res.json({ message: 'Da xoa nhan vien' });
};
