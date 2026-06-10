import { Languages } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageSwitcher({ compact = false }) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className={`language-switcher ${compact ? 'language-switcher-compact' : ''}`} aria-label={t('Chọn ngôn ngữ')}>
      {!compact && <Languages size={15} />}
      <button type="button" className={language === 'vi' ? 'is-active' : ''} onClick={() => setLanguage('vi')} aria-pressed={language === 'vi'}>
        VI
      </button>
      <button type="button" className={language === 'en' ? 'is-active' : ''} onClick={() => setLanguage('en')} aria-pressed={language === 'en'}>
        EN
      </button>
    </div>
  );
}
