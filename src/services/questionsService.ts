
import { supabase } from '@/integrations/supabase/client';
import { Question, QuestionOption } from '@/types/assessment';

class QuestionsService {
  async getAllQuestions(): Promise<Question[]> {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .order('question_id');

      if (error) {
        console.error('Error fetching questions from Supabase:', error);
        return [];
      }

      // Convert database format to app format with proper type conversion
      return (data || []).map(item => ({
        id: item.question_id,
        module: item.module,
        type: item.type as 'mcq' | 'likert' | 'image',
        titleKey: item.title_key,
        textKey: item.text_key,
        options: Array.isArray(item.options) ? (item.options as QuestionOption[]) : [],
        correctAnswer: item.correct_answer || undefined,
        maxScore: item.max_score,
        imageA: item.image_a_url || undefined,
        imageB: item.image_b_url || undefined
      }));
    } catch (error) {
      console.error('Error loading questions:', error);
      return [];
    }
  }

  async getQuestionsByModule(module: string): Promise<Question[]> {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('module', module)
        .order('question_id');

      if (error) {
        console.error(`Error fetching questions for module ${module}:`, error);
        return [];
      }

      return (data || []).map(item => ({
        id: item.question_id,
        module: item.module,
        type: item.type as 'mcq' | 'likert' | 'image',
        titleKey: item.title_key,
        textKey: item.text_key,
        options: Array.isArray(item.options) ? (item.options as QuestionOption[]) : [],
        correctAnswer: item.correct_answer || undefined,
        maxScore: item.max_score,
        imageA: item.image_a_url || undefined,
        imageB: item.image_b_url || undefined
      }));
    } catch (error) {
      console.error('Error loading questions by module:', error);
      return [];
    }
  }

  // Функция для получения случайного набора вопросов
  async getRandomQuestionSet(track: string): Promise<Question[]> {
    const modules = ['systematicThinking', 'attentionToDetail', 'workCapacity', 'honesty', 'growthMindset', 'teamCommitment', 'adaptability'];
    
    // Добавляем креативность для творческого трека
    if (track === 'creative') {
      modules.push('creativity');
    }

    const selectedQuestions: Question[] = [];

    for (const module of modules) {
      const moduleQuestions = await this.getQuestionsByModule(module);
      
      if (moduleQuestions.length > 0) {
        // Выбираем случайный вопрос из модуля
        const randomIndex = Math.floor(Math.random() * moduleQuestions.length);
        selectedQuestions.push(moduleQuestions[randomIndex]);
      }
    }

    return selectedQuestions;
  }
}

export const questionsService = new QuestionsService();
