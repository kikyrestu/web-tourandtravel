import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    // Fetch all dynamic content
    const [packages, articles, galleryItems] = await Promise.all([
      db.tourPackage.findMany({ where: { isActive: true } }),
      db.article.findMany({ where: { isActive: true } }),
      db.gallery.findMany({ where: { isActive: true } }),
    ]);

    // Generate sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static Pages -->
  <url>
    <loc>${baseUrl}</loc>
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
    <lastmod>${pkg.updatedAt.toISOString()}</lastmod>
  </url>`).join('')}
  
  <!-- Articles -->
  ${articles.map(article => `
  <url>
    <loc>${baseUrl}/articles/${article.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
    <lastmod>${article.updatedAt.toISOString()}</lastmod>
  </url>`).join('')}
  
  <!-- Gallery Items -->
  ${galleryItems.map(item => `
  <url>
    <loc>${baseUrl}/gallery/${item.id}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
    <lastmod>${item.updatedAt.toISOString()}</lastmod>
  </url>`).join('')}
</urlset>`;

    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 's-maxage=86400, stale-while-revalidate',
      },
    });
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}