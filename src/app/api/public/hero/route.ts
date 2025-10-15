import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const heroSlides = await prisma.heroSlide.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    });

    // Parse JSON fields
    const formattedSlides = heroSlides.map(slide => ({
      ...slide,
      features: slide.features ? JSON.parse(slide.features) : [],
      stats: slide.stats ? JSON.parse(slide.stats) : {}
    }));

    return NextResponse.json(formattedSlides);
  } catch (error) {
    console.error('Error fetching hero slides:', error);
    return NextResponse.json({ error: 'Failed to fetch hero slides' }, { status: 500 });
  }
}