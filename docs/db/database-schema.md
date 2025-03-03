
# Database Schema Documentation

## Overview
The database uses PostgreSQL and implements user authentication with support for both password-based and magic link authentication methods.

## Tables

### Users
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password TEXT,
  is_admin BOOLEAN NOT NULL DEFAULT false
);
```

### Magic Links
```sql
CREATE TABLE magic_links (
  id SERIAL PRIMARY KEY,
  token TEXT NOT NULL UNIQUE,
  user_id INTEGER REFERENCES users(id),
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN NOT NULL DEFAULT false
);
```

## Validation Rules

### User Creation
- Username: Required
- Email: Required, must be valid email format
- Password: Optional, minimum 8 characters when provided
- Admin status: Defaults to false

### Magic Links
- Token: Unique, randomly generated
- Expiration: 15 minutes from creation
- Usage: Single-use only, marked as used after successful authentication

## Security Considerations
- Passwords are optional to support passwordless authentication
- Magic links expire after 15 minutes
- Magic links can only be used once
- Email addresses must be unique to prevent account duplication

## Relationships
- Magic links have a foreign key relationship to users
- One user can have multiple magic links
- Each magic link belongs to exactly one user
