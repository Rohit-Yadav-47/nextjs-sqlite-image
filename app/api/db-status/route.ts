import { NextResponse } from 'next/server';
import { checkDbConnection, getAllItems } from '@/lib/db';

export async function GET() {
  try {
    const isConnected = checkDbConnection();
    const items = isConnected ? getAllItems() : [];
    
    return NextResponse.json({ 
      connected: isConnected,
      message: isConnected ? 'Database connected successfully' : 'Database connection failed',
      items: items,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error checking database connection:', error);
    return NextResponse.json(
      { 
        connected: false, 
        message: 'Error checking database connection',
        error: (error as Error).message
      },
      { status: 500 }
    );
  }
}
