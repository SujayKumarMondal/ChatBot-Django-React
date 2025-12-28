FastAPI backend for ChatPaat

Google OAuth setup

Required environment variables (use a .env file or system env):

- GOOGLE_CLIENT_ID: your Google OAuth client ID
- GOOGLE_CLIENT_SECRET: your Google OAuth client secret
- FRONTEND_URL: e.g. http://localhost:5173
- JWT_SECRET_KEY: secret for signing local JWTs

How it works

1. Frontend redirects user to Google consent page with `response_type=code`.
2. Google redirects back to the frontend `/oauth-callback` with a `code`.
3. Frontend sends the `code` to `/api/auth/google/exchange/` on the FastAPI backend.
4. Backend exchanges the code with Google, fetches userinfo, upserts a local user, and returns local JWT tokens.

Frontend

- Set `VITE_GOOGLE_CLIENT_ID` in the frontend environment (or edit `SignIn.tsx` fallback).
- The frontend includes `/oauth-callback` which exchanges the code and signs the user in.
