import { useState, useRef, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import questionsRaw from '../data/questions_final_v2.json'
import type { Question } from '../types/question'
import { CATEGORIES, getCategoryById } from '../data/categories'
import QuestionCard from '../components/quiz/QuestionCard'
import { useProgressStore } from '../stores/progressStore'
import { useAuthStore } from '../stores/authStore'

const ALL_QUESTIONS = questionsRaw as Question[]

export default function Quiz() {
  const { category } = useParams<{ category: string }>()
  const navigate = useNavigate()

  const categoryId = decodeURIComponent(category ?? '')
  const isAll = categoryId === 'all'

  const [activeCat, setActiveCat] = useState<string>(isAll ? 'all' : categoryId)

  const questions: Question[] = activeCat === 'all'
    ? ALL_QUESTIONS
    : ALL_QUESTIONS.filter(q => q.category === activeCat)

  const catInfo = activeCat !== 'all' ? getCategoryById(activeCat) : null

  const { practiceAnswers, answerPractice } = useProgressStore()
  const { user, signOut } = useAuthStore()

  // Find first unanswered question to start from
  const firstUnanswered = questions.findIndex(q => !practiceAnswers[q.id])
  const [qIndex, setQIndex] = useState(() => Math.max(0, firstUnanswered))

  const [selected, setSelected] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)

  const progressRef = useRef<HTMLDivElement>(null)

  // Reset local state when question changes
  useEffect(() => {
    const existing = practiceAnswers[questions[qIndex]?.id]
    if (existing) {
      setSelected(existing.selected)
      setAnswered(true)
    } else {
      setSelected(null)
      setAnswered(false)
    }
  }, [qIndex, activeCat]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.width = `${((qIndex + 1) / questions.length) * 100}%`
    }
  }, [qIndex, questions.length])

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4 p-4">
        <p className="text-gray-500">No questions found for this category.</p>
        <Link to="/" className="text-blue-600 hover:underline text-sm">← Back to Home</Link>
      </div>
    )
  }

  const currentQuestion = questions[qIndex]

  function handleAnswer(label: string) {
    if (answered) return
    const isCorrect = label === currentQuestion.correct
    setSelected(label)
    setAnswered(true)
    answerPractice(currentQuestion.id, label, isCorrect)
  }

  function goTo(index: number) {
    if (index < 0 || index >= questions.length) return
    setQIndex(index)
  }

  function handleCategoryChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newCat = e.target.value
    setActiveCat(newCat)
    setQIndex(0)
    navigate(newCat === 'all' ? '/quiz/all' : `/quiz/${encodeURIComponent(newCat)}`, { replace: true })
  }

  const answeredCount = questions.filter(q => practiceAnswers[q.id]).length
  const correctCount  = questions.filter(q => practiceAnswers[q.id]?.correct).length

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-8">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <Link to="/" className="text-sm text-gray-400 hover:text-gray-600 transition-colors shrink-0">
          ← Home
        </Link>

        {/* Category selector */}
        <select
          value={activeCat}
          onChange={handleCategoryChange}
          aria-label="Filter by category"
          className="flex-1 min-w-0 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-400"
        >
          <option value="all">All Questions ({ALL_QUESTIONS.length})</option>
          {CATEGORIES.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.icon} {cat.label} ({ALL_QUESTIONS.filter(q => q.category === cat.id).length})
            </option>
          ))}
        </select>

        {/* Counter */}
        <span className="text-sm font-medium text-gray-500 shrink-0">
          {qIndex + 1} <span className="text-gray-300">/</span> {questions.length}
        </span>

        {/* Sign out */}
        {user && (
          <button
            type="button"
            onClick={() => void signOut()}
            className="text-xs font-medium text-gray-400 hover:text-red-500 shrink-0 transition-colors"
          >
            Sign out
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-100">
        <div
          ref={progressRef}
          className="h-full bg-blue-500 transition-all duration-300"
        />
      </div>

      {/* Category sub-info */}
      {catInfo && (
        <div className="text-center py-2">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            {catInfo.icon} {catInfo.label}
          </p>
        </div>
      )}

      {/* Stats pill */}
      {answeredCount > 0 && (
        <div className="flex justify-center pt-2">
          <span className="inline-flex gap-3 text-xs bg-white border border-gray-100 rounded-full px-4 py-1.5 shadow-sm">
            <span className="text-green-600 font-medium">✓ {correctCount}</span>
            <span className="text-red-500 font-medium">✗ {answeredCount - correctCount}</span>
            <span className="text-gray-400">{answeredCount}/{questions.length} done</span>
          </span>
        </div>
      )}

      {/* Question card */}
      <div className="flex-1 flex flex-col items-center justify-start px-4 pt-4">
        <QuestionCard
          question={currentQuestion}
          onAnswer={handleAnswer}
          answered={answered}
          selectedAnswer={selected}
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

          {answered && qIndex < questions.length - 1 && (
            <button
              type="button"
              onClick={() => goTo(qIndex + 1)}
              className={[
                'flex-1 py-3 rounded-xl text-sm font-medium text-white transition-colors',
                selected === currentQuestion.correct
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-blue-600 hover:bg-blue-700',
              ].join(' ')}
            >
              Next →
            </button>
          )}

          {answered && qIndex === questions.length - 1 && (
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 py-3 rounded-xl bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
            >
              Finish ✓
            </button>
          )}

          {!answered && (
            <button
              type="button"
              onClick={() => goTo(qIndex + 1)}
              disabled={qIndex === questions.length - 1}
              className="flex-1 py-3 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Skip →
            </button>
          )}
        </div>

        {/* Jump to unanswered */}
        {answeredCount < questions.length && (
          <button
            type="button"
            onClick={() => {
              const next = questions.findIndex((q, i) => i > qIndex && !practiceAnswers[q.id])
              const fallback = questions.findIndex(q => !practiceAnswers[q.id])
              goTo(next >= 0 ? next : fallback)
            }}
            className="mt-3 text-xs text-blue-500 hover:text-blue-700 transition-colors"
          >
            Jump to next unanswered →
          </button>
        )}
      </div>
    </div>
  )
}
