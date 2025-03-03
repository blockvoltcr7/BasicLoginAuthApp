
# Sprint 2: Backend Integration

## Task 1: Implement Google OAuth Strategy with Passport.js

### Description
Integrate Google OAuth 2.0 authentication strategy into the existing Passport.js authentication system to enable Google sign-in.

### Implementation Details
1. Install required packages:
   ```
   npm install passport-google-oauth20
   ```
2. Import and configure the Google OAuth strategy in `auth.ts`:
   - Use client ID and secret from environment variables
   - Configure callback URL
   - Define verification function to handle user lookup/creation
3. Add serialization/deserialization support for Google authenticated users
4. Handle different authentication scenarios:
   - New user signing up with Google
   - Existing user logging in with Google
   - Existing user linking Google account

### Acceptance Criteria
- [ ] Passport Google OAuth strategy is implemented and configured
- [ ] Strategy correctly uses environment variables for credentials
- [ ] User serialization/deserialization works with Google authenticated users
- [ ] Strategy handles all authentication scenarios correctly

### Test Cases
- Test authenticating a new user with Google
- Test authenticating an existing user with Google
- Verify that user profile information is correctly extracted from Google response
- Test handling of authentication errors

## Task 2: Create API Endpoints for Google Authentication Flow

### Description
Develop API endpoints that handle the Google OAuth authentication flow, including initial authorization, callback handling, and session management.

### Implementation Details
1. Create `/api/auth/google` endpoint to initiate authentication:
   - Configure OAuth scopes (profile, email)
   - Set proper authentication options
2. Implement `/api/auth/google/callback` endpoint:
   - Handle OAuth callback from Google
   - Process authentication result
   - Create or update user account
   - Establish user session
3. Update existing authentication routes to work with Google auth
4. Add error handling for OAuth flow failures

### Acceptance Criteria
- [ ] API endpoint for initiating Google authentication works correctly
- [ ] Callback endpoint successfully handles Google's response
- [ ] User session is established after successful authentication
- [ ] Error cases are properly handled with appropriate messages

### Test Cases
- Test initiating authentication with Google
- Verify callback handling with simulated Google responses
- Test successful authentication flow end-to-end
- Verify error handling with invalid/expired tokens

## Task 3: Implement User Account Creation/Linking Logic

### Description
Develop the logic to create new user accounts from Google profile information or link Google accounts to existing users.

### Implementation Details
1. Implement function to find users by Google ID
2. Create logic to handle new user creation:
   - Extract profile information (name, email, profile picture)
   - Create new user record with Google ID
   - Initialize default user settings
3. Implement account linking for existing users:
   - Match by email address
   - Update user record with Google ID and profile info
   - Preserve existing account data
4. Handle edge cases (conflicting accounts, missing information)

### Acceptance Criteria
- [ ] New users can be created from Google profile information
- [ ] Google accounts can be linked to existing users by email
- [ ] User profile information is correctly extracted and stored
- [ ] Edge cases and conflicts are properly handled

### Test Cases
- Test creating a new user from Google profile
- Test linking Google account to existing user
- Verify handling of duplicate email scenarios
- Test profile information extraction and storage

## Task 4: Add Session Handling for Google Authenticated Users

### Description
Ensure that sessions are properly managed for users authenticated through Google, maintaining consistent session behavior across authentication methods.

### Implementation Details
1. Update session initialization to work with Google authenticated users
2. Implement token refresh logic if needed
3. Ensure session expiration and renewal works correctly
4. Add session metadata to distinguish authentication method
5. Update session validation to work with Google authenticated sessions

### Acceptance Criteria
- [ ] Sessions are correctly established for Google authenticated users
- [ ] Session behavior is consistent across authentication methods
- [ ] Session expiration and renewal works as expected
- [ ] Authentication method is tracked in session metadata

### Test Cases
- Verify session creation after Google authentication
- Test session persistence across page refreshes
- Verify session expiration behavior
- Test session renewal process
