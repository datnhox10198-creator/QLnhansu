import { Banknote, Building2, FileText, UsersRound, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { money } from '../utils/format';

const currentPeriod = () => new Date().toISOString().slice(0, 7);

export default function Payroll() {
  const { user } = useAuth();
  return user?.role === 'admin' ? <AdminPayroll /> : <MyPayroll />;
}

function AdminPayroll() {
  const [period, setPeriod] = useState(currentPeriod());
  const [summary, setSummary] = useState({ items: [], totalSalary: 0, totalEmployees: 0 });
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    api.get('/payroll/departments', { params: { period } })
      .then(({ data }) => setSummary(data))
      .catch((error) => setError(error.response?.data?.message || 'Không tải được dữ liệu lương.'))
      .finally(() => setLoading(false));
  }, [period]);

  const selected = useMemo(
    () => summary.items.find((item) => item.departmentId === selectedDepartment?.departmentId) || selectedDepartment,
    [summary.items, selectedDepartment]
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Quỹ lương phòng ban</h1>
          <p className="text-sm text-slate-500">Admin kiểm tra tổng tiền lương và chi tiết nhân viên theo từng phòng ban.</p>
        </div>
        <label className="text-sm font-medium text-slate-700">
          Tháng lương
          <input className="field mt-1 md:w-52" type="month" value={period} onChange={(event) => setPeriod(event.target.value)} />
        </label>
      </div>

      {error && <div className="rounded-2xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <SummaryTile icon={Banknote} label="Tổng quỹ lương" value={money(summary.totalSalary)} />
        <SummaryTile icon={UsersRound} label="Tổng nhân sự" value={summary.totalEmployees || 0} />
        <SummaryTile icon={Building2} label="Số phòng ban" value={summary.items.length} />
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Phòng ban</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Nhân sự</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Trưởng phòng</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Tổng tiền trả</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="5" className="px-4 py-10 text-center text-slate-500">Đang tải dữ liệu lương...</td></tr>
              ) : summary.items.length ? (
                summary.items.map((department) => (
                  <tr key={department.departmentId} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-ink">{department.departmentName}</td>
                    <td className="whitespace-nowrap px-4 py-3">{department.employeeCount}</td>
                    <td className="whitespace-nowrap px-4 py-3">{department.managerCount}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-bold text-brand">{money(department.totalSalary)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <button className="btn-secondary" onClick={() => setSelectedDepartment(department)}>
                        <FileText size={16} /> Chi tiết
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="px-4 py-10 text-center text-slate-500">Không có dữ liệu lương</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DepartmentPayrollModal department={selected} period={period} onClose={() => setSelectedDepartment(null)} />
    </div>
  );
}

function MyPayroll() {
  const [period, setPeriod] = useState(currentPeriod());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    api.get('/payroll/me', { params: { period } })
      .then(({ data }) => setData(data))
      .catch((error) => setError(error.response?.data?.message || 'Không tải được phiếu lương.'))
      .finally(() => setLoading(false));
  }, [period]);

  const slip = data?.slip;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Phiếu lương cá nhân</h1>
          <p className="text-sm text-slate-500">Nhân viên và trưởng phòng xem số tiền lương được nhận trong tháng.</p>
        </div>
        <label className="text-sm font-medium text-slate-700">
          Tháng lương
          <input className="field mt-1 md:w-52" type="month" value={period} onChange={(event) => setPeriod(event.target.value)} />
        </label>
      </div>

      {error && <div className="rounded-2xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white px-5 py-10 text-center text-slate-500 shadow-sm">
          Đang tải phiếu lương...
        </div>
      ) : slip ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-col gap-3 border-b border-slate-100 pb-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-3xl bg-teal-50 text-brand">
                <FileText size={24} />
              </div>
              <div>
                <p className="text-lg font-bold text-ink">{slip.fullName}</p>
                <p className="text-sm text-slate-500">{slip.employeeCode} - {slip.position}</p>
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
              Tháng {data.period}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Info label="Phòng ban" value={slip.department?.departmentName} />
            <Info label="Lương cơ bản" value={money(slip.baseSalary)} />
            <Info label="Phụ cấp" value={money(slip.allowance)} />
            <Info label="Khấu trừ" value={money(slip.deduction)} />
          </div>

          <div className="mt-5 rounded-3xl bg-teal-50 p-4">
            <p className="text-sm font-medium text-teal-700">Thực nhận</p>
            <p className="mt-1 text-3xl font-bold text-brand">{money(slip.netSalary)}</p>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white px-5 py-10 text-center text-slate-500 shadow-sm">
          Chưa có phiếu lương
        </div>
      )}
    </div>
  );
}

function DepartmentPayrollModal({ department, period, onClose }) {
  if (!department) return null;

  return (
    <div className="modal-backdrop fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 sm:items-center">
      <div className="modal-card w-full max-w-4xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-ink">{department.departmentName}</h2>
            <p className="text-sm text-slate-500">Chi tiết phiếu lương tháng {period}</p>
          </div>
          <button className="btn-secondary px-2" onClick={onClose} aria-label="Đóng">
            <X size={18} />
          </button>
        </div>
        <div className="modal-body p-0">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="sticky top-0 bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Mã NV</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Họ tên</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Chức vụ</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Lương cơ bản</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Thực nhận</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {department.employees.map((employee) => (
                <tr key={employee.employeeId}>
                  <td className="whitespace-nowrap px-4 py-3">{employee.employeeCode}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-ink">{employee.fullName}</td>
                  <td className="whitespace-nowrap px-4 py-3">{employee.position}</td>
                  <td className="whitespace-nowrap px-4 py-3">{money(employee.baseSalary)}</td>
                  <td className="whitespace-nowrap px-4 py-3 font-bold text-brand">{money(employee.netSalary)}</td>
                </tr>
              ))}
              {!department.employees.length && (
                <tr><td colSpan="5" className="px-4 py-10 text-center text-slate-500">Phòng ban chưa có nhân viên đang làm việc</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">
          <span className="text-sm text-slate-500">{department.employeeCount} nhân sự</span>
          <span className="text-lg font-bold text-brand">{money(department.totalSalary)}</span>
        </div>
      </div>
    </div>
  );
}

function SummaryTile({ icon: Icon, label, value }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 grid h-10 w-10 place-items-center rounded-2xl bg-teal-50 text-brand">
        <Icon size={21} />
      </div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-bold text-ink">{value}</p>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-3">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-ink">{value || '-'}</p>
    </div>
  );
}
