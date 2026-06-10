const toneMap = {
  teal: {
    icon: 'bg-lime-300 text-slate-950',
    bar: 'bg-violet-600',
    glow: 'from-lime-300/40',
    skin: 'stat-lime'
  },
  rose: {
    icon: 'bg-rose-300 text-rose-950',
    bar: 'bg-rose-500',
    glow: 'from-rose-300/30',
    skin: 'stat-rose'
  },
  amber: {
    icon: 'bg-amber-300 text-amber-950',
    bar: 'bg-orange-500',
    glow: 'from-amber-300/30',
    skin: 'stat-amber'
  },
  blue: {
    icon: 'bg-cyan-300 text-cyan-950',
    bar: 'bg-cyan-500',
    glow: 'from-cyan-300/30',
    skin: 'stat-blue'
  },
  slate: {
    icon: 'bg-violet-300 text-violet-950',
    bar: 'bg-violet-600',
    glow: 'from-violet-300/30',
    skin: 'stat-violet'
  }
};

export default function StatCard({ label, value, icon: Icon, tone = 'teal', note = 'Dữ liệu hiện tại' }) {
  const style = toneMap[tone] || toneMap.teal;

  return (
    <div className={`stat-card group ${style.skin}`}>
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${style.glow} via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500">{label}</p>
          <p className="mt-3 text-4xl font-extrabold tracking-[-0.05em] text-slate-950">{value ?? 0}</p>
          <p className="mt-2 text-xs font-medium text-slate-500">{note}</p>
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
