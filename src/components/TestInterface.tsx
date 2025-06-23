
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { questionsService } from '@/services/questionsService';
import { Answer, Question } from '@/types/assessment';
import { useToast } from '@/hooks/use-toast';

interface TestInterfaceProps {
  track: string;
  onComplete: (answers: Answer[]) => void;
}

const TestInterface: React.FC<TestInterfaceProps> = ({ track, onComplete }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  // Загружаем вопросы из базы данных
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        console.log('Loading questions for track:', track);
        const loadedQuestions = await questionsService.getRandomQuestionSet(track);
        console.log('Loaded questions:', loadedQuestions.length);
        setQuestions(loadedQuestions);
      } catch (error) {
        console.error('Failed to load questions:', error);
        toast({
          title: "Ошибка загрузки",
          description: "Не удалось загрузить вопросы теста",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [track, toast]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setQuestionStartTime(Date.now());
    setSelectedOption('');
  }, [currentQuestion]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (value: string) => {
    setSelectedOption(value);
  };

  const handleNext = () => {
    if (selectedOption) {
      const timeSpent = Date.now() - questionStartTime;
      const newAnswer: Answer = {
        questionId: questions[currentQuestion].id,
        selectedOption,
        timeSpent
      };

      const updatedAnswers = [...answers];
      const existingIndex = updatedAnswers.findIndex(a => a.questionId === newAnswer.questionId);
      
      if (existingIndex >= 0) {
        updatedAnswers[existingIndex] = newAnswer;
      } else {
        updatedAnswers.push(newAnswer);
      }

      setAnswers(updatedAnswers);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        onComplete(updatedAnswers);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      const prevAnswer = answers.find(a => a.questionId === questions[currentQuestion - 1].id);
      setSelectedOption(prevAnswer?.selectedOption || '');
    }
  };

  const handleSubmit = () => {
    if (selectedOption) {
      const timeSpent = Date.now() - questionStartTime;
      const finalAnswer: Answer = {
        questionId: questions[currentQuestion].id,
        selectedOption,
        timeSpent
      };
      onComplete([...answers, finalAnswer]);
    } else {
      onComplete(answers);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-lg">Загружаем вопросы...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <p className="text-lg text-red-600">Не удалось загрузить вопросы теста</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Попробовать снова
        </Button>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">{t('test.title')}</h2>
          <div className="flex items-center gap-2 bg-red-100 px-3 py-1 rounded-lg">
            <Clock className="w-4 h-4 text-red-600" />
            <span className="text-red-600 font-mono">
              {t('test.timeRemaining')}: {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>{t('test.question')} {currentQuestion + 1} {t('test.of')} {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t(currentQ.titleKey)}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-6 text-lg leading-relaxed">
            {t(currentQ.textKey)}
          </p>

          {currentQ.type === 'image' && (currentQ.imageA || currentQ.imageB) && (
            <div className="mb-6 p-4 bg-gray-100 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQ.imageA && (
                  <div className="bg-white p-4 rounded border-2 border-gray-300">
                    <p className="text-sm text-gray-600 mb-2 text-center font-medium">Изображение A</p>
                    <img 
                      src={currentQ.imageA} 
                      alt="Image A" 
                      className="w-full h-48 object-cover rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                )}
                {currentQ.imageB && (
                  <div className="bg-white p-4 rounded border-2 border-gray-300">
                    <p className="text-sm text-gray-600 mb-2 text-center font-medium">Изображение B</p>
                    <img 
                      src={currentQ.imageB} 
                      alt="Image B" 
                      className="w-full h-48 object-cover rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          <RadioGroup value={selectedOption} onValueChange={handleAnswerSelect}>
            {currentQ.options.map((option) => (
              <div key={option.key} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-colors">
                <RadioGroupItem value={option.key} id={option.key} />
                <Label htmlFor={option.key} className="flex-1 cursor-pointer text-base">
                  {t(option.textKey)}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              {t('test.previous')}
            </Button>

            <Button
              onClick={currentQuestion === questions.length - 1 ? handleSubmit : handleNext}
              disabled={!selectedOption}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              {currentQuestion === questions.length - 1 ? t('test.submit') : t('test.next')}
              {currentQuestion < questions.length - 1 && <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestInterface;
