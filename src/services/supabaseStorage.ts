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
      console.log('=== SAVING CANDIDATE TO SUPABASE ===');
      console.log('Candidate name:', candidate.name);
      console.log('Candidate email:', candidate.email);
      console.log('Candidate track:', candidate.track);
      console.log('Candidate score:', candidate.score);
      console.log('Module scores:', candidate.moduleScores);
      console.log('Answers count:', candidate.answers?.length || 0);
      console.log('Completion time:', completionTime);
      
      // Validate required fields
      if (!candidate.name || !candidate.email || !candidate.track) {
        console.error('Missing required fields:', {
          name: !!candidate.name,
          email: !!candidate.email,
          track: !!candidate.track
        });
        return false;
      }

      // Prepare data for insertion
      const candidateData: CandidateInsert = {
        name: candidate.name.trim(),
        email: candidate.email.trim().toLowerCase(),
        phone: candidate.phone?.trim() || '',
        track: validateTrack(candidate.track),
        answers: candidate.answers || [],
        score: Math.round(candidate.score || 0),
        module_scores: candidate.moduleScores || [],
        completion_time: completionTime
      };

      console.log('Prepared candidate data for insertion:', candidateData);

      // Check if we can connect to Supabase
      const { data: testData, error: testError } = await supabase
        .from('candidates')
        .select('count', { count: 'exact', head: true });

      if (testError) {
        console.error('Cannot connect to Supabase:', testError);
        return false;
      }

      console.log('Supabase connection test successful, current records count:', testData);

      // Insert the candidate data
      const { data, error } = await supabase
        .from('candidates')
        .insert([candidateData])
        .select('*');

      if (error) {
        console.error('=== SUPABASE INSERT ERROR ===');
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error details:', error.details);
        console.error('Error hint:', error.hint);
        console.error('Full error object:', error);
        
        // Check for specific RLS errors
        if (error.message.includes('row-level security') || error.message.includes('policy')) {
          console.error('RLS POLICY ERROR: The insert is being blocked by Row Level Security policies');
        }
        
        return false;
      }

      if (!data || data.length === 0) {
        console.error('No data returned after insert, but no error thrown');
        return false;
      }

      console.log('=== CANDIDATE SAVED SUCCESSFULLY ===');
      console.log('Inserted data:', data[0]);
      console.log('Candidate ID:', data[0].id);
      return true;
      
    } catch (error: any) {
      console.error('=== CRITICAL ERROR SAVING CANDIDATE ===');
      console.error('Error type:', typeof error);
      console.error('Error message:', error?.message || 'Unknown error');
      console.error('Error stack:', error?.stack);
      console.error('Full error object:', error);
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
