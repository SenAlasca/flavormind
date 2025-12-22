import { sql } from '@vercel/postgres';

/**
 * PostgreSQL Database Utility
 * This uses Vercel Postgres (Neon) for data storage
 */

// Execute a SQL query
export async function query(sqlQuery: string, params?: any[]) {
  try {
    const result = await sql.query(sqlQuery, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Helper function to execute SQL templates
export { sql };
