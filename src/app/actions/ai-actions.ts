'use server'

import { auth } from '@clerk/nextjs/server'
import { generateText } from 'ai'
import { google } from '@ai-sdk/google'
import type { AiResponse, AiSource } from '@/types/ai.types'

// ─── Helpers ───────────────────────────────────────────────────────────────

const VISUAL_TOPICS = [
  'biology', 'anatomy', 'heart', 'cell', 'photosynthesis', 'dna', 'gene',
  'physics', 'circuit', 'wave', 'force', 'diagram', 'structure', 'map',
  'geography', 'solar system', 'planet', 'atom', 'molecule', 'skeleton',
  'muscle', 'brain', 'ecosystem', 'food chain', 'water cycle', 'human body',
  'organ', 'chart', 'graph', 'flow', 'process', 'cycle', 'system', 'model',
]

function shouldGenerateImage(query: string): boolean {
  // Always return true so it always tries to fetch visual context for the modern UI
  return true
}

async function getVisualResources(query: string) {
  const images: { url: string, title: string, source: string }[] = []
  
  try {
    const res = await fetch(`https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=4&pithumbsize=400`)
    const data = await res.json()
    if (data.query && data.query.pages) {
      const pages = Object.values(data.query.pages) as any[]
      pages.forEach(p => {
        if (p.thumbnail && p.thumbnail.source) {
          images.push({
            url: p.thumbnail.source,
            title: p.title,
            source: 'Wikipedia'
          })
        }
      })
    }
  } catch (err) {
    // Ignore fetch errors
  }

  // Fallback to placeholder if no images found
  if (images.length === 0) {
    const sanitized = encodeURIComponent(query.slice(0, 40))
    images.push({
      url: `https://quickchart.io/wordcloud?text=${sanitized}&width=400&height=300&backgroundColor=%230f172a&fontColor=%23f97316&format=png`,
      title: 'Concept Cloud',
      source: 'QuickChart'
    })
  }

  return images.slice(0, 4)
}

function parseSourcesFromText(text: string): AiSource[] {
  const sources: AiSource[] = []
  const seen = new Set<string>()

  // Match markdown links: [Title](URL)
  const mdLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g
  let match: RegExpExecArray | null
  while ((match = mdLinkRegex.exec(text)) !== null) {
    const [, title, url] = match
    if (!seen.has(url)) {
      seen.add(url)
      try {
        const domain = new URL(url).hostname.replace('www.', '')
        sources.push({ title, url, domain })
      } catch { /* skip invalid urls */ }
    }
  }

  // Match bare URLs
  const bareUrlRegex = /(?<!\()(https?:\/\/[^\s\)\]]+)/g
  while ((match = bareUrlRegex.exec(text)) !== null) {
    const url = match[1]
    if (!seen.has(url)) {
      seen.add(url)
      try {
        const domain = new URL(url).hostname.replace('www.', '')
        sources.push({ title: domain, url, domain })
      } catch { /* skip */ }
    }
  }

  return sources.slice(0, 6)
}

// ─── Prompt Enhancement ────────────────────────────────────────────────────

async function enhancePrompt(rawQuery: string): Promise<string> {
  // Only enhance short/vague queries (< 6 words)
  const wordCount = rawQuery.trim().split(/\s+/).length
  if (wordCount >= 6) return rawQuery

  try {
    const { text } = await generateText({
      model: google('gemini-2.0-flash') as any,
      system: `You are a query optimizer for an AI educational tutor. 
Convert brief or vague student queries into detailed, structured educational prompts.
Rules:
- Keep it under 60 words
- Include: definition, key concepts, real-world examples, and ask for citations
- Do NOT answer the question, just reformulate it
- Output only the reformulated prompt, no preamble`,
      prompt: `Reformulate this student query: "${rawQuery}"`,
    })
    return text.trim() || rawQuery
  } catch {
    return rawQuery
  }
}

// ─── Main Chat Action ──────────────────────────────────────────────────────

export async function chatWithTutor(query: string): Promise<AiResponse> {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const enhancedQuery = await enhancePrompt(query)
  const needsImage = shouldGenerateImage(query)

  const systemPrompt = `You are an expert AI Tutor — knowledgeable, clear, and engaging. 

ALWAYS structure your response using this exact format in markdown:

# [Topic Title]

## Explanation
Provide a clear, thorough explanation of the topic.

## Key Points
- Use bullet points for the most important concepts
- Include 4–6 key points

## Examples
Give 1–2 concrete, relatable real-world examples.

## Sources
List 3–5 real, credible sources relevant to this topic. Format each as:
- [Source Title](https://actual-url.com) — brief description

Rules:
- Use inline citation markers like [1], [2] where relevant in your text
- Be encouraging and educational in tone
- If the topic benefits from a visual, mention "See the visual aid below" in the Explanation section
- Keep responses focused and student-friendly
- Always include the Sources section with real URLs (Wikipedia, Khan Academy, britannica.com, etc.)`

  const { text: answer } = await generateText({
    model: google('gemini-2.5-flash') as any,
    system: systemPrompt,
    prompt: enhancedQuery,
  })

  const sources = parseSourcesFromText(answer)

  // Only show images if the query was factual enough to generate actual sources.
  // This prevents images and placeholder cards from appearing on conversational queries like "hello".
  const images = sources.length > 0 ? await getVisualResources(query) : undefined

  const followUps = [
    `📝 Quiz me on ${query.split(' ').slice(0, 3).join(' ')}`,
    '🔍 Explain this in more depth',
    '💡 Give me more examples',
    '🧪 How is this applied in real life?',
  ]

  return { answer, sources, images, followUps }
}

// ─── Voice Response ────────────────────────────────────────────────────────

export async function generateVoiceResponse(transcript: string): Promise<AiResponse> {
  return chatWithTutor(transcript)
}
