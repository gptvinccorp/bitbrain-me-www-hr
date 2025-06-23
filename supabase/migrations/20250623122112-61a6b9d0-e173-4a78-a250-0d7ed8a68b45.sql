
-- Создаем таблицу для хранения результатов кандидатов
CREATE TABLE public.candidates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  track TEXT NOT NULL CHECK (track IN ('sales', 'academy', 'creative')),
  answers JSONB NOT NULL,
  score INTEGER NOT NULL,
  module_scores JSONB NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Добавляем индексы для быстрого поиска
CREATE INDEX idx_candidates_email ON public.candidates(email);
CREATE INDEX idx_candidates_track ON public.candidates(track);
CREATE INDEX idx_candidates_score ON public.candidates(score);
CREATE INDEX idx_candidates_submitted_at ON public.candidates(submitted_at);

-- Настраиваем Row Level Security (публичный доступ для записи результатов)
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;

-- Политика для записи результатов (публичный доступ)
CREATE POLICY "Anyone can insert candidates" 
  ON public.candidates 
  FOR INSERT 
  WITH CHECK (true);

-- Политика для чтения результатов (только для авторизованных пользователей)
CREATE POLICY "Authenticated users can view candidates" 
  ON public.candidates 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Включаем real-time обновления для живого отображения новых результатов
ALTER TABLE public.candidates REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.candidates;
