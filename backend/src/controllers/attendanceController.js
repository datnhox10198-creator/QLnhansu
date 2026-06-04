import Attendance from '../models/Attendance.js';
import Employee from '../models/Employee.js';

const localDateKey = (value = new Date()) => {
  const date = new Date(value);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
};

const getCurrentEmployee = async (user) => Employee.findOne({ userId: user._id });

const withDuration = (attendance) => {
  const item = attendance.toObject();
  item.totalMinutes = item.checkOutAt
    ? Math.max(0, Math.round((new Date(item.checkOutAt) - new Date(item.checkInAt)) / 60000))
    : null;
  return item;
};

export const listAttendance = async (req, res) => {
  const filter = {};

  if (req.query.workDate) filter.workDate = req.query.workDate;

  if (req.user.role === 'admin') {
    if (req.query.departmentId) {
      const employees = await Employee.find({ departmentId: req.query.departmentId }).select('_id');
      filter.employeeId = { $in: employees.map((employee) => employee._id) };
    }
  } else {
    const employee = await getCurrentEmployee(req.user);
    if (!employee) return res.json([]);
    filter.employeeId = employee._id;
  }

  const rows = await Attendance.find(filter)
    .populate({ path: 'employeeId', populate: { path: 'departmentId' } })
    .sort({ workDate: -1, checkInAt: -1 });

  res.json(rows.map(withDuration));
};

export const todayAttendance = async (req, res) => {
  const employee = await getCurrentEmployee(req.user);
  if (!employee) return res.status(404).json({ message: 'Khong tim thay ho so nhan vien' });

  const attendance = await Attendance.findOne({ employeeId: employee._id, workDate: localDateKey() })
    .populate({ path: 'employeeId', populate: { path: 'departmentId' } });

  res.json(attendance ? withDuration(attendance) : null);
};

export const checkIn = async (req, res) => {
  if (req.user.role === 'admin') return res.status(403).json({ message: 'Admin khong can cham cong' });

  const employee = await getCurrentEmployee(req.user);
  if (!employee) return res.status(404).json({ message: 'Khong tim thay ho so nhan vien' });

  const workDate = localDateKey();
  const existed = await Attendance.findOne({ employeeId: employee._id, workDate });
  if (existed) return res.status(400).json({ message: 'Hom nay da check-in' });

  const attendance = await Attendance.create({
    employeeId: employee._id,
    workDate,
    checkInAt: new Date()
  });

  res.status(201).json(withDuration(await attendance.populate({ path: 'employeeId', populate: { path: 'departmentId' } })));
};

export const checkOut = async (req, res) => {
  if (req.user.role === 'admin') return res.status(403).json({ message: 'Admin khong can cham cong' });

  const employee = await getCurrentEmployee(req.user);
  if (!employee) return res.status(404).json({ message: 'Khong tim thay ho so nhan vien' });

  const attendance = await Attendance.findOne({ employeeId: employee._id, workDate: localDateKey() });
  if (!attendance) return res.status(400).json({ message: 'Can check-in truoc khi check-out' });
  if (attendance.checkOutAt) return res.status(400).json({ message: 'Hom nay da check-out' });

  attendance.checkOutAt = new Date();
  attendance.status = 'Completed';
  await attendance.save();

  res.json(withDuration(await attendance.populate({ path: 'employeeId', populate: { path: 'departmentId' } })));
};
