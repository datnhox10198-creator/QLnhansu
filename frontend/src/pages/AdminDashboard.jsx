import { Building2, CalendarCheck, CalendarClock, CalendarDays, UsersRound } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import LeaveCalendar from '../components/LeaveCalendar';
import StatCard from '../components/StatCard';

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/dashboard/admin')
      .then(({ data }) => setStats(data))
      .catch((error) => setError(error.response?.data?.message || 'Không tải được dữ liệu dashboard.'));
  }, []);

  const approvalRate = useMemo(() => {
    if (!stats.totalLeaves) return 0;
    return Math.round(((stats.approvedLeaves || 0) / stats.totalLeaves) * 100);
  }, [stats.approvedLeaves, stats.totalLeaves]);

  return (
    <div className="space-y-5">
      <section className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-xl shadow-slate-900/5 backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-brand">Dashboard quản trị</p>
            <h1 className="mt-1 text-2xl font-bold text-ink">Tổng quan hệ thống nhân sự</h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              Theo dõi nhanh nhân sự, phòng ban và tình hình xử lý đơn nghỉ phép trong hệ thống.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:min-w-80">
            <MiniMetric label="Tỷ lệ đã duyệt" value={`${approvalRate}%`} />
            <MiniMetric label="Chờ xử lý" value={stats.pendingLeaves ?? 0} tone="amber" />
          </div>
        </div>
      </section>

      {error && <div className="rounded-2xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Tổng nhân viên" value={stats.totalEmployees} icon={UsersRound} />
        <StatCard label="Phòng ban" value={stats.totalDepartments} icon={Building2} tone="blue" />
        <StatCard label="Đơn nghỉ phép" value={stats.totalLeaves} icon={CalendarDays} tone="slate" />
        <StatCard label="Chờ duyệt" value={stats.pendingLeaves} icon={CalendarClock} tone="amber" />
        <StatCard label="Đã duyệt" value={stats.approvedLeaves} icon={CalendarCheck} tone="teal" />
      </div>

      <LeaveCalendar title="Lịch nghỉ phép" />
    </div>
  );
}

function MiniMetric({ label, value, tone = 'teal' }) {
  const toneClass = tone === 'amber' ? 'bg-amber-50 text-amber-700 ring-amber-100' : 'bg-teal-50 text-teal-700 ring-teal-100';

  return (
    <div className={`rounded-3xl px-4 py-3 ring-1 ${toneClass}`}>
      <p className="text-xs font-semibold uppercase tracking-wide">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}
