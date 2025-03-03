
# Google Authentication Flow Diagram

```mermaid
graph TD
    subgraph User
        A[User visits app] --> B{Has account?}
        B -->|No| C[Clicks Google Login]
        B -->|Yes| D[Clicks Google Login]
    end

    subgraph Frontend
        C --> E[Google Sign-In Button]
        D --> E
        E --> F[Redirect to Google Auth]
        N[Handle OAuth Redirect] --> O[Extract tokens & state]
        O --> P[Validate state param]
        P --> Q[Send token to backend]
        V[Receive Success] --> W[Store auth state]
        W --> X[Redirect to Dashboard]
    end

    subgraph Google
        F --> G[Google Login Page]
        G --> H[User authenticates]
        H --> I[Consent to permissions]
        I --> J[Redirect to callback URL]
    end

    subgraph Backend
        J --> K[/api/auth/google/callback]
        K --> L[Verify OAuth tokens]
        L --> M{User exists?}
        M -->|Yes| R[Update Google ID]
        M -->|No| S[Create new user]
        R --> T[Generate session]
        S --> T
        Q --> U[Validate token]
        U --> V
    end

    subgraph Database
        R -.-> DB1[(Find user by email)]
        S -.-> DB2[(Create user record)]
        T -.-> DB3[(Store session)]
    end

    subgraph Account Linking
        Y[Existing user] --> Z[Profile settings]
        Z --> AA[Link Google account]
        AA --> AB[Initiate OAuth flow]
        AB --> F
    end
```

## Authentication Sequence Diagram

```mermaid
sequenceDiagram
    actor User
    participant Frontend
    participant Backend
    participant GoogleAuth
    participant Database

    User->>Frontend: Click "Sign in with Google"
    Frontend->>Backend: Request OAuth URL (/api/auth/google)
    Backend->>Frontend: Return OAuth URL with state
    Frontend->>GoogleAuth: Redirect to Google OAuth URL
    GoogleAuth->>User: Present login form
    User->>GoogleAuth: Enter credentials & consent
    GoogleAuth->>Backend: Redirect to callback URL with code
    Backend->>GoogleAuth: Exchange code for tokens
    GoogleAuth->>Backend: Return access & ID tokens
    Backend->>GoogleAuth: Request user info with token
    GoogleAuth->>Backend: Return user profile data
    
    Backend->>Database: Check if user exists
    
    alt User exists
        Database->>Backend: Return user data
        Backend->>Database: Update user with Google ID
    else User doesn't exist
        Backend->>Database: Create new user with Google profile
    end
    
    Backend->>Database: Create/update session
    Backend->>Frontend: Return success with user data
    Frontend->>User: Redirect to dashboard
```

## Data Flow Diagram

```mermaid
flowchart TD
    subgraph User Flow
        A[User] --> B[Browser]
    end
    
    subgraph Authentication Flow
        B <--> C{Frontend App}
        C <--> D[Auth Service]
        D <--> E[Google OAuth API]
        D <--> F[(Database)]
    end
    
    subgraph Data Objects
        G[User Profile] --- F
        H[Google ID] --- F
        I[Access Tokens] --- F
        J[Sessions] --- F
    end
