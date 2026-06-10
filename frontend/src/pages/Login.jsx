import { ArrowRight, Eye, EyeOff, Flame, LockKeyhole, Menu, ShieldCheck, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const navItems = ['Tổng quan', 'Nhân sự', 'Công việc', 'Chấm công'];

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: 'admin@hrms.local', password: 'Admin@123' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
    } catch (err) {
      setError(err.response?.data?.message || 'Không kết nối được API. Kiểm tra backend và cấu hình VITE_API_URL.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="editorial-login">
      <div className="editorial-backdrop" />
      <div className="editorial-wash" />

      <header className="editorial-nav">
        <div className="editorial-brand">
          <span className="editorial-logo"><ShieldCheck size={24} strokeWidth={2.2} /></span>
          <span>
            <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Quản lý nhân sự</span>
            <span className="block text-2xl font-black tracking-[-0.04em] text-slate-900">HRMS</span>
          </span>
        </div>

        <nav className="editorial-links">
          {navItems.map((item, index) => (
            <span key={item} className={index === 0 ? 'active' : ''}>
              <small>{String(index + 1).padStart(2, '0')}</small>
              {item}
            </span>
          ))}
        </nav>

        <button className="editorial-menu" type="button" aria-label="Mở menu">
          <Menu size={20} />
        </button>
      </header>

      <section className="editorial-copy">
        <div className="editorial-eyebrow"><Sparkles size={15} /> People operations, reimagined</div>
        <h1>
          HUMAN<br />
          <span>WORKPLACE</span><br />
          REIMAGINED
        </h1>
        <p>
          Một không gian quản trị nhân sự hiện đại cho đội ngũ,
          công việc, chấm công, lương thưởng và nghỉ phép.
        </p>
        <div className="editorial-points">
          <span>✓ Quản trị tập trung</span>
          <span>✓ Trải nghiệm trực quan</span>
          <span>✓ Dữ liệu theo thời gian thực</span>
        </div>
      </section>

      <form onSubmit={submit} className="editorial-form">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-orange-600">
          <Flame size={15} /> Chào mừng trở lại
        </div>
        <h2>Đăng nhập<br />không gian làm việc.</h2>
        <p className="editorial-form-intro">Sử dụng tài khoản được cấp để tiếp tục.</p>

        {error && <div className="mt-5 rounded-xl border border-rose-200 bg-rose-50/90 px-4 py-3 text-sm text-rose-700">{error}</div>}

        <label className="editorial-field">
          <span>Email công việc</span>
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            autoComplete="email"
          />
        </label>

        <label className="editorial-field">
          <span>Mật khẩu</span>
          <span className="relative block">
            <input
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 grid w-12 place-items-center text-slate-400 hover:text-slate-800"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </span>
        </label>

        <button className="editorial-submit" disabled={loading}>
          {loading
            ? <><LockKeyhole className="animate-pulse" size={18} /> Đang kết nối...</>
            : <>Tiếp tục <ArrowRight size={18} /></>}
        </button>

        <div className="editorial-security">
          <ShieldCheck size={17} />
          <span>Phiên đăng nhập được bảo vệ bằng xác thực JWT.</span>
        </div>
      </form>

      <div className="editorial-footnote">Human Resources Management System · 2026</div>
      <div className="editorial-index"><span>01</span> / 04</div>
    </main>
  );
}
