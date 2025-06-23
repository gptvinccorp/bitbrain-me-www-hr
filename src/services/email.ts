
import { Candidate } from '@/types/assessment';
import { supabase } from '@/integrations/supabase/client';

export const sendEmailToCandidate = async (candidate: Candidate): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('Отправка email через edge function для:', candidate.email);
    
    const { data, error } = await supabase.functions.invoke('send-candidate-email', {
      body: {
        name: candidate.name,
        email: candidate.email,
        score: candidate.score,
        track: candidate.track,
        moduleScores: candidate.moduleScores
      }
    });

    console.log('Ответ от edge function:', { data, error });

    if (error) {
      console.error('Ошибка вызова edge function:', error);
      return { 
        success: false, 
        error: `Ошибка edge function: ${error.message || 'Неизвестная ошибка'}`
      };
    }

    // Проверяем статус ответа от edge function
    if (data && data.success === false) {
      console.error('Edge function вернула ошибку:', data.error);
      
      // Проверяем на специфичные ошибки Resend
      if (data.error && typeof data.error === 'object') {
        const errorMessage = data.error.message || data.error.error || JSON.stringify(data.error);
        
        if (errorMessage.includes('You can only send testing emails') || 
            errorMessage.includes('403') ||
            (data.error.statusCode && data.error.statusCode === 403)) {
          return { 
            success: false, 
            error: 'Ограничение Resend: Для отправки на другие адреса нужно верифицировать домен на resend.com/domains'
          };
        }
        
        return { 
          success: false, 
          error: `Ошибка отправки: ${errorMessage}`
        };
      }
      
      return { 
        success: false, 
        error: data.error || 'Неизвестная ошибка отправки'
      };
    }

    // Если нет явного успеха, но и нет ошибок, считаем успешным
    if (!data || data.success !== true) {
      console.warn('Edge function вернула неожиданный ответ:', data);
      return { 
        success: false, 
        error: 'Неожиданный ответ от сервера отправки email'
      };
    }

    console.log('Email успешно отправлен:', data);
    return { success: true };
    
  } catch (error: any) {
    console.error('Критическая ошибка отправки email:', error);
    return { 
      success: false, 
      error: `Критическая ошибка: ${error.message || 'Неизвестная ошибка'}`
    };
  }
};

// Функция для генерации рекомендаций (оставляем для локального использования)
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

  return recommendations.slice(0, 3);
};
