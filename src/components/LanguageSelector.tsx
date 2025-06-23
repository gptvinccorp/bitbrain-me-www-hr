
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4" />
      <div className="flex bg-gray-100 rounded-lg p-1">
        <Button
          variant={language === 'en' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setLanguage('en')}
          className="text-xs px-3 py-1"
        >
          EN
        </Button>
        <Button
          variant={language === 'ru' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setLanguage('ru')}
          className="text-xs px-3 py-1"
        >
          РУ
        </Button>
      </div>
    </div>
  );
};

export default LanguageSelector;
