import { NextRequest, NextResponse } from 'next/server';
import jwt from "jsonwebtoken";
import { db } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not defined");
}

// GET single hero slide
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    jwt.verify(token, JWT_SECRET);

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
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    jwt.verify(token, JWT_SECRET);

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
    console.log('🔍 [API] DELETE hero slide called for ID:', params.id);
    
    const authHeader = request.headers.get("authorization");
    console.log('🔍 [API] Auth header:', authHeader ? 'Present' : 'Missing');
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log('🔍 [API] No Bearer token found');
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    console.log('🔍 [API] Token length:', token.length);
    console.log('🔍 [API] JWT_SECRET:', JWT_SECRET ? 'Found' : 'Missing');
    
    try {
      jwt.verify(token, JWT_SECRET);
      console.log('🔍 [API] JWT verification successful');
    } catch (jwtError) {
      console.log('🔍 [API] JWT verification failed:', jwtError);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    await db.heroSlide.delete({
      where: { id: params.id }
    });

    console.log('🔍 [API] Hero slide deleted successfully');
    return NextResponse.json({ message: 'Hero slide deleted successfully' });
  } catch (error) {
    console.error('🔍 [API] Error deleting hero slide:', error);
    return NextResponse.json({ error: 'Failed to delete hero slide' }, { status: 500 });
  }
}