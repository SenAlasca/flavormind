import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

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
    
    // Check if restaurant code already exists
    const existing = await sql`
      SELECT id FROM restaurants WHERE code = ${code}
    `;
    
    if (existing.rows.length > 0) {
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
    
    const restaurant = result.rows[0];
    
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
