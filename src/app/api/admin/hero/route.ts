import { NextRequest, NextResponse } from 'next/server';
import jwt from "jsonwebtoken";
import { db } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not defined");
}

// GET all hero slides
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 [API] GET hero slides called');
    
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

    const heroSlides = await db.heroSlide.findMany({
      orderBy: { sortOrder: 'asc' }
    });

    console.log('🔍 [API] Found', heroSlides.length, 'hero slides');

    // Parse JSON fields
    const formattedSlides = heroSlides.map(slide => ({
      ...slide,
      features: slide.features ? JSON.parse(slide.features) : [],
      stats: slide.stats ? JSON.parse(slide.stats) : {}
    }));

    return NextResponse.json({ data: formattedSlides });
  } catch (error) {
    console.error('🔍 [API] Error fetching hero slides:', error);
    return NextResponse.json({ error: 'Failed to fetch hero slides' }, { status: 500 });
  }
}

// POST create new hero slide
export async function POST(request: NextRequest) {
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