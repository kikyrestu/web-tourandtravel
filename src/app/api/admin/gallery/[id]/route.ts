import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// PUT update gallery item
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    jwt.verify(token, JWT_SECRET);

    const body = await request.json();
    const {
      title,
      description,
      category,
      isActive,
      sortOrder,
    } = body;

    const updatedItem = await db.gallery.update({
      where: { id: params.id },
      data: {
        title,
        description,
        category,
        isActive,
        sortOrder,
      },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Update gallery item error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE gallery item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    jwt.verify(token, JWT_SECRET);

    // Get the gallery item first to delete the file
    const galleryItem = await db.gallery.findUnique({
      where: { id: params.id },
    });

    if (galleryItem) {
      // Delete the file from filesystem using dynamic imports
      try {
        const fs = (await import('fs')).promises;
        const path = (await import('path')).default;
        
        const filePath = path.join(process.cwd(), 'public', galleryItem.imagePath);
        await fs.unlink(filePath);
      } catch (fileError) {
        console.error("Error deleting file:", fileError);
        // Continue with database deletion even if file deletion fails
      }
    }

    await db.gallery.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Gallery item deleted successfully" });
  } catch (error) {
    console.error("Delete gallery item error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}