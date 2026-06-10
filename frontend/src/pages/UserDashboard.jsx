import { ArrowUpRight, CalendarCheck, CalendarClock, CalendarDays, Sparkles, UserRound, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import LeaveCalendar from '../components/LeaveCalendar';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function UserDashboard() {
  const { user, employee } = useAuth();
  const { t } = useLanguage();
  const [stats, setStats] = useState({});
  useEffect(() => { api.get('/dashboard/user').then(({ data }) => setStats(data)); }, []);

  return (
    <div className="space-y-6">
      <section className="dashboard-hero dashboard-hero-user">
        <div className="relative z-10 max-w-2xl">
          <div className="hero-kicker"><Sparkles size={14} /> {t('Không gian của bạn')}</div>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.035em] text-slate-800 sm:text-4xl">{t('Chào')} {user?.fullName}. <span className="hero-highlight">{t('Sẵn sàng cho hôm nay?')}</span></h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            {employee?.position} · {employee?.departmentId?.departmentName || t('Chưa phân phòng ban')}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/leaves" className="btn hero-primary">
              {t('Xin nghỉ phép')} <ArrowUpRight size={16} />
            </Link>
            <Link to="/profile" className="btn hero-secondary">
              <UserRound size={16} /> {t('Hồ sơ của tôi')}
            </Link>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Tổng đơn" value={stats.totalLeaves} icon={CalendarDays} note="Đơn nghỉ của bạn" />
        <StatCard label="Chờ duyệt" value={stats.pendingLeaves} icon={CalendarClock} tone="amber" note="Đang được xử lý" />
        <StatCard label="Đã duyệt" value={stats.approvedLeaves} icon={CalendarCheck} tone="teal" note="Đơn được chấp thuận" />
        <StatCard label="Từ chối" value={stats.rejectedLeaves} icon={XCircle} tone="rose" note="Đơn không được duyệt" />
      </div>
      <LeaveCalendar title={t('Lịch nghỉ phép của tôi')} />
    </div>
  );
}
