
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'ru';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Header
    'header.title': 'Web3 Media Agency',
    'header.subtitle': 'Join Our Team',
    
    // Hero Section
    'hero.title': 'Find Your Perfect Role',
    'hero.subtitle': 'Complete this 5-10 minute assessment to see if you\'re a match for our team. Your data and results stay private.',
    'hero.cta': 'Start Assessment',
    
    // Tracks
    'track.sales': 'Sales Department',
    'track.academy': 'Internal Academy',
    'track.creative': 'Creative Department (Viral Content)',
    
    // Registration Form
    'form.name': 'Full Name',
    'form.email': 'Email Address',
    'form.phone': 'Phone Number',
    'form.track': 'Desired Track',
    'form.selectTrack': 'Select your track',
    'form.submit': 'Start Test',
    'form.required': 'This field is required',
    
    // Test Interface
    'test.title': 'Assessment Test',
    'test.timeRemaining': 'Time Remaining',
    'test.question': 'Question',
    'test.of': 'of',
    'test.next': 'Next Question',
    'test.submit': 'Submit Test',
    'test.previous': 'Previous',
    
    // Test Modules
    'module.systematicThinking': 'Systematic Thinking',
    'module.attentionToDetail': 'Attention to Detail',
    'module.workCapacity': 'Work Capacity',
    'module.honesty': 'Honesty & Ethics',
    'module.growthMindset': 'Growth Mindset',
    'module.teamCommitment': 'Team Commitment',
    'module.adaptability': 'Adaptability & Stress',
    'module.creativity': 'Creativity',
    
    // Thank You
    'thanks.title': 'Thank You!',
    'thanks.message': 'We\'ll review your responses and get back to you soon.',
    'thanks.email': 'Check your email for detailed results.',
    
    // Admin Panel
    'admin.title': 'Admin Panel',
    'admin.candidates': 'Candidates',
    'admin.export': 'Export Data',
    'admin.score': 'Score',
    'admin.date': 'Date',
    'admin.details': 'View Details',
    
    // Questions
    'q1.title': 'Logic Sequence',
    'q1.text': 'What comes next in this sequence: 2, 6, 12, 20, 30, ?',
    'q1.a': '40',
    'q1.b': '42',
    'q1.c': '44',
    'q1.d': '46',
    
    'q2.title': 'Problem Solving',
    'q2.text': 'If you have 3 boxes and 12 items to distribute equally, how many items per box?',
    'q2.a': '3',
    'q2.b': '4',
    'q2.c': '5',
    'q2.d': '6',
    
    'q3.title': 'Spot the Difference',
    'q3.text': 'How many differences can you spot between these two similar images?',
    'q3.a': '3 differences',
    'q3.b': '4 differences',
    'q3.c': '5 differences',
    'q3.d': '6 differences',
    
    'q4.title': 'Quick Math',
    'q4.text': '47 + 38 - 15 = ?',
    'q4.a': '68',
    'q4.b': '70',
    'q4.c': '72',
    'q4.d': '74',
    
    'q5.title': 'Speed Calculation',
    'q5.text': '25% of 80 + 15 = ?',
    'q5.a': '35',
    'q5.b': '37',
    'q5.c': '39',
    'q5.d': '41',
    
    'q6.title': 'Ethical Decision',
    'q6.text': 'You notice a colleague making a mistake that could affect the project. What do you do?',
    'q6.a': 'Ignore it - not my responsibility',
    'q6.b': 'Fix it quietly without telling anyone',
    'q6.c': 'Speak to the colleague directly and offer help',
    'q6.d': 'Report it to management immediately',
    
    'q7.title': 'Workplace Scenario',
    'q7.text': 'A client is unhappy with your work. Your response:',
    'q7.a': 'Defend your work and explain why it\'s correct',
    'q7.b': 'Listen to their concerns and work together on a solution',
    'q7.c': 'Apologize and redo everything immediately',
    'q7.d': 'Refer them to your manager',
    
    'q8.title': 'Learning Attitude',
    'q8.text': 'How much do you agree: "I enjoy learning new skills even if they\'re difficult"',
    'q8.a': 'Strongly Disagree',
    'q8.b': 'Disagree',
    'q8.c': 'Agree',
    'q8.d': 'Strongly Agree',
    
    'q9.title': 'Team Collaboration',
    'q9.text': 'Your team is behind schedule on a project. What\'s your approach?',
    'q9.a': 'Work extra hours alone to catch up',
    'q9.b': 'Suggest the team works together to find solutions',
    'q9.c': 'Ask the manager for more time',
    'q9.d': 'Focus only on your assigned tasks',
    
    'q10.title': 'Stress Management',
    'q10.text': 'How do you handle sudden changes in project requirements?',
    'q10.a': 'Get frustrated and complain',
    'q10.b': 'Adapt quickly and find new solutions',
    'q10.c': 'Ask for detailed explanations before proceeding',
    'q10.d': 'Continue with the original plan',
    
    'q11.title': 'Creative Slogan',
    'q11.text': 'Which slogan works best for a crypto trading app?',
    'q11.a': 'Trade Smart, Win Big',
    'q11.b': 'Your Crypto Journey Starts Here',
    'q11.c': 'Revolutionize Your Portfolio',
    'q11.d': 'Secure. Simple. Profitable.',
  },
  ru: {
    // Header
    'header.title': 'Web3 Медиа Агентство',
    'header.subtitle': 'Присоединяйтесь к нашей команде',
    
    // Hero Section
    'hero.title': 'Найдите свою идеальную роль',
    'hero.subtitle': 'Пройдите этот 5-10 минутный тест, чтобы узнать, подходите ли вы нашей команде. Ваши данные и результаты останутся конфиденциальными.',
    'hero.cta': 'Начать тестирование',
    
    // Tracks
    'track.sales': 'Отдел продаж',
    'track.academy': 'Внутренняя академия',
    'track.creative': 'Креативный отдел (Вирусный контент)',
    
    // Registration Form
    'form.name': 'Полное имя',
    'form.email': 'Электронная почта',
    'form.phone': 'Номер телефона',
    'form.track': 'Желаемое направление',
    'form.selectTrack': 'Выберите направление',
    'form.submit': 'Начать тест',
    'form.required': 'Это поле обязательно',
    
    // Test Interface
    'test.title': 'Тест-оценка',
    'test.timeRemaining': 'Осталось времени',
    'test.question': 'Вопрос',
    'test.of': 'из',
    'test.next': 'Следующий вопрос',
    'test.submit': 'Отправить тест',
    'test.previous': 'Назад',
    
    // Test Modules
    'module.systematicThinking': 'Системное мышление',
    'module.attentionToDetail': 'Внимание к деталям',
    'module.workCapacity': 'Работоспособность',
    'module.honesty': 'Честность и этика',
    'module.growthMindset': 'Мышление роста',
    'module.teamCommitment': 'Командная работа',
    'module.adaptability': 'Адаптивность и стрессоустойчивость',
    'module.creativity': 'Креативность',
    
    // Thank You
    'thanks.title': 'Спасибо!',
    'thanks.message': 'Мы рассмотрим ваши ответы и свяжемся с вами в ближайшее время.',
    'thanks.email': 'Проверьте почту для получения подробных результатов.',
    
    // Admin Panel
    'admin.title': 'Панель администратора',
    'admin.candidates': 'Кандидаты',
    'admin.export': 'Экспорт данных',
    'admin.score': 'Балл',
    'admin.date': 'Дата',
    'admin.details': 'Подробности',
    
    // Questions
    'q1.title': 'Логическая последовательность',
    'q1.text': 'Что следует дальше в последовательности: 2, 6, 12, 20, 30, ?',
    'q1.a': '40',
    'q1.b': '42',
    'q1.c': '44',
    'q1.d': '46',
    
    'q2.title': 'Решение задач',
    'q2.text': 'Если у вас есть 3 коробки и 12 предметов для равномерного распределения, сколько предметов в каждой коробке?',
    'q2.a': '3',
    'q2.b': '4',
    'q2.c': '5',
    'q2.d': '6',
    
    'q3.title': 'Найди отличия',
    'q3.text': 'Сколько отличий вы можете найти между этими двумя похожими изображениями?',
    'q3.a': '3 отличия',
    'q3.b': '4 отличия',
    'q3.c': '5 отличий',
    'q3.d': '6 отличий',
    
    'q4.title': 'Быстрая математика',
    'q4.text': '47 + 38 - 15 = ?',
    'q4.a': '68',
    'q4.b': '70',
    'q4.c': '72',
    'q4.d': '74',
    
    'q5.title': 'Вычисления на скорость',
    'q5.text': '25% от 80 + 15 = ?',
    'q5.a': '35',
    'q5.b': '37',
    'q5.c': '39',
    'q5.d': '41',
    
    'q6.title': 'Этическое решение',
    'q6.text': 'Вы заметили, что коллега делает ошибку, которая может повлиять на проект. Что вы делаете?',
    'q6.a': 'Игнорирую - это не моя ответственность',
    'q6.b': 'Исправляю тихо, никому не говоря',
    'q6.c': 'Говорю с коллегой напрямую и предлагаю помощь',
    'q6.d': 'Сразу сообщаю руководству',
    
    'q7.title': 'Рабочая ситуация',
    'q7.text': 'Клиент недоволен вашей работой. Ваша реакция:',
    'q7.a': 'Защищаю свою работу и объясняю, почему она правильная',
    'q7.b': 'Выслушиваю замечания и работаю вместе над решением',
    'q7.c': 'Извиняюсь и сразу переделываю всё',
    'q7.d': 'Направляю их к моему руководителю',
    
    'q8.title': 'Отношение к обучению',
    'q8.text': 'Насколько вы согласны: "Мне нравится изучать новые навыки, даже если они сложные"',
    'q8.a': 'Категорически не согласен',
    'q8.b': 'Не согласен',
    'q8.c': 'Согласен',
    'q8.d': 'Полностью согласен',
    
    'q9.title': 'Командное сотрудничество',
    'q9.text': 'Ваша команда отстает от графика проекта. Каков ваш подход?',
    'q9.a': 'Работаю сверхурочно в одиночку, чтобы наверстать',
    'q9.b': 'Предлагаю команде работать вместе над поиском решений',
    'q9.c': 'Прошу руководителя дать больше времени',
    'q9.d': 'Сосредотачиваюсь только на своих задачах',
    
    'q10.title': 'Управление стрессом',
    'q10.text': 'Как вы справляетесь с внезапными изменениями в требованиях проекта?',
    'q10.a': 'Расстраиваюсь и жалуюсь',
    'q10.b': 'Быстро адаптируюсь и ищу новые решения',
    'q10.c': 'Прошу подробных объяснений перед продолжением',
    'q10.d': 'Продолжаю по первоначальному плану',
    
    'q11.title': 'Креативный слоган',
    'q11.text': 'Какой слоган лучше всего работает для приложения торговли криптовалютой?',
    'q11.a': 'Торгуй умно, выигрывай по-крупному',
    'q11.b': 'Ваше криптопутешествие начинается здесь',
    'q11.c': 'Революционизируйте свой портфель',
    'q11.d': 'Безопасно. Просто. Прибыльно.',
  }
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
