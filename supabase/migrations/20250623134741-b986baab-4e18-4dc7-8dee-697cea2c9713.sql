
-- Создаем таблицу для хранения вопросов
CREATE TABLE public.questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id TEXT NOT NULL UNIQUE,
  module TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('mcq', 'likert', 'image')),
  title_key TEXT NOT NULL,
  text_key TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer TEXT,
  max_score INTEGER NOT NULL DEFAULT 10,
  image_a_url TEXT, -- URL изображения A для вопросов типа 'image'
  image_b_url TEXT, -- URL изображения B для вопросов типа 'image'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Создаем индексы для быстрого поиска
CREATE INDEX idx_questions_module ON public.questions(module);
CREATE INDEX idx_questions_type ON public.questions(type);
CREATE INDEX idx_questions_question_id ON public.questions(question_id);

-- Включаем RLS для таблицы вопросов
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

-- Создаем политику для публичного чтения вопросов (для тестирования)
CREATE POLICY "Allow public read access to questions" 
  ON public.questions 
  FOR SELECT 
  TO public
  USING (true);

-- Создаем политику для админов на все операции
CREATE POLICY "Allow authenticated admin access to questions" 
  ON public.questions 
  FOR ALL
  TO authenticated
  USING (true);

-- Вставляем существующие вопросы в базу данных
INSERT INTO public.questions (question_id, module, type, title_key, text_key, options, correct_answer, max_score, image_a_url, image_b_url) VALUES
('q1', 'systematicThinking', 'mcq', 'q1.title', 'q1.text', '[{"key": "a", "textKey": "q1.a", "score": 2}, {"key": "b", "textKey": "q1.b", "score": 10}, {"key": "c", "textKey": "q1.c", "score": 5}, {"key": "d", "textKey": "q1.d", "score": 0}]'::jsonb, 'b', 10, null, null),
('q2', 'systematicThinking', 'mcq', 'q2.title', 'q2.text', '[{"key": "a", "textKey": "q2.a", "score": 2}, {"key": "b", "textKey": "q2.b", "score": 10}, {"key": "c", "textKey": "q2.c", "score": 5}, {"key": "d", "textKey": "q2.d", "score": 0}]'::jsonb, 'b', 10, null, null),
('q3', 'attentionToDetail', 'image', 'q3.title', 'q3.text', '[{"key": "a", "textKey": "q3.a", "score": 2}, {"key": "b", "textKey": "q3.b", "score": 5}, {"key": "c", "textKey": "q3.c", "score": 10}, {"key": "d", "textKey": "q3.d", "score": 7}]'::jsonb, 'c', 10, 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop'),
('q4', 'workCapacity', 'mcq', 'q4.title', 'q4.text', '[{"key": "a", "textKey": "q4.a", "score": 2}, {"key": "b", "textKey": "q4.b", "score": 10}, {"key": "c", "textKey": "q4.c", "score": 5}, {"key": "d", "textKey": "q4.d", "score": 0}]'::jsonb, 'b', 10, null, null),
('q5', 'workCapacity', 'mcq', 'q5.title', 'q5.text', '[{"key": "a", "textKey": "q5.a", "score": 10}, {"key": "b", "textKey": "q5.b", "score": 5}, {"key": "c", "textKey": "q5.c", "score": 2}, {"key": "d", "textKey": "q5.d", "score": 0}]'::jsonb, 'a', 10, null, null),
('q6', 'honesty', 'mcq', 'q6.title', 'q6.text', '[{"key": "a", "textKey": "q6.a", "score": 0}, {"key": "b", "textKey": "q6.b", "score": 5}, {"key": "c", "textKey": "q6.c", "score": 10}, {"key": "d", "textKey": "q6.d", "score": 7}]'::jsonb, 'c', 10, null, null),
('q7', 'honesty', 'mcq', 'q7.title', 'q7.text', '[{"key": "a", "textKey": "q7.a", "score": 2}, {"key": "b", "textKey": "q7.b", "score": 10}, {"key": "c", "textKey": "q7.c", "score": 5}, {"key": "d", "textKey": "q7.d", "score": 7}]'::jsonb, 'b', 10, null, null),
('q8', 'growthMindset', 'likert', 'q8.title', 'q8.text', '[{"key": "a", "textKey": "q8.a", "score": 0}, {"key": "b", "textKey": "q8.b", "score": 3}, {"key": "c", "textKey": "q8.c", "score": 7}, {"key": "d", "textKey": "q8.d", "score": 10}]'::jsonb, 'd', 10, null, null),
('q9', 'teamCommitment', 'mcq', 'q9.title', 'q9.text', '[{"key": "a", "textKey": "q9.a", "score": 3}, {"key": "b", "textKey": "q9.b", "score": 10}, {"key": "c", "textKey": "q9.c", "score": 5}, {"key": "d", "textKey": "q9.d", "score": 0}]'::jsonb, 'b', 10, null, null),
('q10', 'adaptability', 'likert', 'q10.title', 'q10.text', '[{"key": "a", "textKey": "q10.a", "score": 0}, {"key": "b", "textKey": "q10.b", "score": 10}, {"key": "c", "textKey": "q10.c", "score": 7}, {"key": "d", "textKey": "q10.d", "score": 2}]'::jsonb, 'b', 10, null, null),
('q11', 'creativity', 'mcq', 'q11.title', 'q11.text', '[{"key": "a", "textKey": "q11.a", "score": 7}, {"key": "b", "textKey": "q11.b", "score": 5}, {"key": "c", "textKey": "q11.c", "score": 10}, {"key": "d", "textKey": "q11.d", "score": 8}]'::jsonb, 'c', 10, null, null);

-- Добавляем дополнительные вопросы для создания вариативности
INSERT INTO public.questions (question_id, module, type, title_key, text_key, options, correct_answer, max_score, image_a_url, image_b_url) VALUES
-- Дополнительные вопросы на системное мышление
('q1_alt1', 'systematicThinking', 'mcq', 'q1_alt1.title', 'q1_alt1.text', '[{"key": "a", "textKey": "q1_alt1.a", "score": 0}, {"key": "b", "textKey": "q1_alt1.b", "score": 5}, {"key": "c", "textKey": "q1_alt1.c", "score": 10}, {"key": "d", "textKey": "q1_alt1.d", "score": 2}]'::jsonb, 'c', 10, null, null),
('q2_alt1', 'systematicThinking', 'mcq', 'q2_alt1.title', 'q2_alt1.text', '[{"key": "a", "textKey": "q2_alt1.a", "score": 10}, {"key": "b", "textKey": "q2_alt1.b", "score": 3}, {"key": "c", "textKey": "q2_alt1.c", "score": 0}, {"key": "d", "textKey": "q2_alt1.d", "score": 5}]'::jsonb, 'a', 10, null, null),

-- Дополнительные вопросы на внимание к деталям с изображениями
('q3_alt1', 'attentionToDetail', 'image', 'q3_alt1.title', 'q3_alt1.text', '[{"key": "a", "textKey": "q3_alt1.a", "score": 3}, {"key": "b", "textKey": "q3_alt1.b", "score": 10}, {"key": "c", "textKey": "q3_alt1.c", "score": 5}, {"key": "d", "textKey": "q3_alt1.d", "score": 0}]'::jsonb, 'b', 10, 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop'),
('q3_alt2', 'attentionToDetail', 'image', 'q3_alt2.title', 'q3_alt2.text', '[{"key": "a", "textKey": "q3_alt2.a", "score": 7}, {"key": "b", "textKey": "q3_alt2.b", "score": 2}, {"key": "c", "textKey": "q3_alt2.c", "score": 0}, {"key": "d", "textKey": "q3_alt2.d", "score": 10}]'::jsonb, 'd', 10, 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=300&fit=crop'),

-- Дополнительные вопросы на рабочую способность
('q4_alt1', 'workCapacity', 'mcq', 'q4_alt1.title', 'q4_alt1.text', '[{"key": "a", "textKey": "q4_alt1.a", "score": 5}, {"key": "b", "textKey": "q4_alt1.b", "score": 0}, {"key": "c", "textKey": "q4_alt1.c", "score": 10}, {"key": "d", "textKey": "q4_alt1.d", "score": 3}]'::jsonb, 'c', 10, null, null),
('q5_alt1', 'workCapacity', 'mcq', 'q5_alt1.title', 'q5_alt1.text', '[{"key": "a", "textKey": "q5_alt1.a", "score": 2}, {"key": "b", "textKey": "q5_alt1.b", "score": 10}, {"key": "c", "textKey": "q5_alt1.c", "score": 7}, {"key": "d", "textKey": "q5_alt1.d", "score": 0}]'::jsonb, 'b', 10, null, null),

-- Дополнительные вопросы на честность
('q6_alt1', 'honesty', 'mcq', 'q6_alt1.title', 'q6_alt1.text', '[{"key": "a", "textKey": "q6_alt1.a", "score": 10}, {"key": "b", "textKey": "q6_alt1.b", "score": 0}, {"key": "c", "textKey": "q6_alt1.c", "score": 3}, {"key": "d", "textKey": "q6_alt1.d", "score": 7}]'::jsonb, 'a', 10, null, null),
('q7_alt1', 'honesty', 'mcq', 'q7_alt1.title', 'q7_alt1.text', '[{"key": "a", "textKey": "q7_alt1.a", "score": 5}, {"key": "b", "textKey": "q7_alt1.b", "score": 2}, {"key": "c", "textKey": "q7_alt1.c", "score": 10}, {"key": "d", "textKey": "q7_alt1.d", "score": 0}]'::jsonb, 'c', 10, null, null),

-- Дополнительные вопросы на креативность
('q11_alt1', 'creativity', 'mcq', 'q11_alt1.title', 'q11_alt1.text', '[{"key": "a", "textKey": "q11_alt1.a", "score": 5}, {"key": "b", "textKey": "q11_alt1.b", "score": 10}, {"key": "c", "textKey": "q11_alt1.c", "score": 8}, {"key": "d", "textKey": "q11_alt1.d", "score": 3}]'::jsonb, 'b', 10, null, null),
('q11_alt2', 'creativity', 'mcq', 'q11_alt2.title', 'q11_alt2.text', '[{"key": "a", "textKey": "q11_alt2.a", "score": 3}, {"key": "b", "textKey": "q11_alt2.b", "score": 7}, {"key": "c", "textKey": "q11_alt2.c", "score": 5}, {"key": "d", "textKey": "q11_alt2.d", "score": 10}]'::jsonb, 'd', 10, null, null);
