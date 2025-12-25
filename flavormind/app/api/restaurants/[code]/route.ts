import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 10;

/**
 * GET /api/restaurants/[code]
 * Retrieve restaurant data by code
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  console.log('[API] Route handler starting...');
  
  try {
    console.log('[API] GET /api/restaurants/[code] - Starting request');
    const { code } = await params;
    console.log('[API] Restaurant code:', code);
    
    // Query restaurant from database with timeout
    console.log('[API] Querying database...');
    
    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database query timeout')), 8000);
    });
    
    // Race between query and timeout
    const result = await Promise.race([
      sql`
        SELECT id, code, name, created_at, updated_at
        FROM restaurants
        WHERE UPPER(code) = UPPER(${code})
      `,
      timeoutPromise
    ]) as any;
    
    console.log('[API] Query result rows:', result.rows.length);
    
    if (result.rows.length === 0) {
      console.log('[API] Restaurant not found');
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }
    
    const restaurant = result.rows[0];
    console.log('[API] Restaurant found:', restaurant.name);
    return NextResponse.json({ restaurant });
  } catch (error) {
    console.error('[API] Error fetching restaurant:', error);
    return NextResponse.json(
      { error: 'Failed to fetch restaurant', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
