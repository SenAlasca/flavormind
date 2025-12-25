import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 10;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      restaurantId,
      customerName,
      orderType,
      tableNumber,
      guestsCount,
      allergies,
      items, // Array of { menuItemId, quantity, price, notes? }
    } = body;

    // Validate required fields
    if (!restaurantId || !customerName || !orderType || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate total amount
    const totalAmount = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

    // Insert order
    const orderResult = await sql`
      INSERT INTO orders (
        restaurant_id,
        customer_name,
        order_type,
        table_number,
        guests_count,
        allergies,
        status,
        total_amount
      ) VALUES (
        ${restaurantId},
        ${customerName},
        ${orderType},
        ${tableNumber || null},
        ${guestsCount || null},
        ${allergies || null},
        'pending',
        ${totalAmount}
      )
      RETURNING *
    `;

    const order = orderResult.rows[0];

    // Insert order items
    for (const item of items) {
      await sql`
        INSERT INTO order_items (
          order_id,
          menu_item_id,
          quantity,
          price,
          notes
        ) VALUES (
          ${order.id},
          ${item.menuItemId},
          ${item.quantity},
          ${item.price},
          ${item.notes || null}
        )
      `;
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.id,
        status: order.status,
        totalAmount: order.total_amount,
        createdAt: order.created_at,
      },
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
