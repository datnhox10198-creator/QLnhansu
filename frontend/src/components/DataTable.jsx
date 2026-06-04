export default function DataTable({ columns, rows, page, pages, onPage }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/90 shadow-xl shadow-slate-900/5 backdrop-blur">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50/80">
            <tr>
              {columns.map((column) => <th key={column.key} className="px-4 py-3 text-left font-semibold text-slate-600">{column.label}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row._id} className="transition hover:bg-teal-50/40">
                {columns.map((column) => <td key={column.key} className="whitespace-nowrap px-4 py-3">{column.render ? column.render(row) : row[column.key]}</td>)}
              </tr>
            ))}
            {!rows.length && (
              <tr><td colSpan={columns.length} className="px-4 py-10 text-center text-slate-500">Không có dữ liệu</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {pages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
          <button className="btn-secondary" disabled={page <= 1} onClick={() => onPage(page - 1)}>Trước</button>
          <span className="text-sm text-slate-600">Trang {page} / {pages}</span>
          <button className="btn-secondary" disabled={page >= pages} onClick={() => onPage(page + 1)}>Sau</button>
        </div>
      )}
    </div>
  );
}
