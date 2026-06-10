import { ArrowUpRight, Building2, CalendarCheck, CalendarClock, CalendarDays, UsersRound } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import LeaveCalendar from '../components/LeaveCalendar';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/dashboard/admin')
      .then(({ data }) => setStats(data))
      .catch((requestError) => setError(requestError.response?.data?.message || 'Không tải được dữ liệu dashboard.'));
  }, []);

  const approvalRate = useMemo(() => {
    if (!stats.totalLeaves) return 0;
    return Math.round(((stats.approvedLeaves || 0) / stats.totalLeaves) * 100);
  }, [stats.approvedLeaves, stats.totalLeaves]);

  const today = new Intl.DateTimeFormat('vi-VN', { weekday: 'long', day: '2-digit', month: 'long' }).format(new Date());

  return (
    <div className="space-y-6">
      <section className="dashboard-hero">
        <div className="relative z-10 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">{today}</p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.035em] text-white sm:text-4xl">
            Chào {user?.fullName?.split(' ').slice(-1)[0]}, mọi thứ đang vận hành tốt.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
            Theo dõi biến động nhân sự, tiến độ xử lý đơn và các hoạt động quan trọng từ một màn hình duy nhất.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/employees" className="btn bg-emerald-400 text-slate-950 hover:bg-emerald-300">
              Quản lý nhân viên <ArrowUpRight size={16} />
            </Link>
            <Link to="/reports" className="btn border border-white/15 bg-white/10 text-white hover:bg-white/15">
              Xem báo cáo
            </Link>
          </div>
        </div>
        <div className="hero-metric relative z-10">
          <div className="relative grid h-32 w-32 place-items-center rounded-full" style={{ background: `conic-gradient(#34d399 ${approvalRate * 3.6}deg, rgba(255,255,255,.1) 0deg)` }}>
            <div className="grid h-[106px] w-[106px] place-items-center rounded-full bg-slate-900">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">{approvalRate}%</p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-400">Đã xử lý</p>
              </div>
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-slate-400">{stats.pendingLeaves ?? 0} đơn đang chờ duyệt</p>
        </div>
      </section>

      {error && <div className="alert-error">{error}</div>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Nhân viên" value={stats.totalEmployees} icon={UsersRound} note="Đang hoạt động" />
        <StatCard label="Phòng ban" value={stats.totalDepartments} icon={Building2} tone="blue" note="Trong tổ chức" />
        <StatCard label="Tổng đơn nghỉ" value={stats.totalLeaves} icon={CalendarDays} tone="slate" note="Tất cả trạng thái" />
        <StatCard label="Chờ duyệt" value={stats.pendingLeaves} icon={CalendarClock} tone="amber" note="Cần xử lý" />
        <StatCard label="Đã duyệt" value={stats.approvedLeaves} icon={CalendarCheck} tone="teal" note={`${approvalRate}% tổng số đơn`} />
      </div>

      <LeaveCalendar title="Lịch nghỉ phép toàn công ty" />
    </div>
  );
}
