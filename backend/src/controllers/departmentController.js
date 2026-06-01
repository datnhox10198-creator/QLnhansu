import Department from '../models/Department.js';
import Employee from '../models/Employee.js';

export const listDepartments = async (req, res) => {
  const departments = await Department.find().populate('managerId').sort({ createdAt: -1 });
  res.json(departments);
};

export const createDepartment = async (req, res) => {
  const payload = { ...req.body, managerId: req.body.managerId || null };
  const department = await Department.create(payload);
  res.status(201).json(await department.populate('managerId'));
};

export const updateDepartment = async (req, res) => {
  const payload = { ...req.body, managerId: req.body.managerId || null };
  const department = await Department.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true }).populate('managerId');
  if (!department) return res.status(404).json({ message: 'Khong tim thay phong ban' });
  res.json(department);
};

export const deleteDepartment = async (req, res) => {
  const used = await Employee.exists({ departmentId: req.params.id });
  if (used) return res.status(400).json({ message: 'Phong ban dang co nhan vien' });

  const department = await Department.findByIdAndDelete(req.params.id);
  if (!department) return res.status(404).json({ message: 'Khong tim thay phong ban' });
  res.json({ message: 'Da xoa phong ban' });
};
