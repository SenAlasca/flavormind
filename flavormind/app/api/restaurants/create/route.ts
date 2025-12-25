import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

/**
 * POST /api/restaurants/create
 * Create a new restaurant
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
    
    if (!process.env.POSTGRES_URL) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }
    
    const sql = neon(process.env.POSTGRES_URL);
    
    // Check if restaurant code already exists
    const existing = await sql`
      SELECT id FROM restaurants WHERE UPPER(code) = UPPER(${code})
    `;
    
    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Restaurant code already exists' },
        { status: 409 }
      );
    }
    
    // Insert new restaurant into database
    const result = await sql`
      INSERT INTO restaurants (name, code, owner_pin, manager_pin, staff_pin)
      VALUES (${name}, ${code}, ${ownerPin}, ${managerPin || null}, ${staffPin || null})
      RETURNING id, name, code, created_at
    `;
    
    const restaurant = result[0];
    
    return NextResponse.json({ 
      success: true,
      restaurant,
      message: 'Restaurant created successfully'
    });
  } catch (error) {
    console.error('Error creating restaurant:', error);
    return NextResponse.json(
      { error: 'Failed to create restaurant' },
      { status: 500 }
    );
  }
}
