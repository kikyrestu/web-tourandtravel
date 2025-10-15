import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    // Verify token (in production, you should validate the JWT token)
    if (!token) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Fetch content from database
    const [headerContent, heroContent] = await Promise.all([
      db.siteSettings.findFirst(),
      db.heroSlides.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } })
    ]);

    return NextResponse.json({
      header: headerContent,
      hero: heroContent[0] || null
    });
  } catch (error) {
    console.error("Error fetching content:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    // Verify token (in production, you should validate the JWT token)
    if (!token) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { section, content } = await request.json();

    if (section === 'header') {
      // Update header content in site settings
      await db.siteSettings.upsert({
        where: { id: 'main' },
        update: {
          siteName: content.logoText,
          contactPhone: content.contactInfo.phone,
          contactEmail: content.contactInfo.email,
          contactAddress: content.contactInfo.address,
          socialLinks: content.socialLinks
        },
        create: {
          id: 'main',
          siteName: content.logoText,
          contactPhone: content.contactInfo.phone,
          contactEmail: content.contactInfo.email,
          contactAddress: content.contactInfo.address,
          socialLinks: content.socialLinks
        }
      });
    } else if (section === 'hero') {
      // Update hero content
      await db.heroSlides.upsert({
        where: { id: 'main' },
        update: {
          title: content.title,
          subtitle: content.subtitle,
          features: content.features,
          stats: content.stats
        },
        create: {
          id: 'main',
          title: content.title,
          subtitle: content.subtitle,
          features: content.features,
          stats: content.stats,
          isActive: true,
          sortOrder: 1
        }
      });
    }

    return NextResponse.json({ message: "Content updated successfully" });
  } catch (error) {
    console.error("Error updating content:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}