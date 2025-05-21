# Azure OpenAI Setup Guide

## Prerequisites
1. Azure account with access to Azure OpenAI service
2. Azure OpenAI service instance

## Steps to Set Up Azure OpenAI

### 1. Create Azure OpenAI Service
1. Go to Azure Portal (https://portal.azure.com)
2. Search for "Azure OpenAI"
3. Click "Create"
4. Fill in the required details:
   - Subscription
   - Resource group
   - Region
   - Name
   - Pricing tier

### 2. Deploy GPT-4 Model
1. Go to your Azure OpenAI resource
2. Click on "Model deployments"
3. Click "Create new deployment"
4. Select "GPT-4" as the model
5. Give it a deployment name (e.g., "gpt4")
   - This name will be your `AZURE_OPENAI_DEPLOYMENT_ID`
6. Set your desired capacity

### 3. Deploy Whisper Model
Note: Azure OpenAI doesn't have a separate Whisper deployment. Instead, we'll use the Speech service for audio transcription.

1. Go to Azure Portal
2. Search for "Speech services"
3. Click "Create"
4. Fill in the required details:
   - Subscription
   - Resource group
   - Region
   - Name
   - Pricing tier (Free tier available)

### 4. Get Required Credentials

#### For GPT-4:
1. Go to your Azure OpenAI resource
2. Click on "Keys and Endpoint"
3. Copy:
   - Endpoint (AZURE_OPENAI_ENDPOINT)
   - Key (AZURE_OPENAI_API_KEY)
   - Deployment ID (the name you gave to your GPT-4 deployment)

#### For Speech Service:
1. Go to your Speech service resource
2. Click on "Keys and Endpoint"
3. Copy:
   - Key (AZURE_SPEECH_KEY)
   - Region (AZURE_SPEECH_REGION)

### 5. Update Environment Variables
Create or update your `.env.local` file:

```env
# Azure OpenAI
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_KEY=your-api-key
AZURE_OPENAI_DEPLOYMENT_ID=your-gpt4-deployment-name

# Azure Speech Service
AZURE_SPEECH_KEY=your-speech-key
AZURE_SPEECH_REGION=your-speech-region
```

## Testing the Setup

1. Start your development server:
```bash
npm run dev
```

2. Try the AI features:
   - Click the "AI Assistant" button
   - Try summarizing or enhancing your notes
   - Try voice recording

## Troubleshooting

### Common Issues:

1. "Model not found" error:
   - Make sure your GPT-4 deployment is complete
   - Verify the deployment name matches AZURE_OPENAI_DEPLOYMENT_ID

2. "Authentication failed" error:
   - Double-check your API key
   - Ensure the endpoint URL is correct

3. Voice recording not working:
   - Check microphone permissions
   - Verify Speech service credentials

### Getting Help:
- Azure OpenAI Documentation: https://learn.microsoft.com/azure/cognitive-services/openai/
- Azure Speech Service Documentation: https://learn.microsoft.com/azure/cognitive-services/speech-service/
- Azure Support: https://azure.microsoft.com/support/