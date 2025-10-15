import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// PUT update package
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
      name,
      duration,
      price,
      originalPrice,
      discount,
      rating,
      reviews,
      location,
      highlights,
      description,
      image,
      isActive,
    } = body;

    const updatedPackage = await db.tourPackage.update({
      where: { id: params.id },
      data: {
        name,
        duration,
        price,
        originalPrice,
        discount,
        rating: parseFloat(rating),
        reviews: parseInt(reviews),
        location,
        highlights: JSON.stringify(highlights),
        description,
        image,
        isActive,
      },
    });

    return NextResponse.json({
      ...updatedPackage,
      highlights: JSON.parse(updatedPackage.highlights || "[]"),
    });
  } catch (error) {
    console.error("Update package error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE package
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

    await db.tourPackage.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Package deleted successfully" });
  } catch (error) {
    console.error("Delete package error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}