import { captchaProtection } from '@/lib/captcha/captcha';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') ||
                     request.ip ||
                     '127.0.0.1';
                     
    const userAgent = request.headers.get('user-agent') || undefined;

    const requiresCaptcha = captchaProtection.shouldShowCaptcha(clientIP, userAgent);

    return NextResponse.json({ requiresCaptcha });
  } catch (error) {
    console.error('Erreur lors de la vérification CAPTCHA:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}