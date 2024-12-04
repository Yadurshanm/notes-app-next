import { NextResponse } from 'next/server'
import * as sdk from 'microsoft-cognitiveservices-speech-sdk'

export async function GET() {
  try {
    // Try to create a speech config to verify credentials
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      process.env.AZURE_SPEECH_KEY!,
      process.env.AZURE_SPEECH_REGION!
    )

    // If we get here, the config is valid
    return NextResponse.json({ status: 'connected' })
  } catch (error) {
    console.error('Speech health check error:', error)
    return NextResponse.json(
      { status: 'error', message: 'Failed to connect to Azure Speech Service' },
      { status: 500 }
    )
  }
}