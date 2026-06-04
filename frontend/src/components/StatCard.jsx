export default function StatCard({ label, value, icon: Icon, tone = 'teal' }) {
  const tones = {
    teal: 'bg-teal-50 text-teal-700 ring-teal-100',
    rose: 'bg-rose-50 text-rose-700 ring-rose-100',
    amber: 'bg-amber-50 text-amber-700 ring-amber-100',
    blue: 'bg-sky-50 text-sky-700 ring-sky-100',
    slate: 'bg-slate-100 text-slate-700 ring-slate-200'
  };

  return (
    <div className="rounded-3xl border border-white/70 bg-white/85 p-5 shadow-xl shadow-slate-900/5 backdrop-blur transition hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-teal-900/10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-ink">{value ?? 0}</p>
        </div>
        <div className={`rounded-2xl p-3 ring-1 ${tones[tone]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
