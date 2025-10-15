import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not defined");
}

// GET site settings
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

    // Get the first settings record or create default if not exists
    let settings = await db.siteSettings.findFirst();
    
    if (!settings) {
      settings = await db.siteSettings.create({
        data: {
          siteName: "Nusantara Tour",
          siteDescription: "Tour and Travel terpercaya untuk menjelajahi keindahan Indonesia",
          siteKeywords: "tour, travel, indonesia, bromo, ijen, wisata",
          contactEmail: "info@nusantaratour.com",
          contactPhone: "+62 812-3456-7890",
          contactAddress: "Jl. Wisata No. 123, Surabaya, Jawa Timur",
          socialLinks: JSON.stringify({}),
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Get settings error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT update site settings
export async function PUT(request: NextRequest) {
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
      siteName,
      siteDescription,
      siteKeywords,
      headerBackground,
      logo,
      favicon,
      contactEmail,
      contactPhone,
      contactAddress,
      socialLinks,
      seoMetaTitle,
      seoMetaDescription,
      seoMetaKeywords,
    } = body;

    // Get the first settings record
    let settings = await db.siteSettings.findFirst();
    
    if (settings) {
      // Update existing settings
      settings = await db.siteSettings.update({
        where: { id: settings.id },
        data: {
          siteName,
          siteDescription,
          siteKeywords,
          headerBackground,
          logo,
          favicon,
          contactEmail,
          contactPhone,
          contactAddress,
          socialLinks,
          seoMetaTitle,
          seoMetaDescription,
          seoMetaKeywords,
        },
      });
    } else {
      // Create new settings if not exists
      settings = await db.siteSettings.create({
        data: {
          siteName,
          siteDescription,
          siteKeywords,
          headerBackground,
          logo,
          favicon,
          contactEmail,
          contactPhone,
          contactAddress,
          socialLinks,
          seoMetaTitle,
          seoMetaDescription,
          seoMetaKeywords,
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}