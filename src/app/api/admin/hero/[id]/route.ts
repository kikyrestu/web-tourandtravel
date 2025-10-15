import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

// GET single hero slide
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await verifyToken(request);
    if (!authResult.success) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const heroSlide = await db.heroSlide.findUnique({
      where: { id: params.id }
    });

    if (!heroSlide) {
      return NextResponse.json({ error: 'Hero slide not found' }, { status: 404 });
    }

    // Parse JSON fields
    const formattedSlide = {
      ...heroSlide,
      features: heroSlide.features ? JSON.parse(heroSlide.features) : [],
      stats: heroSlide.stats ? JSON.parse(heroSlide.stats) : {}
    };

    return NextResponse.json({ data: formattedSlide });
  } catch (error) {
    console.error('Error fetching hero slide:', error);
    return NextResponse.json({ error: 'Failed to fetch hero slide' }, { status: 500 });
  }
}

// PUT update hero slide
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const heroSlide = await db.heroSlide.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(subtitle !== undefined && { subtitle }),
        ...(image !== undefined && { image }),
        ...(videoId !== undefined && { videoId }),
        ...(features !== undefined && { features: JSON.stringify(features) }),
        ...(stats !== undefined && { stats: JSON.stringify(stats) }),
        ...(isActive !== undefined && { isActive }),
        ...(sortOrder !== undefined && { sortOrder })
      }
    });

    // Parse JSON fields for response
    const formattedSlide = {
      ...heroSlide,
      features: heroSlide.features ? JSON.parse(heroSlide.features) : [],
      stats: heroSlide.stats ? JSON.parse(heroSlide.stats) : {}
    };

    return NextResponse.json({ data: formattedSlide });
  } catch (error) {
    console.error('Error updating hero slide:', error);
    return NextResponse.json({ error: 'Failed to update hero slide' }, { status: 500 });
  }
}

// DELETE hero slide
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await verifyToken(request);
    if (!authResult.success) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await db.heroSlide.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Hero slide deleted successfully' });
  } catch (error) {
    console.error('Error deleting hero slide:', error);
    return NextResponse.json({ error: 'Failed to delete hero slide' }, { status: 500 });
  }
}