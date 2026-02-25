import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    
    if (!url) {
      return new NextResponse('No URL provided', { status: 400 });
    }
    
    // Redirect to the Convex storage directly
    // This is simpler than proxying the file and avoids potential issues
    return NextResponse.redirect(`https://convex.dev/dashboard/file-storage/${url}`);
  } catch (error) {
    console.error('Error fetching resume:', error);
    return NextResponse.json({ error: 'Failed to access resume' }, { status: 500 });
  }
}
