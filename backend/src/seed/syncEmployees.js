import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Department from '../models/Department.js';
import Employee from '../models/Employee.js';
import User from '../models/User.js';

dotenv.config();

const defaultPassword = process.env.SEED_USER_PASSWORD || 'User@123';

const departmentUpdates = [
  {
    aliases: ['Nhan su', 'Nhân sự'],
    departmentName: 'Nhân sự',
    description: 'Tuyển dụng, đào tạo và chính sách nhân sự'
  },
  {
    aliases: ['Cong nghe thong tin', 'Công nghệ thông tin'],
    departmentName: 'Công nghệ thông tin',
    description: 'Phát triển và vận hành hệ thống'
  },
  {
    aliases: ['Tai chinh', 'Tài chính'],
    departmentName: 'Tài chính',
    description: 'Kế toán, ngân sách và báo cáo tài chính'
  }
];

const existingPeople = [
  ['NV001', 'Nguyễn Văn An', 'an.nguyen@hrms.local'],
  ['NV002', 'Trần Thị Bình', 'binh.tran@hrms.local'],
  ['NV003', 'Lê Minh Chi', 'chi.le@hrms.local'],
  ['NV004', 'Phạm Quốc Dũng', 'dung.pham@hrms.local'],
  ['NV005', 'Võ Thị Em', 'em.vo@hrms.local'],
  ['NV006', 'Đỗ Minh Giang', 'giang.do@hrms.local'],
  ['NV007', 'Hoàng Thu Hạnh', 'hanh.hoang@hrms.local'],
  ['NV008', 'Bùi Nam Khang', 'khang.bui@hrms.local'],
  ['NV009', 'Đặng Mỹ Linh', 'linh.dang@hrms.local']
];

const newPeople = [
  {
    employeeCode: 'NV010',
    fullName: 'Nguyễn Hoàng Minh',
    gender: 'Male',
    birthDate: '1998-08-16',
    phone: '0923000010',
    email: 'minh.nguyen@hrms.local',
    address: 'Quận Gò Vấp, TP. Hồ Chí Minh',
    salary: 13500000,
    department: 'Nhân sự'
  },
  {
    employeeCode: 'NV011',
    fullName: 'Trần Ngọc Mai',
    gender: 'Female',
    birthDate: '2000-03-22',
    phone: '0923000011',
    email: 'mai.tran@hrms.local',
    address: 'Quận Tân Bình, TP. Hồ Chí Minh',
    salary: 12800000,
    department: 'Tài chính'
  },
  {
    employeeCode: 'NV012',
    fullName: 'Lê Đức Anh',
    gender: 'Male',
    birthDate: '1997-12-09',
    phone: '0923000012',
    email: 'anh.le@hrms.local',
    address: 'Thành phố Thủ Đức, TP. Hồ Chí Minh',
    salary: 17500000,
    department: 'Công nghệ thông tin'
  },
  {
    employeeCode: 'NV013',
    fullName: 'Phạm Thảo Nguyên',
    gender: 'Female',
    birthDate: '2001-06-18',
    phone: '0923000013',
    email: 'nguyen.pham@hrms.local',
    address: 'Quận 3, TP. Hồ Chí Minh',
    salary: 12300000,
    department: 'Nhân sự'
  },
  {
    employeeCode: 'NV014',
    fullName: 'Vũ Thành Đạt',
    gender: 'Male',
    birthDate: '1996-10-27',
    phone: '0923000014',
    email: 'dat.vu@hrms.local',
    address: 'Quận Bình Thạnh, TP. Hồ Chí Minh',
    salary: 18200000,
    department: 'Công nghệ thông tin'
  },
  {
    employeeCode: 'NV015',
    fullName: 'Đặng Khánh Vy',
    gender: 'Female',
    birthDate: '2000-11-04',
    phone: '0923000015',
    email: 'vy.dang@hrms.local',
    address: 'Quận 7, TP. Hồ Chí Minh',
    salary: 13200000,
    department: 'Tài chính'
  },
  {
    employeeCode: 'NV016',
    fullName: 'Bùi Quang Huy',
    gender: 'Male',
    birthDate: '1999-01-15',
    phone: '0923000016',
    email: 'huy.bui@hrms.local',
    address: 'Quận 10, TP. Hồ Chí Minh',
    salary: 16800000,
    department: 'Công nghệ thông tin'
  },
  {
    employeeCode: 'NV017',
    fullName: 'Đỗ Phương Linh',
    gender: 'Female',
    birthDate: '1998-07-30',
    phone: '0923000017',
    email: 'phuong.do@hrms.local',
    address: 'Quận Phú Nhuận, TP. Hồ Chí Minh',
    salary: 13100000,
    department: 'Nhân sự'
  },
  {
    employeeCode: 'NV018',
    fullName: 'Ngô Tuấn Kiệt',
    gender: 'Male',
    birthDate: '1997-05-12',
    phone: '0923000018',
    email: 'kiet.ngo@hrms.local',
    address: 'Quận 5, TP. Hồ Chí Minh',
    salary: 14500000,
    department: 'Tài chính'
  },
  {
    employeeCode: 'NV019',
    fullName: 'Hồ Gia Hân',
    gender: 'Female',
    birthDate: '2001-09-08',
    phone: '0923000019',
    email: 'han.ho@hrms.local',
    address: 'Quận 1, TP. Hồ Chí Minh',
    salary: 12600000,
    department: 'Nhân sự'
  },
  {
    employeeCode: 'NV020',
    fullName: 'Nguyễn Nhật Nam',
    gender: 'Male',
    birthDate: '1999-04-24',
    phone: '0923000020',
    email: 'nam.nguyen@hrms.local',
    address: 'Quận 8, TP. Hồ Chí Minh',
    salary: 17200000,
    department: 'Công nghệ thông tin'
  },
  {
    employeeCode: 'NV021',
    fullName: 'Trương Bảo Trâm',
    gender: 'Female',
    birthDate: '2000-02-14',
    phone: '0923000021',
    email: 'tram.truong@hrms.local',
    address: 'Quận Tân Phú, TP. Hồ Chí Minh',
    salary: 13400000,
    department: 'Tài chính'
  },
  {
    employeeCode: 'NV022',
    fullName: 'Phan Minh Quân',
    gender: 'Male',
    birthDate: '1998-06-06',
    phone: '0923000022',
    email: 'quan.phan@hrms.local',
    address: 'Quận 12, TP. Hồ Chí Minh',
    salary: 16500000,
    department: 'Công nghệ thông tin'
  },
  {
    employeeCode: 'NV023',
    fullName: 'Lý Thanh Hà',
    gender: 'Female',
    birthDate: '1999-12-19',
    phone: '0923000023',
    email: 'ha.ly@hrms.local',
    address: 'Quận 4, TP. Hồ Chí Minh',
    salary: 12900000,
    department: 'Nhân sự'
  },
  {
    employeeCode: 'NV024',
    fullName: 'Đinh Quốc Bảo',
    gender: 'Male',
    birthDate: '1996-08-03',
    phone: '0923000024',
    email: 'bao.dinh@hrms.local',
    address: 'Quận Bình Tân, TP. Hồ Chí Minh',
    salary: 14800000,
    department: 'Tài chính'
  },
  {
    employeeCode: 'NV025',
    fullName: 'Mai Ngọc Ánh',
    gender: 'Female',
    birthDate: '2001-03-11',
    phone: '0923000025',
    email: 'anh.mai@hrms.local',
    address: 'Huyện Nhà Bè, TP. Hồ Chí Minh',
    salary: 12700000,
    department: 'Nhân sự'
  },
  {
    employeeCode: 'NV026',
    fullName: 'Trịnh Công Thành',
    gender: 'Male',
    birthDate: '1997-11-29',
    phone: '0923000026',
    email: 'thanh.trinh@hrms.local',
    address: 'Thành phố Thủ Đức, TP. Hồ Chí Minh',
    salary: 17800000,
    department: 'Công nghệ thông tin'
  },
  {
    employeeCode: 'NV027',
    fullName: 'Tạ Thuỳ Dương',
    gender: 'Female',
    birthDate: '2000-10-10',
    phone: '0923000027',
    email: 'duong.ta@hrms.local',
    address: 'Quận 6, TP. Hồ Chí Minh',
    salary: 13600000,
    department: 'Tài chính'
  }
];

