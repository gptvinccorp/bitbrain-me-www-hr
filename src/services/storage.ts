
import { Candidate } from '@/types/assessment';

class StorageService {
  private readonly CANDIDATES_KEY = 'web3_candidates';

  saveCandidate(candidate: Candidate): void {
    try {
      const existingCandidates = this.getAllCandidates();
      const updatedCandidates = [...existingCandidates, candidate];
      localStorage.setItem(this.CANDIDATES_KEY, JSON.stringify(updatedCandidates));
      console.log('Candidate saved successfully:', candidate.name);
    } catch (error) {
      console.error('Error saving candidate:', error);
    }
  }

  getAllCandidates(): Candidate[] {
    try {
      const stored = localStorage.getItem(this.CANDIDATES_KEY);
      if (!stored) return [];
      
      const candidates = JSON.parse(stored);
      // Convert date strings back to Date objects
      return candidates.map((candidate: any) => ({
        ...candidate,
        submittedAt: new Date(candidate.submittedAt)
      }));
    } catch (error) {
      console.error('Error loading candidates:', error);
      return [];
    }
  }

  getCandidateById(id: string): Candidate | null {
    const candidates = this.getAllCandidates();
    return candidates.find(c => c.id === id) || null;
  }

  deleteCandidateById(id: string): boolean {
    try {
      const candidates = this.getAllCandidates();
      const filteredCandidates = candidates.filter(c => c.id !== id);
      localStorage.setItem(this.CANDIDATES_KEY, JSON.stringify(filteredCandidates));
      return true;
    } catch (error) {
      console.error('Error deleting candidate:', error);
      return false;
    }
  }

  clearAllCandidates(): void {
    try {
      localStorage.removeItem(this.CANDIDATES_KEY);
      console.log('All candidates cleared');
    } catch (error) {
      console.error('Error clearing candidates:', error);
    }
  }
}

export const storageService = new StorageService();
