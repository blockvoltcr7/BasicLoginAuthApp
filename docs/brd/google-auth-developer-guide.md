
# Google Authentication Developer Guide

## Setup Instructions

### Prerequisites
- Google Cloud Platform account
- Access to Google Cloud Console
- Node.js and npm installed
- Understanding of OAuth 2.0 flow

### Google Cloud Configuration

1. **Create a Google Cloud Project**
   ```
   1. Go to https://console.cloud.google.com/
   2. Click "New Project"
   3. Enter project name and select organization
   4. Click "Create"
   ```

2. **Configure OAuth Consent Screen**
   ```
   1. Go to "APIs & Services" > "OAuth consent screen"
   2. Select "External" user type
   3. Enter application information:
      - App name
      - User support email
      - Developer contact information
   4. Add scopes:
      - openid
      - email
      - profile
   5. Add test users for development
   6. Click "Save and Continue"
   ```

3. **Create OAuth Credentials**
   ```
   1. Go to "APIs & Services" > "Credentials"
   2. Click "Create Credentials" > "OAuth client ID"
   3. Select "Web application"
   4. Add authorized JavaScript origins:
      - https://[your-replit-domain]
   5. Add authorized redirect URIs:
      - https://[your-replit-domain]/api/auth/google/callback
   6. Click "Create"
   7. Download the JSON file
   ```

### Application Configuration

1. **Set Environment Variables in Replit**
   ```
   GOOGLE_OAUTH_CLIENT_ID=your_client_id
   GOOGLE_OAUTH_CLIENT_SECRET=your_client_secret
   GOOGLE_OAUTH_CALLBACK_URL=https://[your-replit-domain]/api/auth/google/callback
   ```

2. **Install Required Packages**
   ```bash
   npm install passport-google-oauth20
   ```

## Implementation Guide

### Backend Implementation

1. **Update User Schema**
   ```typescript
   // shared/schema.ts
   export const users = pgTable("users", {
     id: serial("id").primaryKey(),
     username: text("username").notNull().unique(),
     email: text("email").notNull().unique(),
     password: text("password"),  // Optional for Google auth
     googleId: text("google_id").unique(),  // Add this field
     authType: text("auth_type"), // 'local', 'google', or 'both'
     profilePictureUrl: text("profile_picture_url"),
     isAdmin: boolean("is_admin").notNull().default(false),
   });
   ```

2. **Create Google OAuth Strategy**
   ```typescript
   // server/auth.ts - Add Google strategy
   import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

   // Add in setupAuth function
   passport.use(
     new GoogleStrategy(
       {
         clientID: process.env.GOOGLE_OAUTH_CLIENT_ID!,
         clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
         callbackURL: process.env.GOOGLE_OAUTH_CALLBACK_URL!,
         scope: ["profile", "email"],
       },
       async (accessToken, refreshToken, profile, done) => {
         try {
           // Check if user already exists with this Google ID
           let user = await storage.getUserByGoogleId(profile.id);

           if (user) {
             return done(null, user);
           }

           // Check if user exists with same email
           const email = profile.emails?.[0]?.value;
           if (email) {
             user = await storage.getUserByEmail(email);
             if (user) {
               // Link Google account to existing user
               user = await storage.linkGoogleAccount(user.id, profile.id, profile);
               return done(null, user);
             }
           }

           // Create new user with Google profile info
           user = await storage.createUser({
             username: `google_${profile.id}`,
             email: email || `${profile.id}@google.user`,
             googleId: profile.id,
             authType: 'google',
             profilePictureUrl: profile.photos?.[0]?.value,
           });

           return done(null, user);
         } catch (err) {
           return done(err);
         }
       }
     )
   );
   ```

3. **Add Google Auth Routes**
   ```typescript
   // server/auth.ts - Add routes
   app.get(
     "/api/auth/google",
     passport.authenticate("google", { scope: ["profile", "email"] })
   );

   app.get(
     "/api/auth/google/callback",
     passport.authenticate("google", { failureRedirect: "/login" }),
     (req, res) => {
       // Successful authentication, redirect home.
       res.redirect("/");
     }
   );

   app.post("/api/auth/link/google", async (req, res, next) => {
     if (!req.isAuthenticated()) return res.sendStatus(401);
     
     passport.authenticate("google", {
       scope: ["profile", "email"],
       state: JSON.stringify({ linkAccount: req.user.id }),
     })(req, res, next);
   });

   app.post("/api/auth/unlink/google", async (req, res) => {
     if (!req.isAuthenticated()) return res.sendStatus(401);
     
     try {
       await storage.unlinkGoogleAccount(req.user.id);
       res.json({ success: true });
     } catch (err) {
       res.status(500).json({ message: "Failed to unlink account" });
     }
   });
   ```

4. **Update Storage Methods**
   ```typescript
   // server/storage.ts - Add Google auth methods
   async getUserByGoogleId(googleId: string): Promise<User | undefined> {
     const users = await db.select().from(schema.users).where(eq(schema.users.googleId, googleId));
     return users[0];
   }

   async linkGoogleAccount(userId: number, googleId: string, profile: any): Promise<User> {
     await db.update(schema.users)
       .set({
         googleId: googleId,
         authType: 'both',
         profilePictureUrl: profile.photos?.[0]?.value || null,
       })
       .where(eq(schema.users.id, userId));
     
     return this.getUser(userId);
   }

   async unlinkGoogleAccount(userId: number): Promise<void> {
     const user = await this.getUser(userId);
     if (!user) throw new Error("User not found");
     
     // Ensure user has a password before unlinking
     if (!user.password) {
       throw new Error("Cannot unlink Google: no alternative login method");
     }
     
     await db.update(schema.users)
       .set({
         googleId: null,
         authType: 'local',
       })
       .where(eq(schema.users.id, userId));
   }
   ```

