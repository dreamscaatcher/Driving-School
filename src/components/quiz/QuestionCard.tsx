import type { Question } from '../../types/question'
import { getCategoryById } from '../../data/categories'
import OptionButton from './OptionButton'
import AIExplanation from './AIExplanation'
import ImageQuestion from './ImageQuestion'

interface Props {
  question: Question
  onAnswer: (label: string) => void
  answered: boolean
  selectedAnswer: string | null
  /** Hide category badge in exam mode */
  hideBadge?: boolean
}

export default function QuestionCard({
  question,
  onAnswer,
  answered,
  selectedAnswer,
  hideBadge = false,
}: Readonly<Props>) {
  const catInfo = getCategoryById(question.category)

  function getState(label: string): 'default' | 'selected' | 'correct' | 'incorrect' {
    if (!answered) {
      return selectedAnswer === label ? 'selected' : 'default'
    }
    if (label === question.correct) return 'correct'
    if (label === selectedAnswer) return 'incorrect'
    return 'default'
  }

  const wasCorrect = answered && selectedAnswer === question.correct

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-2xl w-full mx-auto">
      {/* Category badge */}
      {!hideBadge && catInfo && (
        <div className="mb-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide rounded-full px-3 py-1 bg-slate-100 text-slate-500">
            <span>{catInfo.icon}</span>
            <span>{catInfo.label}</span>
          </span>
        </div>
      )}

      {/* Sign / scenario image */}
      {question.image && <ImageQuestion image={question.image} />}

      {/* Question text */}
      <h2 className="text-base font-semibold text-gray-800 leading-snug mb-5">
        {question.question}
      </h2>

      {/* Options */}
      <div className="flex flex-col gap-3">
        {question.options.map((opt) => (
          <OptionButton
            key={opt.label}
            label={opt.label}
            text={opt.text}
            state={getState(opt.label)}
            onClick={() => onAnswer(opt.label)}
            disabled={answered}
          />
        ))}
      </div>

      {/* Post-answer feedback */}
      {answered && (
        <div className="mt-4 flex flex-col gap-2">
          {/* Result banner */}
          <div
            className={[
              'flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium',
              wasCorrect
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200',
            ].join(' ')}
          >
            <span className="text-base">{wasCorrect ? '✓' : '✗'}</span>
            <span>{wasCorrect ? 'Correct!' : `Wrong — correct answer is ${question.correct}`}</span>
          </div>

          {/* Law reference */}
          {question.law && (
            <p className="text-xs text-gray-400 text-right px-1">
              {question.law}
            </p>
          )}

          {/* Explanation if present */}
          {question.explanation && (
            <div className="flex gap-2 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-900">
              <span className="shrink-0 text-amber-500">ℹ</span>
              <p>{question.explanation}</p>
            </div>
          )}

          {/* AI Explanation */}
          <AIExplanation question={question} selectedAnswer={selectedAnswer} />
        </div>
      )}
    </div>
  )
}
