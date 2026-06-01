import Department from '../models/Department.js';
import Employee from '../models/Employee.js';
import LeaveRequest from '../models/LeaveRequest.js';

export const adminStats = async (req, res) => {
  const [totalEmployees, totalDepartments, totalLeaves, pendingLeaves, approvedLeaves] = await Promise.all([
    Employee.countDocuments(),
    Department.countDocuments(),
    LeaveRequest.countDocuments(),
    LeaveRequest.countDocuments({ status: 'Pending' }),
    LeaveRequest.countDocuments({ status: 'Approved' })
  ]);

  res.json({ totalEmployees, totalDepartments, totalLeaves, pendingLeaves, approvedLeaves });
};

export const userStats = async (req, res) => {
  const employee = await Employee.findOne({ userId: req.user._id });
  if (!employee) return res.status(404).json({ message: 'Khong tim thay ho so nhan vien' });

  const [totalLeaves, pendingLeaves, approvedLeaves, rejectedLeaves] = await Promise.all([
    LeaveRequest.countDocuments({ employeeId: employee._id }),
    LeaveRequest.countDocuments({ employeeId: employee._id, status: 'Pending' }),
    LeaveRequest.countDocuments({ employeeId: employee._id, status: 'Approved' }),
    LeaveRequest.countDocuments({ employeeId: employee._id, status: 'Rejected' })
  ]);

  res.json({ totalLeaves, pendingLeaves, approvedLeaves, rejectedLeaves });
};
