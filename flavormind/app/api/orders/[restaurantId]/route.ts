import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 10;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ restaurantId: string }> }
) {
  try {
    const { restaurantId } = await params;

    // Fetch orders with their items
    const ordersResult = await sql`
      SELECT 
        o.id,
        o.customer_name,
        o.order_type,
        o.table_number,
        o.guests_count,
        o.allergies,
        o.status,
        o.total_amount,
        o.created_at,
        o.updated_at,
        json_agg(
          json_build_object(
            'id', oi.id,
            'menuItemId', oi.menu_item_id,
            'itemName', mi.name,
            'quantity', oi.quantity,
            'price', oi.price,
            'notes', oi.notes
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
      WHERE o.restaurant_id = ${restaurantId}
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `;

    return NextResponse.json({
      success: true,
      orders: ordersResult.rows,
      count: ordersResult.rows.length,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
