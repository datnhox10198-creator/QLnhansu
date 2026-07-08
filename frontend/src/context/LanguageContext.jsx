import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';

const LanguageContext = createContext(null);

const english = {
  'Quản lý nhân sự': 'Human resources',
  'Tổng quan': 'Overview',
  'Không gian quản trị nhân sự': 'Human resources workspace',
  'Nhân viên': 'Employees',
  'Hồ sơ và thông tin nhân sự': 'Employee records and information',
  'Phòng ban': 'Departments',
  'Cơ cấu tổ chức doanh nghiệp': 'Company organization structure',
  'Chấm công': 'Attendance',
  'Theo dõi thời gian làm việc': 'Track working time',
  'Công việc': 'Tasks',
  'Phân công và theo dõi tiến độ': 'Assign and track progress',
  'Phiếu lương': 'Payroll',
  'Thu nhập và quỹ lương': 'Income and payroll',
  'Nghỉ phép': 'Leave',
  'Đơn từ và lịch nghỉ': 'Requests and leave calendar',
  'Báo cáo': 'Reports',
  'Số liệu vận hành nhân sự': 'HR operational insights',
  'Hồ sơ': 'Profile',
  'Thông tin cá nhân của bạn': 'Your personal information',
  'Quản trị viên': 'Administrator',
  'Your space': 'Your space',
  'Đăng xuất': 'Sign out',
  'Đóng menu': 'Close menu',
  'Mở menu': 'Open menu',
  'Đi tới trang': 'Go to page',
  'Kiểm tra đơn nghỉ phép': 'Review leave requests',
  'Xem các yêu cầu đang chờ xử lý.': 'View requests waiting for review.',
  'Theo dõi công việc': 'Track tasks',
  'Kiểm tra tiến độ công việc của đội ngũ.': 'Review your team task progress.',
  'Công việc của bạn': 'Your tasks',
  'Xem và cập nhật tiến độ hôm nay.': 'View and update today’s progress.',
  'Chấm công hôm nay': 'Today’s attendance',
  'Kiểm tra trạng thái check-in và check-out.': 'Review check-in and check-out status.',
  'Đang kiểm tra': 'Checking',
  'Hệ thống ổn định': 'All systems operational',
  'Mất kết nối API': 'API disconnected',
  'Đang kiểm tra hệ thống': 'Checking system status',
  'Kiểm tra lúc': 'Checked at',
  'Tìm kiếm nhanh...': 'Quick search...',
  'Tìm kiếm nhanh': 'Quick search',
  'Thông báo': 'Notifications',
  'Đóng thông báo': 'Close notifications',
  'Các việc bạn có thể cần xử lý': 'Items that may need your attention',
  'mục': 'items',
  'Tìm trang hoặc chức năng...': 'Search pages or features...',
  'Tìm trang hoặc chức năng': 'Search pages or features',
  'Đóng tìm kiếm': 'Close search',
  'Kết quả tìm kiếm': 'Search results',
  'Đi tới nhanh': 'Quick navigation',
  'Không tìm thấy chức năng phù hợp.': 'No matching feature found.',
  'Di chuyển': 'Navigate',
  'Mở': 'Open',
  'Đóng': 'Close',
  'Make today count': 'Make today count',
  'Nhân sự': 'People',
  'People operations, reimagined': 'People operations, reimagined',
  'Một không gian quản trị nhân sự hiện đại cho đội ngũ, công việc, chấm công, lương thưởng và nghỉ phép.': 'A modern HR workspace for people, tasks, attendance, payroll and leave.',
  'Quản trị tập trung': 'Centralized management',
  'Trải nghiệm trực quan': 'Intuitive experience',
  'Dữ liệu theo thời gian thực': 'Real-time data',
  'Chào mừng trở lại': 'Welcome back',
  'Đăng nhập không gian làm việc.': 'Sign in to your workspace.',
  'Sử dụng tài khoản được cấp để tiếp tục.': 'Use your assigned account to continue.',
  'Email công việc': 'Work email',
  'Mật khẩu': 'Password',
  'Ẩn mật khẩu': 'Hide password',
  'Hiện mật khẩu': 'Show password',
  'Đang kết nối...': 'Connecting...',
  'Tiếp tục': 'Continue',
  'Không kết nối được API. Kiểm tra backend và cấu hình VITE_API_URL.': 'Could not connect to the API. Check the backend and VITE_API_URL configuration.',
  'Tiếng Việt': 'Vietnamese',
  'Tiếng Anh': 'English',
  'Chọn ngôn ngữ': 'Choose language',
  'Tổng quan hôm nay.': 'Today at a glance.',
  'Có gì cần chú ý?': 'What needs attention?',
  'Một cái nhìn nhanh về đội ngũ, lịch nghỉ và những việc cần bạn xử lý.': 'A quick view of your team, leave calendar and items requiring action.',
  'Xem đội ngũ': 'View team',
  'Xem báo cáo': 'View reports',
  'Đang hoạt động': 'Active',
  'Trong tổ chức': 'In the organization',
  'Tổng đơn nghỉ': 'Total leave requests',
  'Tất cả trạng thái': 'All statuses',
  'Chờ duyệt': 'Pending',
  'Cần xử lý': 'Needs review',
  'Đã duyệt': 'Approved',
  'tổng số đơn': 'of all requests',
  'request đang chờ bạn': 'requests awaiting you',
  'Lịch nghỉ phép toàn công ty': 'Company leave calendar',
  'Không gian của bạn': 'Your workspace',
  'Chào': 'Hello',
  'Sẵn sàng cho hôm nay?': 'Ready for today?',
  'Chưa phân phòng ban': 'No department assigned',
  'Xin nghỉ phép': 'Request leave',
  'Hồ sơ của tôi': 'My profile',
  'Tổng đơn': 'Total requests',
  'Đơn nghỉ của bạn': 'Your leave requests',
  'Đang được xử lý': 'Being reviewed',
  'Đơn được chấp thuận': 'Approved requests',
  'Từ chối': 'Rejected',
  'Đơn không được duyệt': 'Rejected requests',
  'Lịch nghỉ phép của tôi': 'My leave calendar',
  'Lịch nghỉ phép': 'Leave calendar',
  'Không tải được lịch nghỉ phép.': 'Could not load the leave calendar.',
  'Tuần': 'Week',
  'Tháng': 'Month',
  'Trước': 'Previous',
  'Sau': 'Next',
  'Hôm nay': 'Today',
  'Nhân sự nghỉ': 'Employees on leave',
  'Lọc lịch theo trạng thái': 'Filter calendar by status',
  'Tất cả': 'All',
  'Chưa có phòng ban': 'No department',
  'đơn khác': 'more requests',
  'Chi tiết nghỉ phép': 'Leave details',
  'Ngày nghỉ': 'Leave date',
  'Lý do': 'Reason',
  'Trạng thái': 'Status',
  'Chưa cập nhật': 'Not updated',
  'Không có lý do': 'No reason provided',
  'Dữ liệu hiện tại': 'Current data',
  'Xem chi tiết': 'View details',
  'Chưa có dữ liệu': 'No data available',
  'Dữ liệu mới sẽ xuất hiện tại đây.': 'New data will appear here.',
  'Trang': 'Page',
  'trên': 'of',
  'Trang trước': 'Previous page',
  'Trang sau': 'Next page',
  'Huỷ': 'Cancel',
  'Xoá': 'Delete'
  ,
  'Quản lý phòng ban và phân công trưởng phòng.': 'Manage departments and assign department managers.',
  'Thêm phòng ban': 'Add department',
  'Danh sách phòng ban': 'Department list',
  'Chưa có mô tả': 'No description',
  'Chưa có trưởng phòng': 'No department manager',
  'Sửa phòng ban': 'Edit department',
  'Xoá phòng ban': 'Delete department',
  'Bạn chắc chắn muốn xoá phòng ban này?': 'Are you sure you want to delete this department?',
  'Nhập thông tin phòng ban và trưởng phòng phụ trách.': 'Enter department information and assign its manager.',
  'Tên phòng ban': 'Department name',
  'Mô tả': 'Description',
  'Trưởng phòng': 'Department manager',
  'Chưa phân công': 'Not assigned',
  'Đang lưu...': 'Saving...',
  'Lưu': 'Save',
  'Đã cập nhật phòng ban.': 'Department updated.',
  'Đã thêm phòng ban.': 'Department added.',
  'Không lưu được phòng ban.': 'Could not save the department.',
  'Đã xoá phòng ban.': 'Department deleted.',
  'Không xoá được phòng ban.': 'Could not delete the department.',
  'Quản lý hồ sơ, phòng ban, chức vụ và lương nhân viên.': 'Manage employee profiles, departments, positions and salaries.',
  'Thêm nhân viên': 'Add employee',
  'Tìm theo tên nhân viên': 'Search by employee name',
  'Tất cả phòng ban': 'All departments',
  'Mã NV': 'Employee ID',
  'Mã nhân viên': 'Employee ID',
  'Họ tên': 'Full name',
  'Chức vụ': 'Position',
  'Lương': 'Salary',
  'Sửa nhân viên': 'Edit employee',
  'Xoá nhân viên': 'Delete employee',
  'Bạn chắc chắn muốn xoá nhân viên này?': 'Are you sure you want to delete this employee?',
  'Nhập đầy đủ thông tin hồ sơ nhân viên.': 'Enter all required employee profile information.',
  'Nam': 'Male',
  'Nữ': 'Female',
  'Khác': 'Other',
  'Số điện thoại': 'Phone number',
  'Địa chỉ': 'Address',
  'Chọn phòng ban': 'Select department',
  'Đã cập nhật nhân viên và tài khoản đăng nhập.': 'Employee and login account updated.',
  'Đã thêm nhân viên.': 'Employee added.',
  'Tài khoản': 'Account',
  'Không lưu được nhân viên.': 'Could not save the employee.',
  'Đã xoá nhân viên.': 'Employee deleted.',
  'Không xoá được nhân viên.': 'Could not delete the employee.',
  'Đang làm việc': 'Working',
  'Đã nghỉ': 'Inactive',
  'Admin giao việc cho phòng ban, hệ thống chỉ gửi tới trưởng phòng.': 'Admin assigns tasks to departments; each task is delivered to the department manager.',
  'Theo dõi và cập nhật trạng thái công việc được giao.': 'Track and update assigned task progress.',
  'Lọc theo ngày': 'Filter by date',
  'Giao việc': 'Assign task',
  'Đang tải công việc...': 'Loading tasks...',
  'Chưa có công việc': 'No tasks available',
  'Giao việc cho phòng ban': 'Assign task to departments',
  'Giao việc theo ngày': 'Assign daily task',
  'Việc sẽ được gửi tới trưởng phòng của phòng ban đã chọn.': 'The task will be sent to the manager of each selected department.',
  'Chọn nhân viên trong phòng để giao việc.': 'Select employees in the department for this task.',
  'Tên công việc': 'Task title',
  'Chi tiết công việc': 'Task details',
  'Chọn phòng ban, việc sẽ giao cho trưởng phòng': 'Select departments; the task will be assigned to their managers',
  'Chưa có phòng ban nào được gán trưởng phòng.': 'No department has an assigned manager.',
  'Chọn nhân viên cùng làm, tối đa 5 người': 'Select up to 5 employees',
  'Phòng ban chưa có nhân viên để giao việc.': 'This department has no employees available for assignment.',
  'Đang giao...': 'Assigning...',
  'Chưa làm': 'Not started',
  'Đang làm': 'In progress',
  'Làm xong': 'Completed',
  'người làm': 'assignees',
  'Chi tiết': 'Details',
  'Trưởng phòng nhận việc': 'Assigned department manager',
  'Nhân viên thực hiện': 'Assigned employees',
  'người đã làm xong': 'employees completed',
  'Đã giao việc cho trưởng phòng đã chọn.': 'Task assigned to the selected department managers.',
  'Đã giao việc cho nhân viên trong phòng.': 'Task assigned to department employees.',
  'Không giao việc được.': 'Could not assign the task.',
  'Không tải được dữ liệu công việc.': 'Could not load task data.',
  'Không tải được danh sách công việc.': 'Could not load the task list.',
  'Không cập nhật được trạng thái.': 'Could not update the status.',
  'Admin tạo đơn và quản trị dữ liệu nghỉ phép.': 'Admin creates and manages leave requests.',
  'Theo dõi đơn nghỉ phép của bạn và xử lý đơn trong phòng nếu bạn là trưởng phòng.': 'Track your leave requests and review department requests if you are a manager.',
  'Gửi đơn nghỉ phép': 'Submit leave request',
  'Duyệt đơn': 'Approve request',
  'Từ chối đơn': 'Reject request',
  'Xoá đơn': 'Delete request',
  'Xoá đơn nghỉ phép': 'Delete leave request',
  'Bạn chắc chắn muốn xoá đơn này?': 'Are you sure you want to delete this request?',
  'Admin có thể tạo đơn nghỉ phép cho nhân viên.': 'Admin can create leave requests for employees.',
  'Nhập ngày nghỉ và lý do để gửi đơn xét duyệt.': 'Enter the leave date and reason for approval.',
  'Chọn nhân viên': 'Select employee',
  'Lý do nghỉ phép': 'Leave reason',
  'Đang gửi...': 'Submitting...',
  'Gửi đơn': 'Submit request',
  'Đã gửi đơn nghỉ phép.': 'Leave request submitted.',
  'Không gửi được đơn nghỉ phép.': 'Could not submit the leave request.',
  'Đã duyệt đơn nghỉ phép.': 'Leave request approved.',
  'Đã từ chối đơn nghỉ phép.': 'Leave request rejected.',
  'Đã xoá đơn nghỉ phép.': 'Leave request deleted.',
  'Không xoá được đơn nghỉ phép.': 'Could not delete the leave request.',
  'Theo dõi check-in/check-out theo phòng ban và ngày làm việc.': 'Track check-in and check-out by department and work date.',
  'Check-in khi bắt đầu làm việc và check-out khi kết thúc ngày.': 'Check in when work starts and check out at the end of the day.',
  'Đã check-out': 'Checked out',
  'Tổng giờ': 'Total hours',
  'Ngày': 'Date',
  'Không thực hiện được chấm công': 'Could not update attendance.',
  'Quỹ lương phòng ban': 'Department payroll',
  'Admin kiểm tra tổng tiền lương và chi tiết nhân viên theo từng phòng ban.': 'Review total payroll and employee details by department.',
  'Tháng lương': 'Payroll month',
  'Tổng quỹ lương': 'Total payroll',
  'Tổng nhân sự': 'Total employees',
  'Số phòng ban': 'Departments',
  'Tổng tiền trả': 'Total payment',
  'Đang tải dữ liệu lương...': 'Loading payroll data...',
  'Không có dữ liệu lương': 'No payroll data',
  'Phiếu lương cá nhân': 'Personal payslip',
  'Nhân viên và trưởng phòng xem số tiền lương được nhận trong tháng.': 'Employees and managers can view their monthly payslip.',
  'Đang tải phiếu lương...': 'Loading payslip...',
  'Lương cơ bản': 'Base salary',
  'Phụ cấp': 'Allowance',
  'Khấu trừ': 'Deduction',
  'Thực nhận': 'Net salary',
  'Chưa có phiếu lương': 'No payslip available',
  'Chi tiết phiếu lương tháng': 'Payroll details for',
  'Phòng ban chưa có nhân viên đang làm việc': 'This department has no active employees',
  'Không tải được dữ liệu lương.': 'Could not load payroll data.',
  'Không tải được phiếu lương.': 'Could not load the payslip.',
  'Hồ sơ cá nhân': 'Personal profile',
  'Xem thông tin nhân sự và cập nhật thông tin liên hệ của bạn.': 'View your employee information and update contact details.',
  'Chưa có mã nhân viên': 'No employee ID',
  'Nhập số điện thoại': 'Enter phone number',
  'Ngày sinh': 'Date of birth',
  'Nhập địa chỉ hiện tại': 'Enter current address',
  'Cập nhật hồ sơ': 'Update profile',
  'Thông tin công việc': 'Employment information',
  'Thông tin cá nhân': 'Personal information',
  'Giới tính': 'Gender',
  'Đã cập nhật hồ sơ cá nhân.': 'Profile updated.',
  'Không cập nhật được hồ sơ.': 'Could not update the profile.',
  'Báo cáo thống kê': 'Analytics report',
  'Tổng hợp số liệu phục vụ quản trị nhân sự': 'HR management overview and metrics',
  'Tổng số nhân viên': 'Total employees',
  'Tổng số phòng ban': 'Total departments',
  'Tổng số đơn nghỉ phép': 'Total leave requests',
  'Số đơn chờ duyệt': 'Pending requests',
  'Số đơn đã duyệt': 'Approved requests',
  'Đơn nghỉ': 'Leave requests',
  'Không tải được báo cáo.': 'Could not load reports.'
};

