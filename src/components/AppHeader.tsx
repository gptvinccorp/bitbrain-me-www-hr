
import React from 'react';
import { Button } from '@/components/ui/button';
import LanguageSelector from '@/components/LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';

const AppHeader = () => {
  const { t } = useLanguage();

  return (
    <header className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('header.title')}</h1>
          <p className="text-gray-600">{t('header.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/admin-login'}
            className="text-sm"
          >
            Админка
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
