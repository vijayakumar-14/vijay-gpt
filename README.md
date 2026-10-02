# VIJAY GPT 1.0

Chat website hosted on Vercel.

## Structure (must be at the TOP LEVEL of the GitHub repo)
- `public/index.html` - chat UI
- `api/chat.js` - serverless backend
- `package.json`

## Deploy
1. Push these files to GitHub (api, public, package.json at repo root)
2. Vercel -> Add New -> Project -> import the repo
3. Root Directory: leave EMPTY. Framework Preset: Other
4. Settings -> Environment Variables: add `GEMINI_API_KEY` = your key
5. Deploy / Redeploy
