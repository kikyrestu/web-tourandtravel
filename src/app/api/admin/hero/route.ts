import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

// GET all hero slides
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyToken(request);
    if (!authResult.success) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const heroSlides = await db.heroSlide.findMany({
      orderBy: { sortOrder: 'asc' }
    });

    // Parse JSON fields
    const formattedSlides = heroSlides.map(slide => ({
      ...slide,
      features: slide.features ? JSON.parse(slide.features) : [],
      stats: slide.stats ? JSON.parse(slide.stats) : {}
    }));

    return NextResponse.json({ data: formattedSlides });
  } catch (error) {
    console.error('Error fetching hero slides:', error);
    return NextResponse.json({ error: 'Failed to fetch hero slides' }, { status: 500 });
  }
}

// POST create new hero slide
export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyToken(request);
    if (!authResult.success) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      subtitle,
      image,
      videoId,
      features,
      stats,
      isActive,
      sortOrder
    } = body;

    // Get the highest sort order and add 1
    const lastSlide = await db.heroSlide.findFirst({
      orderBy: { sortOrder: 'desc' }
    });
    const newSortOrder = sortOrder ?? (lastSlide ? lastSlide.sortOrder + 1 : 0);

    const heroSlide = await db.heroSlide.create({
      data: {
        title,
        subtitle,
        image,
        videoId,
        features: JSON.stringify(features || []),
        stats: JSON.stringify(stats || {}),
        isActive: isActive ?? true,
        sortOrder: newSortOrder
      }
    });

    // Parse JSON fields for response
    const formattedSlide = {
      ...heroSlide,
      features: heroSlide.features ? JSON.parse(heroSlide.features) : [],
      stats: heroSlide.stats ? JSON.parse(heroSlide.stats) : {}
    };

    return NextResponse.json({ data: formattedSlide }, { status: 201 });
  } catch (error) {
    console.error('Error creating hero slide:', error);
    return NextResponse.json({ error: 'Failed to create hero slide' }, { status: 500 });
  }
}