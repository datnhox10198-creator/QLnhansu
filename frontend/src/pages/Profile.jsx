import { BadgeCheck, BriefcaseBusiness, Save, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { date, isoDate, money } from '../utils/format';

const statusText = {
  Active: 'Đang làm việc',
  Inactive: 'Đã nghỉ'
};

const genderText = {
  Male: 'Nam',
  Female: 'Nữ',
  Other: 'Khác'
};

const profileForm = (employee) => ({
  phone: employee?.phone || '',
  address: employee?.address || '',
  birthDate: isoDate(employee?.birthDate)
});

export default function Profile() {
  const { employee, refreshMe } = useAuth();
  const [form, setForm] = useState(() => profileForm(employee));
  const [status, setStatus] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(profileForm(employee));
  }, [employee]);

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setStatus({ type: '', text: '' });

    try {
      await api.put('/employees/me/profile', form);
      await refreshMe();
      setStatus({ type: 'success', text: 'Đã cập nhật hồ sơ cá nhân.' });
    } catch (error) {
      setStatus({ type: 'error', text: error.response?.data?.message || 'Không cập nhật được hồ sơ.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-ink">Hồ sơ cá nhân</h1>
        <p className="text-sm text-slate-500">Xem thông tin nhân sự và cập nhật thông tin liên hệ của bạn.</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-3xl bg-teal-50 text-brand">
              <UserRound size={24} />
            </div>
            <div>
              <p className="text-lg font-bold text-ink">{employee?.fullName || 'Nhân viên'}</p>
              <p className="text-sm text-slate-500">{employee?.employeeCode || 'Chưa có mã nhân viên'}</p>
            </div>
          </div>

          {status.text && (
            <div className={`mb-4 rounded-2xl px-3 py-2 text-sm ${status.type === 'success' ? 'bg-teal-50 text-teal-700' : 'bg-rose-50 text-rose-700'}`}>
              {status.text}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              Họ tên
              <input className="field mt-1 bg-slate-50" value={employee?.fullName || ''} disabled />
            </label>

            <label className="text-sm font-medium text-slate-700">
              Email
              <input className="field mt-1 bg-slate-50" value={employee?.email || ''} disabled />
            </label>

            <label className="text-sm font-medium text-slate-700">
              Số điện thoại
              <input
                className="field mt-1"
                value={form.phone}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
                placeholder="Nhập số điện thoại"
              />
            </label>

            <label className="text-sm font-medium text-slate-700">
              Ngày sinh
              <input
                type="date"
                className="field mt-1"
                value={form.birthDate}
                onChange={(event) => setForm({ ...form, birthDate: event.target.value })}
              />
            </label>

            <label className="text-sm font-medium text-slate-700 md:col-span-2">
              Địa chỉ
              <textarea
                className="field mt-1 min-h-24 resize-y"
                value={form.address}
                onChange={(event) => setForm({ ...form, address: event.target.value })}
                placeholder="Nhập địa chỉ hiện tại"
              />
            </label>
          </div>

          <button className="btn-primary mt-5" disabled={saving}>
            <Save size={16} /> {saving ? 'Đang lưu...' : 'Cập nhật hồ sơ'}
          </button>
        </form>

        <aside className="space-y-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <BriefcaseBusiness className="text-brand" size={19} />
              <h2 className="font-bold text-ink">Thông tin công việc</h2>
            </div>
            <div className="space-y-3 text-sm">
              <Info label="Mã nhân viên" value={employee?.employeeCode} />
              <Info label="Phòng ban" value={employee?.departmentId?.departmentName} />
              <Info label="Chức vụ" value={employee?.position} />
              <Info label="Lương" value={money(employee?.salary)} />
              <Info label="Trạng thái" value={statusText[employee?.status] || employee?.status} />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <BadgeCheck className="text-brand" size={19} />
              <h2 className="font-bold text-ink">Thông tin cá nhân</h2>
            </div>
            <div className="space-y-3 text-sm">
              <Info label="Giới tính" value={genderText[employee?.gender] || employee?.gender} />
              <Info label="Ngày sinh" value={date(employee?.birthDate)} />
              <Info label="Số điện thoại" value={employee?.phone} />
              <Info label="Địa chỉ" value={employee?.address} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <p className="flex items-start justify-between gap-4">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-medium text-ink">{value || '-'}</span>
    </p>
  );
}
