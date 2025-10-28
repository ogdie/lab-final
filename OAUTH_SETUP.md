# OAuth Setup Guide

This application now supports OAuth login with Google and GitHub. Follow these steps to set it up:

## Environment Variables Required

Add these to your `.env` file:

```bash
# JWT Configuration
JWT_SECRET=your-jwt-secret-key-here

# Session Configuration  
SESSION_SECRET=your-session-secret-key-here

# OAuth Configuration - Google
# Get these from: https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# OAuth Configuration - GitHub
# Get these from: https://github.com/settings/applications/new
GITHUB_CLIENT_ID=your-github-client-id-here
GITHUB_CLIENT_SECRET=your-github-client-secret-here

# Base URL for production (used for OAuth callbacks)
BASE_URL=https://yourdomain.com
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/google/callback`
   - Production: `https://yourdomain.com/api/auth/google/callback`
6. Copy Client ID and Client Secret to your `.env` file

## GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/applications/new)
2. Create a new OAuth App
3. Set Authorization callback URL:
   - Development: `http://localhost:3000/api/auth/github/callback`
   - Production: `https://yourdomain.com/api/auth/github/callback`
4. Copy Client ID and Client Secret to your `.env` file

## How It Works

- OAuth buttons appear only on the login form (not registration)
- Users can authenticate with Google or GitHub
- If an account with the same email exists, OAuth accounts are linked
- New users are automatically created with default "Estudante" user type
- JWT tokens are generated and handled the same way as regular login

## Security Notes

- Session secrets should be strong random strings
- OAuth credentials should never be committed to version control
- Use HTTPS in production for OAuth callbacks
- Session cookies are secure in production mode

