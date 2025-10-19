export interface QuizQuestion {
  question_no: number;
  question_type: 'MCQ' | 'short_answer' | 'true_false';
  question:
    | {
        text: string;
        options?: string[];
      }
    | string;
  correct_answer: string;
  quizId: string;
  points?: number;
}

export interface CreateQuestion {
  id: string;
  type: 'MCQ' | 'short_answer' | 'true_false';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  points: number;
}

export interface Quiz {
  quizId?: string;
  title?: string;
  description?: string;
  timeLimit?: number;
  deadline?: string;
  questions: QuizQuestion[];
  totalPoints?: number;
}

export interface CreateQuiz {
  quizId?: string;
  title: string;
  description: string;
  group: string;
  duration: number;
  dueDate: string;
  questions: CreateQuestion[];
  totalPoints: number;
}


export interface Answer {
  questionId: number;
  answer: string | number;
}

export interface QuestionResult {
  question: QuizQuestion;
  userAnswer: string | number;
  correctAnswer: string | number;
  isCorrect: boolean;
  pointsEarned: number;
}

export interface QuizResult {
  totalScore: number;
  maxScore: number;
  percentage: number;
  timeSpent: number;
  questionResults: QuestionResult[];
}

export interface QuizAttemptProps {
  quiz?: Quiz;
  isPreview?: boolean;
}
