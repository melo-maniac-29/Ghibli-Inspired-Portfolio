import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = cookies();
  const adminSession = cookieStore.get('admin_session');
  
  return NextResponse.json({ 
    authenticated: !!adminSession?.value 
  });
}
