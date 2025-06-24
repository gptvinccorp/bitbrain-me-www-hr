
import { useState } from 'react';
import { Answer, Candidate } from '@/types/assessment';
import { calculateScoreV2, generateRecommendationsV2 } from '@/utils/scoringV2';
import { useToast } from '@/hooks/use-toast';

export interface RegistrationData {
  name: string;
  email: string;
  phone: string;
  track: 'sales' | 'academy' | 'creative';
}

export type AppState = 'landing' | 'registration' | 'test' | 'complete';

export const useAssessment = () => {
  const { toast } = useToast();
  const [currentState, setCurrentState] = useState<AppState>('landing');
  const [registrationData, setRegistrationData] = useState<RegistrationData | null>(null);
  const [completedCandidate, setCompletedCandidate] = useState<Candidate | null>(null);
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
      console.log('=== TEST COMPLETION V2 STARTED ===');
      console.log('Processing test results for:', registrationData.name);
      console.log('Track:', registrationData.track);
      
      const completionTime = Math.round((new Date().getTime() - testStartTime.getTime()) / 1000);
      console.log('Test completion time:', completionTime, 'seconds');
      
      try {
        // Используем новую систему подсчета баллов
        const { totalScore, moduleScores } = await calculateScoreV2(answers, registrationData.track);
        console.log('Calculated score V2:', totalScore, 'Module scores:', moduleScores);

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

        console.log('Created candidate object V2:', candidate);
        setCompletedCandidate(candidate);
        
        const recommendations = generateRecommendationsV2(moduleScores, registrationData.track);
        console.log('Generated recommendations V2:', recommendations);

        console.log('=== MOVING TO COMPLETION SCREEN V2 ===');
        setCurrentState('complete');
      } catch (error) {
        console.error('Error processing test results V2:', error);
        toast({
          title: "Ошибка",
          description: "Не удалось обработать результаты теста. Попробуйте еще раз.",
          variant: "destructive",
        });
      }
    } else {
      console.error('Missing registration data or test start time');
      toast({
        title: "Ошибка",
        description: "Не удалось обработать результаты теста. Попробуйте еще раз.",
        variant: "destructive",
      });
    }
  };

  const handleStartNew = () => {
    console.log('Starting new assessment');
    setCurrentState('landing');
    setRegistrationData(null);
    setCompletedCandidate(null);
    setTestStartTime(null);
  };

  return {
    currentState,
    registrationData,
    completedCandidate,
    handleStartAssessment,
    handleRegistrationComplete,
    handleTestComplete,
    handleStartNew
  };
};
