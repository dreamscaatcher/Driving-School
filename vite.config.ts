import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { ViteDevServer } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'ai-explain-dev',
        configureServer(server: ViteDevServer) {
          server.middlewares.use('/api/explain', async (req, res) => {
            if (req.method === 'OPTIONS') {
              res.writeHead(200, { 'Access-Control-Allow-Origin': '*' })
              res.end()
              return
            }
            if (req.method !== 'POST') {
              res.writeHead(405)
              res.end()
              return
            }

            const chunks: Buffer[] = []
            for await (const chunk of req) chunks.push(chunk as Buffer)
            const body = JSON.parse(Buffer.concat(chunks).toString())

            const { question, options, correct, explanation, law, userMessage, history, userAnswer } = body
            const correctOption = options.find((o: { label: string; text: string }) => o.label === correct)
            const userOption = userAnswer ? options.find((o: { label: string; text: string }) => o.label === userAnswer) : null

            const systemPrompt = `You are a concise German driving theory exam tutor. Help learners understand why answers are correct based on German traffic law (StVO, StVZO, FeV).

Question: ${question}
Options: ${options.map((o: { label: string; text: string }) => `${o.label}: ${o.text}`).join(' | ')}
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

            const anthropicBody = {
              model: 'claude-haiku-4-5-20251001',
              max_tokens: 512,
              system: systemPrompt,
              messages: [...(history ?? []), { role: 'user', content: userMessage }],
            }

            try {
              const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                  'x-api-key': env.ANTHROPIC_API_KEY ?? '',
                  'anthropic-version': '2023-06-01',
                  'content-type': 'application/json',
                },
                body: JSON.stringify(anthropicBody),
              })

              const data = await anthropicRes.json() as { content?: Array<{ text: string }> }
              const message = data.content?.[0]?.text ?? 'No response received.'

              res.writeHead(200, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ message }))
            } catch (err) {
              res.writeHead(500, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ error: String(err) }))
            }
          })
        },
      },
    ],
  }
})
