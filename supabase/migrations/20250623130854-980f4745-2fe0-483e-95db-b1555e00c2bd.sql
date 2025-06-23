
-- Включаем RLS обратно для таблицы candidates
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;

-- Создаем политику для разрешения публичной вставки данных
-- (поскольку это публичная форма регистрации кандидатов)
CREATE POLICY "Allow public insert for candidates" 
  ON public.candidates
  FOR INSERT 
  WITH CHECK (true);

-- Создаем политику для чтения данных только аутентифицированными пользователями
-- (для админ панели)
CREATE POLICY "Allow authenticated users to view candidates" 
  ON public.candidates 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Создаем политику для удаления данных только аутентифицированными пользователями
-- (для админ панели)
CREATE POLICY "Allow authenticated users to delete candidates" 
  ON public.candidates 
  FOR DELETE 
  TO authenticated
  USING (true);
