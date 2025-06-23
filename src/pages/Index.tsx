
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Users, Target, Palette, ArrowRight } from 'lucide-react';
import LanguageSelector from '@/components/LanguageSelector';
import RegistrationForm from '@/components/RegistrationForm';
import TestInterface from '@/components/TestInterface';
import ThankYou from '@/components/ThankYou';
import { useLanguage } from '@/contexts/LanguageContext';
import { Answer, Candidate } from '@/types/assessment';
import { calculateScore, generateRecommendations } from '@/utils/scoring';
import { supabaseStorageService } from '@/services/supabaseStorage';
import { sendEmailToCandidate } from '@/services/email';
import { useToast } from '@/hooks/use-toast';

type AppState = 'landing' | 'registration' | 'test' | 'complete';

interface RegistrationData {
  name: string;
  email: string;
  phone: string;
  track: 'sales' | 'academy' | 'creative';
}

const Index = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [currentState, setCurrentState] = useState<AppState>('landing');
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null);
  const [finalScore, setFinalScore] = useState<number>(0);
  const [testStartTime, setTestStartTime] = useState<Date | null>(null);

  const handleStartAssessment = () => {
    setCurrentState('registration');
  };

  const handleRegistrationComplete = (data: RegistrationData) => {
    setRegistrationData(data);
    setTestStartTime(new Date());
    setCurrentState('test');
  };

  const handleTestComplete = async (answers: Answer[]) => {
    if (registrationData && testStartTime) {
      console.log('Test completed, processing results...');
      
      // Calculate completion time in seconds
      const completionTime = Math.round((new Date().getTime() - testStartTime.getTime()) / 1000);
      
      // Важно: теперь calculateScore асинхронная функция
      const { totalScore, moduleScores } = await calculateScore(answers);
      setFinalScore(totalScore);

      // Create candidate data
      const candidate: Candidate = {
        id: Math.random().toString(36).substr(2, 9),
        name: registrationData.name,
        email: registrationData.email,
        phone: registrationData.phone,
        track: registrationData.track,
        answers,
        score: totalScore,
        moduleScores,
        submittedAt: new Date(),
        completionTime
      };

      console.log('Saving candidate to database:', candidate);

      // Store candidate data using Supabase storage service
      try {
        const success = await supabaseStorageService.saveCandidate(candidate, completionTime);
        if (success) {
          console.log('Candidate assessment completed and saved to Supabase:', candidate);
          toast({
            title: "Результаты сохранены",
            description: "Ваши результаты успешно сохранены в базе данных",
          });
        } else {
          console.error('Failed to save candidate to Supabase');
          toast({
            title: "Ошибка сохранения",
            description: "Не удалось сохранить результаты. Обратитесь к администратору.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error saving candidate:', error);
        toast({
          title: "Ошибка",
          description: "Произошла ошибка при сохранении результатов",
          variant: "destructive",
        });
      }
      
      // Generate recommendations
      const recommendations = generateRecommendations(moduleScores);
      console.log('HR Recommendations:', recommendations);

      // Автоматически отправляем письмо кандидату
      try {
        await sendEmailToCandidate(candidate);
        console.log('Email sent to candidate successfully');
      } catch (error) {
        console.error('Failed to send email to candidate:', error);
      }

      setCurrentState('complete');
    }
  };

  if (currentState === 'registration') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="absolute top-4 right-4">
          <LanguageSelector />
        </div>
        <RegistrationForm onSubmit={handleRegistrationComplete} />
      </div>
    );
  }

  if (currentState === 'test' && registrationData) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="absolute top-4 right-4">
          <LanguageSelector />
        </div>
        <TestInterface 
          track={registrationData.track} 
          onComplete={handleTestComplete} 
        />
      </div>
    );
  }

  if (currentState === 'complete' && registrationData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="absolute top-4 right-4">
          <LanguageSelector />
        </div>
        <ThankYou 
          candidateName={registrationData.name} 
          score={finalScore}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
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

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          {t('hero.title')}
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          {t('hero.subtitle')}
        </p>
        <Button 
          onClick={handleStartAssessment}
          size="lg" 
          className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          {t('hero.cta')}
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </section>

      {/* Tracks Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">{t('track.sales')}</h3>
            <p className="text-gray-600">
              {t('track.sales.description')}
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">{t('track.academy')}</h3>
            <p className="text-gray-600">
              {t('track.academy.description')}
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Palette className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">{t('track.creative')}</h3>
            <p className="text-gray-600">
              {t('track.creative.description')}
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h3 className="text-3xl font-bold text-center mb-8">{t('features.title')}</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-semibold mb-4">{t('features.evaluate')}</h4>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  {t('features.systematic')}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  {t('features.attention')}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  {t('features.capacity')}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  {t('features.collaboration')}
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-4">{t('features.details')}</h4>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  {t('features.questions')}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  {t('features.time')}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  {t('features.results')}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  {t('features.privacy')}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-600">
        <p>&copy; 2024 Web3 Media Agency. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;
