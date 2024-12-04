import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import * as sdk from 'microsoft-cognitiveservices-speech-sdk'

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
    const tempPath = join('/tmp', `audio-${Date.now()}.wav`)
    await writeFile(tempPath, buffer)

    // Set up the speech configuration
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      process.env.AZURE_SPEECH_KEY!,
      process.env.AZURE_SPEECH_REGION!
    )
    
    // Create the audio configuration
    const audioConfig = sdk.AudioConfig.fromWavFileInput(tempPath)
    
    // Create the speech recognizer
    const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig)

    return new Promise((resolve) => {
      let transcription = ''

      recognizer.recognized = (s, e) => {
        if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
          transcription += e.result.text + ' '
        }
      }

      recognizer.recognizeOnceAsync(
        result => {
          recognizer.close()
          resolve(NextResponse.json({ text: transcription.trim() }))
        },
        error => {
          console.error('Speech recognition error:', error)
          recognizer.close()
          resolve(NextResponse.json(
            { error: 'Failed to transcribe audio' },
            { status: 500 }
          ))
        }
      )
    })
  } catch (error) {
    console.error('Transcription error:', error)
    return NextResponse.json(
      { error: 'Failed to transcribe audio' },
      { status: 500 }
    )
  }
}