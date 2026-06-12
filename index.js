const functions = require('@google-cloud/functions-framework')
const { OpenAI } = require('openai')

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

functions.http('openai-stt', async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*')
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'POST')
    res.set('Access-Control-Allow-Headers', 'Content-Type')
    res.set('Access-Control-Max-Age', '3600')
    res.status(204).send('')
  } else {
    try {
      const { base64, format = 'webm', ...rest } = req.body

      const buffer = Buffer.from(base64, 'base64')

      const transcription = await openai.audio.transcriptions.create({
        ...rest,
        file: new File([buffer], `audio.${format}`, { type: `audio/${format}` }),
      })

      res.status(200).json({ text: transcription.text })
    } catch (error) {
      res.status(500).json(error)
    }
  }
})
