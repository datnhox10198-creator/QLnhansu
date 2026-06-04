import { CheckCircle2, Plus, Trash2, X, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../api/client';
import ConfirmModal from '../components/ConfirmModal';
import DataTable from '../components/DataTable';
import ModalPortal from '../components/ModalPortal';
import { useAuth } from '../context/AuthContext';
import { date } from '../utils/format';

const emptyForm = { employeeId: '', leaveDate: '', reason: '' };

const statusText = {
  Approved: 'Đã duyệt',
  Rejected: 'Từ chối',
  Pending: 'Chờ duyệt'
};

export default function Leaves() {
  const { user, employee } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [formOpen, setFormOpen] = useState(false);
  const [removeId, setRemoveId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);
  const isAdmin = user.role === 'admin';

  const load = () => api.get('/leaves').then(({ data }) => setLeaves(data));
  useEffect(() => {
    load();
    if (isAdmin) api.get('/employees', { params: { limit: 100 } }).then(({ data }) => setEmployees(data.items));
  }, []);

  const openForm = () => {
    setForm(emptyForm);
    setMessage({ type: '', text: '' });
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setForm(emptyForm);
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      await api.post('/leaves', form);
      closeForm();
      setMessage({ type: 'success', text: 'Đã gửi đơn nghỉ phép.' });
      load();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Không gửi được đơn nghỉ phép.' });
    } finally {
      setSaving(false);
    }
  };

  const setStatus = async (id, status) => {
    try {
      await api.put(`/leaves/${id}`, { status });
      setMessage({ type: 'success', text: status === 'Approved' ? 'Đã duyệt đơn nghỉ phép.' : 'Đã từ chối đơn nghỉ phép.' });
      load();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Không cập nhật được trạng thái.' });
    }
  };

  const remove = async () => {
    try {
      await api.delete(`/leaves/${removeId}`);
      setRemoveId(null);
      setMessage({ type: 'success', text: 'Đã xoá đơn nghỉ phép.' });
      load();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Không xoá được đơn nghỉ phép.' });
    }
  };

  const badge = (status) => {
    const cls = status === 'Approved' ? 'bg-teal-50 text-teal-700' : status === 'Rejected' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700';
    return <span className={`rounded-2xl px-2 py-1 text-xs font-semibold ${cls}`}>{statusText[status] || status}</span>;
  };

  const columns = [
    { key: 'employee', label: 'Nhân viên', render: (row) => row.employeeId?.fullName },
    { key: 'department', label: 'Phòng ban', render: (row) => row.employeeId?.departmentId?.departmentName },
    { key: 'leaveDate', label: 'Ngày nghỉ', render: (row) => date(row.leaveDate) },
    { key: 'reason', label: 'Lý do' },
    { key: 'status', label: 'Trạng thái', render: (row) => badge(row.status) },
    { key: 'actions', label: '', render: (row) => (
      <div className="flex gap-2">
        {row.canApprove && row.status === 'Pending' && <>
          <button className="btn-secondary text-teal-700" onClick={() => setStatus(row._id, 'Approved')} aria-label="Duyệt đơn"><CheckCircle2 size={15} /></button>
          <button className="btn-secondary text-rose-700" onClick={() => setStatus(row._id, 'Rejected')} aria-label="Từ chối đơn"><XCircle size={15} /></button>
        </>}
        {(isAdmin || (row.employeeId?._id === employee?._id && row.status === 'Pending')) && (
          <button className="btn-danger" onClick={() => setRemoveId(row._id)} aria-label="Xoá đơn"><Trash2 size={15} /></button>
        )}
      </div>
    ) }
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Nghỉ phép</h1>
          <p className="text-sm text-slate-500">
            {isAdmin
              ? 'Admin tạo đơn và quản trị dữ liệu nghỉ phép.'
              : 'Theo dõi đơn nghỉ phép của bạn và xử lý đơn trong phòng nếu bạn là trưởng phòng.'}
          </p>
        </div>
        <button className="btn-primary" onClick={openForm}>
          <Plus size={16} /> Gửi đơn nghỉ phép
        </button>
      </div>

      {message.text && (
        <div className={`rounded-2xl px-3 py-2 text-sm ${message.type === 'success' ? 'bg-teal-50 text-teal-700' : 'bg-rose-50 text-rose-700'}`}>
          {message.text}
        </div>
      )}

      <DataTable columns={columns} rows={leaves} />

      <LeaveFormModal
        open={formOpen}
        isAdmin={isAdmin}
        employees={employees}
        form={form}
        saving={saving}
        onChange={setForm}
        onClose={closeForm}
        onSubmit={submit}
      />
      <ConfirmModal open={!!removeId} title="Xoá đơn nghỉ phép" message="Bạn chắc chắn muốn xoá đơn này?" onCancel={() => setRemoveId(null)} onConfirm={remove} />
    </div>
  );
}

function LeaveFormModal({ open, isAdmin, employees, form, saving, onChange, onClose, onSubmit }) {
  if (!open) return null;

  return (
    <ModalPortal>
      <div className="modal-backdrop fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/45 p-4 backdrop-blur-sm sm:items-center">
      <div className="modal-fly modal-card w-full max-w-3xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div className="min-w-0">
            <h2 className="text-xl font-bold text-ink">Gửi đơn nghỉ phép</h2>
            <p className="text-sm text-slate-500">
              {isAdmin
                ? 'Admin có thể tạo đơn nghỉ phép cho nhân viên.'
                : 'Nhập ngày nghỉ và lý do để gửi đơn xét duyệt.'}
            </p>
          </div>
          <button className="btn-secondary shrink-0 px-2" type="button" onClick={onClose} aria-label="Đóng">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="modal-body">
            <div className="grid gap-3 md:grid-cols-2">
            {isAdmin && (
              <select className="field min-w-0" value={form.employeeId} onChange={(event) => onChange({ ...form, employeeId: event.target.value })} required>
                <option value="">Chọn nhân viên</option>
                {employees.map((employee) => <option key={employee._id} value={employee._id}>{employee.fullName}</option>)}
              </select>
            )}
            <input className="field min-w-0" type="date" value={form.leaveDate} onChange={(event) => onChange({ ...form, leaveDate: event.target.value })} required />
            <input className="field min-w-0 md:col-span-2" placeholder="Lý do nghỉ phép" value={form.reason} onChange={(event) => onChange({ ...form, reason: event.target.value })} required />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Huỷ</button>
            <button className="btn-primary min-w-32" disabled={saving}>
              <Plus size={16} /> {saving ? 'Đang gửi...' : 'Gửi đơn'}
            </button>
          </div>
        </form>
      </div>
    </div>
    </ModalPortal>
  );
}
