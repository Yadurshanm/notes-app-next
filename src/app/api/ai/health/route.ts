import { NextResponse } from 'next/server'
import { OpenAIClient, AzureKeyCredential } from '@azure/openai'

export async function GET() {
  try {
    const client = new OpenAIClient(
      process.env.AZURE_OPENAI_ENDPOINT!,
      new AzureKeyCredential(process.env.AZURE_OPENAI_API_KEY!)
    )

    // Try to list models to check connection
    await client.listModels()

    return NextResponse.json({ status: 'connected' })
  } catch (error) {
    console.error('GPT health check error:', error)
    return NextResponse.json(
      { status: 'error', message: 'Failed to connect to Azure OpenAI' },
      { status: 500 }
    )
  }
}