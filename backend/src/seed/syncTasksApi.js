const apiUrl = (process.env.HRMS_API_URL || 'https://qlnhansu.onrender.com/api').replace(/\/$/, '');
const adminEmail = process.env.HRMS_ADMIN_EMAIL || 'admin@hrms.local';
const adminPassword = process.env.HRMS_ADMIN_PASSWORD || 'Admin@123';
const userPassword = process.env.HRMS_USER_PASSWORD || 'User@123';

const taskCatalog = {
  Marketing: {
    leadership: {
      title: 'Lập kế hoạch chiến dịch thương hiệu tháng 6',
      description: 'Xác định mục tiêu, thông điệp, ngân sách và chỉ số đo lường cho chiến dịch thương hiệu trong tháng.'
    },
    team: [
      ['Xây dựng lịch nội dung đa kênh', 'Lên lịch nội dung cho Facebook, TikTok, website và email; bảo đảm thông điệp nhất quán.'],
      ['Phân tích insight khách hàng mục tiêu', 'Tổng hợp hành vi, nhu cầu và phản hồi của nhóm khách hàng trọng tâm để đề xuất hướng truyền thông.'],
      ['Chuẩn bị bộ nội dung cho chiến dịch', 'Hoàn thiện nội dung bài viết, key visual và tài liệu cần thiết trước ngày triển khai.'],
      ['Báo cáo hiệu quả truyền thông tuần', 'Tổng hợp lượt tiếp cận, tương tác, chuyển đổi và đề xuất tối ưu cho tuần tiếp theo.']
    ]
  },
  IT: {
    leadership: {
      title: 'Rà soát ổn định hệ thống và an toàn dữ liệu',
      description: 'Đánh giá tình trạng vận hành, các rủi ro kỹ thuật và kế hoạch ưu tiên xử lý trong tuần.'
    },
    team: [
      ['Kiểm tra hiệu năng API và cơ sở dữ liệu', 'Theo dõi thời gian phản hồi, truy vấn chậm và đề xuất tối ưu các điểm nghẽn chính.'],
      ['Kiểm thử luồng nghiệp vụ quan trọng', 'Kiểm thử đăng nhập, nhân sự, chấm công, công việc, lương và nghỉ phép trên desktop lẫn mobile.'],
      ['Rà soát phân quyền và bảo mật tài khoản', 'Kiểm tra quyền Admin/User, token đăng nhập và các trường hợp truy cập không hợp lệ.'],
      ['Cập nhật tài liệu vận hành và sao lưu', 'Chuẩn hóa hướng dẫn triển khai, khôi phục dữ liệu và danh sách kiểm tra khi có sự cố.']
    ]
  },
  'Tài Chính': {
    leadership: {
      title: 'Hoàn thiện báo cáo ngân sách quý II',
      description: 'Kiểm tra số liệu, đánh giá chênh lệch ngân sách và chuẩn bị báo cáo cho ban quản lý.'
    },
    team: [
      ['Đối soát chi phí vận hành', 'Kiểm tra chứng từ và đối chiếu các khoản chi thực tế với kế hoạch ngân sách đã duyệt.'],
      ['Kiểm tra dữ liệu lương và phụ cấp', 'Rà soát mức lương, phụ cấp, khấu trừ và các trường hợp cần điều chỉnh trước khi chốt.'],
      ['Lập dự báo dòng tiền tháng tới', 'Tổng hợp các khoản thu, chi dự kiến và cảnh báo những thời điểm có rủi ro thiếu hụt dòng tiền.'],
      ['Hoàn thiện hồ sơ hóa đơn và chứng từ', 'Phân loại, kiểm tra tính hợp lệ và cập nhật trạng thái các hóa đơn, chứng từ trong kỳ.']
    ]
  },
  'Kinh Doanh': {
    leadership: {
      title: 'Xây dựng kế hoạch tăng trưởng khách hàng tháng 6',
      description: 'Đặt mục tiêu doanh số, phân nhóm khách hàng và thống nhất hoạt động ưu tiên cho đội kinh doanh.'
    },
    team: [
      ['Cập nhật danh sách khách hàng tiềm năng', 'Bổ sung thông tin, phân loại mức độ quan tâm và xác định bước tiếp cận tiếp theo cho từng khách hàng.'],
      ['Chăm sóc và theo dõi khách hàng hiện tại', 'Liên hệ khách hàng, ghi nhận phản hồi và đề xuất giải pháp tăng mức độ hài lòng.'],
      ['Chuẩn bị đề xuất và báo giá bán hàng', 'Hoàn thiện nội dung tư vấn, báo giá và phương án phù hợp với nhu cầu của khách hàng.'],
      ['Tổng hợp kết quả kinh doanh tuần', 'Báo cáo số cơ hội, tỷ lệ chuyển đổi, doanh số và những trở ngại cần trưởng phòng hỗ trợ.']
    ]
  }
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

const login = async (email, password) => {
  const session = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  return {
    session,
    headers: { Authorization: `Bearer ${session.token}` }
  };
};

const createBalancedGroups = (employees, taskCount) => {
  const groups = Array.from({ length: taskCount }, () => []);
  employees.forEach((employee, index) => {
    groups[index % taskCount].push(employee);
    groups[(index + 2) % taskCount].push(employee);
  });
  return groups;
};

const seededStatus = (employeeCode, taskIndex) => {
  const seed = [...`${employeeCode}-${taskIndex}`].reduce((total, char) => total + char.charCodeAt(0), 0) % 10;
  if (seed < 4) return 'Done';
  if (seed < 8) return 'Doing';
  return 'Pending';
};

const findTask = (items, title) => items.find((task) => task.title === title);

const updateStatuses = async (task, taskIndex, loginCache) => {
  for (const assignee of task.assignees) {
    const employee = assignee.employeeId;
    const status = seededStatus(employee.employeeCode, taskIndex);
    if (status === 'Pending' || assignee.status === status) continue;

    if (!loginCache.has(employee.email)) {
      loginCache.set(employee.email, await login(employee.email, userPassword));
    }
    const employeeAuth = loginCache.get(employee.email);
    await request(`/tasks/${task._id}/status`, {
      method: 'PATCH',
      headers: employeeAuth.headers,
      body: JSON.stringify({ status })
    });
  }
};

const run = async () => {
  const adminAuth = await login(adminEmail, adminPassword);
  const departments = await request('/departments', { headers: adminAuth.headers });
  const employeeData = await request('/employees?limit=100&page=1', { headers: adminAuth.headers });
  const employees = employeeData.items;
  const loginCache = new Map();

  const supportedDepartments = departments.filter((department) => taskCatalog[department.departmentName] && department.managerId);
  if (!supportedDepartments.length) throw new Error('Không có phòng ban phù hợp đã được gán trưởng phòng');

  const adminTasksData = await request('/tasks', { headers: adminAuth.headers });
  let adminCreated = 0;
  let managerCreated = 0;

  for (const [departmentIndex, department] of supportedDepartments.entries()) {
    const catalog = taskCatalog[department.departmentName];
    let leadershipTask = findTask(adminTasksData.items, catalog.leadership.title);

    if (!leadershipTask) {
      const created = await request('/tasks', {
        method: 'POST',
        headers: adminAuth.headers,
        body: JSON.stringify({
          ...catalog.leadership,
          workDate: '2026-06-10',
          departmentIds: [department._id]
        })
      });
      [leadershipTask] = created;
      adminCreated += 1;
    }

    await updateStatuses(leadershipTask, departmentIndex, loginCache);

    const managerEmail = department.managerId.email;
    const managerAuth = await login(managerEmail, userPassword);
    loginCache.set(managerEmail, managerAuth);
    const managerTasksData = await request('/tasks', { headers: managerAuth.headers });
    const team = employees
      .filter((employee) => employee.departmentId?._id === department._id && employee._id !== department.managerId._id)
      .sort((a, b) => a.employeeCode.localeCompare(b.employeeCode));
    const groups = createBalancedGroups(team, catalog.team.length);

    for (const [taskIndex, [title, description]] of catalog.team.entries()) {
      let task = findTask(managerTasksData.items, title);
      if (!task) {
        task = await request('/tasks', {
          method: 'POST',
          headers: managerAuth.headers,
          body: JSON.stringify({
            title,
            description,
            workDate: `2026-06-${String(11 + taskIndex).padStart(2, '0')}`,
            assignedEmployeeIds: groups[taskIndex].map((employee) => employee._id)
          })
        });
        managerCreated += 1;
      }

      await updateStatuses(task, departmentIndex * 4 + taskIndex + 4, loginCache);
    }
  }

  console.log(`Đồng bộ công việc hoàn tất: ${adminCreated} việc cho trưởng phòng, ${managerCreated} việc cho nhân viên.`);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
