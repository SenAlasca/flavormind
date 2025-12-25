import { NextResponse } from 'next/server';

export async function GET() {
  console.log('[DIAGNOSTIC] Checking environment variables...');
  
  const diagnostics = {
    timestamp: new Date().toISOString(),
    nodeEnv: process.env.NODE_ENV,
    environmentVariables: {
      POSTGRES_URL: process.env.POSTGRES_URL ? '✓ Set (hidden)' : '✗ Not set',
      POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL ? '✓ Set (hidden)' : '✗ Not set',
      POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING ? '✓ Set (hidden)' : '✗ Not set',
    },
    postgresUrlLength: process.env.POSTGRES_URL?.length || 0,
  };
  
  console.log('[DIAGNOSTIC] Results:', diagnostics);
  
  return NextResponse.json(diagnostics);
}
