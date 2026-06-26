// app/api/login/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    const expected = process.env.ORDER_APP_PASSWORD;
    if (password && expected && password === expected) {
      const response = NextResponse.json({ success: true });
      // Set auth cookie for 24 hours
      response.cookies.set('auth', 'true', {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      });
      return response;
    }
    return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
  } catch (err) {
    console.error('Login error', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
