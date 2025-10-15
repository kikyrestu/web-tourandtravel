import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not defined");
}

// GET all packages
export async function GET(request: NextRequest) {
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

    const packages = await db.tourPackage.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Parse highlights from JSON string to array
    const formattedPackages = packages.map(pkg => ({
      ...pkg,
      highlights: JSON.parse(pkg.highlights || "[]"),
    }));

    return NextResponse.json(formattedPackages);
  } catch (error) {
    console.error("Get packages error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST create new package
export async function POST(request: NextRequest) {
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

    const newPackage = await db.tourPackage.create({
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
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json({
      ...newPackage,
      highlights: JSON.parse(newPackage.highlights || "[]"),
    });
  } catch (error) {
    console.error("Create package error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}