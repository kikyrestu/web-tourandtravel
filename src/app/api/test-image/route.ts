import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET() {
  try {
    const imagePath = join(process.cwd(), "public", "bromo-sunrise.jpg");
    const imageBuffer = await readFile(imagePath);
    
    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error reading image:", error);
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }
}