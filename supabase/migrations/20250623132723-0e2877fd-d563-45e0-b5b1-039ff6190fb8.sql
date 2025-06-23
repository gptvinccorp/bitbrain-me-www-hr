
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can insert candidates" ON public.candidates;
DROP POLICY IF EXISTS "Authenticated users can view candidates" ON public.candidates;
DROP POLICY IF EXISTS "Allow public insert for candidates" ON public.candidates;
DROP POLICY IF EXISTS "Allow authenticated users to view candidates" ON public.candidates;
DROP POLICY IF EXISTS "Allow authenticated users to delete candidates" ON public.candidates;

-- Enable RLS
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;

-- Allow public insert for candidate registration (this is a public form)
CREATE POLICY "Enable public insert for candidates" 
  ON public.candidates 
  FOR INSERT 
  WITH CHECK (true);

-- Allow authenticated users to read all candidates (for admin panel)
CREATE POLICY "Enable authenticated read for candidates" 
  ON public.candidates 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Allow authenticated users to delete candidates (for admin panel)
CREATE POLICY "Enable authenticated delete for candidates" 
  ON public.candidates 
  FOR DELETE 
  TO authenticated
  USING (true);

-- Allow authenticated users to update candidates (for admin panel)
CREATE POLICY "Enable authenticated update for candidates" 
  ON public.candidates 
  FOR UPDATE 
  TO authenticated
  USING (true);
