import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const packages = await db.tourPackage.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });

    // Parse JSON fields
    const formattedPackages = packages.map(pkg => ({
      ...pkg,
      highlights: pkg.highlights ? JSON.parse(pkg.highlights) : []
    }));

    return NextResponse.json({ data: formattedPackages });
  } catch (error) {
    console.error('Error fetching tour packages:', error);
    return NextResponse.json({ error: 'Failed to fetch tour packages' }, { status: 500 });
  }
}