
import { supabase } from '@/integrations/supabase/client';
import { Candidate, ModuleScore, Answer } from '@/types/assessment';

interface CandidateInsert {
  name: string;
  email: string;
  phone: string;
  track: 'sales' | 'academy' | 'creative';
  answers: any;
  score: number;
  module_scores: any;
  completion_time?: number;
}

// Helper function to validate and cast track type
function validateTrack(track: string): 'sales' | 'academy' | 'creative' {
  if (track === 'sales' || track === 'academy' || track === 'creative') {
    return track;
  }
  console.warn(`Invalid track value: ${track}, defaulting to 'sales'`);
  return 'sales';
}

// Helper function to safely parse JSON data
function safeParseJson<T>(data: any, fallback: T): T {
  try {
    if (typeof data === 'string') {
      return JSON.parse(data);
    }
    return data || fallback;
  } catch (error) {
    console.error('Error parsing JSON data:', error);
    return fallback;
  }
}

class SupabaseStorageService {
  async saveCandidate(candidate: Candidate, completionTime?: number): Promise<boolean> {
    try {
      console.log('Attempting to save candidate to Supabase:', candidate.name);
      
      // Prepare data for insertion
      const candidateData: CandidateInsert = {
        name: candidate.name,
        email: candidate.email,
        phone: candidate.phone,
        track: candidate.track,
        answers: JSON.stringify(candidate.answers),
        score: candidate.score,
        module_scores: JSON.stringify(candidate.moduleScores),
        completion_time: completionTime
      };

      console.log('Prepared candidate data:', candidateData);

      const { data, error } = await supabase
        .from('candidates')
        .insert([candidateData])
        .select();

      if (error) {
        console.error('Error saving candidate to Supabase:', error);
        return false;
      }

      console.log('Candidate saved successfully to Supabase:', data);
      return true;
    } catch (error) {
      console.error('Error saving candidate:', error);
      return false;
    }
  }

  async getAllCandidates(): Promise<Candidate[]> {
    try {
      console.log('Fetching candidates from Supabase...');
      
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error('Error fetching candidates from Supabase:', error);
        return [];
      }

      console.log('Fetched candidates from Supabase:', data?.length || 0);

      // Convert Supabase data to Candidate format with proper type casting
      return (data || []).map(item => ({
        id: item.id,
        name: item.name,
        email: item.email,
        phone: item.phone || '',
        track: validateTrack(item.track),
        answers: safeParseJson<Answer[]>(item.answers, []),
        score: item.score,
        moduleScores: safeParseJson<ModuleScore[]>(item.module_scores, []),
        submittedAt: new Date(item.submitted_at),
        completionTime: item.completion_time || undefined
      }));
    } catch (error) {
      console.error('Error loading candidates:', error);
      return [];
    }
  }

  async getCandidateById(id: string): Promise<Candidate | null> {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        console.error('Error fetching candidate:', error);
        return null;
      }

      return {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        track: validateTrack(data.track),
        answers: safeParseJson<Answer[]>(data.answers, []),
        score: data.score,
        moduleScores: safeParseJson<ModuleScore[]>(data.module_scores, []),
        submittedAt: new Date(data.submitted_at),
        completionTime: data.completion_time || undefined
      };
    } catch (error) {
      console.error('Error loading candidate:', error);
      return null;
    }
  }

  async deleteCandidateById(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('candidates')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting candidate:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting candidate:', error);
      return false;
    }
  }

  async clearAllCandidates(): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('candidates')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records

      if (error) {
        console.error('Error clearing candidates:', error);
        return false;
      }

      console.log('All candidates cleared from Supabase');
      return true;
    } catch (error) {
      console.error('Error clearing candidates:', error);
      return false;
    }
  }
}

export const supabaseStorageService = new SupabaseStorageService();
