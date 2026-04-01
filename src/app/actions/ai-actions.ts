'use server'

import { auth } from '@clerk/nextjs/server'
import { generateText } from 'ai'
import { google } from '@ai-sdk/google'

export async function chatWithTutor(query: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  try {
    const { text: answer } = await generateText({
      model: google('gemini-2.5-flash') as any,
      system: `You are an AI Tutor. Answer study questions concisely and professionally.`,
      prompt: query,
    })

    return {
      answer,
      sources: []
    }
  } catch (error) {
    console.error('AI Tutor Error:', error)
    throw error
  }
}

export async function generateVoiceResponse(transcript: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  try {
    const { text: answer } = await generateText({
      model: google('gemini-2.5-flash') as any,
      system: `You are an AI Tutor. Answer study questions concisely and professionally.`,
      prompt: transcript,
    })

    return {
      answer,
      sources: [],
      audioUrl: null
    }
  } catch (error) {
    console.error('Voice AI Error:', error)
    throw error
  }
}
