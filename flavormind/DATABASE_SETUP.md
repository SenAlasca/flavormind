# FlavorMind Database Setup Guide

## Step 1: Deploy to Vercel

### Option A: Using Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import your Git repository (GitHub, GitLab, or Bitbucket)
4. Vercel will auto-detect Next.js settings
5. Click "Deploy"

### Option B: Using Vercel CLI
```bash
# Install Vercel CLI globally (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
cd D:\FlavorTown\flavormind\flavormind
vercel
```

## Step 2: Set Environment Variables in Vercel

After deployment, add these environment variables:

1. Go to your project in Vercel Dashboard
2. Navigate to Settings → Environment Variables
3. Add the following variables:

```
POSTGRES_URL=postgresql://neondb_owner:npg_cDhQ0UN4qBjZ@ep-weathered-brook-adaqvqzq-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require

POSTGRES_PRISMA_URL=postgresql://neondb_owner:npg_cDhQ0UN4qBjZ@ep-weathered-brook-adaqvqzq-pooler.c-2.us-east-1.aws.neon.tech/neondb?connect_timeout=15&sslmode=require

POSTGRES_URL_NON_POOLING=postgresql://neondb_owner:npg_cDhQ0UN4qBjZ@ep-weathered-brook-adaqvqzq.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**Important**: Select "Production", "Preview", and "Development" for each variable.

## Step 3: Redeploy After Adding Environment Variables

Click "Redeploy" in Vercel to apply the environment variables.

## Step 4: Initialize Database Tables

After deployment is complete, visit this URL to create the database tables:

```
https://your-app-name.vercel.app/api/db/init
```

You should see a success response:
```json
{
  "success": true,
  "message": "Database tables created successfully",
  "tables": ["restaurants", "menu_items", "orders", "order_items"]
}
```

## Step 5: Test the Setup

### Test 1: Create a test restaurant
```bash
curl -X POST https://your-app-name.vercel.app/api/restaurants/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Restaurant",
    "code": "TEST01",
    "ownerPin": "1234",
    "managerPin": "5678",
    "staffPin": "9999"
  }'
```

### Test 2: Get restaurant by code
```bash
curl https://your-app-name.vercel.app/api/restaurants/TEST01
```

### Test 3: Verify PIN
```bash
curl -X POST https://your-app-name.vercel.app/api/auth/verify-pin \
  -H "Content-Type: application/json" \
  -d '{"code":"TEST01","pin":"1234"}'
```

## Database Schema

The following tables are created:

- **restaurants**: Store restaurant details, codes, and PINs
- **menu_items**: Store menu items for each restaurant
- **orders**: Store customer orders
- **order_items**: Store individual items within each order

## Next Steps

After successful setup:
1. ✅ Database is initialized
2. ✅ API routes are working
3. 🔄 Connect UI components to API routes
4. 🔄 Add menu management endpoints
5. 🔄 Add order management endpoints
