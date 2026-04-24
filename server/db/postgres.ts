import { drizzle } from 'drizzle-orm/postgres-js';

const db = drizzle({
  connection: {
    url: process.env.DATABASE_URL,
    ssl: true
  }
});

const result = await db.execute('select 1');

