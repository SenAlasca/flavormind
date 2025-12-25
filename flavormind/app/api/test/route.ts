import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET() {
  console.log('[TEST API] Test route hit!');
  
  try {
    console.log('[TEST API] Attempting database connection with Neon client...');
    
    if (!process.env.POSTGRES_URL) {
      return NextResponse.json({ 
        message: 'POSTGRES_URL not configured',
        timestamp: new Date().toISOString(),
      }, { status: 500 });
    }
    
    const sql = neon(process.env.POSTGRES_URL);
    
    console.log('[TEST API] Executing query...');
    const result = await sql`SELECT 1 as test, NOW() as current_time`;
    
    console.log('[TEST API] Query successful:', result);
    
    return NextResponse.json({ 
      message: 'Database connection successful!',
      timestamp: new Date().toISOString(),
      testValue: result[0].test,
      dbTime: result[0].current_time,
    });
  } catch (error) {
    console.error('[TEST API] Error:', error);
    return NextResponse.json({ 
      message: 'Database connection failed',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}
