const locale = () => localStorage.getItem('hrms.language.current') === 'en' ? 'en-US' : 'vi-VN';

export const money = (value) => new Intl.NumberFormat(locale(), { style: 'currency', currency: 'VND' }).format(value || 0);
export const date = (value) => (value ? new Date(value).toLocaleDateString(locale()) : '');
export const isoDate = (value) => (value ? new Date(value).toISOString().slice(0, 10) : '');
