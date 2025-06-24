
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, XCircle, TrendingUp, BarChart3 } from 'lucide-react';
import { Candidate } from '@/types/assessment';
import { analyzeScores, validateScoringLogic, ScoreAnalysis } from '@/utils/scoreAnalysis';

interface ScoringAnalysisProps {
  candidates: Candidate[];
}

const ScoringAnalysis: React.FC<ScoringAnalysisProps> = ({ candidates }) => {
  const [analysis, setAnalysis] = useState<ScoreAnalysis | null>(null);
  const [validation, setValidation] = useState<{ isValid: boolean; issues: string[]; recommendations: string[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const scoreAnalysis = await analyzeScores(candidates);
      const validationResult = await validateScoringLogic();
      
      setAnalysis(scoreAnalysis);
      setValidation(validationResult);
    } catch (error) {
      console.error('Error running scoring analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (candidates.length > 0) {
      runAnalysis();
    }
  }, [candidates]);

  if (!analysis) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <Button onClick={runAnalysis} disabled={loading || candidates.length === 0}>
              {loading ? 'Анализ...' : 'Запустить анализ баллов'}
            </Button>
            {candidates.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">Нет данных для анализа</p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getSeverityIcon = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'medium':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
  };

  const getScoringSeverity = (): 'high' | 'medium' | 'low' => {
    if (analysis.averageScore > 8 || analysis.suspiciousPatterns.length > 2) return 'high';
    if (analysis.averageScore > 7 || analysis.suspiciousPatterns.length > 0) return 'medium';
    return 'low';
  };

  const severity = getScoringSeverity();

  return (
    <div className="space-y-6">
      {/* Общий статус */}
      <Alert className={`border-l-4 ${
        severity === 'high' ? 'border-red-500 bg-red-50' : 
        severity === 'medium' ? 'border-yellow-500 bg-yellow-50' : 
        'border-green-500 bg-green-50'
      }`}>
        <div className="flex items-center gap-2">
          {getSeverityIcon(severity)}
          <div>
            <h3 className="font-semibold">
              Статус системы подсчета баллов: {
                severity === 'high' ? 'Требует внимания' :
                severity === 'medium' ? 'Умеренные проблемы' :
                'Работает корректно'
              }
            </h3>
            <AlertDescription>
              {severity === 'high' && 'Обнаружены серьезные проблемы с подсчетом баллов. Рекомендуется пересмотреть систему оценки.'}
              {severity === 'medium' && 'Система работает, но есть области для улучшения.'}
              {severity === 'low' && 'Система подсчета баллов работает корректно.'}
            </AlertDescription>
          </div>
        </div>
      </Alert>

      {/* Статистика */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-600">Средний балл</span>
            </div>
            <div className="text-2xl font-bold">{analysis.averageScore.toFixed(1)}/10</div>
            <div className="text-xs text-gray-500">
              {analysis.averageScore > 7.5 ? 'Слишком высокий' : 
               analysis.averageScore < 5 ? 'Слишком низкий' : 'Нормальный'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-600">Высокие баллы</span>
            </div>
            <div className="text-2xl font-bold">
              {analysis.scoreDistribution['7-8'] + analysis.scoreDistribution['9-10']}
            </div>
            <div className="text-xs text-gray-500">
              {Math.round(((analysis.scoreDistribution['7-8'] + analysis.scoreDistribution['9-10']) / analysis.totalCandidates) * 100)}% от всех
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-gray-600">Проблемы</span>
            </div>
            <div className="text-2xl font-bold">{analysis.suspiciousPatterns.length}</div>
            <div className="text-xs text-gray-500">Обнаружено</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-600">Всего кандидатов</span>
            </div>
            <div className="text-2xl font-bold">{analysis.totalCandidates}</div>
            <div className="text-xs text-gray-500">В анализе</div>
          </CardContent>
        </Card>
      </div>

      {/* Распределение баллов */}
      <Card>
        <CardHeader>
          <CardTitle>Распределение баллов</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(analysis.scoreDistribution).map(([range, count]) => {
              const percentage = analysis.totalCandidates > 0 ? (count / analysis.totalCandidates) * 100 : 0;
              return (
                <div key={range} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{range} баллов</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12">{count} чел.</span>
                    <span className="text-xs text-gray-500 w-12">{percentage.toFixed(0)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Анализ по модулям */}
      <Card>
        <CardHeader>
          <CardTitle>Анализ по модулям</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(analysis.moduleAnalysis).map(([module, moduleData]) => (
              <div key={module} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{module}</h4>
                  <Badge className={
                    moduleData.averageScore > 8 ? 'bg-red-100 text-red-800' :
                    moduleData.averageScore > 6 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }>
                    {moduleData.averageScore.toFixed(1)}/10
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Мин:</span> {moduleData.minScore}
                  </div>
                  <div>
                    <span className="text-gray-600">Макс:</span> {moduleData.maxScore}
                  </div>
                  <div>
                    <span className="text-gray-600">Кандидатов:</span> {moduleData.candidatesCount}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Подозрительные паттерны */}
      {analysis.suspiciousPatterns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Обнаруженные проблемы
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysis.suspiciousPatterns.map((pattern, index) => (
                <Alert key={index} className="border-orange-200 bg-orange-50">
                  <AlertDescription>{pattern}</AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Валидация логики */}
      {validation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {validation.isValid ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              Валидация логики подсчета
            </CardTitle>
          </CardHeader>
          <CardContent>
            {validation.issues.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-red-800 mb-2">Найденные проблемы:</h4>
                <div className="space-y-2">
                  {validation.issues.map((issue, index) => (
                    <Alert key={index} className="border-red-200 bg-red-50">
                      <AlertDescription>{issue}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="font-medium text-blue-800 mb-2">Рекомендации:</h4>
              <div className="space-y-2">
                {validation.recommendations.map((rec, index) => (
                  <Alert key={index} className="border-blue-200 bg-blue-50">
                    <AlertDescription>{rec}</AlertDescription>
                  </Alert>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center">
        <Button onClick={runAnalysis} disabled={loading}>
          {loading ? 'Обновление...' : 'Обновить анализ'}
        </Button>
      </div>
    </div>
  );
};

export default ScoringAnalysis;
