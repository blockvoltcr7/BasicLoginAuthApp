
# Database Migrations Guide

This document explains how to use the Drizzle ORM migration system to generate and apply database tables in different environments.

## Overview

This project uses Drizzle ORM to manage database schema and migrations. The schema is defined in `shared/schema.ts`, and migrations are generated using Drizzle Kit.

## Prerequisites

1. A PostgreSQL database connection (specified via `DATABASE_URL` environment variable)
2. Node.js and npm installed

## Step-by-Step Migration Process

### 1. Schema Definition

The database schema is defined in `shared/schema.ts` using Drizzle's schema definition syntax. This includes:
- Table definitions using `pgTable`
- Column definitions with their types and constraints
- Relationships between tables

Example from our current schema:
```typescript
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password"),
  isAdmin: boolean("is_admin").notNull().default(false),
});
```

### 2. Generating Migrations

To generate SQL migration files based on your schema:

```bash
npm run db:generate
```

This runs `drizzle-kit generate:pg` which:
- Compares your schema definition with the migrations history
- Creates SQL migration files in the `./migrations` directory
- Each migration has both an "up" (apply changes) and "down" (revert changes) script

### 3. Reviewing Migrations

Before applying migrations, review the generated SQL files in the `./migrations` directory to ensure they match your expectations.

### 4. Applying Migrations

To apply the migrations to your database:

```bash
npm run db:migrate
```

This executes the `scripts/migrate.ts` script which:
- Connects to your database using the `DATABASE_URL` environment variable
- Runs all pending migrations from the `./migrations` folder in order
- Updates the Drizzle migration history table to track which migrations have been applied

### 5. Setting Up in a New Environment

When deploying to a new environment:

1. Ensure the `DATABASE_URL` environment variable is set correctly
2. Run `npm run db:migrate` to apply all migrations and create the database schema

## Tips for Working with Migrations

### Schema Changes

When you need to modify your database schema:

1. Update the schema definitions in `shared/schema.ts`
2. Generate new migrations with `npm run db:generate`
3. Apply the migrations with `npm run db:migrate`

### Troubleshooting

- If migration fails, check the error message for details
- Ensure database credentials are correct
- Verify that the database user has sufficient permissions
- Check for conflicting migrations or schema changes

### Security Considerations

- Never commit database credentials to version control
- Use environment variables for sensitive connection information
- Consider using database roles with minimal required permissions

## Further Reading

- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [Drizzle Kit Migration Guide](https://orm.drizzle.team/kit-docs/overview)
