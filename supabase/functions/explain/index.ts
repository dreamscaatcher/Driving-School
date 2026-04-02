import Anthropic from 'npm:@anthropic-ai/sdk'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Option {
  label: string
  text: string
}

interface MessageParam {
  role: 'user' | 'assistant'
  content: string
}

interface RequestBody {
  question: string
  options: Option[]
  correct: string
  explanation?: string
  law?: string
  userMessage: string
  history?: MessageParam[]
  userAnswer?: string
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body: RequestBody = await req.json()
    const { question, options, correct, explanation, law, userMessage, history, userAnswer } = body

    const correctOption = options.find((o) => o.label === correct)
    const userOption = userAnswer ? options.find((o) => o.label === userAnswer) : null

    const systemPrompt = `You are a concise German driving theory exam tutor. Help learners understand why answers are correct based on German traffic law (StVO, StVZO, FeV).

Question: ${question}
Options: ${options.map((o) => `${o.label}: ${o.text}`).join(' | ')}
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

    const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY') })

    const messages: MessageParam[] = [
      ...(history ?? []),
      { role: 'user', content: userMessage },
    ]

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system: systemPrompt,
      messages,
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''

    return new Response(JSON.stringify({ message: text }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
