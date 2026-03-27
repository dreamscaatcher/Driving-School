import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import questionsRaw from '../data/questions_final_v2.json'
import type { Question } from '../types/question'
import { useProgressStore } from '../stores/progressStore'
import type { ExamAnswer, ExamSession } from '../stores/progressStore'
import QuestionCard from '../components/quiz/QuestionCard'

const ALL_QUESTIONS = questionsRaw as Question[]
const EXAM_COUNT    = 30
const EXAM_MINUTES  = 30

function pickRandom(questions: Question[], n: number): Question[] {
  const shuffled = [...questions].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, n)
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

export default function ExamMode() {
  const navigate = useNavigate()
  const { saveExam } = useProgressStore()

  // Questions are fixed for the session
  const [questions]   = useState<Question[]>(() => pickRandom(ALL_QUESTIONS, EXAM_COUNT))
  const [qIndex, setQIndex]     = useState(0)
  // selected answer per question index (null = unanswered)
  const [selections, setSelections] = useState<(string | null)[]>(() => Array(EXAM_COUNT).fill(null))
  const [timeLeft, setTimeLeft] = useState(EXAM_MINUTES * 60)
  const [started, setStarted]   = useState(false)
  const [finished, setFinished] = useState(false)
  const startTimeRef = useRef<number>(0)
  const progressRef  = useRef<HTMLDivElement>(null)

  const handleFinish = useCallback((finalSelections: (string | null)[], elapsed: number) => {
    if (finished) return
    setFinished(true)

    const answers: ExamAnswer[] = questions.map((q, i) => ({
      questionId:   q.id,
      selected:     finalSelections[i],
      correct:      finalSelections[i] === q.correct,
      correctLabel: q.correct,
      category:     q.category,
    }))

    const score = answers.filter(a => a.correct).length

    const session: ExamSession = {
      id:              crypto.randomUUID(),
      answers,
      score,
      total:           EXAM_COUNT,
      passed:          score >= Math.ceil(EXAM_COUNT * 0.8),
      durationSeconds: elapsed,
      completedAt:     new Date().toISOString(),
    }

    saveExam(session)
    navigate('/results', { state: { session } })
  }, [finished, questions, saveExam, navigate])

  // Timer
  useEffect(() => {
    if (!started || finished) return
    const id = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(id)
          const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000)
          handleFinish(selections, elapsed)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [started, finished, selections, handleFinish])

  // Progress bar
  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.width = `${((qIndex + 1) / EXAM_COUNT) * 100}%`
    }
  }, [qIndex])

  function handleSelect(label: string) {
    if (finished) return
    setSelections(prev => {
      const next = [...prev]
      next[qIndex] = label
      return next
    })
  }

  function goTo(index: number) {
    if (index < 0 || index >= EXAM_COUNT) return
    setQIndex(index)
  }

  const answeredCount = selections.filter(s => s !== null).length
  const isUrgent = timeLeft <= 5 * 60 // last 5 minutes

  if (!started) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md w-full text-center flex flex-col gap-5">
          <div className="text-5xl">📝</div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Exam Mode</h1>
            <p className="text-sm text-gray-500 mt-1">Simulate the official theory test</p>
          </div>
          <ul className="text-sm text-gray-600 text-left flex flex-col gap-2 bg-slate-50 rounded-xl p-4">
            <li>📋 <strong>{EXAM_COUNT}</strong> random questions from all categories</li>
            <li>⏱️ <strong>{EXAM_MINUTES} minutes</strong> time limit</li>
            <li>🔕 No feedback until you submit</li>
            <li>✅ Pass: answer <strong>80% correctly</strong> ({Math.ceil(EXAM_COUNT * 0.8)}/{EXAM_COUNT})</li>
          </ul>
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => { startTimeRef.current = Date.now(); setStarted(true) }}
              className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
            >
              Start Exam
            </button>
            <Link
              to="/"
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-8">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">
          Question {qIndex + 1} / {EXAM_COUNT}
        </span>

        {/* Timer */}
        <span
          className={[
            'font-mono text-sm font-bold px-3 py-1 rounded-lg',
            isUrgent ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-700',
          ].join(' ')}
        >
          ⏱ {formatTime(timeLeft)}
        </span>

        <span className="text-sm text-gray-400">
          {answeredCount}/{EXAM_COUNT} answered
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-100">
        <div ref={progressRef} className="h-full bg-indigo-500 transition-all duration-300" />
      </div>

      {/* Question dots */}
      <div className="flex justify-center flex-wrap gap-1.5 px-4 py-3">
        {questions.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to question ${i + 1}`}
            className={[
              'w-7 h-7 rounded-full text-xs font-semibold transition-colors',
              i === qIndex
                ? 'bg-indigo-600 text-white'
                : selections[i] !== null
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'bg-gray-100 text-gray-400',
            ].join(' ')}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Question card (no badge, no immediate feedback) */}
      <div className="flex-1 flex flex-col items-center px-4 pt-2">
        <QuestionCard
          question={questions[qIndex]}
          onAnswer={handleSelect}
          answered={false}
          selectedAnswer={selections[qIndex]}
          hideBadge
        />

        {/* Navigation */}
        <div className="flex items-center gap-3 mt-5 w-full max-w-2xl">
          <button
            type="button"
            onClick={() => goTo(qIndex - 1)}
            disabled={qIndex === 0}
            className="flex-1 py-3 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>

          {qIndex < EXAM_COUNT - 1 ? (
            <button
              type="button"
              onClick={() => goTo(qIndex + 1)}
              className="flex-1 py-3 rounded-xl bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
            >
              Next →
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000)
                handleFinish(selections, elapsed)
              }}
              className="flex-1 py-3 rounded-xl bg-green-600 text-sm font-medium text-white hover:bg-green-700 transition-colors"
            >
              Submit Exam ✓
            </button>
          )}
        </div>

        {/* Submit early */}
        {answeredCount === EXAM_COUNT && qIndex < EXAM_COUNT - 1 && (
          <button
            type="button"
            onClick={() => {
              const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000)
              handleFinish(selections, elapsed)
            }}
            className="mt-3 text-sm text-green-600 font-medium hover:text-green-800 transition-colors"
          >
            All answered — Submit now ✓
          </button>
        )}
      </div>
    </div>
  )
}
