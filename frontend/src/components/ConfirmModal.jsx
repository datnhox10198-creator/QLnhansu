import { AlertTriangle } from 'lucide-react';

export default function ConfirmModal({ open, title, message, onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="rounded-md bg-rose-50 p-2 text-rose-700"><AlertTriangle size={22} /></div>
          <div>
            <h3 className="font-bold text-ink">{title}</h3>
            <p className="mt-1 text-sm text-slate-600">{message}</p>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button className="btn-secondary" onClick={onCancel}>Hủy</button>
          <button className="btn-danger" onClick={onConfirm}>Xóa</button>
        </div>
      </div>
    </div>
  );
}
