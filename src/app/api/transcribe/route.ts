import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

// Path to whisper.cpp executable and model
const WHISPER_PATH = process.env.WHISPER_PATH || '/usr/local/bin/whisper'
const MODEL_PATH = process.env.WHISPER_MODEL_PATH || '/usr/local/share/whisper/models/ggml-base.bin'

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
      // Convert WebM to WAV using ffmpeg
      const wavPath = tempPath.replace('.webm', '.wav')
      await execAsync(`ffmpeg -i ${tempPath} -ar 16000 -ac 1 -c:a pcm_s16le ${wavPath}`)

      // Transcribe using whisper.cpp
      const { stdout } = await execAsync(
        `${WHISPER_PATH} -m ${MODEL_PATH} -f ${wavPath} -otxt -l auto`
      )

      // Clean up temporary files
      await execAsync(`rm ${tempPath} ${wavPath}`)

      return NextResponse.json({ text: stdout.trim() })
    } catch (error) {
      console.error('Transcription error:', error)
      return NextResponse.json(
        { error: 'Failed to transcribe audio' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Request handling error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}