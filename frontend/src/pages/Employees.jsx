import { Edit2, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../api/client';
import ConfirmModal from '../components/ConfirmModal';
import DataTable from '../components/DataTable';
import { isoDate, money } from '../utils/format';

const positions = ['Nhân sự', 'Trưởng phòng'];
const empty = { employeeCode: '', fullName: '', gender: 'Male', birthDate: '', phone: '', email: '', address: '', position: 'Nhân sự', salary: '', departmentId: '', status: 'Active' };

export default function Employees() {
  const [departments, setDepartments] = useState([]);
  const [data, setData] = useState({ items: [], page: 1, pages: 1 });
  const [query, setQuery] = useState({ search: '', departmentId: '', page: 1 });
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [removeId, setRemoveId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);

  const load = () => api.get('/employees', { params: { ...query, limit: 6 } }).then(({ data }) => setData(data));
  useEffect(() => { api.get('/departments').then(({ data }) => setDepartments(data)); }, []);
  useEffect(() => { load(); }, [query]);

  const openCreate = () => {
    setEditing(null);
    setForm(empty);
    setMessage({ type: '', text: '' });
    setFormOpen(true);
  };

  const openEdit = (employee) => {
    setEditing(employee._id);
    setForm({
      ...employee,
      birthDate: isoDate(employee.birthDate),
      departmentId: employee.departmentId?._id,
      position: positions.includes(employee.position) ? employee.position : 'Nhân sự'
    });
    setMessage({ type: '', text: '' });
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
    setForm(empty);
  };

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const payload = { ...form, salary: Number(form.salary) };
      if (editing) await api.put(`/employees/${editing}`, payload);
      else await api.post('/employees', payload);
      setMessage({ type: 'success', text: editing ? 'Đã cập nhật nhân viên.' : 'Đã thêm nhân viên.' });
      closeForm();
      load();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Không lưu được nhân viên.' });
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    try {
      await api.delete(`/employees/${removeId}`);
      setRemoveId(null);
      setMessage({ type: 'success', text: 'Đã xoá nhân viên.' });
      load();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Không xoá được nhân viên.' });
    }
  };

  const columns = [
    { key: 'employeeCode', label: 'Mã NV' },
    { key: 'fullName', label: 'Họ tên' },
    { key: 'department', label: 'Phòng ban', render: (row) => row.departmentId?.departmentName },
    { key: 'position', label: 'Chức vụ' },
    { key: 'salary', label: 'Lương', render: (row) => money(row.salary) },
    { key: 'actions', label: '', render: (row) => (
      <div className="flex gap-2">
        <button className="btn-secondary" onClick={() => openEdit(row)} aria-label="Sửa nhân viên">
          <Edit2 size={15} />
        </button>
        <button className="btn-danger" onClick={() => setRemoveId(row._id)} aria-label="Xoá nhân viên">
          <Trash2 size={15} />
        </button>
      </div>
    ) }
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Nhân viên</h1>
          <p className="text-sm text-slate-500">Quản lý hồ sơ, phòng ban, chức vụ và lương nhân viên.</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>
          <Plus size={16} /> Thêm nhân viên
        </button>
      </div>

      {message.text && (
        <div className={`rounded-2xl px-3 py-2 text-sm ${message.type === 'success' ? 'bg-teal-50 text-teal-700' : 'bg-rose-50 text-rose-700'}`}>
          {message.text}
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-3xl border border-white/70 bg-white/90 p-4 shadow-xl shadow-slate-900/5 backdrop-blur md:flex-row">
        <input className="field" placeholder="Tìm theo tên nhân viên" value={query.search} onChange={(event) => setQuery({ ...query, search: event.target.value, page: 1 })} />
        <select className="field md:max-w-xs" value={query.departmentId} onChange={(event) => setQuery({ ...query, departmentId: event.target.value, page: 1 })}>
          <option value="">Tất cả phòng ban</option>
          {departments.map((department) => <option key={department._id} value={department._id}>{department.departmentName}</option>)}
        </select>
      </div>

      <DataTable columns={columns} rows={data.items} page={data.page} pages={data.pages} onPage={(page) => setQuery({ ...query, page })} />

      <EmployeeFormModal
        open={formOpen}
        editing={!!editing}
        form={form}
        departments={departments}
        saving={saving}
        onClose={closeForm}
        onSubmit={submit}
        onChange={setForm}
      />
      <ConfirmModal open={!!removeId} title="Xoá nhân viên" message="Bạn chắc chắn muốn xoá nhân viên này?" onCancel={() => setRemoveId(null)} onConfirm={remove} />
    </div>
  );
}

function EmployeeFormModal({ open, editing, form, departments, saving, onClose, onSubmit, onChange }) {
  if (!open) return null;

  return (
    <div className="modal-backdrop fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/45 p-4 backdrop-blur-sm sm:items-center">
      <div className="modal-fly modal-card w-full max-w-5xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-xl font-bold text-ink">{editing ? 'Sửa nhân viên' : 'Thêm nhân viên'}</h2>
            <p className="text-sm text-slate-500">Nhập đầy đủ thông tin hồ sơ nhân viên.</p>
          </div>
          <button className="btn-secondary px-2" type="button" onClick={onClose} aria-label="Đóng">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="modal-body">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <input className="field" placeholder="Mã nhân viên" value={form.employeeCode} onChange={(event) => onChange({ ...form, employeeCode: event.target.value })} required />
            <input className="field" placeholder="Họ tên" value={form.fullName} onChange={(event) => onChange({ ...form, fullName: event.target.value })} required />
            <select className="field" value={form.gender} onChange={(event) => onChange({ ...form, gender: event.target.value })}>
              <option value="Male">Nam</option>
              <option value="Female">Nữ</option>
              <option value="Other">Khác</option>
            </select>
            <input className="field" type="date" value={form.birthDate} onChange={(event) => onChange({ ...form, birthDate: event.target.value })} required />
            <input className="field" placeholder="Số điện thoại" value={form.phone} onChange={(event) => onChange({ ...form, phone: event.target.value })} />
            <input className="field" type="email" placeholder="Email" value={form.email} onChange={(event) => onChange({ ...form, email: event.target.value })} required />
            <input className="field" placeholder="Địa chỉ" value={form.address} onChange={(event) => onChange({ ...form, address: event.target.value })} />
            <select className="field" value={form.position} onChange={(event) => onChange({ ...form, position: event.target.value })} required>
              {positions.map((position) => <option key={position} value={position}>{position}</option>)}
            </select>
            <input className="field" type="number" min="0" placeholder="Lương" value={form.salary} onChange={(event) => onChange({ ...form, salary: event.target.value })} required />
            <select className="field" value={form.departmentId} onChange={(event) => onChange({ ...form, departmentId: event.target.value })} required>
              <option value="">Chọn phòng ban</option>
              {departments.map((department) => <option key={department._id} value={department._id}>{department.departmentName}</option>)}
            </select>
            <select className="field" value={form.status} onChange={(event) => onChange({ ...form, status: event.target.value })}>
              <option>Active</option>
              <option>Inactive</option>
            </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Huỷ</button>
            <button className="btn-primary min-w-32" disabled={saving}>
              <Plus size={16} /> {saving ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
