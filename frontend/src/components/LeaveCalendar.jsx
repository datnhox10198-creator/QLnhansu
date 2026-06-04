import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import api from '../api/client';

const weekdays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

const startOfWeek = (value) => {
  const date = new Date(value);
  const day = date.getDay() || 7;
  date.setDate(date.getDate() - day + 1);
  date.setHours(0, 0, 0, 0);
  return date;
};

const startOfMonth = (value) => new Date(value.getFullYear(), value.getMonth(), 1);
const sameDay = (a, b) => a.toDateString() === b.toDateString();

const addDays = (value, amount) => {
  const date = new Date(value);
  date.setDate(date.getDate() + amount);
  return date;
};

const addMonths = (value, amount) => {
  const date = new Date(value);
  date.setMonth(date.getMonth() + amount);
  return date;
};

const statusClass = {
  Approved: 'bg-teal-50 text-teal-700 ring-teal-100',
  Rejected: 'bg-rose-50 text-rose-700 ring-rose-100',
  Pending: 'bg-amber-50 text-amber-700 ring-amber-100'
};

const statusText = {
  Approved: 'Đã duyệt',
  Rejected: 'Từ chối',
  Pending: 'Chờ duyệt'
};

export default function LeaveCalendar({ title = 'Lịch nghỉ phép' }) {
  const [mode, setMode] = useState('week');
  const [cursor, setCursor] = useState(new Date());
  const [leaves, setLeaves] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/leaves')
      .then(({ data }) => setLeaves(data))
      .catch((error) => setError(error.response?.data?.message || 'Không tải được lịch nghỉ phép.'));
  }, []);

  const days = useMemo(() => {
    if (mode === 'week') {
      const start = startOfWeek(cursor);
      return Array.from({ length: 7 }, (_, index) => addDays(start, index));
    }

    const first = startOfMonth(cursor);
    const gridStart = startOfWeek(first);
    return Array.from({ length: 42 }, (_, index) => addDays(gridStart, index));
  }, [cursor, mode]);

  const rangeLabel = useMemo(() => {
    if (mode === 'week') {
      const first = days[0];
      const last = days[6];
      return `${first.toLocaleDateString('vi-VN')} - ${last.toLocaleDateString('vi-VN')}`;
    }
    return cursor.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
  }, [cursor, days, mode]);

  const move = (direction) => {
    setCursor((current) => (mode === 'week' ? addDays(current, direction * 7) : addMonths(current, direction)));
  };

  const getLeaves = (day) => leaves.filter((leave) => sameDay(new Date(leave.leaveDate), day));

  return (
    <section className="overflow-hidden rounded-3xl border border-white/70 bg-white/90 shadow-xl shadow-slate-900/5 backdrop-blur">
      <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-teal-50 p-2 text-brand ring-1 ring-teal-100">
            <CalendarDays size={20} />
          </div>
          <div>
            <h2 className="font-bold text-ink">{title}</h2>
            <p className="text-sm text-slate-500">{rangeLabel}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="grid grid-cols-2 rounded-2xl border border-slate-200 bg-slate-50 p-1 text-sm">
            <button className={`rounded-xl px-3 py-1.5 font-semibold ${mode === 'week' ? 'bg-white text-brand shadow-sm' : 'text-slate-500'}`} onClick={() => setMode('week')}>Tuần</button>
            <button className={`rounded-xl px-3 py-1.5 font-semibold ${mode === 'month' ? 'bg-white text-brand shadow-sm' : 'text-slate-500'}`} onClick={() => setMode('month')}>Tháng</button>
          </div>
          <button className="btn-secondary px-2" onClick={() => move(-1)} aria-label="Trước"><ChevronLeft size={17} /></button>
          <button className="btn-secondary px-2" onClick={() => setCursor(new Date())}>Hôm nay</button>
          <button className="btn-secondary px-2" onClick={() => move(1)} aria-label="Sau"><ChevronRight size={17} /></button>
        </div>
      </div>

      {error && <div className="border-b border-rose-100 bg-rose-50 px-5 py-2 text-sm text-rose-700">{error}</div>}

      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/80 text-center text-xs font-bold text-slate-500">
        {weekdays.map((day) => <div key={day} className="px-2 py-2">{day}</div>)}
      </div>

      <div className={`grid grid-cols-7 ${mode === 'week' ? 'min-h-72' : ''}`}>
        {days.map((day) => {
          const dayLeaves = getLeaves(day);
          const outsideMonth = mode === 'month' && day.getMonth() !== cursor.getMonth();
          const today = sameDay(day, new Date());

          return (
            <div key={day.toISOString()} className={`min-h-28 border-b border-r border-slate-100 p-2 ${outsideMonth ? 'bg-slate-50 text-slate-400' : 'bg-white/80'} ${today ? 'ring-2 ring-inset ring-teal-200' : ''}`}>
              <div className="mb-2 flex items-center justify-between">
                <span className={`grid h-7 w-7 place-items-center rounded-xl text-sm font-bold ${today ? 'bg-brand text-white' : 'text-slate-700'}`}>
                  {day.getDate()}
                </span>
              </div>
              <div className="space-y-1">
                {dayLeaves.slice(0, mode === 'week' ? 4 : 2).map((leave) => (
                  <div key={leave._id} className={`truncate rounded-xl px-2 py-1 text-xs font-semibold ring-1 ${statusClass[leave.status] || statusClass.Pending}`}>
                    {leave.employeeId?.fullName || 'Nhân viên'} - {statusText[leave.status] || leave.status}
                  </div>
                ))}
                {dayLeaves.length > (mode === 'week' ? 4 : 2) && (
                  <div className="text-xs font-semibold text-slate-500">+{dayLeaves.length - (mode === 'week' ? 4 : 2)} đơn khác</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
