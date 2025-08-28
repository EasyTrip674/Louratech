import { captchaProtection } from '@/lib/captcha/captcha';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    
    if (!token) {
      return NextResponse.json(
        { message: 'Token manquant' },
        { status: 400 }
      );
    }

    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') ||
                     request.ip ||
                     '127.0.0.1';

    const result = await captchaProtection.verifyCaptcha(token, clientIP);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Erreur lors de la vérification:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
