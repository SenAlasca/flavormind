import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

/**
 * GET /api/restaurants/[code]
 * Retrieve restaurant data by code
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    console.log('[API] GET /api/restaurants/[code] - Starting request');
    const { code } = await params;
    console.log('[API] Restaurant code:', code);
    
    // Query restaurant from database
    console.log('[API] Querying database...');
    const result = await sql`
      SELECT id, code, name, created_at, updated_at
      FROM restaurants
      WHERE UPPER(code) = UPPER(${code})
    `;
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
