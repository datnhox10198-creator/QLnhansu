import {
  Banknote,
  Bell,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  Clock3,
  CornerDownLeft,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Menu,
  RefreshCw,
  Search,
  ShieldCheck,
  UserRound,
  UsersRound,
  Zap,
  X
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

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
  const { locale, t } = useLanguage();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationsSeen, setNotificationsSeen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeResult, setActiveResult] = useState(0);
  const [systemStatus, setSystemStatus] = useState({ state: 'checking', checkedAt: null });
  const searchInputRef = useRef(null);
  const displayPosition = employee?.position || t(user.role === 'admin' ? 'Quản trị viên' : 'Nhân viên');
  const [rawPageTitle, rawPageDescription] = pageMeta[pathname] || pageMeta['/'];
  const pageTitle = t(rawPageTitle);
  const pageDescription = t(rawPageDescription);
  const links = user.role === 'admin'
    ? [
        ['/', LayoutDashboard, t('Tổng quan')],
        ['/employees', UsersRound, t('Nhân viên')],
        ['/departments', Building2, t('Phòng ban')],
        ['/attendance', Clock3, t('Chấm công')],
        ['/tasks', ClipboardCheck, t('Công việc')],
        ['/payroll', Banknote, t('Phiếu lương')],
        ['/leaves', CalendarDays, t('Nghỉ phép')],
        ['/reports', ClipboardList, t('Báo cáo')]
      ]
    : [
        ['/', LayoutDashboard, t('Tổng quan')],
        ['/profile', UserRound, t('Hồ sơ')],
        ['/attendance', Clock3, t('Chấm công')],
        ['/tasks', ClipboardCheck, t('Công việc')],
        ['/payroll', Banknote, t('Phiếu lương')],
        ['/leaves', CalendarDays, t('Nghỉ phép')]
      ];
  const searchablePages = useMemo(
    () => links.map(([to, icon, label]) => ({
      to,
      icon,
      label,
      description: t(pageMeta[to]?.[1] || 'Đi tới trang')
    })),
    [user.role, t]
  );
  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase('vi');
    if (!query) return searchablePages;
    return searchablePages.filter((item) =>
      `${item.label} ${item.description}`.toLocaleLowerCase('vi').includes(query)
    );
  }, [searchQuery, searchablePages]);
  const notifications = user.role === 'admin'
    ? [
        { icon: CalendarDays, title: t('Kiểm tra đơn nghỉ phép'), detail: t('Xem các yêu cầu đang chờ xử lý.'), to: '/leaves', tone: 'blue' },
        { icon: ClipboardCheck, title: t('Theo dõi công việc'), detail: t('Kiểm tra tiến độ công việc của đội ngũ.'), to: '/tasks', tone: 'violet' }
      ]
    : [
        { icon: ClipboardCheck, title: t('Công việc của bạn'), detail: t('Xem và cập nhật tiến độ hôm nay.'), to: '/tasks', tone: 'blue' },
        { icon: CheckCircle2, title: t('Chấm công hôm nay'), detail: t('Kiểm tra trạng thái check-in và check-out.'), to: '/attendance', tone: 'green' }
      ];

  const openNotification = (to) => {
    setNotificationsOpen(false);
    setNotificationsSeen(true);
    navigate(to);
  };

  const checkSystem = async () => {
    setSystemStatus((current) => ({ ...current, state: 'checking' }));
    const startedAt = performance.now();
    try {
      await api.get('/health', { timeout: 8000 });
      setSystemStatus({
        state: 'online',
        checkedAt: new Date(),
        latency: Math.round(performance.now() - startedAt)
      });
    } catch {
      setSystemStatus({ state: 'offline', checkedAt: new Date(), latency: null });
    }
  };

  const openSearch = () => {
    setSearchOpen(true);
    setSearchQuery('');
    setActiveResult(0);
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery('');
  };

  const selectSearchResult = (result) => {
    if (!result) return;
    closeSearch();
    navigate(result.to);
  };

  useEffect(() => {
    checkSystem();
    const interval = window.setInterval(checkSystem, 60000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleShortcut = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchOpen ? closeSearch() : openSearch();
      }
      if (event.key === 'Escape' && searchOpen) closeSearch();
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    window.setTimeout(() => searchInputRef.current?.focus(), 0);
  }, [searchOpen]);

  useEffect(() => {
    setActiveResult(0);
  }, [searchQuery]);

  const handleSearchKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveResult((current) => Math.min(current + 1, Math.max(searchResults.length - 1, 0)));
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveResult((current) => Math.max(current - 1, 0));
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      selectSearchResult(searchResults[activeResult]);
    }
  };

  const NavContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-24 items-center justify-between border-b border-black/[0.06] px-6">
        <div className="flex items-center gap-3">
          <div className="brand-mark">
            <ShieldCheck size={22} strokeWidth={2.4} />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">{t('Quản lý nhân sự')}</p>
            <p className="mt-0.5 text-xl font-extrabold tracking-tight text-slate-800">HRMS</p>
          </div>
        </div>
        <button className="icon-button-dark lg:hidden" onClick={() => setOpen(false)} aria-label={t('Đóng menu')}>
          <X size={18} />
        </button>
      </div>

      <div className="px-4 pt-6">
        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">{t('Your space')}</p>
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
        <div className="rounded-2xl border border-black/[0.06] bg-white/70 p-3.5 shadow-sm backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="avatar-pop grid h-10 w-10 shrink-0 place-items-center rounded-xl font-extrabold text-slate-950">
              {user.fullName?.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">{user.fullName}</p>
              <p className="truncate text-xs text-slate-500">{displayPosition}</p>
            </div>
            <button className="icon-button-dark" onClick={logout} aria-label={t('Đăng xuất')}>
              <LogOut size={16} />
            </button>
          </div>
        </div>
        <p className="mt-3 text-center text-[10px] font-semibold tracking-wider text-slate-400">HUMAN RESOURCE SYSTEM</p>
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
      {open && <button className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden" onClick={() => setOpen(false)} aria-label={t('Đóng menu')} />}

      <div className="lg:pl-[276px]">
        <header className="topbar sticky top-0 z-20">
          <div className="flex h-20 items-center gap-4 px-4 sm:px-6 lg:px-8">
            <button className="icon-button lg:hidden" onClick={() => setOpen(true)} aria-label={t('Mở menu')}>
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
              <button
                className={`status-pill status-${systemStatus.state} hidden xl:flex`}
                onClick={checkSystem}
                title={systemStatus.checkedAt ? `${t('Kiểm tra lúc')} ${systemStatus.checkedAt.toLocaleTimeString(locale)}` : t('Đang kiểm tra hệ thống')}
              >
                <span className="status-dot" />
                <span>
                  {systemStatus.state === 'checking' && t('Đang kiểm tra')}
                  {systemStatus.state === 'online' && `${t('Hệ thống ổn định')}${systemStatus.latency ? ` · ${systemStatus.latency}ms` : ''}`}
                  {systemStatus.state === 'offline' && t('Mất kết nối API')}
                </span>
                {systemStatus.state === 'checking'
                  ? <LoaderCircle className="animate-spin" size={13} />
                  : <RefreshCw size={12} />}
              </button>
              <button
                className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400 transition hover:border-blue-200 hover:bg-white hover:text-slate-700 xl:flex"
                onClick={openSearch}
              >
                <Search size={15} />
                <span className="w-40 text-left">{t('Tìm kiếm nhanh...')}</span>
                <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px]">Ctrl K</kbd>
              </button>
              <button className="icon-button xl:hidden" onClick={openSearch} aria-label={t('Tìm kiếm nhanh')}>
                <Search size={18} />
              </button>
              <LanguageSwitcher compact />
              <div className="relative">
                <button
                  className={`icon-button relative ${notificationsOpen ? 'bg-blue-50 text-blue-600' : ''}`}
                  aria-label={t('Thông báo')}
                  aria-expanded={notificationsOpen}
                  onClick={() => {
                    setNotificationsOpen((value) => !value);
                    setNotificationsSeen(true);
                  }}
                >
                  <Bell size={18} />
                  {!notificationsSeen && <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-orange-500 ring-2 ring-white" />}
                </button>

                {notificationsOpen && (
                  <>
                    <button className="fixed inset-0 z-30 cursor-default" onClick={() => setNotificationsOpen(false)} aria-label={t('Đóng thông báo')} />
                    <div className="notification-panel absolute right-0 top-12 z-40 w-[min(22rem,calc(100vw-2rem))]">
                      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{t('Thông báo')}</p>
                          <p className="text-xs text-slate-400">{t('Các việc bạn có thể cần xử lý')}</p>
                        </div>
                        <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-semibold text-blue-600">{notifications.length} {t('mục')}</span>
                      </div>
                      <div className="p-2">
                        {notifications.map(({ icon: Icon, title, detail, to, tone }) => (
                          <button key={to} className="notification-item" onClick={() => openNotification(to)}>
                            <span className={`notification-icon notification-icon-${tone}`}><Icon size={17} /></span>
                            <span className="min-w-0 text-left">
                              <span className="block text-sm font-semibold text-slate-800">{title}</span>
                              <span className="mt-0.5 block text-xs leading-5 text-slate-500">{detail}</span>
                            </span>
                            <ChevronRight className="ml-auto shrink-0 text-slate-300" size={15} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="hidden items-center gap-2.5 border-l border-slate-200 pl-3 sm:flex">
                <div className="avatar-pop grid h-9 w-9 place-items-center rounded-xl text-sm font-extrabold text-slate-950">{user.fullName?.charAt(0)}</div>
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
            <div className="mb-5 flex items-center gap-2 text-xs font-semibold text-slate-500 lg:hidden">
              <Zap size={14} /> {t('Make today count')}
            </div>
            <Outlet />
          </div>
        </main>
      </div>

      {searchOpen && (
        <div className="command-backdrop" onMouseDown={closeSearch}>
          <section className="command-palette" onMouseDown={(event) => event.stopPropagation()} aria-label={t('Tìm kiếm nhanh')}>
            <div className="command-search">
              <Search size={20} />
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder={t('Tìm trang hoặc chức năng...')}
                aria-label={t('Tìm trang hoặc chức năng')}
              />
              <button onClick={closeSearch} aria-label={t('Đóng tìm kiếm')}><X size={18} /></button>
            </div>

            <div className="command-results">
              <p className="command-label">{searchQuery ? t('Kết quả tìm kiếm') : t('Đi tới nhanh')}</p>
              {searchResults.map((result, index) => {
                const Icon = result.icon;
                return (
                  <button
                    key={result.to}
                    className={`command-result ${index === activeResult ? 'command-result-active' : ''}`}
                    onMouseEnter={() => setActiveResult(index)}
                    onClick={() => selectSearchResult(result)}
                  >
                    <span className="command-result-icon"><Icon size={18} /></span>
                    <span className="min-w-0 flex-1 text-left">
                      <span className="block text-sm font-semibold text-slate-800">{result.label}</span>
                      <span className="block truncate text-xs text-slate-400">{result.description}</span>
                    </span>
                    {index === activeResult && <CornerDownLeft className="text-slate-400" size={15} />}
                  </button>
                );
              })}
              {!searchResults.length && (
                <div className="px-4 py-10 text-center text-sm text-slate-500">
                  {t('Không tìm thấy chức năng phù hợp.')}
                </div>
              )}
            </div>

            <footer className="command-footer">
              <span><kbd>↑</kbd><kbd>↓</kbd> {t('Di chuyển')}</span>
              <span><kbd>Enter</kbd> {t('Mở')}</span>
              <span><kbd>Esc</kbd> {t('Đóng')}</span>
            </footer>
          </section>
        </div>
      )}
    </div>
  );
}
