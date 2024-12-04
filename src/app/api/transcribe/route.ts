import { NextResponse } from 'next/server'
import { OpenAIClient, AzureKeyCredential } from '@azure/openai'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

// Initialize Azure OpenAI client for backup transcription
const client = new OpenAIClient(
  process.env.AZURE_OPENAI_ENDPOINT!,
  new AzureKeyCredential(process.env.AZURE_OPENAI_API_KEY!)
)

export async function POST(request: Request) {
  try {
    const data = await request.formData()
    const audio: File | null = data.get('audio') as unknown as File

    if (!audio) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      )
    }

    // Save the audio file temporarily
    const bytes = await audio.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const tempPath = join('/tmp', `audio-${Date.now()}.webm`)
    await writeFile(tempPath, buffer)

    try {
      // Try using local Whisper first
      const { stdout } = await execAsync(`whisper ${tempPath} --model base --output_format txt`)
      const text = stdout.trim()
      
      return NextResponse.json({ text })
    } catch (whisperError) {
      console.error('Local Whisper failed, falling back to Azure:', whisperError)
      
      // Fallback to Azure OpenAI Whisper
      const response = await client.getAudioTranscription(
        process.env.AZURE_OPENAI_WHISPER_DEPLOYMENT_ID!,
        buffer
      )
      
      return NextResponse.json({ text: response.text })
    }
  } catch (error) {
    console.error('Transcription error:', error)
    return NextResponse.json(
      { error: 'Failed to transcribe audio' },
      { status: 500 }
    )
  }
}