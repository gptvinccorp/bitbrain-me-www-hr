
import { Answer, ModuleScore } from '@/types/assessment';
import { questionsService } from '@/services/questionsService';

export const calculateScore = async (answers: Answer[]): Promise<{ totalScore: number; moduleScores: ModuleScore[] }> => {
  console.log('Calculating score for answers:', answers);
  
  // Получаем все вопросы из базы данных для правильного подсчета
  const allQuestions = await questionsService.getAllQuestions();
  console.log('All questions loaded for scoring:', allQuestions.length);
  
  const moduleMap = new Map<string, { totalScore: number; maxScore: number }>();

  // Initialize modules
  const modules = ['systematicThinking', 'attentionToDetail', 'workCapacity', 'honesty', 'growthMindset', 'teamCommitment', 'adaptability', 'creativity'];
  modules.forEach(module => {
    moduleMap.set(module, { totalScore: 0, maxScore: 0 });
  });

  // Calculate scores for each answer
  answers.forEach(answer => {
    const question = allQuestions.find(q => q.questionId === answer.questionId);
    if (question) {
      console.log(`Processing question ${question.questionId}, selected: ${answer.selectedOption}`);
      
      const option = question.options.find(opt => opt.key === answer.selectedOption);
      if (option) {
        const moduleData = moduleMap.get(question.module);
        if (moduleData) {
          console.log(`Adding ${option.score} points to module ${question.module}`);
          moduleData.totalScore += option.score;
          moduleData.maxScore += question.maxScore;
        }
      } else {
        console.error(`Option ${answer.selectedOption} not found for question ${question.questionId}`);
      }
    } else {
      console.error(`Question ${answer.questionId} not found in database`);
    }
  });

  // Convert to normalized scores (0-10)
  const moduleScores: ModuleScore[] = [];
  let totalPoints = 0;
  let maxPoints = 0;

  moduleMap.forEach((data, module) => {
    if (data.maxScore > 0) {
      const normalizedScore = Math.round((data.totalScore / data.maxScore) * 10);
      console.log(`Module ${module}: ${data.totalScore}/${data.maxScore} = ${normalizedScore}/10`);
      moduleScores.push({
        module,
        score: normalizedScore,
        maxScore: 10
      });
      totalPoints += normalizedScore;
      maxPoints += 10;
    }
  });

  const totalScore = Math.round(totalPoints / moduleScores.length);
  console.log(`Final score: ${totalScore}/10 (from ${moduleScores.length} modules)`);

  return { totalScore, moduleScores };
};

export const generateRecommendations = (moduleScores: ModuleScore[]): string[] => {
  const recommendations: string[] = [];
  
  moduleScores.forEach(moduleScore => {
    if (moduleScore.score <= 4) {
      switch (moduleScore.module) {
        case 'systematicThinking':
          recommendations.push('Consider additional training in logical problem-solving');
          break;
        case 'attentionToDetail':
          recommendations.push('Recommend follow-up assessment for attention to detail');
          break;
        case 'workCapacity':
          recommendations.push('May need support with time management and quick decision making');
          break;
        case 'honesty':
          recommendations.push('Important to assess ethical alignment in interview');
          break;
        case 'growthMindset':
          recommendations.push('Discuss learning opportunities and development mindset');
          break;
        case 'teamCommitment':
          recommendations.push('Evaluate team collaboration skills in group interview');
          break;
        case 'adaptability':
          recommendations.push('Assess stress management and flexibility in challenging scenarios');
          break;
        case 'creativity':
          recommendations.push('Consider creative portfolio review for this role');
          break;
      }
    }
  });

  if (recommendations.length === 0) {
    recommendations.push('Strong candidate across all areas - recommend for next interview round');
  }

  return recommendations;
};
