import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

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
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // Fetch counts from all tables
    const [
      totalPackages,
      totalTestimonials,
      totalFaqs,
      totalArticles,
      totalGallery
    ] = await Promise.all([
      db.tourPackage.count({ where: { isActive: true } }),
      db.testimonial.count({ where: { isActive: true } }),
      db.fAQ.count({ where: { isActive: true } }),
      db.article.count({ where: { isActive: true } }),
      db.gallery.count({ where: { isActive: true } }),
    ]);

    return NextResponse.json({
      totalPackages,
      totalTestimonials,
      totalFaqs,
      totalArticles,
      totalGallery,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}