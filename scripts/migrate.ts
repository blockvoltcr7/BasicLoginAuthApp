
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

async function main() {
  console.log("Running migrations...");
  
  // For migrations, we use the postgres-js driver directly
  const migrationClient = postgres(process.env.DATABASE_URL);
  const db = drizzle(migrationClient);
  
  // This will run migrations from the ./migrations folder
  await migrate(db, { migrationsFolder: "./migrations" });
  
  console.log("Migrations completed successfully");
  
  // Close the connection
  await migrationClient.end();
  process.exit(0);
}

main().catch((e) => {
  console.error("Migration failed");
  console.error(e);
  process.exit(1);
});
