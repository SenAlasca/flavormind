import { NextRequest, NextResponse } from 'next/server';
import { getEdgeConfigValue } from '@/lib/edgeConfig';

/**
 * GET /api/restaurants/[code]
 * Retrieve restaurant data by code
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const code = params.code;
    
    // Get all restaurants from Edge Config
    const restaurants = await getEdgeConfigValue('restaurants') as Record<string, any> || {};
    
    // Find restaurant by code
    const restaurant = restaurants[code];
    
    if (!restaurant) {
      return NextResponse.json(
        { error: 'Restaurant not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ restaurant });
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    return NextResponse.json(
      { error: 'Failed to fetch restaurant' },
      { status: 500 }
    );
  }
}
