import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import type { ExamSession } from '../stores/progressStore'
import { getCategoryById } from '../data/categories'
import questionsRaw from '../data/questions_final_v2.json'
import type { Question } from '../types/question'

const ALL_QUESTIONS = questionsRaw as Question[]

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}m ${s}s`
}

export default function Results() {
  const location = useLocation()
  const navigate = useNavigate()
  const session: ExamSession | undefined = location.state?.session

  const [showWrong, setShowWrong] = useState(false)

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4 p-4">
        <p className="text-gray-500 text-sm">No exam results found.</p>
        <Link to="/" className="text-blue-600 hover:underline text-sm">← Back to Home</Link>
      </div>
    )
  }

  const { score, total, passed, durationSeconds, answers } = session
  const pct       = Math.round((score / total) * 100)
  const wrongList = answers.filter(a => !a.correct)

  // Per-category breakdown
  const catMap: Record<string, { correct: number; total: number }> = {}
  for (const a of answers) {
    if (!catMap[a.category]) catMap[a.category] = { correct: 0, total: 0 }
    catMap[a.category].total++
    if (a.correct) catMap[a.category].correct++
  }
  const catEntries = Object.entries(catMap).sort((x, y) => x[0].localeCompare(y[0]))

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 text-center">
        <h1 className="text-xl font-bold text-gray-900">Exam Results</h1>
        <p className="text-xs text-gray-400 mt-0.5">{formatDuration(durationSeconds)} · {total} questions</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-6 flex flex-col gap-6">

        {/* Score card */}
        <div
          className={[
            'rounded-2xl p-6 text-center flex flex-col gap-3',
            passed ? 'bg-green-600 text-white' : 'bg-red-500 text-white',
          ].join(' ')}
        >
          <div className="text-5xl font-black">{pct}%</div>
          <div className="text-3xl font-bold">{score} / {total}</div>
          <div
            className={[
              'inline-block mx-auto rounded-full px-5 py-1 text-sm font-bold tracking-wide',
              passed ? 'bg-white/20' : 'bg-white/20',
            ].join(' ')}
          >
            {passed ? '✓ PASS' : '✗ FAIL'}
          </div>
          {!passed && (
            <p className="text-sm text-white/80">
              Need {Math.ceil(total * 0.8)} correct to pass (80%)
            </p>
          )}
        </div>

        {/* Category breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-gray-700">Breakdown by Category</h2>
          <div className="flex flex-col gap-2">
            {catEntries.map(([catId, stat]) => {
              const catInfo = getCategoryById(catId)
              const catPct  = Math.round((stat.correct / stat.total) * 100)
              return (
                <div key={catId} className="flex items-center gap-3">
                  <span className="text-base w-6 text-center shrink-0">{catInfo?.icon ?? '📋'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700 truncate">
                        {catInfo?.label ?? catId}
                      </span>
                      <span className="text-xs text-gray-400 ml-2 shrink-0">
                        {stat.correct}/{stat.total}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={[
                          'h-full rounded-full transition-all duration-700',
                          catPct >= 80 ? 'bg-green-500' : catPct >= 50 ? 'bg-amber-400' : 'bg-red-400',
                        ].join(' ')}
                        ref={el => {
                          if (el) el.style.width = `${catPct}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Wrong answers review */}
        {wrongList.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => setShowWrong(v => !v)}
              className="w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span>✗ {wrongList.length} wrong answer{wrongList.length !== 1 ? 's' : ''}</span>
              <span className="text-gray-400">{showWrong ? '▲' : '▼'}</span>
            </button>

            {showWrong && (
              <div className="border-t border-gray-100 divide-y divide-gray-50">
                {wrongList.map(a => {
                  const q = ALL_QUESTIONS.find(q => q.id === a.questionId)
                  if (!q) return null
                  const wrongOpt   = q.options.find(o => o.label === a.selected)
                  const correctOpt = q.options.find(o => o.label === q.correct)
                  return (
                    <div key={a.questionId} className="px-5 py-4 flex flex-col gap-2">
                      <p className="text-sm font-medium text-gray-800">{q.question}</p>
                      {a.selected && wrongOpt && (
                        <p className="text-xs text-red-600 flex gap-1.5">
                          <span className="shrink-0 font-bold">✗ {a.selected}.</span>
                          <span>{wrongOpt.text}</span>
                        </p>
                      )}
                      {!a.selected && (
                        <p className="text-xs text-gray-400 italic">Not answered</p>
                      )}
                      {correctOpt && (
                        <p className="text-xs text-green-700 flex gap-1.5">
                          <span className="shrink-0 font-bold">✓ {q.correct}.</span>
                          <span>{correctOpt.text}</span>
                        </p>
                      )}
                      {q.law && (
                        <p className="text-xs text-gray-400">{q.law}</p>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => navigate('/exam')}
            className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
          <Link
            to="/"
            className="block w-full py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold text-center hover:bg-gray-200 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
