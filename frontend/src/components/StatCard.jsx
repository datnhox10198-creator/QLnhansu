export default function StatCard({ label, value, icon: Icon, tone = 'teal' }) {
  const tones = {
    teal: 'bg-teal-50 text-teal-700',
    rose: 'bg-rose-50 text-rose-700',
    amber: 'bg-amber-50 text-amber-700',
    blue: 'bg-sky-50 text-sky-700',
    slate: 'bg-slate-100 text-slate-700'
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-ink">{value ?? 0}</p>
        </div>
        <div className={`rounded-md p-3 ${tones[tone]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
