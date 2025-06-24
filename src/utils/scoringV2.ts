
import { Answer, ModuleScore } from '@/types/assessment';
import { questionsService } from '@/services/questionsService';
import { logError } from '@/utils/errorHandling';

// Весовые коэффициенты для модулей (важность для разных треков)
const MODULE_WEIGHTS = {
  sales: {
    systematicThinking: 1.2,
    attentionToDetail: 1.0,
    workCapacity: 1.3,
    honesty: 1.4,
    growthMindset: 1.1,
    teamCommitment: 1.2,
    adaptability: 1.3,
    creativity: 0.8
  },
  academy: {
    systematicThinking: 1.4,
    attentionToDetail: 1.2,
    workCapacity: 1.1,
    honesty: 1.3,
    growthMindset: 1.4,
    teamCommitment: 1.1,
    adaptability: 1.2,
    creativity: 0.9
  },
  creative: {
    systematicThinking: 1.0,
    attentionToDetail: 1.3,
    workCapacity: 1.1,
    honesty: 1.2,
    growthMindset: 1.3,
    teamCommitment: 1.2,
    adaptability: 1.4,
    creativity: 1.5
  }
};

// Пороговые значения для более строгой оценки
const DIFFICULTY_MULTIPLIERS = {
  easy: 0.8,    // Легкие вопросы дают меньше баллов
  medium: 1.0,  // Средние вопросы - базовые баллы
  hard: 1.2     // Сложные вопросы - бонусные баллы
};

export const calculateScoreV2 = async (
  answers: Answer[], 
  track: 'sales' | 'academy' | 'creative'
): Promise<{ totalScore: number; moduleScores: ModuleScore[] }> => {
  try {
    console.log('=== SCORING V2 START ===');
    console.log('Calculating score for track:', track);
    console.log('Answers count:', answers.length);
    
    const allQuestions = await questionsService.getAllQuestions();
    console.log('Questions loaded:', allQuestions.length);
    
    const moduleMap = new Map<string, { 
      rawScore: number; 
      maxScore: number; 
      questionCount: number;
      weightedScore: number;
    }>();

    // Инициализируем модули
    const modules = [
      'systematicThinking', 
      'attentionToDetail', 
      'workCapacity', 
      'honesty', 
      'growthMindset', 
      'teamCommitment', 
      'adaptability', 
      'creativity'
    ];
    
    modules.forEach(module => {
      moduleMap.set(module, { 
        rawScore: 0, 
        maxScore: 0, 
        questionCount: 0,
        weightedScore: 0
      });
    });

    // Подсчитываем сырые баллы
    answers.forEach(answer => {
      const question = allQuestions.find(q => q.questionId === answer.questionId);
      if (question) {
        console.log(`Processing question ${question.questionId} from module ${question.module}`);
        
        const option = question.options.find(opt => opt.key === answer.selectedOption);
        if (option) {
          const moduleData = moduleMap.get(question.module);
          if (moduleData) {
            // Определяем сложность вопроса по распределению баллов
            const scores = question.options.map(opt => opt.score);
            const maxOptionScore = Math.max(...scores);
            const minOptionScore = Math.min(...scores);
            const scoreRange = maxOptionScore - minOptionScore;
            
            let difficulty: 'easy' | 'medium' | 'hard' = 'medium';
            if (scoreRange <= 5) difficulty = 'easy';
            else if (scoreRange >= 8) difficulty = 'hard';
            
            const difficultyMultiplier = DIFFICULTY_MULTIPLIERS[difficulty];
            const adjustedScore = Math.round(option.score * difficultyMultiplier);
            
            console.log(`Question ${question.questionId}: ${option.score} * ${difficultyMultiplier} = ${adjustedScore}`);
            
            moduleData.rawScore += adjustedScore;
            moduleData.maxScore += Math.round(question.maxScore * difficultyMultiplier);
            moduleData.questionCount += 1;
          }
        }
      }
    });

    // Применяем весовые коэффициенты и нормализуем
    const moduleScores: ModuleScore[] = [];
    let totalWeightedScore = 0;
    let totalWeight = 0;

    const trackWeights = MODULE_WEIGHTS[track];

    moduleMap.forEach((data, module) => {
      if (data.questionCount > 0) {
        // Нормализуем до 0-10
        const normalizedScore = data.maxScore > 0 ? (data.rawScore / data.maxScore) * 10 : 0;
        
        // Применяем весовой коэффициент
        const weight = trackWeights[module as keyof typeof trackWeights] || 1.0;
        const weightedScore = normalizedScore * weight;
        
        // Более строгое округление (в меньшую сторону для реалистичности)
        const finalScore = Math.floor(Math.min(10, weightedScore));
        
        console.log(`Module ${module}:`, {
          raw: data.rawScore,
          max: data.maxScore,
          normalized: normalizedScore.toFixed(2),
          weight: weight,
          weighted: weightedScore.toFixed(2),
          final: finalScore
        });

        moduleScores.push({
          module,
          score: finalScore,
          maxScore: 10
        });

        totalWeightedScore += weightedScore;
        totalWeight += weight;
      }
    });

    // Вычисляем общий балл с учетом весов
    const averageWeightedScore = totalWeight > 0 ? totalWeightedScore / moduleScores.length : 0;
    
    // Применяем дополнительную корректировку для реалистичности
    let totalScore = Math.floor(averageWeightedScore);
    
    // Штраф за низкую производительность по времени
    const averageTimePerQuestion = answers.reduce((sum, a) => sum + (a.timeSpent || 0), 0) / answers.length;
    if (averageTimePerQuestion < 30000) { // Менее 30 секунд на вопрос - подозрительно быстро
      totalScore = Math.max(0, totalScore - 1);
      console.log('Applied speed penalty: -1 point');
    }

    // Бонус за последовательность (хорошие результаты во всех модулях)
    const moduleScoresArray = moduleScores.map(m => m.score);
    const minModuleScore = Math.min(...moduleScoresArray);
    const maxModuleScore = Math.max(...moduleScoresArray);
    if (maxModuleScore - minModuleScore <= 2 && minModuleScore >= 6) {
      totalScore = Math.min(10, totalScore + 1);
      console.log('Applied consistency bonus: +1 point');
    }

    totalScore = Math.max(0, Math.min(10, totalScore));

    console.log('=== SCORING V2 RESULT ===');
    console.log(`Final score: ${totalScore}/10`);
    console.log('Module scores:', moduleScores);

    return { totalScore, moduleScores };
    
  } catch (error) {
    logError('SCORE_CALCULATION_V2', error, { answersCount: answers.length, track });
    throw new Error('Ошибка при подсчете результатов теста');
  }
};

