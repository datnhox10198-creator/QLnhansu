import {
  Banknote,
  Bell,
  Building2,
  CalendarDays,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  Clock3,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  UserRound,
  UsersRound,
  X
} from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const pageMeta = {
  '/': ['Tổng quan', 'Không gian quản trị nhân sự'],
  '/employees': ['Nhân viên', 'Hồ sơ và thông tin nhân sự'],
  '/departments': ['Phòng ban', 'Cơ cấu tổ chức doanh nghiệp'],
  '/attendance': ['Chấm công', 'Theo dõi thời gian làm việc'],
  '/tasks': ['Công việc', 'Phân công và theo dõi tiến độ'],
  '/payroll': ['Phiếu lương', 'Thu nhập và quỹ lương'],
  '/leaves': ['Nghỉ phép', 'Đơn từ và lịch nghỉ'],
  '/reports': ['Báo cáo', 'Số liệu vận hành nhân sự'],
  '/profile': ['Hồ sơ', 'Thông tin cá nhân của bạn']
};

export default function Layout() {
  const { user, employee, logout } = useAuth();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const displayPosition = employee?.position || (user.role === 'admin' ? 'Quản trị viên' : 'Nhân viên');
  const [pageTitle, pageDescription] = pageMeta[pathname] || pageMeta['/'];
  const links = user.role === 'admin'
    ? [
        ['/', LayoutDashboard, 'Tổng quan'],
        ['/employees', UsersRound, 'Nhân viên'],
        ['/departments', Building2, 'Phòng ban'],
        ['/attendance', Clock3, 'Chấm công'],
        ['/tasks', ClipboardCheck, 'Công việc'],
        ['/payroll', Banknote, 'Phiếu lương'],
        ['/leaves', CalendarDays, 'Nghỉ phép'],
        ['/reports', ClipboardList, 'Báo cáo']
      ]
    : [
        ['/', LayoutDashboard, 'Tổng quan'],
        ['/profile', UserRound, 'Hồ sơ'],
        ['/attendance', Clock3, 'Chấm công'],
        ['/tasks', ClipboardCheck, 'Công việc'],
        ['/payroll', Banknote, 'Phiếu lương'],
        ['/leaves', CalendarDays, 'Nghỉ phép']
      ];

  const NavContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-24 items-center justify-between border-b border-white/10 px-6">
        <div className="flex items-center gap-3">
          <div className="brand-mark">
            <ShieldCheck size={22} strokeWidth={2.4} />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-300">People OS</p>
            <p className="mt-0.5 text-xl font-bold tracking-tight text-white">Nexora HR</p>
          </div>
        </div>
        <button className="icon-button-dark lg:hidden" onClick={() => setOpen(false)} aria-label="Đóng menu">
          <X size={18} />
        </button>
      </div>

      <div className="px-4 pt-6">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">Không gian làm việc</p>
        <nav className="space-y-1.5">
          {links.map(([to, Icon, label]) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) => `nav-item group ${isActive ? 'nav-item-active' : ''}`}
            >
              <span className="nav-icon"><Icon size={18} strokeWidth={2} /></span>
              <span>{label}</span>
              <ChevronRight className="ml-auto opacity-0 transition group-hover:opacity-50" size={15} />
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3.5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-400 font-bold text-slate-950">
              {user.fullName?.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{user.fullName}</p>
              <p className="truncate text-xs text-slate-400">{displayPosition}</p>
            </div>
            <button className="icon-button-dark" onClick={logout} aria-label="Đăng xuất">
              <LogOut size={16} />
            </button>
          </div>
        </div>
        <p className="mt-3 text-center text-[10px] tracking-wider text-slate-600">HRMS PLATFORM · 2026</p>
      </div>
    </div>
  );

  return (
    <div className="app-shell min-h-screen">
      <aside className="sidebar fixed inset-y-0 left-0 z-30 hidden w-[276px] lg:block">
        <NavContent />
      </aside>

      <aside className={`sidebar fixed inset-y-0 left-0 z-50 w-[276px] transition-transform duration-300 lg:hidden ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <NavContent />
      </aside>
      {open && <button className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)} aria-label="Đóng menu" />}

      <div className="lg:pl-[276px]">
        <header className="topbar sticky top-0 z-20">
          <div className="flex h-20 items-center gap-4 px-4 sm:px-6 lg:px-8">
            <button className="icon-button lg:hidden" onClick={() => setOpen(true)} aria-label="Mở menu">
              <Menu size={19} />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <span>HRMS</span><ChevronRight size={12} /><span>{pageTitle}</span>
              </div>
              <div className="mt-0.5 flex items-baseline gap-3">
                <h1 className="truncate text-lg font-bold tracking-tight text-slate-900">{pageTitle}</h1>
                <p className="hidden text-xs text-slate-400 md:block">{pageDescription}</p>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400 xl:flex">
                <Search size={15} />
                <span className="w-40">Tìm kiếm nhanh...</span>
                <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px]">Ctrl K</kbd>
              </div>
              <button className="icon-button relative" aria-label="Thông báo">
                <Bell size={18} />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-orange-500 ring-2 ring-white" />
              </button>
              <div className="hidden items-center gap-2.5 border-l border-slate-200 pl-3 sm:flex">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-sm font-bold text-white">{user.fullName?.charAt(0)}</div>
                <div className="hidden lg:block">
                  <p className="max-w-36 truncate text-xs font-semibold text-slate-800">{user.fullName}</p>
                  <p className="text-[11px] text-slate-400">{displayPosition}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-[1480px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
