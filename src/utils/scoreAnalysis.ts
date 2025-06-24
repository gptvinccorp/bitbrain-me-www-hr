import { Candidate, Answer } from '@/types/assessment';
import { questionsService } from '@/services/questionsService';

export interface ScoreAnalysis {
  totalCandidates: number;
  averageScore: number;
  scoreDistribution: {
    [range: string]: number;
  };
  moduleAnalysis: {
    [module: string]: {
      averageScore: number;
      minScore: number;
      maxScore: number;
      candidatesCount: number;
    };
  };
  suspiciousPatterns: string[];
  detailedRecommendations: string[];
}

export const analyzeScores = async (candidates: Candidate[]): Promise<ScoreAnalysis> => {
  if (candidates.length === 0) {
    return {
      totalCandidates: 0,
      averageScore: 0,
      scoreDistribution: {},
      moduleAnalysis: {},
      suspiciousPatterns: [],
      detailedRecommendations: []
    };
  }

  // Анализ распределения баллов
  const scoreDistribution: { [range: string]: number } = {
    '0-2': 0,
    '3-4': 0,
    '5-6': 0,
    '7-8': 0,
    '9-10': 0
  };

  candidates.forEach(candidate => {
    const score = candidate.score;
    if (score <= 2) scoreDistribution['0-2']++;
    else if (score <= 4) scoreDistribution['3-4']++;
    else if (score <= 6) scoreDistribution['5-6']++;
    else if (score <= 8) scoreDistribution['7-8']++;
    else scoreDistribution['9-10']++;
  });

  // Анализ по модулям
  const moduleData: { [module: string]: number[] } = {};
  
  candidates.forEach(candidate => {
    candidate.moduleScores.forEach(moduleScore => {
      if (!moduleData[moduleScore.module]) {
        moduleData[moduleScore.module] = [];
      }
      moduleData[moduleScore.module].push(moduleScore.score);
    });
  });

  const moduleAnalysis: ScoreAnalysis['moduleAnalysis'] = {};
  Object.entries(moduleData).forEach(([module, scores]) => {
    moduleAnalysis[module] = {
      averageScore: scores.reduce((sum, score) => sum + score, 0) / scores.length,
      minScore: Math.min(...scores),
      maxScore: Math.max(...scores),
      candidatesCount: scores.length
    };
  });

  // Enhanced suspicious patterns detection
  const suspiciousPatterns: string[] = [];
  const detailedRecommendations: string[] = [];
  
  const totalCandidates = candidates.length;
  const averageScore = candidates.reduce((sum, c) => sum + c.score, 0) / totalCandidates;

  // Detailed analysis of score patterns
  const highScorePercent = (scoreDistribution['7-8'] + scoreDistribution['9-10']) / totalCandidates * 100;
  const perfectScorePercent = scoreDistribution['9-10'] / totalCandidates * 100;
  
  if (highScorePercent > 70) {
    suspiciousPatterns.push(
      `${Math.round(highScorePercent)}% кандидатов получили высокие баллы (7+). Возможно, тест слишком легкий.`
    );
    detailedRecommendations.push('Рассмотрите возможность добавления более сложных вопросов');
    detailedRecommendations.push('Проверьте корректность весовых коэффициентов для каждого вопроса');
  }

  if (perfectScorePercent > 20) {
    suspiciousPatterns.push(
      `${Math.round(perfectScorePercent)}% кандидатов получили максимальные баллы (9-10). Это может указывать на проблемы с дифференциацией.`
    );
    detailedRecommendations.push('Добавьте вопросы с градуированной оценкой для лучшей дифференциации');
  }

  if (averageScore > 7.5) {
    suspiciousPatterns.push(
      `Средний балл (${averageScore.toFixed(1)}) очень высокий. Рекомендуется пересмотреть сложность вопросов.`
    );
    detailedRecommendations.push('Понизьте баллы за простые ответы');
    detailedRecommendations.push('Увеличьте количество вопросов на логическое мышление');
  }

  if (averageScore < 4) {
    suspiciousPatterns.push(
      `Средний балл (${averageScore.toFixed(1)}) слишком низкий. Возможно, вопросы слишком сложные.`
    );
    detailedRecommendations.push('Пересмотрите сложность вопросов');
    detailedRecommendations.push('Добавьте вопросы среднего уровня сложности');
  }

  // Check module balance
  Object.entries(moduleAnalysis).forEach(([module, analysis]) => {
    if (analysis.averageScore > 8.5) {
      suspiciousPatterns.push(
        `Модуль "${module}" имеет слишком высокий средний балл (${analysis.averageScore.toFixed(1)}). Проверьте правильность подсчета.`
      );
    }
    
    if (analysis.averageScore < 3) {
      suspiciousPatterns.push(
        `Модуль "${module}" имеет очень низкий средний балл (${analysis.averageScore.toFixed(1)}). Возможно, вопросы слишком сложные.`
      );
    }

    // Check for lack of variation
    if (analysis.maxScore - analysis.minScore < 2 && analysis.candidatesCount > 5) {
      suspiciousPatterns.push(
        `Модуль "${module}" показывает низкую вариативность баллов. Добавьте вопросы разной сложности.`
      );
    }
  });

  // Check completion time patterns
  const fastCompletions = candidates.filter(c => c.completionTime && c.completionTime < 180);
  const slowCompletions = candidates.filter(c => c.completionTime && c.completionTime > 900);
  
  if (fastCompletions.length > totalCandidates * 0.3) {
    suspiciousPatterns.push(
      `${fastCompletions.length} кандидат(ов) прошли тест менее чем за 3 минуты (${Math.round((fastCompletions.length / totalCandidates) * 100)}%). Возможно, они не читали вопросы внимательно.`
    );
    detailedRecommendations.push('Добавьте минимальное время на каждый вопрос');
    detailedRecommendations.push('Рассмотрите добавление вопросов, требующих больше времени на обдумывание');
  }

  if (slowCompletions.length > totalCandidates * 0.2) {
    suspiciousPatterns.push(
      `${slowCompletions.length} кандидат(ов) потратили более 15 минут на тест. Возможно, некоторые вопросы слишком сложные.`
    );
  }

  // Check for answer patterns
  const sameAnswerPatterns = candidates.filter(candidate => {
    const answers = candidate.answers.map(a => a.selectedOption);
    const uniqueAnswers = new Set(answers);
    return uniqueAnswers.size < answers.length * 0.6; // Less than 60% unique answers
  });

  if (sameAnswerPatterns.length > 0) {
    suspiciousPatterns.push(
      `${sameAnswerPatterns.length} кандидат(ов) показали подозрительно однообразные ответы. Проверьте качество прохождения теста.`
    );
  }

  // Add general recommendations if no issues found
  if (suspiciousPatterns.length === 0) {
    detailedRecommendations.push('Система подсчета баллов работает корректно');
    detailedRecommendations.push('Рассмотрите добавление весовых коэффициентов для разных модулей');
    detailedRecommendations.push('Продолжайте мониторинг результатов для поддержания качества оценки');
  }

  return {
    totalCandidates,
    averageScore,
    scoreDistribution,
    moduleAnalysis,
    suspiciousPatterns,
    detailedRecommendations
  };
};

