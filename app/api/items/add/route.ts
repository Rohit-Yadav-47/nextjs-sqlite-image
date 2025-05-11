import { NextResponse } from 'next/server';
import { addItem } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text } = body;
    
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Text is required' },
        { status: 400 }
      );
    }
    
    const success = addItem(text);
    
    return NextResponse.json({ 
      success,
      message: success ? 'Item added successfully' : 'Failed to add item'
    });
  } catch (error) {
    console.error('Error adding item:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error adding item',
        error: (error as Error).message
      },
      { status: 500 }
    );
  }
}
