import { ChevronLeft, ChevronRight, Database } from 'lucide-react';

export default function DataTable({ columns, rows, page, pages, onPage }) {
  return (
    <div className="data-surface">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row._id} className="group transition-colors hover:bg-emerald-50/40">
                {columns.map((column) => (
                  <td key={column.key} className="whitespace-nowrap px-5 py-4 text-slate-600 first:font-semibold first:text-slate-900">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={columns.length} className="px-5 py-16 text-center">
                  <Database className="mx-auto mb-3 text-slate-300" size={28} />
                  <p className="font-medium text-slate-500">Chưa có dữ liệu</p>
                  <p className="mt-1 text-xs text-slate-400">Dữ liệu mới sẽ xuất hiện tại đây.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {pages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-5 py-3">
          <p className="text-xs text-slate-500">Trang <strong className="text-slate-800">{page}</strong> trên {pages}</p>
          <div className="flex gap-2">
            <button className="icon-button" disabled={page <= 1} onClick={() => onPage(page - 1)} aria-label="Trang trước"><ChevronLeft size={16} /></button>
            <button className="icon-button" disabled={page >= pages} onClick={() => onPage(page + 1)} aria-label="Trang sau"><ChevronRight size={16} /></button>
          </div>
        </div>
      )}
    </div>
  );
}
