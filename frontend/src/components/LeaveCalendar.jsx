import { Building2, CalendarDays, ChevronLeft, ChevronRight, FileText, UserRound, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import ModalPortal from './ModalPortal';

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

const statusOptions = ['All', 'Approved', 'Pending', 'Rejected'];

export default function LeaveCalendar({ title = 'Lịch nghỉ phép' }) {
  const [mode, setMode] = useState('week');
  const [cursor, setCursor] = useState(new Date());
  const [leaves, setLeaves] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedLeave, setSelectedLeave] = useState(null);
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

  const rangeLeaves = useMemo(() => {
    const firstDay = days[0];
    const lastDay = addDays(days[days.length - 1], 1);
    return leaves.filter((leave) => {
      const leaveDate = new Date(leave.leaveDate);
      return leaveDate >= firstDay && leaveDate < lastDay;
    });
  }, [days, leaves]);

  const filteredLeaves = useMemo(
    () => statusFilter === 'All' ? rangeLeaves : rangeLeaves.filter((leave) => leave.status === statusFilter),
    [rangeLeaves, statusFilter]
  );

  const leavesByDay = useMemo(() => filteredLeaves.reduce((calendar, leave) => {
    const key = new Date(leave.leaveDate).toDateString();
    if (!calendar[key]) calendar[key] = [];
    calendar[key].push(leave);
    return calendar;
  }, {}), [filteredLeaves]);

  const uniqueEmployees = new Set(rangeLeaves.map((leave) => leave.employeeId?._id).filter(Boolean)).size;
  const statusCount = (status) => status === 'All'
    ? rangeLeaves.length
    : rangeLeaves.filter((leave) => leave.status === status).length;

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
            <button type="button" className={`rounded-xl px-3 py-1.5 font-semibold ${mode === 'week' ? 'bg-white text-brand shadow-sm' : 'text-slate-500'}`} onClick={() => setMode('week')}>Tuần</button>
            <button type="button" className={`rounded-xl px-3 py-1.5 font-semibold ${mode === 'month' ? 'bg-white text-brand shadow-sm' : 'text-slate-500'}`} onClick={() => setMode('month')}>Tháng</button>
          </div>
          <button type="button" className="btn-secondary px-2" onClick={() => move(-1)} aria-label="Trước"><ChevronLeft size={17} /></button>
          <button type="button" className="btn-secondary px-2" onClick={() => setCursor(new Date())}>Hôm nay</button>
          <button type="button" className="btn-secondary px-2" onClick={() => move(1)} aria-label="Sau"><ChevronRight size={17} /></button>
        </div>
      </div>

      {error && <div className="border-b border-rose-100 bg-rose-50 px-5 py-2 text-sm text-rose-700">{error}</div>}

      <div className="calendar-overview">
        <div className="calendar-summary">
          <div>
            <span>Tổng đơn</span>
            <strong>{rangeLeaves.length}</strong>
          </div>
          <div>
            <span>Nhân sự nghỉ</span>
            <strong>{uniqueEmployees}</strong>
          </div>
        </div>
        <div className="calendar-filters" aria-label="Lọc lịch theo trạng thái">
          {statusOptions.map((status) => (
            <button
              key={status}
              type="button"
              className={`calendar-filter calendar-filter-${status.toLowerCase()} ${statusFilter === status ? 'is-active' : ''}`}
              onClick={() => setStatusFilter(status)}
              aria-pressed={statusFilter === status}
            >
              <i />
              {status === 'All' ? 'Tất cả' : statusText[status]}
              <span>{statusCount(status)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/80 text-center text-xs font-bold text-slate-500">
        {weekdays.map((day) => <div key={day} className="px-2 py-2">{day}</div>)}
      </div>

      <div className={`grid grid-cols-7 ${mode === 'week' ? 'min-h-72' : ''}`}>
        {days.map((day) => {
          const dayLeaves = leavesByDay[day.toDateString()] || [];
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
                  <button
                    key={leave._id}
                    type="button"
                    className={`calendar-event w-full rounded-xl px-2 py-1.5 text-left text-xs ring-1 ${statusClass[leave.status] || statusClass.Pending}`}
                    onClick={() => setSelectedLeave(leave)}
                    title={`${leave.employeeId?.fullName || 'Nhân viên'} - ${statusText[leave.status] || leave.status}`}
                  >
                    <span>{leave.employeeId?.fullName || 'Nhân viên'}</span>
                    <small>{leave.employeeId?.departmentId?.departmentName || 'Chưa có phòng ban'}</small>
                  </button>
                ))}
                {dayLeaves.length > (mode === 'week' ? 4 : 2) && (
                  <div className="px-1 text-xs font-semibold text-slate-500">+{dayLeaves.length - (mode === 'week' ? 4 : 2)} đơn khác</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <LeaveDetailModal leave={selectedLeave} onClose={() => setSelectedLeave(null)} />
    </section>
  );
}

function LeaveDetailModal({ leave, onClose }) {
  if (!leave) return null;

  return (
    <ModalPortal>
      <div className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm" onMouseDown={onClose}>
        <div className="modal-fly modal-card w-full max-w-lg" onMouseDown={(event) => event.stopPropagation()}>
          <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.14em] text-slate-400">Chi tiết nghỉ phép</p>
              <h3 className="mt-1 text-xl font-bold text-ink">{leave.employeeId?.fullName || 'Nhân viên'}</h3>
            </div>
            <button type="button" className="btn-secondary shrink-0 px-2" onClick={onClose} aria-label="Đóng"><X size={18} /></button>
          </div>
          <div className="modal-body space-y-3">
            <DetailRow icon={Building2} label="Phòng ban" value={leave.employeeId?.departmentId?.departmentName || 'Chưa cập nhật'} />
            <DetailRow icon={CalendarDays} label="Ngày nghỉ" value={new Date(leave.leaveDate).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })} />
            <DetailRow icon={FileText} label="Lý do" value={leave.reason || 'Không có lý do'} />
            <DetailRow
              icon={UserRound}
              label="Trạng thái"
              value={<span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${statusClass[leave.status] || statusClass.Pending}`}>{statusText[leave.status] || leave.status}</span>}
            />
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex gap-3 rounded-2xl bg-slate-50 p-3.5">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-slate-500 shadow-sm"><Icon size={17} /></div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-slate-400">{label}</p>
        <div className="mt-1 text-sm font-semibold text-slate-700">{value}</div>
      </div>
    </div>
  );
}
