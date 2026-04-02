import { supabase } from './supabase'
import type { Option } from '../types/question'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ExplainParams {
  question: string
  options: Option[]
  correct: string
  explanation?: string
  law?: string
  userMessage: string
  history: Message[]
  userAnswer?: string | null
}

export async function callExplain(params: ExplainParams): Promise<string> {
  if (import.meta.env.DEV) {
    const res = await fetch('/api/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error((err as { error?: string }).error ?? `HTTP ${res.status}`)
    }
    const data = await res.json() as { message: string }
    return data.message
  }

  const { data, error } = await supabase.functions.invoke('explain', { body: params })
  if (error) throw error
  return (data as { message: string }).message
}
