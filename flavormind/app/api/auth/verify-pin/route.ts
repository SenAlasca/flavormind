import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 10;

/**
 * POST /api/auth/verify-pin
 * Verify restaurant code and PIN combination
 */
export async function POST(request: NextRequest) {
  try {
    console.log('[API] POST /api/auth/verify-pin - Starting request');
    const body = await request.json();
    const { code, pin } = body;
    console.log('[API] Code:', code, 'PIN length:', pin?.length);
    
    // Validate required fields
    if (!code || !pin) {
      console.log('[API] Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields: code, pin' },
        { status: 400 }
      );
    }
    
    // Query restaurant from database
    console.log('[API] Querying database...');
    const result = await sql`
      SELECT id, name, code, owner_pin, manager_pin, staff_pin
      FROM restaurants
      WHERE UPPER(code) = UPPER(${code})
    `;
    console.log('[API] Query result rows:', result.rows.length);
    
    if (result.rows.length === 0) {
      console.log('[API] Restaurant not found');
      return NextResponse.json(
        { error: 'Invalid restaurant code' },
        { status: 404 }
      );
    }
    
    const restaurant = result.rows[0];
    console.log('[API] Restaurant found:', restaurant.name);
    
    // Check which PIN was provided
    let role = null;
    if (restaurant.owner_pin === pin) {
      role = 'owner';
    } else if (restaurant.manager_pin === pin) {
      role = 'manager';
    } else if (restaurant.staff_pin === pin) {
      role = 'staff';
    }
    
    console.log('[API] Role determined:', role || 'INVALID PIN');
    
    if (!role) {
      return NextResponse.json(
        { error: 'Invalid PIN' },
        { status: 401 }
      );
    }
    
    // Return success with role information
    console.log('[API] Auth successful');
    return NextResponse.json({ 
      success: true,
      role,
      restaurantId: restaurant.id,
      restaurant: {
        name: restaurant.name,
        code: restaurant.code,
      }
    });
  } catch (error) {
    console.error('Error verifying PIN:', error);
    return NextResponse.json(
      { error: 'Failed to verify PIN' },
      { status: 500 }
    );
  }
}
