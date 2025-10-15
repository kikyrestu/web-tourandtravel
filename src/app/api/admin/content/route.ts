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
    const [headerContent, heroContent, packagesSettings, testimonialsSettings, footerSettings, contactSettings] = await Promise.all([
      db.siteSettings.findFirst({ where: { id: 'main' } }),
      db.heroSlide.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
      db.siteSettings.findFirst({ where: { id: 'packages_settings' } }),
      db.siteSettings.findFirst({ where: { id: 'testimonials_settings' } }),
      db.siteSettings.findFirst({ where: { id: 'footer_settings' } }),
      db.siteSettings.findFirst({ where: { id: 'contact_settings' } })
    ]);

    // Parse JSON fields
    const packagesData = packagesSettings?.siteKeywords ? JSON.parse(packagesSettings.siteKeywords) : null;
    const testimonialsData = testimonialsSettings?.siteKeywords ? JSON.parse(testimonialsSettings.siteKeywords) : null;
    const footerData = footerSettings?.siteKeywords ? JSON.parse(footerSettings.siteKeywords) : null;
    const contactData = contactSettings?.siteKeywords ? JSON.parse(contactSettings.siteKeywords) : null;

    return NextResponse.json({
      header: headerContent,
      hero: heroContent[0] || null,
      packages: packagesData,
      testimonials: testimonialsData,
      footer: footerData,
      contact: contactData
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
      await db.heroSlide.upsert({
        where: { id: 'main' },
        update: {
          title: content.title,
          subtitle: content.subtitle,
          features: JSON.stringify(content.features || []),
          stats: JSON.stringify(content.stats || {})
        },
        create: {
          id: 'main',
          title: content.title,
          subtitle: content.subtitle,
          features: JSON.stringify(content.features || []),
          stats: JSON.stringify(content.stats || {}),
          isActive: true,
          sortOrder: 1
        }
      });
    } else if (section === 'packages') {
      // Update packages section settings
      await db.siteSettings.upsert({
        where: { id: 'packages_settings' },
        update: {
          siteName: content.title,
          siteDescription: content.subtitle,
          siteKeywords: JSON.stringify(content)
        },
        create: {
          id: 'packages_settings',
          siteName: content.title,
          siteDescription: content.subtitle,
          siteKeywords: JSON.stringify(content)
        }
      });
    } else if (section === 'testimonials') {
      // Update testimonials section settings
      await db.siteSettings.upsert({
        where: { id: 'testimonials_settings' },
        update: {
          siteName: content.title,
          siteDescription: content.subtitle,
          siteKeywords: JSON.stringify(content)
        },
        create: {
          id: 'testimonials_settings',
          siteName: content.title,
          siteDescription: content.subtitle,
          siteKeywords: JSON.stringify(content)
        }
      });
    } else if (section === 'footer') {
      // Update footer settings
      await db.siteSettings.upsert({
        where: { id: 'footer_settings' },
        update: {
          siteName: content.logoText,
          siteDescription: content.description,
          siteKeywords: JSON.stringify(content)
        },
        create: {
          id: 'footer_settings',
          siteName: content.logoText,
          siteDescription: content.description,
          siteKeywords: JSON.stringify(content)
        }
      });
    } else if (section === 'contact') {
      // Update contact section settings
      await db.siteSettings.upsert({
        where: { id: 'contact_settings' },
        update: {
          siteName: content.title,
          siteDescription: content.subtitle,
          siteKeywords: JSON.stringify(content)
        },
        create: {
          id: 'contact_settings',
          siteName: content.title,
          siteDescription: content.subtitle,
          siteKeywords: JSON.stringify(content)
        }
      });
    }

    return NextResponse.json({ message: "Content updated successfully" });
  } catch (error) {
    console.error("Error updating content:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}