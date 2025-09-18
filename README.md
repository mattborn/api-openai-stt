## Dev locally

```
npm i
npm run dev
```

## Deploy

```
gcloud functions deploy openai-stt \
--allow-unauthenticated \
--runtime=nodejs20 \
--update-env-vars OPENAI_API_KEY=PASTE_KEY_HERE \
--trigger-http \
--no-gen2
```

## Usage

POST to the endpoint with:

```json
{
  "base64": "//PAxABWqsn4AVvQATlIQ2Q0FCs12BO … qg==",
  "model": "whisper-1"
}
```

Returns:

```json
{
  "text": "Transcribed text from the audio"
}
```

## Test

```
npm run test
```
