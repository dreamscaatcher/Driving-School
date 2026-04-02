import { Link } from 'react-router-dom'
import { CATEGORIES } from '../data/categories'
import questionsRaw from '../data/questions_final_v2.json'
import type { Question } from '../types/question'
import { useProgressStore } from '../stores/progressStore'
import { useAuthStore } from '../stores/authStore'
import ProgressBar from '../components/ui/ProgressBar'

const allQuestions = questionsRaw as Question[]

const countByCategory: Record<string, number> = {}
for (const q of allQuestions) {
  countByCategory[q.category] = (countByCategory[q.category] ?? 0) + 1
}

export default function Home() {
  const { practiceAnswers, examHistory, clearPractice } = useProgressStore()
  const { user, signOut } = useAuthStore()

  const totalAnswered = Object.keys(practiceAnswers).length
  const totalCorrect  = Object.values(practiceAnswers).filter(a => a.correct).length
  const lastExam      = examHistory[0] ?? null

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between">
        <div className="flex-1" />
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Führerschein Theorie</h1>
          <p className="text-sm text-gray-400 mt-0.5">German driving theory · 472 questions · v2</p>
        </div>
        <div className="flex-1 flex justify-end">
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 hidden sm:block truncate max-w-30">
                {user.email}
              </span>
              <button
                type="button"
                onClick={() => signOut()}
                className="text-xs font-medium text-gray-500 hover:text-red-500 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg px-3 py-1.5 transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-8">

        {/* Mode cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Practice */}
          <Link
            to="/quiz/all"
            className="group flex flex-col gap-2 rounded-2xl bg-blue-600 p-5 text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            <span className="text-3xl">📖</span>
            <h2 className="text-lg font-bold">Practice Mode</h2>
            <p className="text-sm text-blue-100">
              Go through all 472 questions at your own pace with immediate feedback.
            </p>
            {totalAnswered > 0 && (
              <p className="text-xs text-blue-200 mt-1">
                {totalAnswered} answered · {totalCorrect} correct
              </p>
            )}
          </Link>

          {/* Exam */}
          <Link
            to="/exam"
            className="group flex flex-col gap-2 rounded-2xl bg-indigo-600 p-5 text-white shadow-sm hover:bg-indigo-700 transition-colors"
          >
            <span className="text-3xl">📝</span>
            <h2 className="text-lg font-bold">Exam Mode</h2>
            <p className="text-sm text-indigo-100">
              30 random questions · 30 minutes · results at the end.
            </p>
            {lastExam && (
              <p className="text-xs text-indigo-200 mt-1">
                Last: {lastExam.score}/{lastExam.total} · {lastExam.passed ? 'PASS' : 'FAIL'}
              </p>
            )}
          </Link>
        </div>

        {/* Progress summary bar */}
        {totalAnswered > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-700">Practice Progress</h3>
              <button
                type="button"
                onClick={() => { if (confirm('Reset all practice progress?')) clearPractice() }}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                Reset
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <ProgressBar value={totalAnswered} max={allQuestions.length} />
              </div>
              <span className="text-xs text-gray-500 w-16 text-right">
                {totalAnswered} / {allQuestions.length}
              </span>
            </div>
            <div className="flex gap-4 text-xs text-gray-500">
              <span className="text-green-600 font-medium">✓ {totalCorrect} correct</span>
              <span className="text-red-500 font-medium">✗ {totalAnswered - totalCorrect} wrong</span>
              {totalAnswered > 0 && (
                <span className="ml-auto font-semibold text-gray-700">
                  {Math.round((totalCorrect / totalAnswered) * 100)}% accuracy
                </span>
              )}
            </div>
          </div>
        )}

        {/* Category grid */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Study by Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CATEGORIES.map((cat) => {
              const total     = countByCategory[cat.id] ?? 0
              const catAnswers = Object.entries(practiceAnswers)
                .filter(([id]) => allQuestions.find(q => q.id === Number(id))?.category === cat.id)
              const catDone    = catAnswers.length
              const catCorrect = catAnswers.filter(([, a]) => a.correct).length

              return (
                <Link
                  key={cat.id}
                  to={`/quiz/${encodeURIComponent(cat.id)}`}
                  className="group bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col gap-2 hover:shadow-md hover:border-blue-200 transition-all duration-150"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{cat.icon}</span>
                      <h3 className="text-sm font-semibold text-gray-800 leading-snug group-hover:text-blue-600 transition-colors">
                        {cat.label}
                      </h3>
                    </div>
                    <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5 shrink-0">
                      {total}
                    </span>
                  </div>

                  {/* Progress bar */}
                  {catDone > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                        <ProgressBar value={catDone} max={total} className="bg-blue-400" />
                      </div>
                      <span className="text-xs text-gray-400">{catCorrect}/{catDone}</span>
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
