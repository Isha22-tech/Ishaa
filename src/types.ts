
export enum QuestionType {
  MCQ = "MCQ",
  ASSERTION_REASON = "Assertion & Reason",
  SHORT_ANSWER = "Short Answer",
  LONG_ANSWER = "Long Answer",
  TRUE_FALSE = "True/False"
}

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[]; // For MCQ
  marks: number;
  correctAnswer: string;
  explanation?: string;
}

export interface QuestionPaper {
  id: string;
  title: string;
  subject: string;
  board: string;
  grade: string;
  totalMarks: number;
  timeAllowed: string;
  sections: {
    title: string;
    questions: Question[];
  }[];
}

export interface PaperConfig {
  examType: 'academic' | 'competitive';
  subject: string;
  board: string;
  grade: string;
  totalMarks: number;
  customTopic?: string;
  questionDistribution: {
    type: QuestionType;
    count: number;
    marksPerQuestion: number;
  }[];
}
