const cache = new Map();

const knownTranslations = new Map([
  ['Nhân sự', 'Human Resources'],
  ['Trưởng phòng', 'Department Manager'],
  ['Marketing', 'Marketing'],
  ['IT', 'IT'],
  ['Tài Chính', 'Finance'],
  ['Tài chính', 'Finance'],
  ['Kinh Doanh', 'Sales'],
  ['Kinh doanh', 'Sales']
]);

export const translateToEnglish = async (value) => {
  const text = value?.trim();
  if (!text) return '';
  if (knownTranslations.has(text)) return knownTranslations.get(text);
  if (cache.has(text)) return cache.get(text);

  try {
    const params = new URLSearchParams({
      client: 'gtx',
      sl: 'vi',
      tl: 'en',
      dt: 't',
      q: text
    });
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?${params}`, {
      signal: AbortSignal.timeout(8000)
    });
    if (!response.ok) throw new Error(`Translation service returned ${response.status}`);
    const data = await response.json();
    const translated = data?.[0]?.map((part) => part?.[0] || '').join('').trim();
    if (!translated) throw new Error('Translation service returned an empty result');
    cache.set(text, translated);
    return translated;
  } catch (error) {
    console.warn(`Translation skipped: ${error.message}`);
    return text;
  }
};

export const translateFields = async (payload, fields) => {
  const entries = await Promise.all(fields.map(async (field) => [
    field,
    await translateToEnglish(payload[field])
  ]));
  return Object.fromEntries(entries);
};

export const ensureEnglishTranslation = async (document, fields) => {
  const missing = fields.filter((field) => document[field] && !document.translations?.en?.[field]);
  if (!missing.length) return document;

  const translated = await translateFields(document, missing);
  document.set('translations.en', {
    ...(document.translations?.en?.toObject?.() || document.translations?.en || {}),
    ...translated
  });
  await document.save();
  return document;
};
