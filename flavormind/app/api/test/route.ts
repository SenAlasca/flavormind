import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET() {
  console.log('[TEST API] Test route hit!');
  
  try {
    console.log('[TEST API] Attempting database connection...');
    
    // Simple query with timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database connection timeout')), 5000);
    });
    
    const result = await Promise.race([
      sql`SELECT NOW() as current_time, COUNT(*) as restaurant_count FROM restaurants`,
      timeoutPromise
    ]) as any;
    
    console.log('[TEST API] Database query successful!');
    
    return NextResponse.json({ 
      message: 'API routes and database are working!',
      timestamp: new Date().toISOString(),
      databaseTime: result.rows[0].current_time,
      restaurantCount: result.rows[0].restaurant_count,
    });
  } catch (error) {
    console.error('[TEST API] Error:', error);
    return NextResponse.json({ 
      message: 'API route works but database connection failed',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