export const generateRecommendationsV2 = (
  moduleScores: ModuleScore[], 
  track: 'sales' | 'academy' | 'creative'
): string[] => {
  const recommendations: string[] = [];
  
  const recommendationMap: Record<string, Record<string, string>> = {
    systematicThinking: {
      sales: 'Развитие аналитических навыков критично для работы с клиентами',
      academy: 'Системное мышление - основа для обучения и развития',
      creative: 'Логическое мышление поможет в структурировании творческих идей'
    },
    attentionToDetail: {
      sales: 'Внимательность к деталям важна при работе с договорами и клиентами',
      academy: 'Точность критична при подготовке учебных материалов',
      creative: 'Внимание к деталям обеспечивает качество творческого продукта'
    },
    workCapacity: {
      sales: 'Высокая работоспособность необходима для достижения целей продаж',
      academy: 'Способность к интенсивной работе важна для образовательных проектов',
      creative: 'Продуктивность критична при работе над творческими проектами'
    },
    honesty: {
      sales: 'Честность - основа доверительных отношений с клиентами',
      academy: 'Этические принципы важны в образовательной среде',
      creative: 'Честность в креативе создает аутентичный бренд'
    },
    growthMindset: {
      sales: 'Готовность к обучению поможет адаптироваться к изменениям рынка',
      academy: 'Мышление роста - ключевой навык для преподавателей',
      creative: 'Открытость к развитию важна в динамичной творческой среде'
    },
    teamCommitment: {
      sales: 'Командная работа усиливает результаты продаж',
      academy: 'Сотрудничество критично для образовательных проектов',
      creative: 'Творческая команда создает более сильные решения'
    },
    adaptability: {
      sales: 'Гибкость помогает работать с разными типами клиентов',
      academy: 'Адаптивность важна при работе с разными стилями обучения',
      creative: 'Способность адаптироваться критична в меняющихся трендах'
    },
    creativity: {
      sales: 'Креативность поможет найти нестандартные решения для клиентов',
      academy: 'Творческий подход делает обучение более эффективным',
      creative: 'Креативность - основной навык для этой позиции'
    }
  };
  
  // Анализируем слабые стороны (балл ≤ 5)
  const weakModules = moduleScores.filter(m => m.score <= 5);
  const strongModules = moduleScores.filter(m => m.score >= 8);
  
  if (weakModules.length > 0) {
    recommendations.push(`Области для развития (${weakModules.length}):`);
    weakModules.forEach(module => {
      const recommendation = recommendationMap[module.module]?.[track];
      if (recommendation) {
        recommendations.push(`• ${recommendation}`);
      }
    });
  }

  if (strongModules.length > 0) {
    recommendations.push(`Сильные стороны (${strongModules.length}):`);
    strongModules.forEach(module => {
      recommendations.push(`• ${module.module}: отличный результат`);
    });
  }

  // Общие рекомендации на основе профиля
  const averageScore = moduleScores.reduce((sum, m) => sum + m.score, 0) / moduleScores.length;
  
  if (averageScore >= 7) {
    recommendations.push('Рекомендуется для следующего этапа собеседования');
  } else if (averageScore >= 5) {
    recommendations.push('Кандидат с потенциалом, рекомендуется дополнительное интервью');
  } else {
    recommendations.push('Требуется значительное развитие навыков');
  }

  return recommendations;
};
