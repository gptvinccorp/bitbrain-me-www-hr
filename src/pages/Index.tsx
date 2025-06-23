
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

type AppState = 'landing' | 'registration' | 'test' | 'complete';

interface RegistrationData {
  name: string;
  email: string;
  phone: string;
  track: 'sales' | 'academy' | 'creative';
}

const Index = () => {
  const { t } = useLanguage();
  const [currentState, setCurrentState] = useState<AppState>('landing');
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null);
  const [finalScore, setFinalScore] = useState<number>(0);

  const handleStartAssessment = () => {
    setCurrentState('registration');
  };

  const handleRegistrationComplete = (data: RegistrationData) => {
    setRegistrationData(data);
    setCurrentState('test');
  };

  const handleTestComplete = (answers: Answer[]) => {
    if (registrationData) {
      const { totalScore, moduleScores } = calculateScore(answers);
      setFinalScore(totalScore);

      // Store candidate data (in real app, this would go to a database)
      const candidate: Candidate = {
        id: Math.random().toString(36).substr(2, 9),
        name: registrationData.name,
        email: registrationData.email,
        phone: registrationData.phone,
        track: registrationData.track,
        answers,
        score: totalScore,
        moduleScores,
        submittedAt: new Date()
      };

      console.log('Candidate assessment completed:', candidate);
      
      // Generate recommendations
      const recommendations = generateRecommendations(moduleScores);
      console.log('HR Recommendations:', recommendations);

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
          <LanguageSelector />
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
              Drive growth through strategic client relationships and innovative sales approaches in the Web3 space.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">{t('track.academy')}</h3>
            <p className="text-gray-600">
              Develop and deliver educational content that empowers the next generation of Web3 professionals.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Palette className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">{t('track.creative')}</h3>
            <p className="text-gray-600">
              Create viral content that captures attention and drives engagement across digital platforms.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h3 className="text-3xl font-bold text-center mb-8">Assessment Features</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-semibold mb-4">What We Evaluate</h4>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Systematic thinking and problem-solving
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Attention to detail and accuracy
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Work capacity and time management
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Team collaboration and adaptability
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-4">Assessment Details</h4>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  8-10 focused questions
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  10-minute time limit
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Immediate results via email
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Privacy guaranteed
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
