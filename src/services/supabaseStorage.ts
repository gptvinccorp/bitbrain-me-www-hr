
import { supabase } from '@/integrations/supabase/client';
import { Candidate, ModuleScore } from '@/types/assessment';

interface CandidateInsert {
  name: string;
  email: string;
  phone: string;
  track: 'sales' | 'academy' | 'creative';
  answers: any;
  score: number;
  module_scores: any;
}

class SupabaseStorageService {
  async saveCandidate(candidate: Candidate): Promise<boolean> {
    try {
      // Prepare data for insertion
      const candidateData: CandidateInsert = {
        name: candidate.name,
        email: candidate.email,
        phone: candidate.phone,
        track: candidate.track,
        answers: candidate.answers,
        score: candidate.score,
        module_scores: candidate.moduleScores
      };

      const { error } = await supabase
        .from('candidates')
        .insert([candidateData]);

      if (error) {
        console.error('Error saving candidate to Supabase:', error);
        return false;
      }

      console.log('Candidate saved successfully to Supabase:', candidate.name);
      return true;
    } catch (error) {
      console.error('Error saving candidate:', error);
      return false;
    }
  }

  async getAllCandidates(): Promise<Candidate[]> {
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error('Error fetching candidates from Supabase:', error);
        return [];
      }

      // Convert Supabase data to Candidate format
      return (data || []).map(item => ({
        id: item.id,
        name: item.name,
        email: item.email,
        phone: item.phone,
        track: item.track,
        answers: item.answers,
        score: item.score,
        moduleScores: item.module_scores,
        submittedAt: new Date(item.submitted_at)
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
        phone: data.phone,
        track: data.track,
        answers: data.answers,
        score: data.score,
        moduleScores: data.module_scores,
        submittedAt: new Date(data.submitted_at)
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
