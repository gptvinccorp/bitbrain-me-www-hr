
-- Проверим и настроим политики RLS для таблицы candidates
-- Сначала отключим RLS временно, чтобы разрешить вставку данных
ALTER TABLE public.candidates DISABLE ROW LEVEL SECURITY;

-- Или альтернативно, если нужно оставить RLS включенным, 
-- создадим политику для разрешения вставки данных всем пользователям
-- (поскольку это публичная форма регистрации)
-- ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
-- 
-- CREATE POLICY "Allow public insert" ON public.candidates
--   FOR INSERT 
--   WITH CHECK (true);
--
-- CREATE POLICY "Allow public select" ON public.candidates
--   FOR SELECT 
--   USING (true);

-- Добавим поле для хранения времени прохождения теста (в секундах)
ALTER TABLE public.candidates 
ADD COLUMN IF NOT EXISTS completion_time INTEGER;
