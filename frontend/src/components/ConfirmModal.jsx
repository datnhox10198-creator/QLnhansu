import { AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import ModalPortal from './ModalPortal';

export default function ConfirmModal({ open, title, message, onCancel, onConfirm }) {
  const { t } = useLanguage();
  if (!open) return null;
  return (
    <ModalPortal>
      <div className="modal-backdrop fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div className="modal-fly modal-card w-full max-w-md p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-rose-50 p-2 text-rose-700 ring-1 ring-rose-100"><AlertTriangle size={22} /></div>
          <div>
            <h3 className="font-bold text-ink">{t(title)}</h3>
            <p className="mt-1 text-sm text-slate-600">{t(message)}</p>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button className="btn-secondary" onClick={onCancel}>{t('Huỷ')}</button>
          <button className="btn-danger" onClick={onConfirm}>{t('Xoá')}</button>
        </div>
      </div>
    </div>
    </ModalPortal>
  );
}
