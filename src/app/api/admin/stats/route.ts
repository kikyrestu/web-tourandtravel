import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not defined");
}

export async function GET(request: NextRequest) {
  try {
    console.log("🔍 [API] Stats endpoint called");
    
    const authHeader = request.headers.get("authorization");
    console.log("🔍 [API] Auth header:", authHeader ? "Present" : "Missing");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("🔍 [API] No Bearer token found");
      return NextResponse.json(
        { error: "Unauthorized - No Bearer token" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    console.log("🔍 [API] Token length:", token.length);
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      console.log("🔍 [API] Token decoded successfully:", { email: decoded.email, role: decoded.role });
    } catch (jwtError) {
      console.error("🔍 [API] JWT verification failed:", jwtError.message);
      return NextResponse.json(
        { error: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }

    console.log("🔍 [API] Fetching database counts...");
    
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

    console.log("🔍 [API] Database counts fetched:", {
      totalPackages,
      totalTestimonials,
      totalFaqs,
      totalArticles,
      totalGallery
    });

    return NextResponse.json({
      totalPackages,
      totalTestimonials,
      totalFaqs,
      totalArticles,
      totalGallery,
    });
  } catch (error) {
    console.error("🔍 [API] Stats error:", error);
    console.error("🔍 [API] Error stack:", error.stack);
    
    return NextResponse.json(
      { 
        error: "Internal server error",
        message: error.message,
        stack: error.stack
      },
      { status: 500 }
    );
  }
}