const preferenceKey = (user) => `hrms.language.${user?._id || user?.email || 'guest'}`;
const vietnamese = Object.fromEntries(Object.entries(english).map(([vi, en]) => [en, vi]));
const translatableAttributes = ['placeholder', 'aria-label', 'title'];

const translateDom = (root, language) => {
  const dictionary = language === 'en' ? english : vietnamese;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  while (node) {
    const value = node.nodeValue;
    const trimmed = value.trim();
    if (dictionary[trimmed]) {
      node.nodeValue = value.replace(trimmed, dictionary[trimmed]);
    }
    node = walker.nextNode();
  }

  root.querySelectorAll?.('*').forEach((element) => {
    translatableAttributes.forEach((attribute) => {
      const value = element.getAttribute(attribute);
      if (value && dictionary[value]) element.setAttribute(attribute, dictionary[value]);
    });
  });
};

export function LanguageProvider({ children }) {
  const { user } = useAuth();
  const [language, setLanguageState] = useState(() => localStorage.getItem(preferenceKey(null)) || 'vi');

  useEffect(() => {
    setLanguageState(localStorage.getItem(preferenceKey(user)) || localStorage.getItem(preferenceKey(null)) || 'vi');
  }, [user?._id, user?.email]);

  const setLanguage = (nextLanguage) => {
    if (!['vi', 'en'].includes(nextLanguage)) return;
    localStorage.setItem(preferenceKey(user), nextLanguage);
    localStorage.setItem('hrms.language.current', nextLanguage);
    if (!user) localStorage.setItem(preferenceKey(null), nextLanguage);
    setLanguageState(nextLanguage);
  };

  const value = useMemo(() => ({
    language,
    locale: language === 'en' ? 'en-US' : 'vi-VN',
    setLanguage,
    t: (text) => language === 'en' ? english[text] || text : text,
    td: (value, translations, field) => (
      language === 'en'
        ? translations?.en?.[field] || english[value] || value
        : value
    )
  }), [language]);

  useEffect(() => {
    document.documentElement.lang = language;
    localStorage.setItem('hrms.language.current', language);
    translateDom(document.body, language);
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) translateDom(node, language);
          if (node.nodeType === Node.TEXT_NODE && node.parentElement) translateDom(node.parentElement, language);
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => useContext(LanguageContext);
