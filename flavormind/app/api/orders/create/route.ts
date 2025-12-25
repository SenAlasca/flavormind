import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

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
    
    console.log('[ORDERS API] Received order data:', JSON.stringify(body));
    
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
    if (!restaurantId) {
      console.log('[ORDERS API] Missing restaurantId');
      return NextResponse.json({ error: 'Missing restaurantId' }, { status: 400 });
    }
    if (!customerName) {
      console.log('[ORDERS API] Missing customerName');
      return NextResponse.json({ error: 'Missing customerName' }, { status: 400 });
    }
    if (!orderType) {
      console.log('[ORDERS API] Missing orderType');
      return NextResponse.json({ error: 'Missing orderType' }, { status: 400 });
    }
    if (!items || items.length === 0) {
      console.log('[ORDERS API] Missing items or empty cart');
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
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

    const order = orderResult[0];

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
