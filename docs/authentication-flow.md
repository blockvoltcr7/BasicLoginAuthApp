
# Authentication Flow Documentation

## Overview
This application supports two authentication methods:
1. Traditional username/password authentication
2. Passwordless authentication via Magic Links

## Authentication Methods

### 1. Traditional Authentication Flow

#### Registration (Username/Password)
1. User navigates to registration form
2. Submits required information:
   - Username (unique)
   - Email (unique)
   - Password (min 8 characters)
3. Server validates input using `insertUserSchema`
4. If valid:
   - Password is hashed using scrypt with salt
   - User record is created in database
   - User is automatically logged in
   - Session is created

#### Login (Username/Password)
1. User enters username and password
2. Server validates credentials using Passport LocalStrategy
3. If valid:
   - Session is created
   - User is redirected to authenticated area

### 2. Magic Link Authentication Flow

#### Requesting Magic Link
1. User enters email address
2. Server processes request:
   - If user doesn't exist, creates new account using email
   - Generates secure random token
   - Creates magic link record with 15-minute expiration
   - Sends email via SendGrid with verification link

#### Magic Link Verification
1. User clicks link in email
2. Server validates token:
   - Checks if token exists
   - Verifies token hasn't expired
   - Confirms token hasn't been used
3. If valid:
   - Marks token as used
   - Creates user session
   - Logs user in automatically

## Security Features

### Password Security
- Passwords are hashed using scrypt with unique salts
- Timing-safe comparison for password verification
- Optional password requirement for magic link support

### Magic Link Security
- Tokens are cryptographically secure random values
- 15-minute expiration time
- Single-use tokens
- Secure email delivery via SendGrid

### Session Management
- Secure session storage in PostgreSQL
- 24-hour session lifetime
- Secure cookie settings in production

## API Endpoints

### Authentication Routes
```
POST /api/register         - Create new account
POST /api/login           - Traditional login
POST /api/magic-link      - Request magic link
GET  /api/verify          - Verify magic link token
POST /api/logout          - End session
GET  /api/user           - Get current user info
```

## Frontend Components

### Auth Forms
- `LoginForm`: Handles both password and magic link login
- `RegisterForm`: New account creation
- Form validation using Zod schemas
- Real-time error feedback
- Loading states during authentication

## Environment Requirements
- `SENDGRID_API_KEY`: Required for sending magic link emails
- `SENDGRID_FROM_EMAIL`: Sender email address for magic links
- `SESSION_SECRET`: Secret for session encryption
