## Ball Mtaani

A Vite + Express full-stack app for football banter, memes, chat, and an AI assistant.

### Prerequisites
- Node.js 18+

### Setup
1) Install deps:
```bash
npm install
```
2) Create `.env` from `env.example` and fill values:
```bash
copy env.example .env  # on Windows PowerShell
```
Set `GEMINI_API_KEY` to your Google AI Studio key.

### Development
```bash
npm run dev
```
Server runs on `PORT` (default 5000) and serves both API and client.

### Production
```bash
npm run build
npm start
```

### API & WS
- GET `/api/trending/topics`
- GET `/api/trending/searches`
- GET `/api/matches/today`
- GET `/api/memes`
- POST `/api/memes`
- POST `/api/memes/:id/like`
- POST `/api/ai/chat` (needs `GEMINI_API_KEY`)
- WebSocket `/ws` for chat

### Storage
- Default: In-memory storage (non-persistent)
- Firestore: Set `USE_FIRESTORE=true` in `.env` and provide Firebase Admin credentials via one of:
  - `GOOGLE_APPLICATION_CREDENTIALS=path/to/serviceAccount.json`
  - or `GOOGLE_APPLICATION_CREDENTIALS_JSON={...}` (JSON string)

Collections used when Firestore is enabled:
- `users`
- `memes` (fields: imageUrl, caption, likes, createdAt)
- `chat_messages` (fields: user, message, timestamp)

### Aliases
- `@` → `client/src`
- `@shared` → `shared`
- `@assets` → `attached_assets`

### Notes
- Dev uses Vite middleware + HMR.
- Prod serves static from `dist/public` and bundled server from `dist`.


