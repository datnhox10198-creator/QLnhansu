import { Building2, CalendarCheck, CalendarClock, CalendarDays, UsersRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../api/client';
import LeaveCalendar from '../components/LeaveCalendar';
import StatCard from '../components/StatCard';

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  useEffect(() => { api.get('/dashboard/admin').then(({ data }) => setStats(data)); }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-ink">Dashboard quản trị</h1>
        <p className="text-sm text-slate-500">Tổng quan nhân sự, phòng ban và nghỉ phép</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Tổng nhân viên" value={stats.totalEmployees} icon={UsersRound} />
        <StatCard label="Phòng ban" value={stats.totalDepartments} icon={Building2} tone="blue" />
        <StatCard label="Đơn nghỉ phép" value={stats.totalLeaves} icon={CalendarDays} tone="slate" />
        <StatCard label="Chờ duyệt" value={stats.pendingLeaves} icon={CalendarClock} tone="amber" />
        <StatCard label="Đã duyệt" value={stats.approvedLeaves} icon={CalendarCheck} tone="teal" />
      </div>
      <LeaveCalendar title="Lịch nghỉ phép toàn công ty" />
    </div>
  );
}
