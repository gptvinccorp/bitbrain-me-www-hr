
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Phone, Mail, User, Calendar, Clock, Target } from 'lucide-react';
import { Candidate } from '@/types/assessment';
import { useLanguage } from '@/contexts/LanguageContext';

interface CandidateDetailModalProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
}

const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({
  candidate,
  isOpen,
  onClose
}) => {
  const { t } = useLanguage();

  if (!candidate) return null;

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'bg-green-100 text-green-800';
    if (score >= 6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const formatCompletionTime = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getModuleName = (module: string) => {
    const moduleNames: Record<string, string> = {
      systematicThinking: 'Системное мышление',
      attentionToDetail: 'Внимание к деталям',
      workCapacity: 'Работоспособность',
      honesty: 'Честность',
      growthMindset: 'Готовность к развитию',
      teamCommitment: 'Командная работа',
      adaptability: 'Адаптивность',
      creativity: 'Креативность'
    };
    return moduleNames[module] || module;
  };

  const getTrackName = (track: string) => {
    switch (track) {
      case 'sales':
        return t('track.sales');
      case 'academy':
        return t('track.academy');
      case 'creative':
        return t('track.creative');
      default:
        return track;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Детальная информация о кандидате
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Личная информация */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Личные данные
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Имя</p>
                  <p className="font-medium">{candidate.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{candidate.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Телефон</p>
                  <p className="font-medium">{candidate.phone || 'Не указан'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Target className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Направление</p>
                  <Badge variant="outline">{getTrackName(candidate.track)}</Badge>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Дата прохождения</p>
                  <p className="font-medium">
                    {candidate.submittedAt.toLocaleDateString('ru-RU', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Время прохождения</p>
                  <p className="font-medium">{formatCompletionTime(candidate.completionTime)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Результаты теста */}
          <Card>
            <CardHeader>
              <CardTitle>Результаты тестирования</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-medium">Общий балл</span>
                  <Badge className={`text-lg px-4 py-2 ${getScoreColor(candidate.score)}`}>
                    {candidate.score}/10
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${(candidate.score / 10) * 100}%` }}
                  />
                </div>
              </div>

              <Separator className="my-6" />

              <div>
                <h4 className="font-semibold mb-4">Баллы по модулям</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {candidate.moduleScores.map((moduleScore, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">
                        {getModuleName(moduleScore.module)}
                      </span>
                      <Badge className={getScoreColor(moduleScore.score)}>
                        {moduleScore.score}/10
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Детальные ответы */}
          <Card>
            <CardHeader>
              <CardTitle>Ответы на вопросы ({candidate.answers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {candidate.answers.map((answer, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-sm text-gray-600">
                        Вопрос {answer.questionId}
                      </span>
                      <span className="text-xs text-gray-500">
                        Время: {Math.round(answer.timeSpent / 1000)}с
                      </span>
                    </div>
                    <p className="text-sm">
                      <strong>Выбранный ответ:</strong> {answer.selectedOption}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose} variant="outline">
            Закрыть
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CandidateDetailModal;
