import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { encodeText } from 'crypto-js/enc-utf8';
import { AES, enc } from 'crypto-js';

// Secret used for encryption
const COOKIE_SECRET = process.env.COOKIE_SECRET || process.env.SECRET_ADMIN_PASSWORD || 'fallback-secret';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    
    // Check if the provided password matches the secret password
    if (password === process.env.SECRET_ADMIN_PASSWORD) {
      // Create a session payload
      const payload = {
        authorized: true,
        exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      };
      
      // Encrypt the payload
      const encryptedPayload = AES.encrypt(
        JSON.stringify(payload),
        COOKIE_SECRET
      ).toString();
      
      // Set cookie with the encrypted payload
      cookies().set('admin_session', encryptedPayload, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/'
      });
      
      return NextResponse.json({ success: true }, { status: 200 });
    }
    
    // Return error for incorrect password
    return NextResponse.json(
      { success: false, error: 'Unauthorized' }, 
      { status: 401 }
    );
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
