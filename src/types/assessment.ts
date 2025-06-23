
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
  completionTime?: number; // in seconds
}

export interface Answer {
  questionId: string;
  selectedOption: string;
  timeSpent: number;
}

export interface Question {
  id: string;
  questionId: string; // Adding this property to match usage
  module: string;
  type: 'mcq' | 'likert' | 'image';
  titleKey: string;
  textKey: string;
  options: QuestionOption[];
  correctAnswer?: string;
  maxScore: number;
  imageA?: string; // URL изображения A
  imageB?: string; // URL изображения B
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
