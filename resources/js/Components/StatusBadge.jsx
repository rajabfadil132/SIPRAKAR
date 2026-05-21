const map = {
  Selesai: 'bg-emerald-500/15 text-emerald-300',
  'Sedang berjalan': 'bg-sky-500/15 text-sky-300',
  'Belum dilaksanakan': 'bg-slate-500/15 text-slate-300',
  Tertunda: 'bg-amber-500/15 text-amber-300',
  Dibatalkan: 'bg-red-500/15 text-red-300',
  Draft: 'bg-slate-500/15 text-slate-300',
  Direncanakan: 'bg-indigo-500/15 text-indigo-300',
  Disetujui: 'bg-emerald-500/15 text-emerald-300',
  Berjalan: 'bg-sky-500/15 text-sky-300',
};
export default function StatusBadge({ value }) { return <span className={`badge ${map[value] ?? 'bg-slate-500/15 text-slate-300'}`}>{value ?? '-'}</span>; }