export const validateScoringLogic = async (): Promise<{
  isValid: boolean;
  issues: string[];
  recommendations: string[];
}> => {
  const issues: string[] = [];
  const recommendations: string[] = [];

  try {
    const allQuestions = await questionsService.getAllQuestions();
    
    // Проверяем, что у всех вопросов есть правильные опции и баллы
    allQuestions.forEach(question => {
      if (!question.options || question.options.length === 0) {
        issues.push(`Вопрос ${question.questionId}: нет вариантов ответов`);
      }

      const maxOptionScore = Math.max(...question.options.map(opt => opt.score));
      if (maxOptionScore !== question.maxScore) {
        issues.push(
          `Вопрос ${question.questionId}: максимальный балл опции (${maxOptionScore}) не совпадает с maxScore (${question.maxScore})`
        );
      }

      // Проверяем, что есть варианты с разными баллами
      const uniqueScores = [...new Set(question.options.map(opt => opt.score))];
      if (uniqueScores.length === 1) {
        issues.push(
          `Вопрос ${question.questionId}: все варианты ответов имеют одинаковый балл (${uniqueScores[0]})`
        );
      }
    });

    // Рекомендации по улучшению системы оценки
    if (issues.length === 0) {
      recommendations.push("Базовая структура вопросов корректна");
    }

    recommendations.push("Рассмотрите добавление весовых коэффициентов для разных модулей");
    recommendations.push("Добавьте более сложные вопросы для лучшей дифференциации кандидатов");
    recommendations.push("Реализуйте адаптивное тестирование на основе ответов кандидата");

    return {
      isValid: issues.length === 0,
      issues,
      recommendations
    };

  } catch (error) {
    console.error('Error validating scoring logic:', error);
    return {
      isValid: false,
      issues: ['Ошибка при проверке логики подсчета баллов'],
      recommendations: []
    };
  }
};
