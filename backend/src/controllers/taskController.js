import Department from '../models/Department.js';
import Employee from '../models/Employee.js';
import WorkTask from '../models/WorkTask.js';

const getCurrentEmployee = async (userId) => Employee.findOne({ userId }).populate('departmentId');

const getManagedDepartment = async (employeeId) => Department.findOne({ managerId: employeeId });

const taskPayload = (task) => {
  const doneCount = task.assignees.filter((assignee) => assignee.status === 'Done').length;
  const progress = task.assignees.length ? Math.round((doneCount / task.assignees.length) * 100) : 0;

  return {
    ...task.toObject(),
    progress,
    doneCount,
    totalAssignees: task.assignees.length
  };
};

export const taskContext = async (req, res) => {
  if (req.user.role === 'admin') {
    const departments = await Department.find({ managerId: { $ne: null } })
      .populate('managerId')
      .sort({ departmentName: 1 });

    return res.json({ employee: null, managedDepartment: null, team: [], departments });
  }

  const employee = await getCurrentEmployee(req.user._id);
  if (!employee) return res.status(404).json({ message: 'Khong tim thay ho so nhan vien' });

  const managedDepartment = await getManagedDepartment(employee._id);
  const team = managedDepartment
    ? await Employee.find({ departmentId: managedDepartment._id, status: 'Active', _id: { $ne: employee._id } }).sort({ fullName: 1 })
    : [];

  res.json({ employee, managedDepartment, team });
};

export const listTasks = async (req, res) => {
  if (req.user.role === 'admin') {
    const filter = { source: 'Admin' };

    if (req.query.workDate) {
      const start = new Date(req.query.workDate);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      filter.workDate = { $gte: start, $lt: end };
    }

    const tasks = await WorkTask.find(filter)
      .populate('departmentId')
      .populate('createdBy')
      .populate('createdByUser')
      .populate('assignees.employeeId')
      .sort({ workDate: -1, createdAt: -1 });

    return res.json({
      canManage: true,
      adminMode: true,
      managedDepartment: null,
      items: tasks.map(taskPayload)
    });
  }

  const employee = await getCurrentEmployee(req.user._id);
  if (!employee) return res.status(404).json({ message: 'Khong tim thay ho so nhan vien' });

  const managedDepartment = await getManagedDepartment(employee._id);
  const filter = managedDepartment
    ? { departmentId: managedDepartment._id }
    : { 'assignees.employeeId': employee._id };

  if (req.query.workDate) {
    const start = new Date(req.query.workDate);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    filter.workDate = { $gte: start, $lt: end };
  }

  const tasks = await WorkTask.find(filter)
    .populate('departmentId')
    .populate('createdBy')
    .populate('createdByUser')
    .populate('assignees.employeeId')
    .sort({ workDate: -1, createdAt: -1 });

  res.json({
    canManage: !!managedDepartment,
    managedDepartment,
    items: tasks.map(taskPayload)
  });
};

export const createTask = async (req, res) => {
  if (req.user.role === 'admin') {
    const departmentIds = [...new Set(req.body.departmentIds || [])];
    if (departmentIds.length < 1) {
      return res.status(400).json({ message: 'Chon it nhat 1 phong ban' });
    }

    const departments = await Department.find({ _id: { $in: departmentIds }, managerId: { $ne: null } }).populate('managerId');
    if (departments.length !== departmentIds.length) {
      return res.status(400).json({ message: 'Chi duoc giao viec cho phong ban da co truong phong' });
    }

    const tasks = await WorkTask.create(departments.map((department) => ({
      title: req.body.title,
      description: req.body.description,
      workDate: req.body.workDate,
      departmentId: department._id,
      createdByUser: req.user._id,
      source: 'Admin',
      assignees: [{ employeeId: department.managerId._id }]
    })));

    const populated = await WorkTask.find({ _id: { $in: tasks.map((task) => task._id) } })
      .populate('departmentId')
      .populate('createdByUser')
      .populate('assignees.employeeId')
      .sort({ departmentId: 1 });

    return res.status(201).json(populated.map(taskPayload));
  }

  const employee = await getCurrentEmployee(req.user._id);
  if (!employee) return res.status(404).json({ message: 'Khong tim thay ho so nhan vien' });

  const managedDepartment = await getManagedDepartment(employee._id);
  if (!managedDepartment) return res.status(403).json({ message: 'Chi truong phong moi duoc giao viec' });

  const assignedEmployeeIds = [...new Set(req.body.assignedEmployeeIds || [])];
  if (assignedEmployeeIds.length < 1 || assignedEmployeeIds.length > 5) {
    return res.status(400).json({ message: 'Chon tu 1 den 5 nhan vien' });
  }

  const employees = await Employee.find({
    _id: { $in: assignedEmployeeIds, $ne: employee._id },
    departmentId: managedDepartment._id,
    status: 'Active'
  });

  if (employees.length !== assignedEmployeeIds.length) {
    return res.status(400).json({ message: 'Chi duoc giao viec cho nhan vien trong phong' });
  }

  const task = await WorkTask.create({
    title: req.body.title,
    description: req.body.description,
    workDate: req.body.workDate,
    departmentId: managedDepartment._id,
    createdBy: employee._id,
    source: 'Manager',
    assignees: assignedEmployeeIds.map((employeeId) => ({ employeeId }))
  });

  const populated = await task.populate(['departmentId', 'createdBy', 'createdByUser', 'assignees.employeeId']);
  res.status(201).json(taskPayload(populated));
};

export const updateMyTaskStatus = async (req, res) => {
  const employee = await getCurrentEmployee(req.user._id);
  if (!employee) return res.status(404).json({ message: 'Khong tim thay ho so nhan vien' });

  if (!['Doing', 'Done'].includes(req.body.status)) {
    return res.status(400).json({ message: 'Trang thai khong hop le' });
  }

  const task = await WorkTask.findOne({ _id: req.params.id, 'assignees.employeeId': employee._id });
  if (!task) return res.status(404).json({ message: 'Khong tim thay cong viec duoc giao' });

  const assignee = task.assignees.find((item) => item.employeeId.toString() === employee._id.toString());
  assignee.status = req.body.status;
  assignee.updatedAt = new Date();
  await task.save();

  const populated = await task.populate(['departmentId', 'createdBy', 'createdByUser', 'assignees.employeeId']);
  res.json(taskPayload(populated));
};
