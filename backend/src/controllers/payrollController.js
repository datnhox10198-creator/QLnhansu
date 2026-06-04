import Department from '../models/Department.js';
import Employee from '../models/Employee.js';

const toPayrollLine = (employee) => {
  const baseSalary = employee.salary || 0;
  return {
    employeeId: employee._id,
    employeeCode: employee.employeeCode,
    fullName: employee.fullName,
    position: employee.position,
    department: employee.departmentId
      ? {
          _id: employee.departmentId._id,
          departmentName: employee.departmentId.departmentName
        }
      : null,
    baseSalary,
    allowance: 0,
    deduction: 0,
    netSalary: baseSalary
  };
};

export const myPayrollSlip = async (req, res) => {
  const employee = await Employee.findOne({ userId: req.user._id }).populate('departmentId');
  if (!employee) return res.status(404).json({ message: 'Khong tim thay ho so nhan vien' });

  res.json({
    period: req.query.period || new Date().toISOString().slice(0, 7),
    slip: toPayrollLine(employee)
  });
};

export const departmentPayrollSummary = async (req, res) => {
  const departments = await Department.find().sort({ departmentName: 1 });
  const employees = await Employee.find({ status: 'Active' })
    .populate('departmentId')
    .sort({ fullName: 1 });

  const employeesByDepartment = employees.reduce((map, employee) => {
    const key = employee.departmentId?._id?.toString();
    if (!key) return map;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(toPayrollLine(employee));
    return map;
  }, new Map());

  const items = departments.map((department) => {
    const payroll = employeesByDepartment.get(department._id.toString()) || [];
    const totalSalary = payroll.reduce((sum, employee) => sum + employee.netSalary, 0);
    const managerId = department.managerId?.toString();
    const managerCount = payroll.filter((employee) => employee.employeeId.toString() === managerId).length;

    return {
      departmentId: department._id,
      departmentName: department.departmentName,
      employeeCount: payroll.length,
      managerCount,
      totalSalary,
      employees: payroll
    };
  });

  res.json({
    period: req.query.period || new Date().toISOString().slice(0, 7),
    totalSalary: items.reduce((sum, item) => sum + item.totalSalary, 0),
    totalEmployees: items.reduce((sum, item) => sum + item.employeeCount, 0),
    items
  });
};
