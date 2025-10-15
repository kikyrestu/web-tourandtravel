import { NextRequest, NextResponse } from 'next/server';
import jwt from "jsonwebtoken";
import { db } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// GET single content section
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

    const contentSection = await db.contentSection.findUnique({
      where: { id: params.id }
    });

    if (!contentSection) {
      return NextResponse.json({ error: "Content section not found" }, { status: 404 });
    }

    return NextResponse.json(contentSection);
  } catch (error) {
    console.error("Error fetching content section:", error);
    return NextResponse.json({ error: "Failed to fetch content section" }, { status: 500 });
  }
}

// PUT update content section
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
      content,
      sectionType,
      position,
      isActive
    } = body;

    const contentSection = await db.contentSection.update({
      where: { id: params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(sectionType !== undefined && { sectionType }),
        ...(position !== undefined && { position }),
        ...(isActive !== undefined && { isActive })
      }
    });

    return NextResponse.json(contentSection);
  } catch (error) {
    console.error("Error updating content section:", error);
    return NextResponse.json({ error: "Failed to update content section" }, { status: 500 });
  }
}

// DELETE content section
export async function DELETE(
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

    await db.contentSection.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: "Content section deleted successfully" });
  } catch (error) {
    console.error("Error deleting content section:", error);
    return NextResponse.json({ error: "Failed to delete content section" }, { status: 500 });
  }
}