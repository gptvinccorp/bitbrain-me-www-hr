import { Question } from '@/types/assessment';

export const questions: Question[] = [
  {
    id: 'q1',
    questionId: 'q1',
    module: 'systematicThinking',
    type: 'mcq',
    titleKey: 'q1.title',
    textKey: 'q1.text',
    options: [
      { key: 'a', textKey: 'q1.a', score: 2 },
      { key: 'b', textKey: 'q1.b', score: 10 },
      { key: 'c', textKey: 'q1.c', score: 5 },
      { key: 'd', textKey: 'q1.d', score: 0 }
    ],
    correctAnswer: 'b',
    maxScore: 10
  },
  {
    id: 'q2',
    questionId: 'q2',
    module: 'systematicThinking',
    type: 'mcq',
    titleKey: 'q2.title',
    textKey: 'q2.text',
    options: [
      { key: 'a', textKey: 'q2.a', score: 2 },
      { key: 'b', textKey: 'q2.b', score: 10 },
      { key: 'c', textKey: 'q2.c', score: 5 },
      { key: 'd', textKey: 'q2.d', score: 0 }
    ],
    correctAnswer: 'b',
    maxScore: 10
  },
  {
    id: 'q3',
    questionId: 'q3',
    module: 'attentionToDetail',
    type: 'image',
    titleKey: 'q3.title',
    textKey: 'q3.text',
    options: [
      { key: 'a', textKey: 'q3.a', score: 2 },
      { key: 'b', textKey: 'q3.b', score: 5 },
      { key: 'c', textKey: 'q3.c', score: 10 },
      { key: 'd', textKey: 'q3.d', score: 7 }
    ],
    correctAnswer: 'c',
    maxScore: 10,
    imageA: '/images/detail-test-a.jpg',
    imageB: '/images/detail-test-b.jpg'
  },
  {
    id: 'q4',
    questionId: 'q4',
    module: 'workCapacity',
    type: 'mcq',
    titleKey: 'q4.title',
    textKey: 'q4.text',
    options: [
      { key: 'a', textKey: 'q4.a', score: 2 },
      { key: 'b', textKey: 'q4.b', score: 10 },
      { key: 'c', textKey: 'q4.c', score: 5 },
      { key: 'd', textKey: 'q4.d', score: 0 }
    ],
    correctAnswer: 'b',
    maxScore: 10
  },
  {
    id: 'q5',
    questionId: 'q5',
    module: 'workCapacity',
    type: 'mcq',
    titleKey: 'q5.title',
    textKey: 'q5.text',
    options: [
      { key: 'a', textKey: 'q5.a', score: 10 },
      { key: 'b', textKey: 'q5.b', score: 5 },
      { key: 'c', textKey: 'q5.c', score: 2 },
      { key: 'd', textKey: 'q5.d', score: 0 }
    ],
    correctAnswer: 'a',
    maxScore: 10
  },
  {
    id: 'q6',
    questionId: 'q6',
    module: 'honesty',
    type: 'mcq',
    titleKey: 'q6.title',
    textKey: 'q6.text',
    options: [
      { key: 'a', textKey: 'q6.a', score: 0 },
      { key: 'b', textKey: 'q6.b', score: 5 },
      { key: 'c', textKey: 'q6.c', score: 10 },
      { key: 'd', textKey: 'q6.d', score: 7 }
    ],
    maxScore: 10
  },
  {
    id: 'q7',
    questionId: 'q7',
    module: 'honesty',
    type: 'mcq',
    titleKey: 'q7.title',
    textKey: 'q7.text',
    options: [
      { key: 'a', textKey: 'q7.a', score: 2 },
      { key: 'b', textKey: 'q7.b', score: 10 },
      { key: 'c', textKey: 'q7.c', score: 5 },
      { key: 'd', textKey: 'q7.d', score: 7 }
    ],
    maxScore: 10
  },
  {
    id: 'q8',
    questionId: 'q8',
    module: 'growthMindset',
    type: 'likert',
    titleKey: 'q8.title',
    textKey: 'q8.text',
    options: [
      { key: 'a', textKey: 'q8.a', score: 0 },
      { key: 'b', textKey: 'q8.b', score: 3 },
      { key: 'c', textKey: 'q8.c', score: 7 },
      { key: 'd', textKey: 'q8.d', score: 10 }
    ],
    maxScore: 10
  },
  {
    id: 'q9',
    questionId: 'q9',
    module: 'teamCommitment',
    type: 'mcq',
    titleKey: 'q9.title',
    textKey: 'q9.text',
    options: [
      { key: 'a', textKey: 'q9.a', score: 3 },
      { key: 'b', textKey: 'q9.b', score: 10 },
      { key: 'c', textKey: 'q9.c', score: 5 },
      { key: 'd', textKey: 'q9.d', score: 0 }
    ],
    maxScore: 10
  },
  {
    id: 'q10',
    questionId: 'q10',
    module: 'adaptability',
    type: 'likert',
    titleKey: 'q10.title',
    textKey: 'q10.text',
    options: [
      { key: 'a', textKey: 'q10.a', score: 0 },
      { key: 'b', textKey: 'q10.b', score: 10 },
      { key: 'c', textKey: 'q10.c', score: 7 },
      { key: 'd', textKey: 'q10.d', score: 2 }
    ],
    maxScore: 10
  },
  {
    id: 'q11',
    questionId: 'q11',
    module: 'creativity',
    type: 'mcq',
    titleKey: 'q11.title',
    textKey: 'q11.text',
    options: [
      { key: 'a', textKey: 'q11.a', score: 7 },
      { key: 'b', textKey: 'q11.b', score: 5 },
      { key: 'c', textKey: 'q11.c', score: 10 },
      { key: 'd', textKey: 'q11.d', score: 8 }
    ],
    maxScore: 10
  }
];
