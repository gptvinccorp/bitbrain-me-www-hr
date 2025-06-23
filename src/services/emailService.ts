
import { Candidate } from '@/types/assessment';
import { supabase } from '@/integrations/supabase/client';
import { logError } from '@/utils/errorHandling';

interface EmailResponse {
  success: boolean;
  error?: string;
}

class EmailService {
  async sendCandidateEmail(candidate: Candidate): Promise<EmailResponse> {
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
        logError('EMAIL_SEND', error, { candidate: candidate.email });
        return { 
          success: false, 
          error: `Ошибка edge function: ${error.message || 'Неизвестная ошибка'}`
        };
      }

      if (data && data.success === false) {
        console.error('Edge function вернула ошибку:', data.error);
        return this.handleEmailError(data.error);
      }

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
      logError('CRITICAL_EMAIL_ERROR', error, { candidate: candidate.email });
      return { 
        success: false, 
        error: `Критическая ошибка: ${error.message || 'Неизвестная ошибка'}`
      };
    }
  }

  private handleEmailError(error: any): EmailResponse {
    if (error && typeof error === 'object') {
      const errorMessage = error.message || error.error || JSON.stringify(error);
      
      if (errorMessage.includes('You can only send testing emails') || 
          errorMessage.includes('403') ||
          (error.statusCode && error.statusCode === 403)) {
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
      error: error || 'Неизвестная ошибка отправки'
    };
  }
}

export const emailService = new EmailService();
