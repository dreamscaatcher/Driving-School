interface Env {
  ASSETS: { fetch(input: RequestInfo, init?: RequestInit): Promise<Response> }
  ANTHROPIC_API_KEY: string
}

interface Option {
  label: string
  text: string
}

interface ExplainBody {
  question: string
  options: Option[]
  correct: string
  explanation?: string
  law?: string
  userMessage: string
  history?: Array<{ role: 'user' | 'assistant'; content: string }>
  userAnswer?: string | null
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname === '/api/explain') {
      if (request.method === 'OPTIONS') {
        return new Response(null, {
          status: 200,
          headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'content-type' },
        })
      }
      if (request.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 })
      }

      const body: ExplainBody = await request.json()
      const { question, options, correct, explanation, law, userMessage, history, userAnswer } = body

      const correctOption = options.find(o => o.label === correct)
      const userOption = userAnswer ? options.find(o => o.label === userAnswer) : null

      const systemPrompt = `You are a concise German driving theory exam tutor. Help learners understand why answers are correct based on German traffic law (StVO, StVZO, FeV).

Question: ${question}
Options: ${options.map(o => `${o.label}: ${o.text}`).join(' | ')}
Correct answer: ${correct} — ${correctOption?.text ?? ''}
${userAnswer && userAnswer !== correct ? `User chose: ${userAnswer} — ${userOption?.text ?? ''} (incorrect)` : ''}
${law ? `Law reference: ${law}` : ''}
${explanation ? `Official explanation: ${explanation}` : ''}

Rules:
- Keep answers to 2-4 sentences
- Reference the specific law section when relevant
- Explain the underlying rule, not just the answer
- Flag common misconceptions when applicable
- Respond in English`

      const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': env.ANTHROPIC_API_KEY ?? '',
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 512,
          system: systemPrompt,
          messages: [...(history ?? []), { role: 'user', content: userMessage }],
        }),
      })

      const data = await anthropicRes.json() as { content?: Array<{ text: string }> }
      const message = data.content?.[0]?.text ?? 'No response received.'

      return new Response(JSON.stringify({ message }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return env.ASSETS.fetch(request)
  },
}
