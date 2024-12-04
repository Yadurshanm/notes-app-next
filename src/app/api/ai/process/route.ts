import { NextResponse } from 'next/server'
import { OpenAIClient, AzureKeyCredential } from '@azure/openai'

const client = new OpenAIClient(
  process.env.AZURE_OPENAI_ENDPOINT!,
  new AzureKeyCredential(process.env.AZURE_OPENAI_API_KEY!)
)

const deploymentId = process.env.AZURE_OPENAI_DEPLOYMENT_ID!

export async function POST(request: Request) {
  try {
    const { content, prompt, action } = await request.json()

    const messages = [
      { role: 'system', content: 'You are a helpful AI assistant that helps users with their notes.' },
      { role: 'user', content: `${prompt}\n\n${content}` }
    ]

    const response = await client.getChatCompletions(deploymentId, messages)
    const text = response.choices[0]?.message?.content || ''

    return NextResponse.json({ text })
  } catch (error) {
    console.error('AI processing error:', error)
    return NextResponse.json(
      { error: 'Failed to process with AI' },
      { status: 500 }
    )
  }
}