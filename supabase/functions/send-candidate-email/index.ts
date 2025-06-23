
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  name: string;
  email: string;
  score: number;
  track: string;
  moduleScores: any;
}

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
          case 'honesty':
            recommendations.push('Продолжайте развивать этические навыки и честность в работе.');
            break;
          case 'growth':
            recommendations.push('Развивайте установку на рост и готовность к обучению.');
            break;
          case 'team':
            recommendations.push('Улучшайте навыки командной работы и сотрудничества.');
            break;
          case 'adaptability':
            recommendations.push('Работайте над адаптивностью и стрессоустойчивостью.');
            break;
          case 'creativity':
            recommendations.push('Развивайте творческие навыки и креативное мышление.');
            break;
        }
      }
    });
  }

  return recommendations.slice(0, 4);
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, score, track, moduleScores }: EmailRequest = await req.json();

    console.log('=== EMAIL SENDING ATTEMPT ===');
    console.log('Recipient:', email);
    console.log('Score:', score);
    console.log('Track:', track);
    console.log('RESEND_API_KEY exists:', !!Deno.env.get("RESEND_API_KEY"));

    const recommendations = generateRecommendations(score, moduleScores);
    
    const trackNames = {
      'sales': 'Отдел продаж',
      'academy': 'Внутренняя академия',
      'creative': 'Креативный отдел'
    };

    const trackName = trackNames[track as keyof typeof trackNames] || track;

    console.log('Attempting to send email via Resend...');

    const emailResponse = await resend.emails.send({
      from: "Web3 Media Agency <noreply@bitbrain.me>",
      to: [email],
      subject: "Ваши результаты тестирования - Web3 Media Agency",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2563eb; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
            .content { background-color: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
            .score-box { background-color: #dbeafe; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
            .score { font-size: 2em; font-weight: bold; color: #2563eb; }
            .recommendations { background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .recommendation { margin: 10px 0; padding-left: 20px; position: relative; }
            .recommendation:before { content: "•"; color: #10b981; font-weight: bold; position: absolute; left: 0; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 0.9em; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Web3 Media Agency</h1>
            <p>Результаты вашего тестирования</p>
          </div>
          
          <div class="content">
            <h2>Здравствуйте, ${name}!</h2>
            
            <p>Спасибо за прохождение нашего тестирования для позиции в направлении "<strong>${trackName}</strong>".</p>
            
            <div class="score-box">
              <div class="score">${score}/10</div>
              <p>Ваш общий результат</p>
            </div>
            
            <div class="recommendations">
              <h3>🎯 Персональные рекомендации:</h3>
              ${recommendations.map(rec => `<div class="recommendation">${rec}</div>`).join('')}
            </div>
            
            <p>Мы рассмотрим ваши результаты и свяжемся с вами в ближайшее время для обсуждения следующих шагов.</p>
            
            <div class="footer">
              <p>С уважением,<br>
              <strong>Команда Web3 Media Agency</strong></p>
              
              <p><em>Это автоматическое письмо. Если у вас есть вопросы, пожалуйста, свяжитесь с нами.</em></p>
              
              <hr style="margin: 20px 0;">
              <p style="font-size: 12px; color: #9ca3af;">
                Время отправки: ${new Date().toISOString()}<br>
                Получатель: ${email}
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("=== RESEND RESPONSE ===");
    console.log("Full response:", JSON.stringify(emailResponse, null, 2));

    if (emailResponse.error) {
      console.error("=== RESEND ERROR ===");
      console.error("Error details:", emailResponse.error);
      
      return new Response(JSON.stringify({ 
        success: false, 
        error: emailResponse.error,
        details: "Resend API returned an error"
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }

    console.log("=== EMAIL SENT SUCCESSFULLY ===");
    console.log("Message ID:", emailResponse.data?.id);

    return new Response(JSON.stringify({ 
      success: true, 
      messageId: emailResponse.data?.id,
      recipient: email,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("=== FUNCTION ERROR ===");
    console.error("Error type:", typeof error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message,
        details: "Edge function encountered an error"
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
