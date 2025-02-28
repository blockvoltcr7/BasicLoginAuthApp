
# Password Reset Flow

The following diagram illustrates the password reset process flow:

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database
    participant Email

    User->>Frontend: Clicks "Forgot Password"
    Frontend->>Frontend: Displays forgot password form
    User->>Frontend: Enters email address
    Frontend->>Backend: POST /api/forgot-password (email)
    Backend->>Database: Check if email exists
    
    alt Email exists
        Backend->>Database: Generate and store reset token
        Backend->>Email: Send password reset email with token
        Backend->>Frontend: 200 Success (Email sent)
        Frontend->>User: Display "Check your email" message
        
        User->>Email: Opens email
        User->>Frontend: Clicks reset link with token
        Frontend->>Frontend: Display reset password form
        User->>Frontend: Enters and confirms new password
        Frontend->>Backend: POST /api/reset-password (token, new password)
        Backend->>Database: Validate token (exists, not expired, not used)
        
        alt Token valid
            Backend->>Database: Update user password, mark token as used
            Backend->>Frontend: 200 Success (Password updated)
            Frontend->>User: Display success message and redirect to login
        else Token invalid
            Backend->>Frontend: 400 Error (Invalid or expired token)
            Frontend->>User: Display error message
        end
    else Email doesn't exist
        Backend->>Frontend: 200 Success (Same response to prevent email enumeration)
        Frontend->>User: Display "Check your email" message
    end
```

## Security Considerations

- The system will return the same response whether or not the email exists in the database to prevent email enumeration attacks
- Password reset tokens are single-use and expire after 1 hour
- All communications are encrypted using HTTPS
- Password complexity requirements are enforced on the server side
- Rate limiting is applied to prevent brute force attacks
