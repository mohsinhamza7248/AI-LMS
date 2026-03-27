import 'dotenv/config'
import { generateText } from 'ai'
import { google } from '@ai-sdk/google'

async function testGemini() {
  try {
    const { text } = await generateText({
      model: google('gemini-1.5-flash') as any,
      prompt: 'Hello, are you working?',
    })
    console.log('Gemini response:', text)
  } catch (error) {
    console.error('Gemini error:', error)
  }
}

testGemini()
