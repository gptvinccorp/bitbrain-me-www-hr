
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
    
    // Более сбалансированный подбор вопросов
    const questionsByModule = new Map<string, Question[]>();
    
    // Фильтрация по треку
    let filteredQuestions = allQuestions;
    if (track !== 'creative') {
      filteredQuestions = allQuestions.filter(q => q.module !== 'creativity');
    }
    
    // Группируем по модулям
    filteredQuestions.forEach(q => {
      if (!questionsByModule.has(q.module)) {
        questionsByModule.set(q.module, []);
      }
      questionsByModule.get(q.module)!.push(q);
    });
    
    // Стратегия отбора: 2-3 вопроса на модуль для лучшей оценки
    const selectedQuestions: Question[] = [];
    const questionsPerModule = track === 'creative' ? 2 : 3; // Для creative трека меньше, т.к. больше модулей
    
    questionsByModule.forEach((questions, module) => {
      // Сортируем по сложности и берем разные уровни
      const sortedQuestions = questions.sort((a, b) => {
        const aRange = Math.max(...a.options.map(opt => opt.score)) - Math.min(...a.options.map(opt => opt.score));
        const bRange = Math.max(...b.options.map(opt => opt.score)) - Math.min(...b.options.map(opt => opt.score));
        return bRange - aRange; // Сначала сложные
      });
      
      const selected = sortedQuestions.slice(0, Math.min(questionsPerModule, sortedQuestions.length));
      selectedQuestions.push(...selected);
    });
    
    console.log('Selected questions V2:', selectedQuestions.length);
    console.log('Questions by module V2:', Array.from(questionsByModule.keys()).map(module => 
      `${module}: ${Math.min(questionsPerModule, questionsByModule.get(module)?.length || 0)}`
    ));
    
    return selectedQuestions;
  }
};
