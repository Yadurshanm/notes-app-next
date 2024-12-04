# Whisper.cpp Setup Guide

This guide will help you set up Whisper.cpp for local speech-to-text transcription.

## Prerequisites

- C++ compiler (gcc or clang)
- Make
- FFmpeg
- CMake (optional, for building with BLAS/OpenBLAS)

## Installation Steps

### 1. Install System Dependencies

On Ubuntu/Debian:
```bash
sudo apt-get update
sudo apt-get install -y build-essential ffmpeg
```

On macOS:
```bash
brew install ffmpeg
```

### 2. Clone and Build Whisper.cpp

```bash
# Clone the repository
git clone https://github.com/ggerganov/whisper.cpp.git
cd whisper.cpp

# Build the project
make

# Download the base model
bash ./models/download-ggml-model.sh base.en
```

### 3. Install the Binary

```bash
# Copy the binary to system path
sudo cp main /usr/local/bin/whisper
sudo mkdir -p /usr/local/share/whisper/models
sudo cp models/ggml-base.bin /usr/local/share/whisper/models/
```

### 4. Update Environment Variables

Add these to your `.env.local`:

```env
WHISPER_PATH=/usr/local/bin/whisper
WHISPER_MODEL_PATH=/usr/local/share/whisper/models/ggml-base.bin
```

## Testing the Installation

1. Create a test audio file:
```bash
ffmpeg -f lavfi -i "sine=frequency=1000:duration=5" -c:a pcm_s16le -ar 16000 test.wav
```

2. Try transcribing it:
```bash
whisper -f test.wav -m /usr/local/share/whisper/models/ggml-base.bin
```

## Troubleshooting

### Common Issues:

1. "Command not found: whisper"
   - Make sure the binary is properly installed in /usr/local/bin
   - Check file permissions

2. "Model not found"
   - Verify the model path in .env.local
   - Re-download the model if necessary

3. "Failed to process audio"
   - Check FFmpeg installation
   - Verify audio file format
   - Try converting to WAV first

### Performance Tips:

1. Use a smaller model for faster processing:
   - tiny.en: Fastest, least accurate
   - base.en: Good balance
   - small.en: More accurate, slower
   - medium.en: Most accurate, slowest

2. Optimize for your hardware:
   - Enable BLAS support for better CPU performance
   - Use OpenCL for GPU acceleration (if available)

## Additional Models

You can download different models based on your needs:

```bash
# For English-only models
bash ./models/download-ggml-model.sh tiny.en    # 75MB
bash ./models/download-ggml-model.sh base.en    # 142MB
bash ./models/download-ggml-model.sh small.en   # 466MB
bash ./models/download-ggml-model.sh medium.en  # 1.5GB

# For multilingual models
bash ./models/download-ggml-model.sh tiny    # 75MB
bash ./models/download-ggml-model.sh base    # 142MB
bash ./models/download-ggml-model.sh small   # 466MB
bash ./models/download-ggml-model.sh medium  # 1.5GB
```

## Resources

- [Whisper.cpp GitHub](https://github.com/ggerganov/whisper.cpp)
- [OpenAI Whisper](https://github.com/openai/whisper)
- [FFmpeg Documentation](https://ffmpeg.org/documentation.html)