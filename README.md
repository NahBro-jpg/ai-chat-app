# AI Chat App

A small mobile-friendly AI chat application using OpenAI through a server-side API.

## Security

The OpenAI API key is never placed in the browser. Set it as the `OPENAI_API_KEY` environment variable on the server/hosting provider.

Never commit `.env` or a real API key to GitHub.

## Local run

1. Install Node.js.
2. Run `npm install`.
3. Copy `.env.example` to `.env`.
4. Put your new OpenAI API key in `.env`.
5. Run `npm start`.
6. Open `http://localhost:3000`.

## Render

The included `render.yaml` configures a Node web service. Add `OPENAI_API_KEY` as a secret environment variable in Render.
