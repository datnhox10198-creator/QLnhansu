import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Attendance from '../models/Attendance.js';
import Department from '../models/Department.js';
import Employee from '../models/Employee.js';
import LeaveRequest from '../models/LeaveRequest.js';
import User from '../models/User.js';
import WorkTask from '../models/WorkTask.js';

dotenv.config();

const run = async () => {
  await connectDB();
  await Promise.all([User.deleteMany(), Department.deleteMany(), Employee.deleteMany(), LeaveRequest.deleteMany(), Attendance.deleteMany(), WorkTask.deleteMany()]);

  const [hr, it, finance] = await Department.create([
    { departmentName: 'Nhan su', description: 'Tuyen dung, dao tao va chinh sach nhan su' },
    { departmentName: 'Cong nghe thong tin', description: 'Phat trien va van hanh he thong' },
    { departmentName: 'Tai chinh', description: 'Ke toan, ngan sach va bao cao tai chinh' }
  ]);

  const [admin, an, binh, chi, dung, em, giang, hanh, khang, linh] = await User.create([
    { fullName: 'Quan tri vien', email: 'admin@hrms.local', password: 'Admin@123', phone: '0900000000', role: 'admin' },
    { fullName: 'Nguyen Van An', email: 'an.nguyen@hrms.local', password: 'User@123', phone: '0911000001', role: 'user' },
    { fullName: 'Tran Thi Binh', email: 'binh.tran@hrms.local', password: 'User@123', phone: '0911000002', role: 'user' },
    { fullName: 'Le Minh Chi', email: 'chi.le@hrms.local', password: 'User@123', phone: '0911000003', role: 'user' },
    { fullName: 'Pham Quoc Dung', email: 'dung.pham@hrms.local', password: 'User@123', phone: '0911000004', role: 'user' },
    { fullName: 'Vo Thi Em', email: 'em.vo@hrms.local', password: 'User@123', phone: '0911000005', role: 'user' },
    { fullName: 'Do Minh Giang', email: 'giang.do@hrms.local', password: 'User@123', phone: '0911000006', role: 'user' },
    { fullName: 'Hoang Thu Hanh', email: 'hanh.hoang@hrms.local', password: 'User@123', phone: '0911000007', role: 'user' },
    { fullName: 'Bui Nam Khang', email: 'khang.bui@hrms.local', password: 'User@123', phone: '0911000008', role: 'user' },
    { fullName: 'Dang My Linh', email: 'linh.dang@hrms.local', password: 'User@123', phone: '0911000009', role: 'user' }
  ]);

  const employees = await Employee.create([
    {
      userId: an._id,
      employeeCode: 'NV001',
      fullName: 'Nguyen Van An',
      gender: 'Male',
      birthDate: '1998-04-12',
      phone: '0911000001',
      email: 'an.nguyen@hrms.local',
      address: 'Quan 1, TP HCM',
      position: 'Trưởng phòng',
      salary: 14000000,
      departmentId: hr._id
    },
    {
      userId: binh._id,
      employeeCode: 'NV002',
      fullName: 'Tran Thi Binh',
      gender: 'Female',
      birthDate: '1997-09-21',
      phone: '0911000002',
      email: 'binh.tran@hrms.local',
      address: 'Quan Binh Thanh, TP HCM',
      position: 'Trưởng phòng',
      salary: 18000000,
      departmentId: it._id
    },
    {
      userId: chi._id,
      employeeCode: 'NV003',
      fullName: 'Le Minh Chi',
      gender: 'Other',
      birthDate: '1996-02-08',
      phone: '0911000003',
      email: 'chi.le@hrms.local',
      address: 'Quan 3, TP HCM',
      position: 'Trưởng phòng',
      salary: 16000000,
      departmentId: finance._id
    },
    {
      userId: dung._id,
      employeeCode: 'NV004',
      fullName: 'Pham Quoc Dung',
      gender: 'Male',
      birthDate: '1999-11-17',
      phone: '0911000004',
      email: 'dung.pham@hrms.local',
      address: 'Quan 7, TP HCM',
      position: 'Nhân sự',
      salary: 12000000,
      departmentId: hr._id
    },
    {
      userId: em._id,
      employeeCode: 'NV005',
      fullName: 'Vo Thi Em',
      gender: 'Female',
      birthDate: '2000-05-25',
      phone: '0911000005',
      email: 'em.vo@hrms.local',
      address: 'Thu Duc, TP HCM',
      position: 'Nhân sự',
      salary: 11500000,
      departmentId: hr._id
    },
    {
      userId: giang._id,
      employeeCode: 'NV006',
      fullName: 'Do Minh Giang',
      gender: 'Male',
      birthDate: '1998-12-04',
      phone: '0911000006',
      email: 'giang.do@hrms.local',
      address: 'Quan 10, TP HCM',
      position: 'Nhân sự',
      salary: 15000000,
      departmentId: it._id
    },
    {
      userId: hanh._id,
      employeeCode: 'NV007',
      fullName: 'Hoang Thu Hanh',
      gender: 'Female',
      birthDate: '1999-07-14',
      phone: '0911000007',
      email: 'hanh.hoang@hrms.local',
      address: 'Quan Phu Nhuan, TP HCM',
      position: 'Nhân sự',
      salary: 14500000,
      departmentId: it._id
    },
    {
      userId: khang._id,
      employeeCode: 'NV008',
      fullName: 'Bui Nam Khang',
      gender: 'Male',
      birthDate: '1997-03-19',
      phone: '0911000008',
      email: 'khang.bui@hrms.local',
      address: 'Quan 5, TP HCM',
      position: 'Nhân sự',
      salary: 13000000,
      departmentId: finance._id
    },
    {
      userId: linh._id,
      employeeCode: 'NV009',
      fullName: 'Dang My Linh',
      gender: 'Female',
      birthDate: '2001-01-30',
      phone: '0911000009',
      email: 'linh.dang@hrms.local',
      address: 'Quan 4, TP HCM',
      position: 'Nhân sự',
      salary: 12500000,
      departmentId: finance._id
    }
  ]);

  await Promise.all([
    Department.findByIdAndUpdate(hr._id, { managerId: employees[0]._id }),
    Department.findByIdAndUpdate(it._id, { managerId: employees[1]._id }),
    Department.findByIdAndUpdate(finance._id, { managerId: employees[2]._id })
  ]);

  await LeaveRequest.create([
    { employeeId: employees[3]._id, leaveDate: '2026-06-03', reason: 'Nghi viec gia dinh', status: 'Pending' },
    { employeeId: employees[4]._id, leaveDate: '2026-06-04', reason: 'Kham suc khoe', status: 'Approved' },
    { employeeId: employees[5]._id, leaveDate: '2026-06-05', reason: 'Nghi ca nhan', status: 'Pending' },
    { employeeId: employees[6]._id, leaveDate: '2026-06-08', reason: 'Co viec dot xuat', status: 'Rejected' },
    { employeeId: employees[7]._id, leaveDate: '2026-06-10', reason: 'Cham soc nguoi than', status: 'Pending' },
    { employeeId: employees[8]._id, leaveDate: '2026-06-12', reason: 'Di cong viec gia dinh', status: 'Approved' },
    { employeeId: employees[0]._id, leaveDate: '2026-06-15', reason: 'Nghi phep nam', status: 'Pending' },
    { employeeId: employees[1]._id, leaveDate: '2026-06-16', reason: 'Nghi ca nhan', status: 'Pending' },
    { employeeId: employees[2]._id, leaveDate: '2026-06-17', reason: 'Kham suc khoe dinh ky', status: 'Pending' }
  ]);

  await Attendance.create([
    { employeeId: employees[3]._id, workDate: '2026-06-04', checkInAt: new Date('2026-06-04T01:05:00.000Z'), checkOutAt: new Date('2026-06-04T10:10:00.000Z'), status: 'Completed' },
    { employeeId: employees[4]._id, workDate: '2026-06-04', checkInAt: new Date('2026-06-04T01:15:00.000Z'), status: 'CheckedIn' },
    { employeeId: employees[5]._id, workDate: '2026-06-04', checkInAt: new Date('2026-06-04T01:00:00.000Z'), checkOutAt: new Date('2026-06-04T09:45:00.000Z'), status: 'Completed' },
    { employeeId: employees[6]._id, workDate: '2026-06-04', checkInAt: new Date('2026-06-04T01:25:00.000Z'), status: 'CheckedIn' },
    { employeeId: employees[7]._id, workDate: '2026-06-04', checkInAt: new Date('2026-06-04T00:55:00.000Z'), checkOutAt: new Date('2026-06-04T09:30:00.000Z'), status: 'Completed' },
    { employeeId: employees[8]._id, workDate: '2026-06-04', checkInAt: new Date('2026-06-04T01:20:00.000Z'), status: 'CheckedIn' }
  ]);

  console.log('Seed completed');
  console.log('Admin: admin@hrms.local / Admin@123');
  console.log('Managers: an.nguyen@hrms.local, binh.tran@hrms.local, chi.le@hrms.local / User@123');
  console.log('Employees: dung.pham@hrms.local, em.vo@hrms.local, giang.do@hrms.local, hanh.hoang@hrms.local, khang.bui@hrms.local, linh.dang@hrms.local / User@123');
  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
