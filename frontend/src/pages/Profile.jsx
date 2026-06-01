import { Save } from 'lucide-react';
import { useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { isoDate, money } from '../utils/format';

export default function Profile() {
  const { employee, refreshMe } = useAuth();
  const [form, setForm] = useState({ phone: employee?.phone || '', address: employee?.address || '', birthDate: isoDate(employee?.birthDate) });
  const [saved, setSaved] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    await api.put('/employees/me/profile', form);
    await refreshMe();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
      <form onSubmit={submit} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="mb-4 text-xl font-bold text-ink">Thông tin cá nhân</h1>
        {saved && <div className="mb-4 rounded-md bg-teal-50 px-3 py-2 text-sm text-teal-700">Đã cập nhật hồ sơ</div>}
        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm font-medium">Họ tên<input className="field mt-1 bg-slate-50" value={employee?.fullName || ''} disabled /></label>
          <label className="text-sm font-medium">Email<input className="field mt-1 bg-slate-50" value={employee?.email || ''} disabled /></label>
          <label className="text-sm font-medium">Số điện thoại<input className="field mt-1" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></label>
          <label className="text-sm font-medium">Ngày sinh<input type="date" className="field mt-1" value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.target.value })} /></label>
          <label className="text-sm font-medium md:col-span-2">Địa chỉ<input className="field mt-1" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></label>
        </div>
        <button className="btn-primary mt-4"><Save size={16} /> Cập nhật</button>
      </form>
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 font-bold">Công việc</h2>
        <div className="space-y-3 text-sm">
          <p><span className="text-slate-500">Mã NV:</span> {employee?.employeeCode}</p>
          <p><span className="text-slate-500">Phòng ban:</span> {employee?.departmentId?.departmentName}</p>
          <p><span className="text-slate-500">Chức vụ:</span> {employee?.position}</p>
          <p><span className="text-slate-500">Lương:</span> {money(employee?.salary)}</p>
          <p><span className="text-slate-500">Trạng thái:</span> {employee?.status}</p>
        </div>
      </div>
    </div>
  );
}
