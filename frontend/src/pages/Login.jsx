import { ArrowRight, BarChart3, CheckCircle2, Eye, EyeOff, Flame, LockKeyhole, ShieldCheck, Sparkles, UsersRound } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

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
    <div className="login-shell min-h-screen p-3 sm:p-5">
      <div className="mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-[1500px] overflow-hidden rounded-[28px] border border-white/10 bg-white shadow-2xl shadow-slate-950/20 sm:min-h-[calc(100vh-2.5rem)] lg:grid-cols-[1.08fr_0.92fr]">
        <section className="login-visual relative hidden overflow-hidden p-12 lg:flex lg:flex-col">
          <div className="login-grid absolute inset-0 opacity-30" />
          <div className="login-orb login-orb-one" />
          <div className="login-orb login-orb-two" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="brand-mark"><ShieldCheck size={22} /></div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Quản lý nhân sự</p>
              <p className="text-xl font-extrabold text-slate-800">HRMS</p>
            </div>
          </div>

          <div className="relative z-10 my-auto max-w-xl">
            <div className="login-badge">
              <Sparkles size={14} /> Thiết kế cho thế hệ làm việc mới
            </div>
            <h1 className="text-5xl font-extrabold leading-[1.03] tracking-[-0.055em] text-slate-800 xl:text-6xl">
              Mọi thứ về công việc.<br />
              <span className="login-highlight">Đơn giản và đẹp hơn.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-slate-600">
              Team, công việc, chấm công và lương thưởng trong một không gian trực quan, nhẹ nhàng và dễ dùng.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-3">
              <Feature icon={UsersRound} value="360°" label="Team view" color="lime" />
              <Feature icon={BarChart3} value="Live" label="Real insights" color="violet" />
              <Feature icon={CheckCircle2} value="1 tap" label="Quick actions" color="coral" />
            </div>
          </div>

          <p className="relative z-10 text-xs text-slate-500">Human Resources Management System</p>
        </section>

        <section className="flex items-center justify-center bg-[#f8faf9] px-5 py-10 sm:px-10 lg:px-16">
          <form onSubmit={submit} className="login-panel w-full max-w-md">
            <div className="mb-10 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="brand-mark"><ShieldCheck size={22} /></div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Quản lý nhân sự</p>
                  <p className="text-xl font-extrabold text-slate-900">HRMS</p>
                </div>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-600"><Flame size={15} /> Chào mừng trở lại</div>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.045em] text-slate-950 sm:text-4xl">Bắt đầu ngày mới.</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">Đăng nhập để tiếp tục không gian làm việc của bạn.</p>

            {error && <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

            <div className="mt-8 space-y-5">
              <label className="block text-sm font-semibold text-slate-700">
                Email công việc
                <input
                  type="email"
                  className="field mt-2"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  placeholder="name@company.com"
                  autoComplete="email"
                />
              </label>
              <label className="block text-sm font-semibold text-slate-700">
                Mật khẩu
                <span className="relative mt-2 block">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="field pr-12"
                    value={form.password}
                    onChange={(event) => setForm({ ...form, password: event.target.value })}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 grid w-12 place-items-center text-slate-400 hover:text-slate-700"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </span>
              </label>
            </div>

            <button className="btn-primary mt-7 w-full py-3.5" disabled={loading}>
              {loading ? <><LockKeyhole className="animate-pulse" size={17} /> Đang kết nối...</> : <>Tiếp tục <ArrowRight size={17} /></>}
            </button>

            <div className="mt-6 flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3.5">
              <ShieldCheck className="mt-0.5 shrink-0 text-emerald-600" size={17} />
              <p className="text-xs leading-5 text-slate-500">Phiên đăng nhập được bảo vệ bằng xác thực JWT. Không chia sẻ thông tin truy cập với người khác.</p>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

function Feature({ icon: Icon, value, label, color }) {
  return (
    <div className={`login-feature login-feature-${color}`}>
      <Icon className="mb-5" size={20} />
      <p className="text-lg font-bold text-slate-800">{value}</p>
      <p className="mt-1 text-xs text-slate-600">{label}</p>
    </div>
  );
}
