// Run this script to initialize the database with tables and a test restaurant
// Usage: node scripts/init-db.js

const { sql } = require('@vercel/postgres');

async function initDatabase() {
  try {
    console.log('Creating tables...');
    
    // Create restaurants table
    await sql`
      CREATE TABLE IF NOT EXISTS restaurants (
        id SERIAL PRIMARY KEY,
        code VARCHAR(6) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        owner_pin VARCHAR(4) NOT NULL,
        manager_pin VARCHAR(4),
        staff_pin VARCHAR(4),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✓ Restaurants table created');

    // Create menu_items table
    await sql`
      CREATE TABLE IF NOT EXISTS menu_items (
        id SERIAL PRIMARY KEY,
        restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        category VARCHAR(100),
        image_url TEXT,
        available BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✓ Menu items table created');

    // Create orders table
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
        customer_name VARCHAR(255),
        order_type VARCHAR(20) CHECK (order_type IN ('dine-in', 'takeout')),
        table_number INTEGER,
        guests_count INTEGER,
        allergies TEXT,
        status VARCHAR(20) DEFAULT 'pending',
        total_amount DECIMAL(10, 2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✓ Orders table created');

    // Create order_items table
    await sql`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        menu_item_id INTEGER REFERENCES menu_items(id),
        quantity INTEGER NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✓ Order items table created');

    // Create indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_restaurants_code ON restaurants(code)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant ON menu_items(restaurant_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_orders_restaurant ON orders(restaurant_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id)`;
    console.log('✓ Indexes created');

    // Check if test restaurant exists
    const existingRestaurant = await sql`
      SELECT id FROM restaurants WHERE code = 'TEST01'
    `;

    if (existingRestaurant.rows.length === 0) {
      // Create a test restaurant
      await sql`
        INSERT INTO restaurants (code, name, owner_pin, manager_pin, staff_pin)
        VALUES ('TEST01', 'Test Restaurant', '1234', '5678', '9999')
      `;
      console.log('✓ Test restaurant created');
      console.log('  Code: TEST01');
      console.log('  Owner PIN: 1234');
      console.log('  Manager PIN: 5678');
      console.log('  Staff PIN: 9999');
    } else {
      console.log('✓ Test restaurant already exists (TEST01)');
    }

    console.log('\n✅ Database initialization complete!');
    console.log('\nYou can now:');
    console.log('1. Visit the customer page and enter code: TEST01');
    console.log('2. Visit the kitchen page and enter code: TEST01 with PIN: 1234 (owner), 5678 (manager), or 9999 (staff)');
    
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
}

initDatabase()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
