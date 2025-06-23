
import { Candidate } from '@/types/assessment';
import { supabase } from '@/integrations/supabase/client';

interface EmailData {
  to: string;
  name: string;
  score: number;
  recommendations: string[];
}

export const sendEmailToCandidate = async (candidate: Candidate): Promise<boolean> => {
  try {
    console.log('Sending email via edge function to:', candidate.email);
    
    const { data, error } = await supabase.functions.invoke('send-candidate-email', {
      body: {
        name: candidate.name,
        email: candidate.email,
        score: candidate.score,
        track: candidate.track,
        moduleScores: candidate.moduleScores
      }
    });

    if (error) {
      console.error('Error calling edge function:', error);
      return false;
    }

    console.log('Email sent successfully:', data);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Оставляем функцию для генерации рекомендаций для локального использования
const generateRecommendations = (score: number, moduleScores: any): string[] => {
  const recommendations: string[] = [];

  if (score >= 8) {
    recommendations.push('Отличные результаты! Вы показали высокий уровень подготовки.');
    recommendations.push('Рекомендуем обратить внимание на специализированные курсы для дальнейшего развития.');
  } else if (score >= 6) {
    recommendations.push('Хорошие результаты! У вас есть потенциал для роста.');
    recommendations.push('Рекомендуем улучшить навыки в областях с более низкими оценками.');
  } else {
    recommendations.push('Есть области для улучшения.');
    recommendations.push('Рекомендуем пройти дополнительное обучение перед повторной попыткой.');
  }

  // Добавляем специфичные рекомендации по модулям
  if (moduleScores) {
    Object.entries(moduleScores).forEach(([module, score]: [string, any]) => {
      if (score < 5) {
        switch (module) {
          case 'systematic':
            recommendations.push('Развивайте навыки системного мышления через решение логических задач.');
            break;
          case 'attention':
            recommendations.push('Тренируйте внимательность через специальные упражнения.');
            break;
          case 'capacity':
            recommendations.push('Улучшайте навыки тайм-менеджмента и работы под давлением.');
            break;
        }
      }
    });
  }

  return recommendations.slice(0, 3); // Ограничиваем количество рекомендаций
};
