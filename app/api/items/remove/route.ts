import { NextResponse } from 'next/server';
import { removeItem } from '@/lib/db';

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { success: false, message: 'Valid ID is required' },
        { status: 400 }
      );
    }
    
    const success = removeItem(Number(id));
    
    return NextResponse.json({ 
      success,
      message: success ? 'Item removed successfully' : 'Failed to remove item'
    });
  } catch (error) {
    console.error('Error removing item:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error removing item',
        error: (error as Error).message
      },
      { status: 500 }
    );
  }
}
