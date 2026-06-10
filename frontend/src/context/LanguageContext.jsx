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
  'Phiên đăng nhập được bảo vệ bằng xác thực JWT.': 'Your session is protected by JWT authentication.',
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
};

const preferenceKey = (user) => `hrms.language.${user?._id || user?.email || 'guest'}`;

export function LanguageProvider({ children }) {
  const { user } = useAuth();
  const [language, setLanguageState] = useState(() => localStorage.getItem(preferenceKey(null)) || 'vi');

  useEffect(() => {
    setLanguageState(localStorage.getItem(preferenceKey(user)) || localStorage.getItem(preferenceKey(null)) || 'vi');
  }, [user?._id, user?.email]);

  const setLanguage = (nextLanguage) => {
    if (!['vi', 'en'].includes(nextLanguage)) return;
    localStorage.setItem(preferenceKey(user), nextLanguage);
    if (!user) localStorage.setItem(preferenceKey(null), nextLanguage);
    setLanguageState(nextLanguage);
  };

  const value = useMemo(() => ({
    language,
    locale: language === 'en' ? 'en-US' : 'vi-VN',
    setLanguage,
    t: (text) => language === 'en' ? english[text] || text : text
  }), [language]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => useContext(LanguageContext);
