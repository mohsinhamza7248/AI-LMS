import { createClient } from '@/lib/supabase/server'
import { generateText } from 'ai'
import { google } from '@ai-sdk/google'
import { AiLog } from '@/types/database.types'

export async function queryAiTutor(userId: string, tenantId: string, query: string) {
  const supabase = await createClient()

  // Query Gemini without knowledge base per requirements
  try {
    const { text: answer } = await generateText({
      model: google('gemini-2.0-flash') as any,
      system: `You are an expert AI Tutor and experienced teacher. Always maintain a professional, encouraging, and educational tone. Focus your responses on answering the student's study-related questions.`,
      prompt: query,
    })

    // Log AI interaction
    await supabase.from('ai_logs').insert({
      user_id: userId,
      tenant_id: tenantId,
      query,
      response: answer,
      sources: '[]',
    } as any)

    return {
      answer,
      sources: []
    }
  } catch (error) {
    console.error('AI Service Error:', error)
    throw error
  }
}

export async function getAiLogs(userId: string, limit = 20) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('ai_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  return data || []
}