### Frontend Implementation

1. **Create Google Sign-in Button Component**
   ```tsx
   // client/src/components/GoogleSignInButton.tsx
   import { Button } from "@/components/ui/button";

   export function GoogleSignInButton({ text = "Sign in with Google" }) {
     const handleGoogleSignIn = () => {
       window.location.href = "/api/auth/google";
     };

     return (
       <Button
         onClick={handleGoogleSignIn}
         className="flex items-center gap-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
       >
         <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
           {/* Google G logo SVG path */}
           <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
           <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
           <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
           <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
         </svg>
         {text}
       </Button>
     );
   }
   ```

2. **Add Button to Login Form**
   ```tsx
   // client/src/components/LoginForm.tsx
   import { GoogleSignInButton } from "./GoogleSignInButton";

   export function LoginForm() {
     // Existing form code
     
     return (
       <div className="space-y-6">
         {/* Existing form elements */}
         
         <div className="relative">
           <div className="absolute inset-0 flex items-center">
             <span className="w-full border-t" />
           </div>
           <div className="relative flex justify-center text-xs uppercase">
             <span className="bg-background px-2 text-muted-foreground">
               Or continue with
             </span>
           </div>
         </div>
         
         <GoogleSignInButton />
       </div>
     );
   }
   ```

3. **Add Account Linking in User Settings**
   ```tsx
   // client/src/components/AccountSettings.tsx
   import { GoogleSignInButton } from "./GoogleSignInButton";
   import { Button } from "@/components/ui/button";
   import { useState } from "react";

   export function AccountSettings({ user }) {
     const [isLinking, setIsLinking] = useState(false);
     
     const handleGoogleLink = () => {
       window.location.href = "/api/auth/link/google";
     };
     
     const handleGoogleUnlink = async () => {
       try {
         setIsLinking(true);
         const response = await fetch("/api/auth/unlink/google", {
           method: "POST",
           credentials: "include",
         });
         
         if (response.ok) {
           window.location.reload();
         } else {
           const data = await response.json();
           alert(data.message || "Failed to unlink account");
         }
       } catch (error) {
         alert("An error occurred");
       } finally {
         setIsLinking(false);
       }
     };
     
     return (
       <div className="space-y-6">
         {/* Other account settings */}
         
         <div className="border rounded-lg p-4">
           <h3 className="text-lg font-medium">Connected Accounts</h3>
           <p className="text-sm text-gray-500 mb-4">
             Connect your account with third-party services
           </p>
           
           {user.googleId ? (
             <div className="flex justify-between items-center">
               <div className="flex items-center gap-2">
                 <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                   {/* Google G logo SVG */}
                 </svg>
                 <span>Google (Connected)</span>
               </div>
               <Button 
                 variant="outline"
                 onClick={handleGoogleUnlink}
                 disabled={isLinking || !user.password}
               >
                 Disconnect
               </Button>
             </div>
           ) : (
             <GoogleSignInButton text="Connect Google Account" />
           )}
           
           {!user.password && user.googleId && (
             <p className="text-sm text-amber-600 mt-2">
               You cannot disconnect Google as it's your only login method.
               Set a password first to enable disconnection.
             </p>
           )}
         </div>
       </div>
     );
   }
   ```

## Testing

### Manual Testing Checklist

1. **Authentication Flow**
   - [ ] New user can sign in with Google
   - [ ] Existing Google user can sign in
   - [ ] User with same email can link accounts
   - [ ] Authentication persists across page reloads

2. **Account Management**
   - [ ] User can link Google account in settings
   - [ ] User can unlink Google account if password exists
   - [ ] Cannot unlink Google if it's the only authentication method
   - [ ] Google profile information is correctly displayed

3. **Error Handling**
   - [ ] Authentication errors show meaningful messages
   - [ ] Failed authentication redirects properly
   - [ ] Account linking failures are handled gracefully

### Automated Testing

1. **Backend Testing**
   ```typescript
   // Example test for Google authentication
   describe('Google Authentication', () => {
     it('should create a new user with Google profile', async () => {
       // Mock Google profile
       const mockProfile = {
         id: 'google123',
         displayName: 'Test User',
         emails: [{ value: 'test@example.com' }],
         photos: [{ value: 'https://example.com/photo.jpg' }]
       };
       
       // Mock strategy verification function
       const verifyFn = passport._strategies.google._verify;
       
       // Call verify function
       await new Promise(resolve => {
         verifyFn(
           'mock-token', 
           'mock-refresh', 
           mockProfile, 
           (err, user) => {
             expect(err).toBeNull();
             expect(user).toBeDefined();
             expect(user.googleId).toBe('google123');
             expect(user.email).toBe('test@example.com');
             resolve();
           }
         );
       });
     });
   });
   ```

## Troubleshooting

### Common Issues

1. **"Error: redirect_uri_mismatch"**
   - **Cause**: The redirect URI in the request doesn't match any in your Google Cloud Console
   - **Solution**: Verify that the exact callback URL is added to authorized redirect URIs in Google Cloud Console

2. **"Failed to fetch" when initiating authentication**
   - **Cause**: Network issues or server not running
   - **Solution**: Check network connectivity and ensure server is running

3. **"User not authenticated after successful Google sign-in"**
   - **Cause**: Session not properly established
   - **Solution**: Check session configuration and ensure cookies are being set correctly

4. **"Cannot link Google account" error**
   - **Cause**: User with this Google ID already exists
   - **Solution**: User needs to sign in with Google account first, then link to existing account

### Debug Logging

Add the following environment variable to enable debug logging:
```
DEBUG=passport:*
```

This will show detailed logs of the authentication process, including token exchange and profile parsing.
