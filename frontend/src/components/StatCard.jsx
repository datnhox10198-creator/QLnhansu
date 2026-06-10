const toneMap = {
  teal: {
    icon: 'bg-[#cbd7bd] text-[#29382f]',
    bar: 'bg-[#71806b]',
    glow: 'from-[#dfe7d5]/60',
    skin: 'stat-lime'
  },
  rose: {
    icon: 'bg-[#e6b8a2] text-[#653c2d]',
    bar: 'bg-[#b66d50]',
    glow: 'from-[#f1d8cc]/50',
    skin: 'stat-rose'
  },
  amber: {
    icon: 'bg-[#ead9a7] text-[#5e5130]',
    bar: 'bg-[#b59a55]',
    glow: 'from-[#f3e8c7]/50',
    skin: 'stat-amber'
  },
  blue: {
    icon: 'bg-[#bfd3dc] text-[#304c59]',
    bar: 'bg-[#6f96a8]',
    glow: 'from-[#dce9ee]/60',
    skin: 'stat-blue'
  },
  slate: {
    icon: 'bg-[#c9c8bc] text-[#41443f]',
    bar: 'bg-[#737a72]',
    glow: 'from-[#e5e4dc]/60',
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
          <p className="text-xs font-semibold text-slate-500">{label}</p>
          <p className="mt-3 text-4xl font-bold tracking-[-0.05em] text-slate-950">{value ?? 0}</p>
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
