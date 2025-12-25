import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

/**
 * GET /api/menu/[restaurantId]
 * Get all menu items for a restaurant
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ restaurantId: string }> }
) {
  try {
    if (!process.env.POSTGRES_URL) {
      return NextResponse.json(
        { error: 'Database connection not configured' },
        { status: 500 }
      );
    }
    
    const sql = neon(process.env.POSTGRES_URL);
    const { restaurantId } = await params;
    
    // Query menu items from database
    const result = await sql`
      SELECT id, restaurant_id, name, description, price, category, image_url, available, created_at, updated_at
      FROM menu_items
      WHERE restaurant_id = ${restaurantId}
      ORDER BY category, name
    `;
    
    return NextResponse.json({ 
      menuItems: result,
      count: result.length
    });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu items' },
      { status: 500 }
    );
  }
}
