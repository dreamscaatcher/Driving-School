import { useState, useRef, useEffect } from 'react'
import { callExplain } from '../../lib/explain'
import type { Question } from '../../types/question'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Props {
  question: Question
  selectedAnswer: string | null
}

export default function AIExplanation({ question, selectedAnswer }: Readonly<Props>) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const didInit = useRef(false)

  useEffect(() => {
    if (open && !didInit.current) {
      didInit.current = true
      void send('Why is this the correct answer?')
    }
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function send(text: string) {
    const next: Message[] = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const reply = await callExplain({
        question: question.question,
        options: question.options,
        correct: question.correct,
        explanation: question.explanation,
        law: question.law,
        userMessage: text,
        history: messages,
        userAnswer: selectedAnswer,
      })
      setMessages([...next, { role: 'assistant', content: reply }])
    } catch {
      setError('Could not reach AI. Check your connection.')
    } finally {
      setLoading(false)
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = input.trim()
    if (trimmed && !loading) void send(trimmed)
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-3 w-full flex items-center justify-center gap-2 rounded-lg border border-violet-200 bg-violet-50 px-4 py-2.5 text-sm font-medium text-violet-700 hover:bg-violet-100 transition-colors"
      >
        <span>✦</span>
        <span>Ask AI to explain</span>
      </button>
    )
  }

  return (
    <div className="mt-3 rounded-xl border border-violet-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-violet-100 border-b border-violet-200">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-violet-800">
          <span>✦</span> AI Tutor
        </span>
        <button
          onClick={() => setOpen(false)}
          className="text-xs text-violet-500 hover:text-violet-700 transition-colors"
        >
          close
        </button>
      </div>

      {/* Messages */}
      <div className="bg-violet-50 px-4 py-3 flex flex-col gap-3 max-h-64 overflow-y-auto">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === 'user' ? 'flex justify-end' : ''}>
            {msg.role === 'user' ? (
              // Hide the auto-generated first message (always "Why is this correct?")
              i === 0 ? null : (
                <span className="inline-block bg-violet-600 text-white text-sm rounded-2xl rounded-tr-sm px-3 py-2 max-w-[85%]">
                  {msg.content}
                </span>
              )
            ) : (
              <p className="text-sm text-violet-900 leading-relaxed whitespace-pre-wrap">
                {msg.content}
              </p>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-1 pt-1">
            {[0, 150, 300].map((delay) => (
              <span
                key={delay}
                className="w-2 h-2 rounded-full bg-violet-400 animate-bounce"
                style={{ animationDelay: `${delay}ms` }}
              />
            ))}
          </div>
        )}

        {error && <p className="text-xs text-red-500">{error}</p>}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={onSubmit}
        className="flex gap-2 px-4 py-3 bg-white border-t border-violet-200"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a follow-up…"
          disabled={loading}
          className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-violet-400 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="px-3 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700 disabled:opacity-40 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  )
}
