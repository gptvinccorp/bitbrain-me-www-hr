
// Помощники для работы с переводами
export const getNestedTranslation = (obj: any, path: string): string => {
  const keys = path.split('.');
  let value = obj;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return path; // Возвращаем ключ как fallback
    }
  }
  
  return typeof value === 'string' ? value : path;
};

export const validateTranslationKeys = (translations: any, language: string): string[] => {
  const missingKeys: string[] = [];
  
  const checkKeys = (obj: any, prefix = '') => {
    for (const key in obj) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        checkKeys(obj[key], fullKey);
      } else if (typeof obj[key] !== 'string') {
        missingKeys.push(`${language}.${fullKey}`);
      }
    }
  };
  
  checkKeys(translations);
  return missingKeys;
};

// Общие переводы для часто используемых элементов
export const commonTranslations = {
  buttons: {
    save: { ru: 'Сохранить', en: 'Save' },
    cancel: { ru: 'Отмена', en: 'Cancel' },
    submit: { ru: 'Отправить', en: 'Submit' },
    loading: { ru: 'Загрузка...', en: 'Loading...' },
    retry: { ru: 'Повторить', en: 'Retry' }
  },
  status: {
    success: { ru: 'Успешно', en: 'Success' },
    error: { ru: 'Ошибка', en: 'Error' },
    warning: { ru: 'Предупреждение', en: 'Warning' },
    info: { ru: 'Информация', en: 'Info' }
  }
};
