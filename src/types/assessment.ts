
export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  track: 'sales' | 'academy' | 'creative';
  answers: Answer[];
  score: number;
  moduleScores: ModuleScore[];
  submittedAt: Date;
}

export interface Answer {
  questionId: string;
  selectedOption: string;
  timeSpent: number;
}

export interface Question {
  id: string;
  module: string;
  type: 'mcq' | 'likert' | 'image';
  titleKey: string;
  textKey: string;
  options: QuestionOption[];
  correctAnswer?: string;
  maxScore: number;
}

export interface QuestionOption {
  key: string;
  textKey: string;
  score: number;
}

export interface ModuleScore {
  module: string;
  score: number;
  maxScore: number;
}

export interface TestState {
  currentQuestion: number;
  answers: Answer[];
  timeRemaining: number;
  startTime: Date;
}
