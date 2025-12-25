import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

/**
 * POST /api/menu/create
 * Create a new menu item
 */
export async function POST(request: NextRequest) {
  try {
    if (!process.env.POSTGRES_URL) {
      return NextResponse.json(
        { error: 'Database connection not configured' },
        { status: 500 }
      );
    }
    
    const sql = neon(process.env.POSTGRES_URL);
    const body = await request.json();
    const { restaurantId, name, description, price, category, imageUrl } = body;
    
    // Validate required fields
    if (!restaurantId || !name || !price) {
      return NextResponse.json(
        { error: 'Missing required fields: restaurantId, name, price' },
        { status: 400 }
      );
    }
    
    // Insert new menu item into database
    const result = await sql`
      INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url)
      VALUES (${restaurantId}, ${name}, ${description || null}, ${price}, ${category || 'Other'}, ${imageUrl || null})
      RETURNING id, restaurant_id, name, description, price, category, image_url, available, created_at
    `;
    
    const menuItem = result[0];
    
    return NextResponse.json({ 
      success: true,
      menuItem,
      message: 'Menu item created successfully'
    });
  } catch (error) {
    console.error('Error creating menu item:', error);
    return NextResponse.json(
      { error: 'Failed to create menu item' },
      { status: 500 }
    );
  }
}
