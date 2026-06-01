import { Edit2, Plus, Trash2 } from 'lucide-react';
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
  const [removeId, setRemoveId] = useState(null);

  const load = () => api.get('/employees', { params: { ...query, limit: 6 } }).then(({ data }) => setData(data));
  useEffect(() => { api.get('/departments').then(({ data }) => setDepartments(data)); }, []);
  useEffect(() => { load(); }, [query]);

  const submit = async (event) => {
    event.preventDefault();
    const payload = { ...form, salary: Number(form.salary) };
    if (editing) await api.put(`/employees/${editing}`, payload);
    else await api.post('/employees', payload);
    setForm(empty);
    setEditing(null);
    load();
  };

  const remove = async () => {
    await api.delete(`/employees/${removeId}`);
    setRemoveId(null);
    load();
  };

  const columns = [
    { key: 'employeeCode', label: 'Mã NV' },
    { key: 'fullName', label: 'Họ tên' },
    { key: 'department', label: 'Phòng ban', render: (r) => r.departmentId?.departmentName },
    { key: 'position', label: 'Chức vụ' },
    { key: 'salary', label: 'Lương', render: (r) => money(r.salary) },
    { key: 'actions', label: '', render: (r) => (
      <div className="flex gap-2">
        <button
          className="btn-secondary"
          onClick={() => {
            setEditing(r._id);
            setForm({
              ...r,
              birthDate: isoDate(r.birthDate),
              departmentId: r.departmentId?._id,
              position: positions.includes(r.position) ? r.position : 'Nhân sự'
            });
          }}
        >
          <Edit2 size={15} />
        </button>
        <button className="btn-danger" onClick={() => setRemoveId(r._id)}><Trash2 size={15} /></button>
      </div>
    ) }
  ];

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="mb-4 text-xl font-bold text-ink">{editing ? 'Sửa nhân viên' : 'Thêm nhân viên'}</h1>
        <form onSubmit={submit} className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <input className="field" placeholder="Mã nhân viên" value={form.employeeCode} onChange={(e) => setForm({ ...form, employeeCode: e.target.value })} required />
          <input className="field" placeholder="Họ tên" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
          <select className="field" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}><option value="Male">Nam</option><option value="Female">Nữ</option><option value="Other">Khác</option></select>
          <input className="field" type="date" value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.target.value })} required />
          <input className="field" placeholder="Số điện thoại" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input className="field" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="field" placeholder="Địa chỉ" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <select className="field" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} required>
            {positions.map((position) => <option key={position} value={position}>{position}</option>)}
          </select>
          <input className="field" type="number" placeholder="Lương" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} required />
          <select className="field" value={form.departmentId} onChange={(e) => setForm({ ...form, departmentId: e.target.value })} required>
            <option value="">Chọn phòng ban</option>
            {departments.map((d) => <option key={d._id} value={d._id}>{d.departmentName}</option>)}
          </select>
          <select className="field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}><option>Active</option><option>Inactive</option></select>
          <button className="btn-primary"><Plus size={16} /> Lưu</button>
        </form>
      </div>
      <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:flex-row">
        <input className="field" placeholder="Tìm theo tên nhân viên" value={query.search} onChange={(e) => setQuery({ ...query, search: e.target.value, page: 1 })} />
        <select className="field md:max-w-xs" value={query.departmentId} onChange={(e) => setQuery({ ...query, departmentId: e.target.value, page: 1 })}>
          <option value="">Tất cả phòng ban</option>
          {departments.map((d) => <option key={d._id} value={d._id}>{d.departmentName}</option>)}
        </select>
      </div>
      <DataTable columns={columns} rows={data.items} page={data.page} pages={data.pages} onPage={(page) => setQuery({ ...query, page })} />
      <ConfirmModal open={!!removeId} title="Xóa nhân viên" message="Bạn chắc chắn muốn xóa nhân viên này?" onCancel={() => setRemoveId(null)} onConfirm={remove} />
    </div>
  );
}
