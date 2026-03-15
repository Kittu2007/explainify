import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

/**
 * Direct PostgreSQL Pool client.
 * Used for high-volume vector inserts that might timeout over Supabase REST.
 */
export const pool = new Pool({
  connectionString,
  // Recommended for serverless: set connection timeouts
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 10000,
  max: 1, // Keep it low for Vercel functions
});

/**
 * Execute a query with the pool.
 */
export async function query(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}

/**
 * Batch insert embeddings using raw SQL (efficient).
 */
export async function insertEmbeddings(documentId: string, chunks: string[], embeddings: number[][]) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    for (let i = 0; i < chunks.length; i++) {
      await client.query(
        'INSERT INTO chunks (document_id, content, chunk_index, embedding) VALUES ($1, $2, $3, $4)',
        [documentId, chunks[i], i, JSON.stringify(embeddings[i])]
      );
    }
    
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
