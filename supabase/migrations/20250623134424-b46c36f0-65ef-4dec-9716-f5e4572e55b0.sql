
-- Удаляем существующие политики
DROP POLICY IF EXISTS "Enable public insert for candidates" ON public.candidates;
DROP POLICY IF EXISTS "Enable authenticated read for candidates" ON public.candidates;
DROP POLICY IF EXISTS "Enable authenticated delete for candidates" ON public.candidates;
DROP POLICY IF EXISTS "Enable authenticated update for candidates" ON public.candidates;

-- Отключаем RLS временно для очистки
ALTER TABLE public.candidates DISABLE ROW LEVEL SECURITY;

-- Включаем RLS обратно
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;

-- Создаем новую политику для публичной вставки (регистрация кандидатов)
CREATE POLICY "Allow public candidate registration" 
  ON public.candidates 
  FOR INSERT 
  TO public
  WITH CHECK (true);

-- Создаем политику для чтения только аутентифицированными пользователями (админка)
CREATE POLICY "Allow authenticated read for admin" 
  ON public.candidates 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Создаем политику для удаления только аутентифицированными пользователями (админка)
CREATE POLICY "Allow authenticated delete for admin" 
  ON public.candidates 
  FOR DELETE 
  TO authenticated
  USING (true);

-- Создаем политику для обновления только аутентифицированными пользователями (админка)
CREATE POLICY "Allow authenticated update for admin" 
  ON public.candidates 
  FOR UPDATE 
  TO authenticated
  USING (true);
