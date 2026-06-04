import { Clock3, LogIn, LogOut } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import DataTable from '../components/DataTable';
import { useAuth } from '../context/AuthContext';
import { date } from '../utils/format';

const todayKey = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 10);
};

const time = (value) => (
  value
    ? new Date(value).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    : '-'
);

const duration = (minutes) => {
  if (minutes === null || minutes === undefined) return '-';
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return `${hours}h ${rest}m`;
};

export default function Attendance() {
  const { user } = useAuth();
  const isAdmin = user.role === 'admin';
  const [departments, setDepartments] = useState([]);
  const [rows, setRows] = useState([]);
  const [today, setToday] = useState(null);
  const [filters, setFilters] = useState({ departmentId: '', workDate: todayKey() });
  const [message, setMessage] = useState('');

  const params = useMemo(() => ({
    workDate: filters.workDate,
    ...(filters.departmentId ? { departmentId: filters.departmentId } : {})
  }), [filters]);

  const loadRows = () => api.get('/attendance', { params }).then(({ data }) => setRows(data));
  const loadToday = () => !isAdmin && api.get('/attendance/today').then(({ data }) => setToday(data));

  const load = async () => {
    setMessage('');
    await Promise.all([loadRows(), loadToday()]);
  };

  useEffect(() => {
    if (isAdmin) api.get('/departments').then(({ data }) => setDepartments(data));
  }, [isAdmin]);

  useEffect(() => {
    load();
  }, [params]);

  const check = async (type) => {
    try {
      const path = type === 'in' ? '/attendance/check-in' : '/attendance/check-out';
      await api.post(path);
      await load();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Không thực hiện được chấm công');
    }
  };

  const badge = (status) => {
    const cls = status === 'Completed' ? 'bg-teal-50 text-teal-700' : 'bg-amber-50 text-amber-700';
    const label = status === 'Completed' ? 'Đã check-out' : 'Đang làm việc';
    return <span className={`rounded-2xl px-2 py-1 text-xs font-semibold ${cls}`}>{label}</span>;
  };

  const columns = [
    { key: 'employee', label: 'Nhân viên', render: (row) => row.employeeId?.fullName },
    { key: 'department', label: 'Phòng ban', render: (row) => row.employeeId?.departmentId?.departmentName },
    { key: 'workDate', label: 'Ngày', render: (row) => date(row.workDate) },
    { key: 'checkInAt', label: 'Check-in', render: (row) => time(row.checkInAt) },
    { key: 'checkOutAt', label: 'Check-out', render: (row) => time(row.checkOutAt) },
    { key: 'totalMinutes', label: 'Tổng giờ', render: (row) => duration(row.totalMinutes) },
    { key: 'status', label: 'Trạng thái', render: (row) => badge(row.status) }
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-ink">Chấm công</h1>
        <p className="text-sm text-slate-500">
          {isAdmin ? 'Theo dõi check-in/check-out theo phòng ban và ngày làm việc.' : 'Check-in khi bắt đầu làm việc và check-out khi kết thúc ngày.'}
        </p>
      </div>

      {!isAdmin && (
        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-3xl bg-teal-50 text-brand">
                <Clock3 size={22} />
              </div>
              <div>
                <p className="text-sm text-slate-500">Hôm nay</p>
                <p className="text-lg font-bold text-ink">{todayKey()}</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Check-in</p>
                <p className="mt-1 text-xl font-bold text-ink">{time(today?.checkInAt)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Check-out</p>
                <p className="mt-1 text-xl font-bold text-ink">{time(today?.checkOutAt)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">Tổng giờ</p>
                <p className="mt-1 text-xl font-bold text-ink">{duration(today?.totalMinutes)}</p>
              </div>
            </div>
            {message && <p className="mt-4 rounded-2xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{message}</p>}
          </div>

          <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:w-56">
            <button className="btn-primary" disabled={!!today} onClick={() => check('in')}>
              <LogIn size={16} /> Check-in
            </button>
            <button className="btn-secondary" disabled={!today || !!today.checkOutAt} onClick={() => check('out')}>
              <LogOut size={16} /> Check-out
            </button>
          </div>
        </div>
      )}

      {isAdmin && (
        <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row">
          <select className="field md:max-w-xs" value={filters.departmentId} onChange={(event) => setFilters({ ...filters, departmentId: event.target.value })}>
            <option value="">Tất cả phòng ban</option>
            {departments.map((department) => (
              <option key={department._id} value={department._id}>{department.departmentName}</option>
            ))}
          </select>
          <input className="field md:max-w-xs" type="date" value={filters.workDate} onChange={(event) => setFilters({ ...filters, workDate: event.target.value })} />
        </div>
      )}

      <DataTable columns={columns} rows={rows} />
    </div>
  );
}
