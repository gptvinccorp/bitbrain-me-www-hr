
import { Candidate } from '@/types/assessment';
import { emailService } from '@/services/emailService';

export const sendEmailToCandidate = async (candidate: Candidate): Promise<{ success: boolean; error?: string }> => {
  return await emailService.sendCandidateEmail(candidate);
};
