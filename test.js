#!/usr/bin/env node

const { spawn } = require('child_process')
const fs = require('fs')

const recordAudio = async () => {
  return new Promise((resolve, reject) => {
    console.log(`Recording \x1b[90mpress any key to stop\x1b[0m`)

    const recordProcess = spawn('sox', [
      '-t',
      'coreaudio',
      'default',
      '-r',
      '16000',
      '-c',
      '1',
      '-b',
      '16',
      '-t',
      'wav',
      '-',
    ])

    let audioChunks = []

    recordProcess.stdout.on('data', chunk => {
      audioChunks.push(chunk)
    })

    process.stdin.setRawMode(true)
    process.stdin.resume()

    const handleKeyPress = () => {
      process.stdin.setRawMode(false)
      process.stdin.pause()
      process.stdin.removeListener('data', handleKeyPress)

      recordProcess.kill('SIGINT')

      const audioBuffer = Buffer.concat(audioChunks)
      resolve(audioBuffer)
    }

    process.stdin.on('data', handleKeyPress)

    recordProcess.on('error', err => {
      process.stdin.setRawMode(false)
      process.stdin.pause()
      reject(err)
    })
  })
}

const testSTT = async audioBuffer => {
  const base64Audio = audioBuffer.toString('base64')

  const response = await fetch(
    'https://us-central1-samantha-374622.cloudfunctions.net/openai-stt',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        base64: base64Audio,
        format: 'wav',
        model: 'gpt-4o-transcribe',
      }),
    },
  )

  const result = await response.json()
  console.log(`\x1b[38;2;255;187;102m${result.text}\x1b[0m`)
}

const main = async () => {
  try {
    const audioBuffer = await recordAudio()
    await testSTT(audioBuffer)
  } catch (error) {
    console.error('Error:', error.message)
  }
}

main()
