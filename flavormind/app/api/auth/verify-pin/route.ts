import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

/**
 * POST /api/auth/verify-pin
 * Verify restaurant code and PIN combination
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, pin } = body;
    
    // Validate required fields
    if (!code || !pin) {
      return NextResponse.json(
        { error: 'Missing required fields: code, pin' },
        { status: 400 }
      );
    }
    
    // Query restaurant from database
    const result = await sql`
      SELECT id, name, code, owner_pin, manager_pin, staff_pin
      FROM restaurants
      WHERE code = ${code}
    `;
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid restaurant code' },
        { status: 404 }
      );
    }
    
    const restaurant = result.rows[0];
    
    // Check which PIN was provided
    let role = null;
    if (restaurant.owner_pin === pin) {
      role = 'owner';
    } else if (restaurant.manager_pin === pin) {
      role = 'manager';
    } else if (restaurant.staff_pin === pin) {
      role = 'staff';
    }
    
    if (!role) {
      return NextResponse.json(
        { error: 'Invalid PIN' },
        { status: 401 }
      );
    }
    
    // Return success with role information
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
