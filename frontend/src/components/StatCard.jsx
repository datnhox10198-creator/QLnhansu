const toneMap = {
  teal: {
    icon: 'bg-emerald-50 text-emerald-700',
    bar: 'bg-emerald-500',
    glow: 'from-emerald-500/10'
  },
  rose: {
    icon: 'bg-rose-50 text-rose-700',
    bar: 'bg-rose-500',
    glow: 'from-rose-500/10'
  },
  amber: {
    icon: 'bg-amber-50 text-amber-700',
    bar: 'bg-amber-500',
    glow: 'from-amber-500/10'
  },
  blue: {
    icon: 'bg-sky-50 text-sky-700',
    bar: 'bg-sky-500',
    glow: 'from-sky-500/10'
  },
  slate: {
    icon: 'bg-violet-50 text-violet-700',
    bar: 'bg-violet-500',
    glow: 'from-violet-500/10'
  }
};

export default function StatCard({ label, value, icon: Icon, tone = 'teal', note = 'Dữ liệu hiện tại' }) {
  const style = toneMap[tone] || toneMap.teal;

  return (
    <div className="stat-card group">
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${style.glow} via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">{label}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{value ?? 0}</p>
          <p className="mt-2 text-xs text-slate-400">{note}</p>
        </div>
        <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${style.icon}`}>
          <Icon size={21} strokeWidth={2} />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-slate-100">
        <div className={`h-full w-1/3 transition-all duration-500 group-hover:w-2/3 ${style.bar}`} />
      </div>
    </div>
  );
}
