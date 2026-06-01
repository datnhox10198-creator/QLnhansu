import { Building2, CalendarCheck, CalendarClock, CalendarDays, UsersRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../api/client';
import StatCard from '../components/StatCard';

export default function Reports() {
  const [stats, setStats] = useState({});
  useEffect(() => { api.get('/dashboard/admin').then(({ data }) => setStats(data)); }, []);

  const rows = [
    ['Tổng số nhân viên', stats.totalEmployees],
    ['Tổng số phòng ban', stats.totalDepartments],
    ['Tổng số đơn nghỉ phép', stats.totalLeaves],
    ['Số đơn chờ duyệt', stats.pendingLeaves],
    ['Số đơn đã duyệt', stats.approvedLeaves]
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-ink">Báo cáo thống kê</h1>
        <p className="text-sm text-slate-500">Tổng hợp số liệu phục vụ quản trị nhân sự</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Nhân viên" value={stats.totalEmployees} icon={UsersRound} />
        <StatCard label="Phòng ban" value={stats.totalDepartments} icon={Building2} tone="blue" />
        <StatCard label="Đơn nghỉ" value={stats.totalLeaves} icon={CalendarDays} tone="slate" />
        <StatCard label="Chờ duyệt" value={stats.pendingLeaves} icon={CalendarClock} tone="amber" />
        <StatCard label="Đã duyệt" value={stats.approvedLeaves} icon={CalendarCheck} tone="teal" />
      </div>
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between border-b border-slate-100 px-5 py-4 last:border-b-0">
            <span className="text-slate-600">{label}</span>
            <span className="font-bold">{value ?? 0}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
