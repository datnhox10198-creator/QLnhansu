import { departmentUpdates, existingPeople, newPeople } from './syncEmployees.js';

const apiUrl = (process.env.HRMS_API_URL || 'https://qlnhansu.onrender.com/api').replace(/\/$/, '');
const adminEmail = process.env.HRMS_ADMIN_EMAIL || 'admin@hrms.local';
const adminPassword = process.env.HRMS_ADMIN_PASSWORD || 'Admin@123';

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

const run = async () => {
  const session = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: adminEmail, password: adminPassword })
  });
  const auth = { Authorization: `Bearer ${session.token}` };

  const departments = await request('/departments', { headers: auth });
  if (!departments.length) throw new Error('Website chưa có phòng ban để phân công nhân viên');

  const departmentMap = new Map();
  for (const definition of departmentUpdates) {
    const department = departments.find((item) => definition.aliases.includes(item.departmentName));
    if (department) departmentMap.set(definition.departmentName, department);
  }

  const firstPage = await request('/employees?limit=100&page=1', { headers: auth });
  const employees = firstPage.items;
  const employeeByCode = new Map(employees.map((employee) => [employee.employeeCode, employee]));

  for (const [employeeCode, fullName] of existingPeople) {
    const employee = employeeByCode.get(employeeCode);
    if (!employee) continue;
    await request(`/employees/${employee._id}`, {
      method: 'PUT',
      headers: auth,
      body: JSON.stringify({
        employeeCode: employee.employeeCode,
        fullName,
        gender: employee.gender,
        birthDate: employee.birthDate,
        phone: employee.phone || '',
        email: employee.email,
        address: employee.address || '',
        position: employee.position,
        salary: employee.salary,
        departmentId: employee.departmentId?._id,
        status: employee.status
      })
    });
  }

  let created = 0;
  let skipped = 0;
  for (const [index, person] of newPeople.entries()) {
    if (employeeByCode.has(person.employeeCode)) {
      skipped += 1;
      continue;
    }

    const department = departmentMap.get(person.department) || departments[index % departments.length];
    await request('/employees', {
      method: 'POST',
      headers: auth,
      body: JSON.stringify({
        ...person,
        position: 'Nhân sự',
        departmentId: department._id,
        status: 'Active'
      })
    });
    created += 1;
  }

  const result = await request('/employees?limit=100&page=1', { headers: auth });
  console.log(`Đồng bộ API hoàn tất: tạo ${created}, bỏ qua ${skipped}, tổng ${result.total} nhân viên.`);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
