import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is missing");
  process.exit(1);
}

const pool = new pg.Pool({ connectionString });

async function init() {
  try {
    const migrationPath = path.join(__dirname, '../supabase/migrations/003_chats_and_profiles.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    console.log("Applying migration 003...");
    await pool.query(sql);
    console.log("Migration applied successfully!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await pool.end();
  }
}

init();
