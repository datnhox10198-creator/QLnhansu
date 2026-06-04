import { Edit2, Plus, Trash2, UserRoundCog, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../api/client';
import ConfirmModal from '../components/ConfirmModal';
import ModalPortal from '../components/ModalPortal';

const empty = { departmentName: '', description: '', managerId: '' };

export default function Departments() {
  const [items, setItems] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [removeId, setRemoveId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);

  const load = () => api.get('/departments').then(({ data }) => setItems(data));
  useEffect(() => {
    load();
    api.get('/employees', { params: { limit: 100 } }).then(({ data }) => setEmployees(data.items));
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(empty);
    setMessage({ type: '', text: '' });
    setFormOpen(true);
  };

  const openEdit = (department) => {
    setEditing(department._id);
    setForm({
      departmentName: department.departmentName || '',
      description: department.description || '',
      managerId: department.managerId?._id || ''
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
      if (editing) await api.put(`/departments/${editing}`, form);
      else await api.post('/departments', form);
      closeForm();
      setMessage({ type: 'success', text: editing ? 'Đã cập nhật phòng ban.' : 'Đã thêm phòng ban.' });
      load();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Không lưu được phòng ban.' });
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    try {
      await api.delete(`/departments/${removeId}`);
      setRemoveId(null);
      setMessage({ type: 'success', text: 'Đã xoá phòng ban.' });
      load();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Không xoá được phòng ban.' });
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Phòng ban</h1>
          <p className="text-sm text-slate-500">Quản lý phòng ban và phân công trưởng phòng.</p>
        </div>
        <button className="btn-primary" onClick={openCreate}>
          <Plus size={16} /> Thêm phòng ban
        </button>
      </div>

      {message.text && (
        <div className={`rounded-2xl px-3 py-2 text-sm ${message.type === 'success' ? 'bg-teal-50 text-teal-700' : 'bg-rose-50 text-rose-700'}`}>
          {message.text}
        </div>
      )}

      <div className="rounded-3xl border border-white/70 bg-white/90 shadow-xl shadow-slate-900/5 backdrop-blur">
        <div className="border-b border-slate-200 px-5 py-4"><h2 className="font-bold">Danh sách phòng ban</h2></div>
        <div className="divide-y divide-slate-100">
          {items.map((item) => (
            <div key={item._id} className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <div>
                  <p className="font-semibold">{item.departmentName}</p>
                  <p className="text-sm text-slate-500">{item.description || 'Chưa có mô tả'}</p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-2xl bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">
                  <UserRoundCog size={14} />
                  {item.managerId?.fullName || 'Chưa có trưởng phòng'}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn-secondary" onClick={() => openEdit(item)} aria-label="Sửa phòng ban">
                  <Edit2 size={15} />
                </button>
                <button className="btn-danger" onClick={() => setRemoveId(item._id)} aria-label="Xoá phòng ban">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
          {!items.length && <div className="px-5 py-10 text-center text-slate-500">Chưa có phòng ban</div>}
        </div>
      </div>

      <DepartmentFormModal
        open={formOpen}
        editing={!!editing}
        form={form}
        employees={employees}
        saving={saving}
        onChange={setForm}
        onClose={closeForm}
        onSubmit={submit}
      />
      <ConfirmModal open={!!removeId} title="Xoá phòng ban" message="Bạn chắc chắn muốn xoá phòng ban này?" onCancel={() => setRemoveId(null)} onConfirm={remove} />
    </div>
  );
}

function DepartmentFormModal({ open, editing, form, employees, saving, onChange, onClose, onSubmit }) {
  if (!open) return null;

  return (
    <ModalPortal>
      <div className="modal-backdrop fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/45 p-4 backdrop-blur-sm sm:items-center">
      <div className="modal-fly modal-card w-full max-w-xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-xl font-bold text-ink">{editing ? 'Sửa phòng ban' : 'Thêm phòng ban'}</h2>
            <p className="text-sm text-slate-500">Nhập thông tin phòng ban và trưởng phòng phụ trách.</p>
          </div>
          <button className="btn-secondary shrink-0 px-2" type="button" onClick={onClose} aria-label="Đóng">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="modal-body">
            <label className="mb-3 block text-sm font-medium text-slate-700">Tên phòng ban
              <input className="field mt-1" value={form.departmentName} onChange={(event) => onChange({ ...form, departmentName: event.target.value })} required />
            </label>
            <label className="mb-4 block text-sm font-medium text-slate-700">Mô tả
              <textarea className="field mt-1 min-h-28 resize-y" value={form.description} onChange={(event) => onChange({ ...form, description: event.target.value })} />
            </label>
            <label className="mb-4 block text-sm font-medium text-slate-700">Trưởng phòng
              <select className="field mt-1" value={form.managerId} onChange={(event) => onChange({ ...form, managerId: event.target.value })}>
                <option value="">Chưa phân công</option>
                {employees.map((employee) => (
                  <option key={employee._id} value={employee._id}>{employee.fullName} - {employee.position}</option>
                ))}
              </select>
            </label>
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
    </ModalPortal>
  );
}
