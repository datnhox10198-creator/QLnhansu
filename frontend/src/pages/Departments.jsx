import { Edit2, Plus, Trash2, UserRoundCog } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../api/client';
import ConfirmModal from '../components/ConfirmModal';

const empty = { departmentName: '', description: '', managerId: '' };

export default function Departments() {
  const [items, setItems] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [removeId, setRemoveId] = useState(null);

  const load = () => api.get('/departments').then(({ data }) => setItems(data));
  useEffect(() => {
    load();
    api.get('/employees', { params: { limit: 100 } }).then(({ data }) => setEmployees(data.items));
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    if (editing) await api.put(`/departments/${editing}`, form);
    else await api.post('/departments', form);
    setForm(empty);
    setEditing(null);
    load();
  };

  const remove = async () => {
    await api.delete(`/departments/${removeId}`);
    setRemoveId(null);
    load();
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
      <form onSubmit={submit} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="mb-4 text-xl font-bold text-ink">{editing ? 'Sửa phòng ban' : 'Thêm phòng ban'}</h1>
        <label className="mb-3 block text-sm font-medium">Tên phòng ban
          <input className="field mt-1" value={form.departmentName} onChange={(e) => setForm({ ...form, departmentName: e.target.value })} required />
        </label>
        <label className="mb-4 block text-sm font-medium">Mô tả
          <textarea className="field mt-1" rows="4" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </label>
        <label className="mb-4 block text-sm font-medium">Trưởng phòng
          <select className="field mt-1" value={form.managerId} onChange={(e) => setForm({ ...form, managerId: e.target.value })}>
            <option value="">Chưa phân công</option>
            {employees.map((employee) => (
              <option key={employee._id} value={employee._id}>{employee.fullName} - {employee.position}</option>
            ))}
          </select>
        </label>
        <button className="btn-primary"><Plus size={16} /> Lưu</button>
      </form>
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4"><h2 className="font-bold">Danh sách phòng ban</h2></div>
        <div className="divide-y divide-slate-100">
          {items.map((item) => (
            <div key={item._id} className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <div>
                  <p className="font-semibold">{item.departmentName}</p>
                  <p className="text-sm text-slate-500">{item.description}</p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-md bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-700">
                  <UserRoundCog size={14} />
                  {item.managerId?.fullName || 'Chưa có trưởng phòng'}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="btn-secondary"
                  onClick={() => {
                    setEditing(item._id);
                    setForm({
                      departmentName: item.departmentName || '',
                      description: item.description || '',
                      managerId: item.managerId?._id || ''
                    });
                  }}
                >
                  <Edit2 size={15} />
                </button>
                <button className="btn-danger" onClick={() => setRemoveId(item._id)}><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ConfirmModal open={!!removeId} title="Xóa phòng ban" message="Bạn chắc chắn muốn xóa phòng ban này?" onCancel={() => setRemoveId(null)} onConfirm={remove} />
    </div>
  );
}
