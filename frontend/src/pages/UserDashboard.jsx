import { CalendarCheck, CalendarClock, CalendarDays, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../api/client';
import LeaveCalendar from '../components/LeaveCalendar';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/AuthContext';

export default function UserDashboard() {
  const { employee } = useAuth();
  const [stats, setStats] = useState({});
  useEffect(() => { api.get('/dashboard/user').then(({ data }) => setStats(data)); }, []);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-ink">Dashboard cá nhân</h1>
        <p className="text-sm text-slate-500">{employee?.position} - {employee?.departmentId?.departmentName}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Tổng đơn" value={stats.totalLeaves} icon={CalendarDays} />
        <StatCard label="Chờ duyệt" value={stats.pendingLeaves} icon={CalendarClock} tone="amber" />
        <StatCard label="Đã duyệt" value={stats.approvedLeaves} icon={CalendarCheck} tone="teal" />
        <StatCard label="Từ chối" value={stats.rejectedLeaves} icon={XCircle} tone="rose" />
      </div>
      <LeaveCalendar title="Lịch nghỉ phép của tôi" />
    </div>
  );
}
