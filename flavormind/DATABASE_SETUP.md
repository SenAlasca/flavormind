# FlavorMind Database Setup Guide

## Edge Config Structure

Your Edge Config should contain a `restaurants` key with the following structure:

```json
{
  "restaurants": {
    "ABC123": {
      "name": "Test Restaurant",
      "code": "ABC123",
      "pins": {
        "owner": "1234",
        "manager": "5678",
        "staff": "9999"
      },
      "createdAt": "2025-12-22T00:00:00.000Z",
      "menu": [],
      "orders": []
    }
  }
}
```

## Setting up Edge Config Data

### Method 1: Using Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Navigate to Storage → Edge Config → flavormind-db
3. Click "Edit Items"
4. Add a new item with key: `restaurants` and value as JSON object above

### Method 2: Using Vercel CLI
```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Login to Vercel
vercel login

# Set the Edge Config value
vercel edge-config:set restaurants '{"ABC123":{"name":"Test Restaurant","code":"ABC123","pins":{"owner":"1234","manager":"5678","staff":"9999"},"createdAt":"2025-12-22T00:00:00.000Z","menu":[],"orders":[]}}' --edge-config-id ecfg_akdqbljsdt2tvzcttlryxb7bg4xk
```

## API Routes Created

✅ `GET /api/restaurants/[code]` - Get restaurant by code
✅ `POST /api/restaurants/create` - Create new restaurant (returns structure to manually add)
✅ `POST /api/auth/verify-pin` - Verify restaurant code + PIN combination

## Testing the Setup

After adding data to Edge Config, test with:

```bash
# Test getting a restaurant
curl http://localhost:3000/api/restaurants/ABC123

# Test PIN verification
curl -X POST http://localhost:3000/api/auth/verify-pin \
  -H "Content-Type: application/json" \
  -d '{"code":"ABC123","pin":"1234"}'
```

## Next Steps

1. Add initial restaurant data to Edge Config (use Method 1 or 2 above)
2. Update UI components to call these API routes
3. Add menu and order management routes
4. Implement proper authentication/session management
