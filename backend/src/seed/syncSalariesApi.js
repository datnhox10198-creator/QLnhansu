const apiUrl = (process.env.HRMS_API_URL || 'https://qlnhansu.onrender.com/api').replace(/\/$/, '');
const adminEmail = process.env.HRMS_ADMIN_EMAIL || 'admin@hrms.local';
const adminPassword = process.env.HRMS_ADMIN_PASSWORD || 'Admin@123';

const managerSalaryByDepartment = {
  Marketing: 35000000,
  IT: 45000000,
  'Tài Chính': 38000000,
  'Kinh Doanh': 40000000,
  'Nhân sự': 32000000,
  'Công nghệ thông tin': 45000000,
  'Tài chính': 38000000
};

const staffBands = {
  Marketing: [16000000, 18000000, 20000000, 22000000, 24000000],
  IT: [22000000, 24000000, 26000000, 29000000, 32000000],
  'Tài Chính': [17000000, 19000000, 21000000, 23000000, 26000000],
  'Kinh Doanh': [15000000, 17000000, 19000000, 21000000, 23000000],
  'Nhân sự': [15000000, 17000000, 19000000, 21000000, 23000000],
  'Công nghệ thông tin': [22000000, 24000000, 26000000, 29000000, 32000000],
  'Tài chính': [17000000, 19000000, 21000000, 23000000, 26000000]
};

const request = async (path, options = {}) => {
  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`${options.method || 'GET'} ${path}: ${data.message || response.statusText}`);
  return data;
};

const salaryForStaff = (employee, departmentName) => {
  const band = staffBands[departmentName] || [16000000, 18000000, 20000000];
  const numericCode = Number(employee.employeeCode.replace(/\D/g, '')) || 0;
  return band[numericCode % band.length];
};

const run = async () => {
  const session = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: adminEmail, password: adminPassword })
  });
  const headers = { Authorization: `Bearer ${session.token}` };
  const [departments, employeeData] = await Promise.all([
    request('/departments', { headers }),
    request('/employees?limit=100&page=1', { headers })
  ]);

  const managerDepartmentByEmployeeId = new Map(
    departments
      .filter((department) => department.managerId?._id)
      .map((department) => [department.managerId._id, department])
  );

  const changes = [];
  for (const employee of employeeData.items) {
    const managedDepartment = managerDepartmentByEmployeeId.get(employee._id);
    const departmentName = employee.departmentId?.departmentName;
    const salary = managedDepartment
      ? managerSalaryByDepartment[managedDepartment.departmentName]
      : salaryForStaff(employee, departmentName);
    const position = managedDepartment ? 'Trưởng phòng' : 'Nhân sự';

    if (!salary) throw new Error(`Chưa có khung lương cho ${employee.fullName}`);

    await request(`/employees/${employee._id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        employeeCode: employee.employeeCode,
        fullName: employee.fullName,
        gender: employee.gender,
        birthDate: employee.birthDate,
        phone: employee.phone || '',
        email: employee.email,
        address: employee.address || '',
        position,
        salary,
        departmentId: managedDepartment?._id || employee.departmentId?._id,
        status: employee.status
      })
    });

    changes.push({
      employeeCode: employee.employeeCode,
      fullName: employee.fullName,
      department: managedDepartment?.departmentName || departmentName,
      position,
      oldSalary: employee.salary,
      newSalary: salary
    });
  }

  changes.sort((a, b) => a.employeeCode.localeCompare(b.employeeCode));
  console.table(changes);
  console.log(`Đã cập nhật lương và chức danh cho ${changes.length} nhân viên.`);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
