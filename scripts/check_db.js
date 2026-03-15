const { Pool } = require('pg');
const pool = new Pool({connectionString: 'postgresql://postgres:Explainifyexp999%23@db.jbzkzbhjaakkzbcjegja.supabase.co:5432/postgres'});

async function test() {
  const docs = await pool.query('SELECT d.id, d.filename, (SELECT count(*) FROM chunks c WHERE c.document_id = d.id) as chunk_count FROM documents d ORDER BY d.uploaded_at DESC');
  console.log('Documents with chunk counts:');
  for (const doc of docs.rows) {
    console.log(`  ${doc.filename} (${doc.id}): ${doc.chunk_count} chunks`);
  }
  await pool.end();
}

test().catch(e => console.error(e.message));
