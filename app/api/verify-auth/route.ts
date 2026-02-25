import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createHash } from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Get the token from cookies
    const token = cookies().get('admin_token')?.value;
    
    // If no token exists, return unauthorized
    if (!token) {
      console.log('No admin token found');
      return NextResponse.json(
        { authorized: false, message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    try {
      // Decode the token
      const tokenData = JSON.parse(Buffer.from(token, 'base64').toString());
      
      // Check if token is expired
      if (tokenData.exp < Date.now()) {
        console.log('Admin token expired');
        return NextResponse.json(
          { authorized: false, message: 'Authentication expired' },
          { status: 401 }
        );
      }
      
      // Check if it has the right role
      if (tokenData.role !== 'admin') {
        console.log('Invalid admin role');
        return NextResponse.json(
          { authorized: false, message: 'Invalid credentials' },
          { status: 403 }
        );
      }
      
      // Verify the password hash in the token
      const storedPassword = process.env.SECRET_ADMIN_PASSWORD;
      const expectedHash = createHash('sha256')
        .update(storedPassword || '')
        .digest('hex')
        .substring(0, 10);
        
      if (tokenData.hash !== expectedHash) {
        console.log('Invalid token hash');
        return NextResponse.json(
          { authorized: false, message: 'Invalid token' },
          { status: 401 }
        );
      }
      
      // Token is valid
      console.log('Admin authentication successful');
      return NextResponse.json({ authorized: true });
      
    } catch (decodeError) {
      console.error('Error decoding token:', decodeError);
      return NextResponse.json(
        { authorized: false, message: 'Invalid token format' },
        { status: 401 }
      );
    }
    
  } catch (error) {
    console.error('Auth verification error:', error);
    return NextResponse.json(
      { authorized: false, message: 'Authentication error' },
      { status: 500 }
    );
  }
}
