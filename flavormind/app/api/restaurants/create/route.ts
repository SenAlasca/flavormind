import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/restaurants/create
 * Create a new restaurant
 * 
 * Note: Edge Config is read-only from the SDK.
 * For now, this returns the data structure that should be stored.
 * In production, you would use Vercel's Edge Config API to write data.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, code, ownerPin, managerPin, staffPin } = body;
    
    // Validate required fields
    if (!name || !code || !ownerPin) {
      return NextResponse.json(
        { error: 'Missing required fields: name, code, ownerPin' },
        { status: 400 }
      );
    }
    
    // Create restaurant object
    const restaurant = {
      name,
      code,
      pins: {
        owner: ownerPin,
        manager: managerPin || null,
        staff: staffPin || null,
      },
      createdAt: new Date().toISOString(),
      menu: [],
      orders: [],
    };
    
    // TODO: In production, use Vercel Edge Config Management API to write data
    // For now, we'll return the structure and log instructions
    console.log('Restaurant created (store this in Edge Config):', restaurant);
    console.log('To store in Edge Config, use the Vercel dashboard or CLI:');
    console.log(`vercel env add restaurants --value '{"${code}": ${JSON.stringify(restaurant)}}'`);
    
    return NextResponse.json({ 
      success: true,
      restaurant,
      message: 'Restaurant structure created. Store in Edge Config via Vercel dashboard.'
    });
  } catch (error) {
    console.error('Error creating restaurant:', error);
    return NextResponse.json(
      { error: 'Failed to create restaurant' },
      { status: 500 }
    );
  }
}