const syncDepartments = async () => {
  const departments = new Map();

  for (const definition of departmentUpdates) {
    const department = await Department.findOneAndUpdate(
      { departmentName: { $in: definition.aliases } },
      {
        $set: {
          departmentName: definition.departmentName,
          description: definition.description
        }
      },
      { new: true }
    );

    if (!department) {
      throw new Error(`Không tìm thấy phòng ban: ${definition.departmentName}`);
    }
    departments.set(definition.departmentName, department);
  }

  return departments;
};

const syncExistingNames = async () => {
  for (const [employeeCode, fullName, email] of existingPeople) {
    await Promise.all([
      Employee.updateOne({ employeeCode }, { $set: { fullName } }),
      User.updateOne({ email }, { $set: { fullName } })
    ]);
  }
  await User.updateOne({ email: 'admin@hrms.local' }, { $set: { fullName: 'Quản trị viên' } });
};

const syncNewPeople = async (departments) => {
  let created = 0;
  let updated = 0;

  for (const person of newPeople) {
    let user = await User.findOne({ email: person.email });
    if (!user) {
      user = await User.create({
        fullName: person.fullName,
        email: person.email,
        password: defaultPassword,
        phone: person.phone,
        role: 'user',
        status: 'Active'
      });
      created += 1;
    } else {
      user.fullName = person.fullName;
      user.phone = person.phone;
      user.status = 'Active';
      await user.save();
      updated += 1;
    }

    const department = departments.get(person.department);
    await Employee.findOneAndUpdate(
      {
        $or: [
          { employeeCode: person.employeeCode },
          { email: person.email }
        ]
      },
      {
        $set: {
          userId: user._id,
          employeeCode: person.employeeCode,
          fullName: person.fullName,
          gender: person.gender,
          birthDate: person.birthDate,
          phone: person.phone,
          email: person.email,
          address: person.address,
          position: 'Nhân sự',
          salary: person.salary,
          departmentId: department._id,
          status: 'Active'
        }
      },
      { upsert: true, new: true, runValidators: true }
    );
  }

  return { created, updated };
};

const run = async () => {
  await connectDB();
  const departments = await syncDepartments();
  await syncExistingNames();
  const result = await syncNewPeople(departments);

  console.log(`Đồng bộ hoàn tất: ${result.created} tài khoản mới, ${result.updated} tài khoản đã cập nhật.`);
  console.log(`Tổng nhân viên: ${await Employee.countDocuments()}`);
  console.log(`Mật khẩu mặc định cho 18 tài khoản mới: ${defaultPassword}`);
  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
