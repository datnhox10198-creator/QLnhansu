export const money = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);
export const date = (value) => (value ? new Date(value).toLocaleDateString('vi-VN') : '');
export const isoDate = (value) => (value ? new Date(value).toISOString().slice(0, 10) : '');
