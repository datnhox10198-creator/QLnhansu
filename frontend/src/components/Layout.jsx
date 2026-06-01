import { Building2, CalendarDays, ClipboardList, LayoutDashboard, LogOut, Menu, ShieldCheck, UserRound, UsersRound, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, employee, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const displayPosition = employee?.position || (user.role === 'admin' ? 'Quản trị viên' : 'Nhân sự');
  const links = user.role === 'admin'
    ? [
        ['/', LayoutDashboard, 'Dashboard'],
        ['/employees', UsersRound, 'Nhân viên'],
        ['/departments', Building2, 'Phòng ban'],
        ['/leaves', CalendarDays, 'Nghỉ phép'],
        ['/reports', ClipboardList, 'Báo cáo']
      ]
    : [
        ['/', LayoutDashboard, 'Dashboard'],
        ['/profile', UserRound, 'Hồ sơ'],
        ['/leaves', CalendarDays, 'Nghỉ phép']
      ];

  const NavContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-brand text-white shadow-sm">
            <ShieldCheck size={23} />
          </div>
          <div>
            <p className="text-lg font-bold text-ink">HRMS</p>
            <p className="text-xs text-slate-500">Quản lý nhân sự</p>
          </div>
        </div>
        <button className="btn-secondary px-2 lg:hidden" onClick={() => setOpen(false)} aria-label="Đóng menu">
          <X size={18} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {links.map(([to, Icon, label]) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition ${
                isActive
                  ? 'bg-teal-50 text-brand shadow-sm ring-1 ring-teal-100'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-ink'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="m-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-md bg-white font-bold text-brand ring-1 ring-slate-200">
            {user.fullName?.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{user.fullName}</p>
            <p className="text-xs text-slate-500">{displayPosition}</p>
          </div>
        </div>
        <button className="btn-secondary mt-3 w-full" onClick={logout}>
          <LogOut size={16} /> Đăng xuất
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f6f8f7]">
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:hidden">
        <button className="btn-secondary px-2" onClick={() => setOpen(true)} aria-label="Mở menu">
          <Menu size={18} />
        </button>
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-md bg-brand text-white">
            <ShieldCheck size={19} />
          </div>
          <div>
            <p className="text-sm font-bold text-ink">HRMS</p>
            <p className="text-xs text-slate-500">{displayPosition}</p>
          </div>
        </div>
        <button className="btn-secondary px-2" onClick={logout} aria-label="Đăng xuất">
          <LogOut size={17} />
        </button>
      </header>

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-slate-200 bg-white shadow-sm lg:block">
        <NavContent />
      </aside>

      <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-white shadow-xl transition-transform lg:hidden ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <NavContent />
      </aside>
      {open && <button className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={() => setOpen(false)} aria-label="Đóng menu" />}

      <main className="p-4 md:p-6 lg:pl-80">
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
