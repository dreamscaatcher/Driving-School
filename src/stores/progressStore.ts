import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AnswerRecord {
  selected: string
  correct: boolean
  answeredAt: string
}

export interface ExamAnswer {
  questionId: number
  selected: string | null
  correct: boolean
  correctLabel: string
  category: string
}

export interface ExamSession {
  id: string
  answers: ExamAnswer[]
  score: number
  total: number
  passed: boolean
  durationSeconds: number
  completedAt: string
}

interface ProgressState {
  /** Practice mode: one record per question id */
  practiceAnswers: Record<number, AnswerRecord>
  /** Last 5 exam sessions */
  examHistory: ExamSession[]

  answerPractice: (questionId: number, selected: string, correct: boolean) => void
  saveExam: (session: ExamSession) => void
  clearPractice: () => void
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      practiceAnswers: {},
      examHistory: [],

      answerPractice: (questionId, selected, correct) =>
        set((state) => ({
          practiceAnswers: {
            ...state.practiceAnswers,
            [questionId]: { selected, correct, answeredAt: new Date().toISOString() },
          },
        })),

      saveExam: (session) =>
        set((state) => ({
          examHistory: [session, ...state.examHistory].slice(0, 5),
        })),

      clearPractice: () => set({ practiceAnswers: {} }),
    }),
    { name: 'driving-theory-progress' }
  )
)
