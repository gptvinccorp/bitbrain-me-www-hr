
-- Включаем Row Level Security для таблицы candidates
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;

-- Создаем политику для публичного доступа к вставке данных
-- Поскольку это публичная система оценки, разрешаем всем вставлять данные
CREATE POLICY "Allow public insert to candidates" 
  ON public.candidates 
  FOR INSERT 
  WITH CHECK (true);

-- Создаем политику для публичного чтения данных
-- Это нужно для админ панели
CREATE POLICY "Allow public select from candidates" 
  ON public.candidates 
  FOR SELECT 
  USING (true);

-- Создаем политику для обновления данных (на случай если понадобится)
CREATE POLICY "Allow public update to candidates" 
  ON public.candidates 
  FOR UPDATE 
  USING (true);

-- Создаем политику для удаления данных (для админ панели)
CREATE POLICY "Allow public delete from candidates" 
  ON public.candidates 
  FOR DELETE 
  USING (true);
