import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";
import { writeFile } from "fs/promises";
import { join } from "path";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

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

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    
    // Fetch all dynamic content
    const [packages, articles, faqs] = await Promise.all([
      db.tourPackage.findMany({ where: { isActive: true } }),
      db.article.findMany({ where: { isActive: true } }),
      db.fAQ.findMany({ where: { isActive: true } }),
    ]);

    // Generate sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static Pages -->
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/packages</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/gallery</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  
  <!-- Tour Packages -->
  ${packages.map(pkg => `
  <url>
    <loc>${baseUrl}/packages/${pkg.id}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`).join('')}
  
  <!-- Articles -->
  ${articles.map(article => `
  <url>
    <loc>${baseUrl}/articles/${article.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
  
  <!-- FAQ -->
  <url>
    <loc>${baseUrl}/faq</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>`;

    // Save sitemap to public directory
    const sitemapPath = join(process.cwd(), "public", "sitemap.xml");
    await writeFile(sitemapPath, sitemap);

    // Also generate robots.txt
    const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml

# Crawl delay (optional)
Crawl-delay: 1`;

    const robotsPath = join(process.cwd(), "public", "robots.txt");
    await writeFile(robotsPath, robotsTxt);

    return NextResponse.json({ 
      message: "Sitemap generated successfully",
      sitemapUrl: `${baseUrl}/sitemap.xml`,
      robotsUrl: `${baseUrl}/robots.txt`
    });
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}