import { NextRequest, NextResponse } from 'next/server';
import jwt from "jsonwebtoken";
import { db } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// GET all content sections
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    jwt.verify(token, JWT_SECRET);

    const contentSections = await db.contentSection.findMany({
      orderBy: { position: 'asc' }
    });

    return NextResponse.json(contentSections);
  } catch (error) {
    console.error("Error fetching content sections:", error);
    return NextResponse.json({ error: "Failed to fetch content sections" }, { status: 500 });
  }
}

// POST create new content section
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
      content,
      sectionType,
      position,
      isActive
    } = body;

    // Get the highest position and add 1
    const lastSection = await db.contentSection.findFirst({
      orderBy: { position: 'desc' }
    });
    const newPosition = position ?? (lastSection ? lastSection.position + 1 : 0);

    const contentSection = await db.contentSection.create({
      data: {
        title,
        content,
        sectionType: sectionType || 'text',
        position: newPosition,
        isActive: isActive !== undefined ? isActive : true
      }
    });

    return NextResponse.json(contentSection, { status: 201 });
  } catch (error) {
    console.error("Error creating content section:", error);
    return NextResponse.json({ error: "Failed to create content section" }, { status: 500 });
  }
}