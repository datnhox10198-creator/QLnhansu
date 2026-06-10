import { CheckCircle2, ClipboardList, Eye, LoaderCircle, Plus, UsersRound, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import ModalPortal from '../components/ModalPortal';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { date, isoDate } from '../utils/format';

const baseForm = () => ({
  title: '',
  description: '',
  workDate: isoDate(new Date()),
  assignedEmployeeIds: [],
  departmentIds: []
});

const statusText = {
  Pending: 'Chưa làm',
  Doing: 'Đang làm',
  Done: 'Làm xong'
};

const statusClass = {
  Pending: 'bg-slate-100 text-slate-700',
  Doing: 'bg-amber-50 text-amber-700',
  Done: 'bg-teal-50 text-teal-700'
};

export default function Tasks() {
  const { user, employee } = useAuth();
  const { t, td } = useLanguage();
  const isAdmin = user?.role === 'admin';
  const [context, setContext] = useState({ team: [], departments: [], managedDepartment: null });
  const [data, setData] = useState({ items: [], canManage: false, adminMode: false });
  const [form, setForm] = useState(baseForm);
  const [formOpen, setFormOpen] = useState(false);
  const [workDate, setWorkDate] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState('');

  const loadTasks = async () => {
    const params = workDate ? { workDate } : {};
    const { data } = await api.get('/tasks', { params });
    setData(data);
  };

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([api.get('/tasks/context'), loadTasks()])
      .then(([contextResponse]) => {
        if (mounted) setContext(contextResponse.data);
      })
      .catch((error) => {
        if (mounted) setMessage({ type: 'error', text: error.response?.data?.message || 'Không tải được dữ liệu công việc.' });
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    setLoading(true);
    loadTasks()
      .catch((error) => setMessage({ type: 'error', text: error.response?.data?.message || 'Không tải được danh sách công việc.' }))
      .finally(() => setLoading(false));
  }, [workDate]);

  const openForm = () => {
    setForm(baseForm());
    setMessage({ type: '', text: '' });
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setForm(baseForm());
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    const payload = isAdmin
      ? {
          title: form.title,
          description: form.description,
          workDate: form.workDate,
          departmentIds: form.departmentIds
        }
      : {
          title: form.title,
          description: form.description,
          workDate: form.workDate,
          assignedEmployeeIds: form.assignedEmployeeIds
        };

    try {
      await api.post('/tasks', payload);
      closeForm();
      setMessage({ type: 'success', text: isAdmin ? 'Đã giao việc cho trưởng phòng đã chọn.' : 'Đã giao việc cho nhân viên trong phòng.' });
      await loadTasks();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Không giao việc được.' });
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (taskId, status) => {
    setUpdatingTaskId(taskId);
    try {
      const { data: updated } = await api.patch(`/tasks/${taskId}/status`, { status });
      setData((current) => ({
        ...current,
        items: current.items.map((task) => (task._id === updated._id ? updated : task))
      }));
      setSelectedTask((current) => (current?._id === updated._id ? updated : current));
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Không cập nhật được trạng thái.' });
    } finally {
      setUpdatingTaskId('');
    }
  };

  const canCreateTask = isAdmin || data.canManage;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Công việc</h1>
          <p className="text-sm text-slate-500">
            {isAdmin
              ? 'Admin giao việc cho phòng ban, hệ thống chỉ gửi tới trưởng phòng.'
              : data.canManage
                ? `${t('Giao việc')} ${td(context.managedDepartment?.departmentName, context.managedDepartment?.translations, 'departmentName')}.`
                : 'Theo dõi và cập nhật trạng thái công việc được giao.'}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <label className="text-sm font-medium text-slate-700">
            Lọc theo ngày
            <input className="field mt-1 sm:w-52" type="date" value={workDate} onChange={(event) => setWorkDate(event.target.value)} />
          </label>
          {canCreateTask && (
            <button className="btn-primary" onClick={openForm}>
              <Plus size={16} /> Giao việc
            </button>
          )}
        </div>
      </div>

      {message.text && (
        <div className={`rounded-2xl px-3 py-2 text-sm ${message.type === 'success' ? 'bg-teal-50 text-teal-700' : 'bg-rose-50 text-rose-700'}`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white px-5 py-10 text-center text-slate-500 shadow-sm">
          Đang tải công việc...
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {data.items.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              td={td}
              t={t}
              currentEmployeeId={employee?._id}
              updatingTaskId={updatingTaskId}
              onOpen={() => setSelectedTask(task)}
              onStatus={updateStatus}
            />
          ))}
          {!data.items.length && (
            <div className="rounded-3xl border border-slate-200 bg-white px-5 py-10 text-center text-slate-500 shadow-sm xl:col-span-2">
              Chưa có công việc
            </div>
          )}
        </div>
      )}

      <TaskFormModal
        open={formOpen}
        form={form}
        setForm={setForm}
        isAdmin={isAdmin}
        team={context.team}
        departments={context.departments}
        saving={saving}
        onClose={closeForm}
        onSubmit={submit}
      />

      <TaskDetailModal
        task={selectedTask}
        currentEmployeeId={employee?._id}
        updatingTaskId={updatingTaskId}
        onClose={() => setSelectedTask(null)}
        onStatus={updateStatus}
      />
    </div>
  );
}

function TaskFormModal({ open, form, setForm, isAdmin, team, departments, saving, onClose, onSubmit }) {
  const { t, td } = useLanguage();
  if (!open) return null;
  return (
    <ModalPortal>
      <div className="modal-backdrop fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/45 p-3 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="modal-fly modal-card w-full max-w-3xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-ink sm:text-xl">{isAdmin ? 'Giao việc cho phòng ban' : 'Giao việc theo ngày'}</h2>
            <p className="text-sm text-slate-500">{isAdmin ? 'Việc sẽ được gửi tới trưởng phòng của phòng ban đã chọn.' : 'Chọn nhân viên trong phòng để giao việc.'}</p>
          </div>
          <button className="btn-secondary shrink-0 px-2" type="button" onClick={onClose} aria-label="Đóng">
            <X size={18} />
          </button>
        </div>
        <TaskFormContent
          form={form}
          setForm={setForm}
          isAdmin={isAdmin}
          team={team}
          departments={departments}
          t={t}
          td={td}
          saving={saving}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      </div>
    </div>
    </ModalPortal>
  );
}

function TaskFormContent({ form, setForm, isAdmin, team, departments, saving, onClose, onSubmit, t, td }) {
  const selectedEmployeeIds = useMemo(() => new Set(form.assignedEmployeeIds), [form.assignedEmployeeIds]);
  const selectedDepartmentIds = useMemo(() => new Set(form.departmentIds), [form.departmentIds]);

  const toggleEmployee = (employeeId) => {
    const exists = selectedEmployeeIds.has(employeeId);
    const next = exists
      ? form.assignedEmployeeIds.filter((id) => id !== employeeId)
      : [...form.assignedEmployeeIds, employeeId].slice(0, 5);
    setForm({ ...form, assignedEmployeeIds: next });
  };

  const toggleDepartment = (departmentId) => {
    const next = selectedDepartmentIds.has(departmentId)
      ? form.departmentIds.filter((id) => id !== departmentId)
      : [...form.departmentIds, departmentId];
    setForm({ ...form, departmentIds: next });
  };

  const hasSelection = isAdmin ? form.departmentIds.length > 0 : form.assignedEmployeeIds.length > 0;

  return (
    <form onSubmit={onSubmit}>
      <div className="modal-body">
      <div className="grid gap-3 lg:grid-cols-[1fr_180px]">
        <input className="field" placeholder="Tên công việc" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
        <input className="field" type="date" value={form.workDate} onChange={(event) => setForm({ ...form, workDate: event.target.value })} required />
      </div>

      <textarea className="field mt-3 min-h-20 resize-y" placeholder="Chi tiết công việc" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required />

      {isAdmin ? (
        <div className="mt-4">
          <p className="mb-2 text-sm font-semibold text-slate-700">Chọn phòng ban, việc sẽ giao cho trưởng phòng</p>
          <div className="grid gap-2 md:grid-cols-2">
            {departments.map((department) => (
              <label key={department._id} className="flex min-h-12 items-center gap-3 rounded-2xl border border-slate-200 px-3 py-2 text-sm">
                <input type="checkbox" checked={selectedDepartmentIds.has(department._id)} onChange={() => toggleDepartment(department._id)} />
                <span className="min-w-0">
                  <span className="block truncate font-semibold text-ink">{td(department.departmentName, department.translations, 'departmentName')}</span>
                  <span className="block truncate text-xs text-slate-500">Trưởng phòng: {department.managerId?.fullName}</span>
                </span>
              </label>
            ))}
          </div>
          {!departments.length && <p className="mt-2 text-sm text-amber-700">Chưa có phòng ban nào được gán trưởng phòng.</p>}
        </div>
      ) : (
        <div className="mt-4">
          <p className="mb-2 text-sm font-semibold text-slate-700">Chọn nhân viên cùng làm, tối đa 5 người</p>
          <div className="grid gap-2 md:grid-cols-2">
            {team.map((member) => (
              <label key={member._id} className="flex min-h-12 items-center gap-3 rounded-2xl border border-slate-200 px-3 py-2 text-sm">
                <input type="checkbox" checked={selectedEmployeeIds.has(member._id)} onChange={() => toggleEmployee(member._id)} disabled={!selectedEmployeeIds.has(member._id) && form.assignedEmployeeIds.length >= 5} />
                <span className="min-w-0">
                  <span className="block truncate font-semibold text-ink">{member.fullName}</span>
                  <span className="block truncate text-xs text-slate-500">{member.employeeCode} - {member.position}</span>
                </span>
              </label>
            ))}
          </div>
          {!team.length && <p className="mt-2 text-sm text-amber-700">Phòng ban chưa có nhân viên để giao việc.</p>}
        </div>
      )}
      </div>

      <div className="modal-footer">
        <button type="button" className="btn-secondary" onClick={onClose}>Huỷ</button>
        <button className="btn-primary min-w-32" disabled={!hasSelection || saving}>
          <Plus size={16} /> {saving ? 'Đang giao...' : 'Giao việc'}
        </button>
      </div>
    </form>
  );
}

function TaskCard({ task, currentEmployeeId, updatingTaskId, onOpen, onStatus, t, td }) {
  const currentAssignee = task.assignees.find((assignee) => assignee.employeeId?._id === currentEmployeeId);
  const updating = updatingTaskId === task._id;

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-lg font-bold text-ink">{td(task.title, task.translations, 'title')}</p>
          <p className="text-sm text-slate-500">{date(task.workDate)} - {td(task.departmentId?.departmentName, task.departmentId?.translations, 'departmentName')}</p>
        </div>
        {task.totalAssignees >= 2 ? <ProgressCircle value={task.progress} /> : null}
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-slate-600">{td(task.description, task.translations, 'description')}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-2 rounded-2xl bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700">
          <UsersRound size={14} /> {task.source === 'Admin' ? t('Trưởng phòng') : `${task.totalAssignees} ${t('người làm')}`}
        </span>
        {currentAssignee && (
          <span className={`rounded-2xl px-2.5 py-1 text-xs font-semibold ${statusClass[currentAssignee.status]}`}>
            {statusText[currentAssignee.status]}
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button className="btn-secondary" onClick={onOpen}>
          <Eye size={16} /> Chi tiết
        </button>
        {currentAssignee && currentAssignee.status !== 'Done' && (
          <>
            <button className="btn-secondary" disabled={updating} onClick={() => onStatus(task._id, 'Doing')}>
              <LoaderCircle size={16} /> Đang làm
            </button>
            <button className="btn-primary" disabled={updating} onClick={() => onStatus(task._id, 'Done')}>
              <CheckCircle2 size={16} /> Làm xong
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function TaskDetailModal({ task, currentEmployeeId, updatingTaskId, onClose, onStatus }) {
  const { t, td } = useLanguage();
  if (!task) return null;
  const currentAssignee = task.assignees.find((assignee) => assignee.employeeId?._id === currentEmployeeId);
  const updating = updatingTaskId === task._id;

  return (
    <ModalPortal>
      <div className="modal-backdrop fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 sm:items-center">
      <div className="modal-fly modal-card w-full max-w-3xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold text-ink">{td(task.title, task.translations, 'title')}</h2>
            <p className="text-sm text-slate-500">{date(task.workDate)} - {td(task.departmentId?.departmentName, task.departmentId?.translations, 'departmentName')}</p>
          </div>
          <button className="btn-secondary px-2" onClick={onClose} aria-label="Đóng">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="grid gap-4 md:grid-cols-[1fr_120px]">
            <div>
              <p className="mb-2 text-sm font-semibold text-slate-700">Chi tiết công việc</p>
              <p className="whitespace-pre-wrap rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">{td(task.description, task.translations, 'description')}</p>
            </div>
            {task.totalAssignees >= 2 && (
              <div className="flex items-center justify-center rounded-2xl border border-slate-200 p-3">
                <ProgressCircle value={task.progress} size={92} />
              </div>
            )}
          </div>

          <div className="mt-5">
            <p className="mb-2 text-sm font-semibold text-slate-700">{task.source === 'Admin' ? 'Trưởng phòng nhận việc' : 'Nhân viên thực hiện'}</p>
            <div className="divide-y divide-slate-100 rounded-2xl border border-slate-200">
              {task.assignees.map((assignee) => (
                <div key={assignee.employeeId?._id} className="flex items-center justify-between gap-4 px-3 py-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-ink">{assignee.employeeId?.fullName}</p>
                    <p className="truncate text-xs text-slate-500">{assignee.employeeId?.employeeCode} - {assignee.employeeId?.position}</p>
                  </div>
                  <span className={`shrink-0 rounded-2xl px-2.5 py-1 text-xs font-semibold ${statusClass[assignee.status]}`}>
                    {statusText[assignee.status]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-5 py-4">
          <span className="text-sm text-slate-500">{task.doneCount}/{task.totalAssignees} {t('người đã làm xong')}</span>
          {currentAssignee && currentAssignee.status !== 'Done' && (
            <div className="flex gap-2">
              <button className="btn-secondary" disabled={updating} onClick={() => onStatus(task._id, 'Doing')}>
                <LoaderCircle size={16} /> Đang làm
              </button>
              <button className="btn-primary" disabled={updating} onClick={() => onStatus(task._id, 'Done')}>
                <CheckCircle2 size={16} /> Làm xong
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
    </ModalPortal>
  );
}

function ProgressCircle({ value, size = 58 }) {
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative grid shrink-0 place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#0f766e"
          strokeLinecap="round"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute text-sm font-bold text-ink">{value}%</span>
    </div>
  );
}
