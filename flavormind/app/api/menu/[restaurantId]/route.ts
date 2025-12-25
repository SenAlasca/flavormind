import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 10;

/**
 * GET /api/menu/[restaurantId]
 * Get all menu items for a restaurant
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ restaurantId: string }> }
) {
  try {
    const { restaurantId } = await params;
    
    // Query menu items from database
    const result = await sql`
      SELECT id, restaurant_id, name, description, price, category, image_url, available, created_at, updated_at
      FROM menu_items
      WHERE restaurant_id = ${restaurantId}
      ORDER BY category, name
    `;
    
    return NextResponse.json({ 
      menuItems: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu items' },
      { status: 500 }
    );
  }
}
