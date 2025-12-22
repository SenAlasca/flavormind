import { NextRequest, NextResponse } from 'next/server';
import { getEdgeConfigValue } from '@/lib/edgeConfig';

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
    
    // Get all restaurants from Edge Config
    const restaurants = await getEdgeConfigValue('restaurants') as Record<string, any> || {};
    
    // Find restaurant by code
    const restaurant = restaurants[code];
    
    if (!restaurant) {
      return NextResponse.json(
        { error: 'Invalid restaurant code' },
        { status: 404 }
      );
    }
    
    // Check which PIN was provided
    let role = null;
    if (restaurant.pins.owner === pin) {
      role = 'owner';
    } else if (restaurant.pins.manager === pin) {
      role = 'manager';
    } else if (restaurant.pins.staff === pin) {
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
