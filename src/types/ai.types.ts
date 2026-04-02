export interface AiSource {
  title: string
  url: string
  domain: string
  snippet?: string
}

export interface AiMessage {
  role: 'user' | 'assistant'
  content: string
  sources: AiSource[]
  images?: { url: string; title: string; source: string }[]
  followUps?: string[]
  isVoice?: boolean
  timestamp?: Date
}

export interface AiResponse {
  answer: string
  sources: AiSource[]
  images?: { url: string; title: string; source: string }[]
  followUps: string[]
}
