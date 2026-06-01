import { CheckCircle2, Plus, Trash2, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../api/client';
import ConfirmModal from '../components/ConfirmModal';
import DataTable from '../components/DataTable';
import { useAuth } from '../context/AuthContext';
import { date } from '../utils/format';

export default function Leaves() {
  const { user, employee } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ employeeId: '', leaveDate: '', reason: '' });
  const [removeId, setRemoveId] = useState(null);
  const isAdmin = user.role === 'admin';

  const load = () => api.get('/leaves').then(({ data }) => setLeaves(data));
  useEffect(() => {
    load();
    if (isAdmin) api.get('/employees', { params: { limit: 100 } }).then(({ data }) => setEmployees(data.items));
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    await api.post('/leaves', form);
    setForm({ employeeId: '', leaveDate: '', reason: '' });
    load();
  };

  const setStatus = async (id, status) => {
    await api.put(`/leaves/${id}`, { status });
    load();
  };

  const remove = async () => {
    await api.delete(`/leaves/${removeId}`);
    setRemoveId(null);
    load();
  };

  const badge = (status) => {
    const cls = status === 'Approved' ? 'bg-teal-50 text-teal-700' : status === 'Rejected' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700';
    return <span className={`rounded-md px-2 py-1 text-xs font-semibold ${cls}`}>{status}</span>;
  };

  const columns = [
    { key: 'employee', label: 'Nhân viên', render: (r) => r.employeeId?.fullName },
    { key: 'department', label: 'Phòng ban', render: (r) => r.employeeId?.departmentId?.departmentName },
    { key: 'leaveDate', label: 'Ngày nghỉ', render: (r) => date(r.leaveDate) },
    { key: 'reason', label: 'Lý do' },
    { key: 'status', label: 'Trạng thái', render: (r) => badge(r.status) },
    { key: 'actions', label: '', render: (r) => (
      <div className="flex gap-2">
        {r.canApprove && r.status === 'Pending' && <>
          <button className="btn-secondary text-teal-700" onClick={() => setStatus(r._id, 'Approved')}><CheckCircle2 size={15} /></button>
          <button className="btn-secondary text-rose-700" onClick={() => setStatus(r._id, 'Rejected')}><XCircle size={15} /></button>
        </>}
        {(isAdmin || (r.employeeId?._id === employee?._id && r.status === 'Pending')) && (
          <button className="btn-danger" onClick={() => setRemoveId(r._id)}><Trash2 size={15} /></button>
        )}
      </div>
    ) }
  ];

  return (
    <div className="space-y-5">
      <form onSubmit={submit} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="mb-1 text-xl font-bold text-ink">Gửi đơn nghỉ phép</h1>
        {!isAdmin && <p className="mb-4 text-sm text-slate-500">Nếu bạn là trưởng phòng, danh sách bên dưới gồm đơn nghỉ của nhân viên trong phòng ban để duyệt.</p>}
        {isAdmin && <p className="mb-4 text-sm text-slate-500">Admin có thể tạo đơn và quản trị dữ liệu; trưởng phòng là người duyệt nghiệp vụ cho phòng ban.</p>}
        <div className="grid gap-3 md:grid-cols-4">
          {isAdmin && (
            <select className="field" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })}>
              <option value="">Chọn nhân viên</option>
              {employees.map((e) => <option key={e._id} value={e._id}>{e.fullName}</option>)}
            </select>
          )}
          <input className="field" type="date" value={form.leaveDate} onChange={(e) => setForm({ ...form, leaveDate: e.target.value })} required />
          <input className="field md:col-span-2" placeholder="Lý do nghỉ phép" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} required />
          <button className="btn-primary"><Plus size={16} /> Gửi đơn</button>
        </div>
      </form>
      <DataTable columns={columns} rows={leaves} />
      <ConfirmModal open={!!removeId} title="Xóa đơn nghỉ phép" message="Bạn chắc chắn muốn xóa đơn này?" onCancel={() => setRemoveId(null)} onConfirm={remove} />
    </div>
  );
}
