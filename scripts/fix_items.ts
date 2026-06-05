// scripts/fix_items.ts
const { pool } = require('../lib/db');

async function fix() {
  const client = await pool.connect();
  try {
    const res = await client.query(
      `UPDATE orders SET items = '[]'::jsonb WHERE items = '[object Object]'`
    );
    console.log(`Fixed ${res.rowCount} rows`);
  } finally {
    client.release();
    process.exit(0);
  }
}

fix().catch((e) => {
  console.error(e);
  process.exit(1);
});
