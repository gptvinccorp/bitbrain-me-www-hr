
import { supabase } from '@/integrations/supabase/client';
import { Question } from '@/types/assessment';

interface DatabaseQuestion {
  id: string;
  question_id: string;
  module: string;
  type: string;
  title_key: string;
  text_key: string;
  options: any; // Changed from any[] to any to handle Json type
  correct_answer: string | null;
  max_score: number;
  image_a_url: string | null;
  image_b_url: string | null;
}

const mapDatabaseQuestionToQuestion = (dbQuestion: DatabaseQuestion): Question => {
  return {
    id: dbQuestion.question_id,
    questionId: dbQuestion.question_id,
    module: dbQuestion.module,
    type: dbQuestion.type as 'mcq' | 'likert' | 'image',
    titleKey: dbQuestion.title_key,
    textKey: dbQuestion.text_key,
    options: Array.isArray(dbQuestion.options) ? dbQuestion.options : [],
    correctAnswer: dbQuestion.correct_answer,
    maxScore: dbQuestion.max_score,
    imageA: dbQuestion.image_a_url,
    imageB: dbQuestion.image_b_url
  };
};

export const questionsService = {
  async getAllQuestions(): Promise<Question[]> {
    console.log('Fetching all questions from database...');
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .order('question_id');

    if (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }

    console.log('Fetched questions from database:', data?.length || 0);
    return data?.map((item) => mapDatabaseQuestionToQuestion(item as DatabaseQuestion)) || [];
  },

  async getRandomQuestionSet(track: string): Promise<Question[]> {
    console.log('Getting question set for track:', track);
    
    const allQuestions = await this.getAllQuestions();
    
    // Фильтрация вопросов по треку
    let filteredQuestions = allQuestions;
    
    // Для творческого трека добавляем вопрос креативности
    if (track === 'creative') {
      // Включаем все модули включая креативность
      filteredQuestions = allQuestions;
    } else {
      // Для других треков исключаем креативность
      filteredQuestions = allQuestions.filter(q => q.module !== 'creativity');
    }
    
    console.log(`Filtered questions for ${track}:`, filteredQuestions.length);
    
    // Группируем по модулям
    const moduleGroups = new Map<string, Question[]>();
    filteredQuestions.forEach(q => {
      if (!moduleGroups.has(q.module)) {
        moduleGroups.set(q.module, []);
      }
      moduleGroups.get(q.module)!.push(q);
    });
    
    // Выбираем по одному вопросу из каждого модуля (или все если модуль содержит только один вопрос)
    const selectedQuestions: Question[] = [];
    moduleGroups.forEach((questions, module) => {
      if (questions.length > 0) {
        // Для каждого модуля берем все доступные вопросы (так как в каждом модуле по 1-2 вопроса)
        selectedQuestions.push(...questions);
      }
    });
    
    console.log('Selected questions for test:', selectedQuestions.length);
    console.log('Questions by module:', Array.from(moduleGroups.keys()).map(module => 
      `${module}: ${moduleGroups.get(module)?.length || 0}`
    ));
    
    return selectedQuestions;
  }
};
