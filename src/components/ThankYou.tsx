
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ThankYouProps {
  candidateName: string;
  score: number;
}

const ThankYou: React.FC<ThankYouProps> = ({ candidateName, score }) => {
  const { t } = useLanguage();

  return (
    <div className="max-w-md mx-auto">
      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">{t('thanks.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            {candidateName}, {t('thanks.message')}
          </p>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-center gap-2 text-blue-600 mb-2">
              <Mail className="w-5 h-5" />
              <span className="font-medium">{t('thanks.email')}</span>
            </div>
          </div>

          <div className="text-sm text-gray-500 mt-6">
            <p>Assessment ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThankYou;
