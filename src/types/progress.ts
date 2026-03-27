export interface QuestionResult {
  questionId: number
  answeredCorrectly: boolean
  answeredAt: string
}

export interface CategoryProgress {
  categoryId: string
  totalQuestions: number
  answeredCorrectly: number
  answeredTotal: number
  lastStudied?: string
}

export interface Streak {
  current: number
  longest: number
  lastStudiedDate: string
}

export interface ExamResult {
  id: string
  score: number
  total: number
  passed: boolean
  durationSeconds: number
  takenAt: string
}

export interface Score {
  categoryId: string
  correct: number
  total: number
  percentage: number
}
