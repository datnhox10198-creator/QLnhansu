import { LockKeyhole } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: 'admin@hrms.local', password: 'Admin@123' });
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await login(form.email, form.password);
    } catch (err) {
      setError(err.response?.data?.message || 'Không kết nối được API. Kiểm tra backend và cấu hình VITE_API_URL.');
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-slate-100 px-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-md bg-teal-50 p-3 text-brand"><LockKeyhole size={24} /></div>
          <div>
            <h1 className="text-2xl font-bold text-ink">Đăng nhập HRMS</h1>
            <p className="text-sm text-slate-500">Quản lý nhân sự và nghỉ phép</p>
          </div>
        </div>
        {error && <div className="mb-4 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}
        <label className="mb-4 block text-sm font-medium">Email
          <input className="field mt-1" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </label>
        <label className="mb-5 block text-sm font-medium">Mật khẩu
          <input type="password" className="field mt-1" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </label>
        <button className="btn-primary w-full">Đăng nhập</button>
      </form>
    </div>
  );
}
