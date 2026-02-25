import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { createHash } from 'crypto';

// This is a simple API route to handle admin login
// In a real app, you'd use proper authentication

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    // Get the stored password from environment variable
    const storedPassword = process.env.SECRET_ADMIN_PASSWORD;

    // Simple password check - replace with actual secure auth
    if (password === storedPassword) {
      // Create a simple token with expiration and password hash
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 1); // 1 day expiry

      // Hash the password for additional security in the token
      const passwordHash = createHash('sha256')
        .update(storedPassword || '')
        .digest('hex')
        .substring(0, 10); // Use first 10 characters of hash

      const tokenData = {
        role: 'admin',
        exp: expiryDate.getTime(),
        hash: passwordHash
      };

      // Convert to base64 for the cookie
      const token = Buffer.from(JSON.stringify(tokenData)).toString('base64');

      // Set the cookie
      cookies().set({
        name: 'admin_token',
        value: token,
        expires: expiryDate,
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      console.log('Admin token set successfully');

      const response = NextResponse.json({ success: true, message: 'Admin access granted' });
      response.cookies.set('admin_session', 'true', { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1 day
        path: '/',
      });

      return response;
    }

    return NextResponse.json({ success: false, message: 'Invalid password' }, { status: 401 });
  } catch (error) {
    console.error('Secret login error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to authenticate' },
      { status: 500 }
    );
  }
}
