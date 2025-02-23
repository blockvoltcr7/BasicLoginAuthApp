
# JWT Authentication Implementation Guide

## Overview
This guide explains the implementation of JWT (JSON Web Token) authentication with role-based access control using bcrypt for password hashing.

## Schema Changes

We'll extend the existing users table with a roles field:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  is_admin BOOLEAN NOT NULL DEFAULT false
);
```

## Authentication Flow

1. **Registration**: User registers with email/password
2. **Login**: User provides credentials and receives JWT token
3. **Protected Routes**: User includes token in Authorization header
4. **Role Verification**: Middleware checks user role for protected resources

## Implementation Steps

### 1. Install Required Packages
```bash
npm install jsonwebtoken bcryptjs
```

### 2. JWT Configuration
Create environment variables:
- `JWT_SECRET`: Secret key for signing tokens
- `JWT_EXPIRY`: Token expiration time (e.g., "24h")

### 3. Password Hashing with Bcrypt
```typescript
import bcrypt from 'bcryptjs';

// Hash password before saving
const hashedPassword = await bcrypt.hash(password, 10);

// Compare password during login
const isValid = await bcrypt.compare(password, storedHash);
```

### 4. Token Generation
```typescript
import jwt from 'jsonwebtoken';

const generateToken = (user: User) => {
  return jwt.sign(
    { 
      id: user.id, 
      role: user.role,
      isAdmin: user.isAdmin 
    },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRY }
  );
};
```

### 5. Authentication Middleware
```typescript
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};
```

### 6. Role-Based Authorization Middleware
```typescript
const authorizeRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Insufficient permissions' 
      });
    }
    next();
  };
};
```

## Usage Examples

### Protected Route with Role Check
```typescript
// Protect video access to premium users only
app.get('/api/videos',
  authenticateToken,
  authorizeRole(['premium', 'admin']),
  (req, res) => {
    // Handle video access
  }
);
```

### Login Response with Token
```typescript
// Login endpoint response
res.json({
  user: {
    id: user.id,
    email: user.email,
    role: user.role
  },
  token: generateToken(user)
});
```

## Security Considerations

1. Store JWT_SECRET securely in environment variables
2. Use HTTPS for all API communications
3. Implement token refresh mechanism for long-term sessions
4. Add rate limiting for authentication endpoints
5. Never store sensitive data in JWT payload

## Role-Based Access Examples

```typescript
// Role types
type UserRole = 'user' | 'premium' | 'admin';

// Feature access by role
const rolePermissions = {
  user: ['basic_content'],
  premium: ['basic_content', 'premium_content', 'videos'],
  admin: ['basic_content', 'premium_content', 'videos', 'admin_panel']
};
```
