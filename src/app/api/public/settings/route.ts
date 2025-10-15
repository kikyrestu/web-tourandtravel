import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findFirst();
    
    if (!settings) {
      return NextResponse.json({ error: 'Settings not found' }, { status: 404 });
    }

    // Parse JSON fields
    const formattedSettings = {
      ...settings,
      socialLinks: settings.socialLinks ? JSON.parse(settings.socialLinks) : {}
    };

    return NextResponse.json(formattedSettings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}