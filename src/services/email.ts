
import { Candidate } from '@/types/assessment';

interface EmailData {
  to: string;
  name: string;
  score: number;
  recommendations: string[];
}

export const sendEmailToCandidate = async (candidate: Candidate): Promise<boolean> => {
  try {
    // Генерируем простые рекомендации на основе результатов
    const recommendations = generateRecommendations(candidate.score, candidate.moduleScores);
    
    // Имитация отправки письма (в реальном проекте здесь был бы API вызов)
    console.log('=== EMAIL SENDING SIMULATION ===');
    console.log('To:', candidate.email);
    console.log('Name:', candidate.name);
    console.log('Score:', candidate.score);
    console.log('Track:', candidate.track);
    console.log('Recommendations:', recommendations);
    console.log('Email content would be:');
    console.log(`
Subject: Ваши результаты тестирования - Web3 Media Agency

Здравствуйте, ${candidate.name}!

Спасибо за прохождение нашего тестирования.

Ваш результат: ${candidate.score}/10

Рекомендации:
${recommendations.map(rec => `• ${rec}`).join('\n')}

С уважением,
Команда Web3 Media Agency
    `);
    console.log('=== END EMAIL SIMULATION ===');

    // Симуляция задержки отправки
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // В данный момент это только симуляция - письма не отправляются реально
    // Для реальной отправки нужно подключить EmailJS, SendGrid или другой сервис
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

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
