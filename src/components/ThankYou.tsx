
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Mail, Home, Clock, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ThankYouProps {
  candidateName: string;
  score: number;
  emailSent?: boolean;
}

const ThankYou: React.FC<ThankYouProps> = ({ candidateName, score, emailSent = false }) => {
  const { t } = useLanguage();
  const [emailStatus, setEmailStatus] = useState<'sending' | 'sent' | 'failed'>('sending');

  useEffect(() => {
    // Имитируем небольшую задержку для отправки письма
    const timer = setTimeout(() => {
      setEmailStatus(emailSent ? 'sent' : 'failed');
    }, 2000);

    return () => clearTimeout(timer);
  }, [emailSent]);

  const handleGoHome = () => {
    // Принудительно перезагружаем страницу для возврата на главную
    window.location.href = '/';
  };

  const getEmailStatusIcon = () => {
    switch (emailStatus) {
      case 'sending':
        return <Clock className="w-5 h-5 animate-spin" />;
      case 'sent':
        return <Mail className="w-5 h-5" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getEmailStatusText = () => {
    switch (emailStatus) {
      case 'sending':
        return 'Отправляем результаты на почту...';
      case 'sent':
        return 'Результаты отправлены на вашу почту';
      case 'failed':
        return 'Не удалось отправить письмо';
    }
  };

  const getEmailStatusColor = () => {
    switch (emailStatus) {
      case 'sending':
        return 'text-blue-600';
      case 'sent':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
    }
  };

  const getEmailBgColor = () => {
    switch (emailStatus) {
      case 'sending':
        return 'bg-blue-50';
      case 'sent':
        return 'bg-green-50';
      case 'failed':
        return 'bg-red-50';
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">{t('thanks.title')}</CardTitle>
          <p className="text-gray-600">{t('thanks.subtitle')}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {t('thanks.score')} {score} {t('thanks.outOf')}
            </div>
          </div>
          
          <p className="text-gray-600">
            {candidateName}, {t('thanks.message')}
          </p>
          
          <div className={`${getEmailBgColor()} p-4 rounded-lg`}>
            <div className={`flex items-center justify-center gap-2 ${getEmailStatusColor()} mb-2`}>
              {getEmailStatusIcon()}
              <span className="font-medium">{getEmailStatusText()}</span>
            </div>
            {emailStatus === 'sent' && (
              <p className="text-sm text-gray-600">
                {t('thanks.reportGenerated')}
              </p>
            )}
            {emailStatus === 'failed' && (
              <p className="text-sm text-gray-600">
                Проверьте результаты в личном кабинете администратора
              </p>
            )}
          </div>

          <Button 
            onClick={handleGoHome}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
          >
            <Home className="w-4 h-4 mr-2" />
            {t('thanks.backHome')}
          </Button>

          <div className="text-sm text-gray-500 mt-6">
            <p>{t('thanks.assessmentId')}: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThankYou;
