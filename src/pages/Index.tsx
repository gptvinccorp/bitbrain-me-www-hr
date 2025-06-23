
import React from 'react';
import LanguageSelector from '@/components/LanguageSelector';
import RegistrationForm from '@/components/RegistrationForm';
import TestInterface from '@/components/TestInterface';
import ThankYou from '@/components/ThankYou';
import AppHeader from '@/components/AppHeader';
import LandingContent from '@/components/LandingContent';
import { useAssessment } from '@/hooks/useAssessment';

const Index = () => {
  const {
    currentState,
    registrationData,
    completedCandidate,
    handleStartAssessment,
    handleRegistrationComplete,
    handleTestComplete,
    handleStartNew
  } = useAssessment();

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

  if (currentState === 'complete' && completedCandidate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="absolute top-4 right-4">
          <LanguageSelector />
        </div>
        <ThankYou 
          candidate={completedCandidate}
          completionTime={completedCandidate.completionTime}
          onStartNew={handleStartNew}
        />
      </div>
    );
  }

  return (
    <>
      <AppHeader />
      <LandingContent onStartAssessment={handleStartAssessment} />
    </>
  );
};

export default Index;
