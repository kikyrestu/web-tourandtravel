import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    jwt.verify(token, JWT_SECRET);

    // For demo purposes, return sample data if database is not available
    try {
      const [siteSettings, heroSlides, tourPackages, testimonials, faqs] = await Promise.all([
        db.siteSettings.findFirst(),
        db.heroSlide.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
        db.tourPackage.findMany({ where: { isActive: true }, orderBy: { createdAt: 'desc' } }),
        db.testimonial.findMany({ where: { isActive: true }, orderBy: { createdAt: 'desc' } }),
        db.fAQ.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } })
      ]);

      // Format data for frontend
      const headerContent = {
        logoText: siteSettings?.siteName || 'Nusantara Tour',
        navItems: [
          { text: 'Beranda', href: '#', isActive: true },
          { text: 'Paket', href: '#packages', isActive: true },
          { text: 'Testimoni', href: '#testimonials', isActive: true },
          { text: 'Kontak', href: '#contact', isActive: true },
        ],
        ctaButton: { text: 'Hubungi Kami', href: '#contact', isActive: true },
        contactInfo: {
          phone: siteSettings?.contactPhone || '+62 812-3456-7890',
          email: siteSettings?.contactEmail || 'info@nusantaratour.com',
          address: siteSettings?.contactAddress || 'Jakarta, Indonesia'
        },
        socialLinks: siteSettings?.socialLinks ? JSON.parse(siteSettings.socialLinks) : {
          facebook: 'https://facebook.com/nusantaratour',
          instagram: 'https://instagram.com/nusantaratour',
          twitter: 'https://twitter.com/nusantaratour',
          youtube: 'https://youtube.com/nusantaratour'
        }
      };

      const heroContent = heroSlides.length > 0 ? {
        title: heroSlides[0].title,
        subtitle: heroSlides[0].subtitle,
        description: 'Bergabunglah dengan ribuan pelanggan yang telah merasakan pengalaman wisata tak terlupakan bersama kami. Dapatkan penawaran terbaik dan pelayanan profesional untuk liburan impian Anda.',
        backgroundImage: heroSlides[0].image || '/bromo-sunrise.jpg',
        ctaButtons: [
          { text: 'Jelajahi Sekarang', href: '#packages', style: 'primary', isActive: true },
          { text: 'Tonton Video', href: '#', style: 'secondary', isActive: true },
          { text: 'Lihat Testimoni', href: '#testimonials', style: 'outline', isActive: true }
        ],
        features: heroSlides[0].features ? JSON.parse(heroSlides[0].features) : [
          { text: 'Sunrise Penanjakan', icon: 'sun', isActive: true },
          { text: 'Lautan Pasir', icon: 'mountain', isActive: true },
          { text: 'Kawah Bromo', icon: 'map-pin', isActive: true },
          { text: 'Hutan Pinus', icon: 'trees', isActive: true }
        ],
        stats: heroSlides[0].stats ? JSON.parse(heroSlides[0].stats) : {
          rating: 4.8,
          reviews: 2341,
          tours: 1567
        }
      } : null;

      const packagesContent = {
        title: 'Paket Tour Kami',
        subtitle: 'Pilih paket tour terbaik untuk petualangan Anda',
        description: 'Kami menawarkan berbagai paket tour dengan harga terjangkau dan pelayanan terbaik. Dari paket hemat hingga paket premium, semua dirancang untuk memberikan pengalaman tak terlupakan.',
        showFeaturedOnly: false,
        maxPackages: 6
      };

      const testimonialsContent = {
        title: 'Testimoni Pelanggan',
        subtitle: 'Apa kata mereka tentang kami',
        description: 'Ribuan pelanggan telah merasakan pengalaman wisata tak terlupakan bersama kami. Berikut adalah testimoni dari beberapa pelanggan kami.',
        autoRotate: true,
        rotateInterval: 5000,
        showRating: true
      };

      const footerContent = {
        logoText: siteSettings?.siteName || 'Nusantara Tour',
        description: 'Nusantara Tour adalah penyedia layanan tour and travel terpercaya di Indonesia. Kami menawarkan berbagai paket wisata dengan harga terjangkau dan pelayanan terbaik.',
        quickLinks: [
          { text: 'Tentang Kami', href: '#about', isActive: true },
          { text: 'Paket Tour', href: '#packages', isActive: true },
          { text: 'Testimoni', href: '#testimonials', isActive: true },
          { text: 'Kontak', href: '#contact', isActive: true },
          { text: 'FAQ', href: '#faq', isActive: true }
        ],
        contactInfo: {
          phone: siteSettings?.contactPhone || '+62 812-3456-7890',
          email: siteSettings?.contactEmail || 'info@nusantaratour.com',
          address: siteSettings?.contactAddress || 'Jakarta, Indonesia'
        },
        socialLinks: siteSettings?.socialLinks ? JSON.parse(siteSettings.socialLinks) : {
          facebook: 'https://facebook.com/nusantaratour',
          instagram: 'https://instagram.com/nusantaratour',
          twitter: 'https://twitter.com/nusantaratour',
          youtube: 'https://youtube.com/nusantaratour'
        },
        copyrightText: '© 2024 Nusantara Tour. All rights reserved.'
      };

      const contactContent = {
        title: 'Hubungi Kami',
        subtitle: 'Siap melayani kebutuhan wisata Anda',
        description: 'Tim kami siap membantu Anda merencanakan liburan impian. Hubungi kami untuk informasi lebih lanjut tentang paket tour dan layanan kami.',
        formFields: [
          { name: 'name', label: 'Nama Lengkap', type: 'text', required: true, isActive: true },
          { name: 'email', label: 'Email', type: 'email', required: true, isActive: true },
          { name: 'phone', label: 'Telepon', type: 'tel', required: true, isActive: true },
          { name: 'message', label: 'Pesan', type: 'textarea', required: true, isActive: true }
        ],
        contactInfo: {
          phone: siteSettings?.contactPhone || '+62 812-3456-7890',
          email: siteSettings?.contactEmail || 'info@nusantaratour.com',
          address: siteSettings?.contactAddress || 'Jakarta, Indonesia',
          workingHours: 'Senin - Sabtu: 09:00 - 18:00'
        },
        showMap: true,
        mapUrl: 'https://maps.google.com/?q=Jakarta,Indonesia'
      };

      return NextResponse.json({
        header: headerContent,
        hero: heroContent,
        packages: packagesContent,
        testimonials: testimonialsContent,
        footer: footerContent,
        contact: contactContent
      });
    } catch (dbError) {
      // If database is not available, return demo data
      console.log('Database not available, returning demo data:', dbError);
      
      return NextResponse.json({
        header: {
          logoText: 'Nusantara Tour',
          navItems: [
            { text: 'Beranda', href: '#', isActive: true },
            { text: 'Paket', href: '#packages', isActive: true },
            { text: 'Testimoni', href: '#testimonials', isActive: true },
            { text: 'Kontak', href: '#contact', isActive: true },
          ],
          ctaButton: { text: 'Hubungi Kami', href: '#contact', isActive: true },
          contactInfo: {
            phone: '+62 812-3456-7890',
            email: 'info@nusantaratour.com',
            address: 'Jakarta, Indonesia'
          },
          socialLinks: {
            facebook: 'https://facebook.com/nusantaratour',
            instagram: 'https://instagram.com/nusantaratour',
            twitter: 'https://twitter.com/nusantaratour',
            youtube: 'https://youtube.com/nusantaratour'
          }
        },
        hero: {
          title: 'Jelajahi Keindahan Indonesia',
          subtitle: 'Temukan keajaiban alam Indonesia yang tak terlupakan',
          description: 'Bergabunglah dengan ribuan pelanggan yang telah merasakan pengalaman wisata tak terlupakan bersama kami. Dapatkan penawaran terbaik dan pelayanan profesional untuk liburan impian Anda.',
          backgroundImage: '/bromo-sunrise.jpg',
          ctaButtons: [
            { text: 'Jelajahi Sekarang', href: '#packages', style: 'primary', isActive: true },
            { text: 'Tonton Video', href: '#', style: 'secondary', isActive: true },
            { text: 'Lihat Testimoni', href: '#testimonials', style: 'outline', isActive: true }
          ],
          features: [
            { text: 'Sunrise Penanjakan', icon: 'sun', isActive: true },
            { text: 'Lautan Pasir', icon: 'mountain', isActive: true },
            { text: 'Kawah Bromo', icon: 'map-pin', isActive: true },
            { text: 'Hutan Pinus', icon: 'trees', isActive: true }
          ],
          stats: {
            rating: 4.8,
            reviews: 2341,
            tours: 1567
          }
        },
        packages: {
          title: 'Paket Tour Kami',
          subtitle: 'Pilih paket tour terbaik untuk petualangan Anda',
          description: 'Kami menawarkan berbagai paket tour dengan harga terjangkau dan pelayanan terbaik. Dari paket hemat hingga paket premium, semua dirancang untuk memberikan pengalaman tak terlupakan.',
          showFeaturedOnly: false,
          maxPackages: 6
        },
        testimonials: {
          title: 'Testimoni Pelanggan',
          subtitle: 'Apa kata mereka tentang kami',
          description: 'Ribuan pelanggan telah merasakan pengalaman wisata tak terlupakan bersama kami. Berikut adalah testimoni dari beberapa pelanggan kami.',
          autoRotate: true,
          rotateInterval: 5000,
          showRating: true
        },
        footer: {
          logoText: 'Nusantara Tour',
          description: 'Nusantara Tour adalah penyedia layanan tour and travel terpercaya di Indonesia. Kami menawarkan berbagai paket wisata dengan harga terjangkau dan pelayanan terbaik.',
          quickLinks: [
            { text: 'Tentang Kami', href: '#about', isActive: true },
            { text: 'Paket Tour', href: '#packages', isActive: true },
            { text: 'Testimoni', href: '#testimonials', isActive: true },
            { text: 'Kontak', href: '#contact', isActive: true },
            { text: 'FAQ', href: '#faq', isActive: true }
          ],
          contactInfo: {
            phone: '+62 812-3456-7890',
            email: 'info@nusantaratour.com',
            address: 'Jakarta, Indonesia'
          },
          socialLinks: {
            facebook: 'https://facebook.com/nusantaratour',
            instagram: 'https://instagram.com/nusantaratour',
            twitter: 'https://twitter.com/nusantaratour',
            youtube: 'https://youtube.com/nusantaratour'
          },
          copyrightText: '© 2024 Nusantara Tour. All rights reserved.'
        },
        contact: {
          title: 'Hubungi Kami',
          subtitle: 'Siap melayani kebutuhan wisata Anda',
          description: 'Tim kami siap membantu Anda merencanakan liburan impian. Hubungi kami untuk informasi lebih lanjut tentang paket tour dan layanan kami.',
          formFields: [
            { name: 'name', label: 'Nama Lengkap', type: 'text', required: true, isActive: true },
            { name: 'email', label: 'Email', type: 'email', required: true, isActive: true },
            { name: 'phone', label: 'Telepon', type: 'tel', required: true, isActive: true },
            { name: 'message', label: 'Pesan', type: 'textarea', required: true, isActive: true }
          ],
          contactInfo: {
            phone: '+62 812-3456-7890',
            email: 'info@nusantaratour.com',
            address: 'Jakarta, Indonesia',
            workingHours: 'Senin - Sabtu: 09:00 - 18:00'
          },
          showMap: true,
          mapUrl: 'https://maps.google.com/?q=Jakarta,Indonesia'
        }
      });
    }
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
    jwt.verify(token, JWT_SECRET);

    const { section, content } = await request.json();

    if (section === 'header') {
      // Update site settings for header - find first or create
      const existingSettings = await db.siteSettings.findFirst();
      
      if (existingSettings) {
        await db.siteSettings.update({
          where: { id: existingSettings.id },
          data: {
            siteName: content.logoText,
            contactPhone: content.contactInfo.phone,
            contactEmail: content.contactInfo.email,
            contactAddress: content.contactInfo.address,
            socialLinks: JSON.stringify(content.socialLinks)
          }
        });
      } else {
        await db.siteSettings.create({
          data: {
            siteName: content.logoText,
            siteDescription: 'Tour and travel terpercaya untuk menjelajahi keindahan Indonesia',
            siteKeywords: 'tour, travel, indonesia, bromo, ijen, wisata',
            contactPhone: content.contactInfo.phone,
            contactEmail: content.contactInfo.email,
            contactAddress: content.contactInfo.address,
            socialLinks: JSON.stringify(content.socialLinks)
          }
        });
      }
    } else if (section === 'hero') {
      // Update hero slide (update the first active hero slide)
      const existingHero = await db.heroSlide.findFirst({ where: { isActive: true } });
      
      if (existingHero) {
        await db.heroSlide.update({
          where: { id: existingHero.id },
          data: {
            title: content.title,
            subtitle: content.subtitle,
            features: JSON.stringify(content.features || []),
            stats: JSON.stringify(content.stats || {})
          }
        });
      } else {
        await db.heroSlide.create({
          data: {
            title: content.title,
            subtitle: content.subtitle,
            features: JSON.stringify(content.features || []),
            stats: JSON.stringify(content.stats || {}),
            isActive: true,
            sortOrder: 1
          }
        });
      }
    } else if (section === 'packages') {
      // Update packages section (currently just static, but we can save settings if needed)
      console.log('Packages section updated:', content);
    } else if (section === 'testimonials') {
      // Update testimonials section (currently just static, but we can save settings if needed)
      console.log('Testimonials section updated:', content);
    } else if (section === 'footer') {
      // Update site settings for footer
      const existingSettings = await db.siteSettings.findFirst();
      
      if (existingSettings) {
        await db.siteSettings.update({
          where: { id: existingSettings.id },
          data: {
            siteName: content.logoText,
            siteDescription: content.description
          }
        });
      } else {
        await db.siteSettings.create({
          data: {
            siteName: content.logoText,
            siteDescription: content.description,
            siteKeywords: 'tour, travel, indonesia, bromo, ijen, wisata'
          }
        });
      }
    } else if (section === 'contact') {
      // Update site settings for contact
      const existingSettings = await db.siteSettings.findFirst();
      
      if (existingSettings) {
        await db.siteSettings.update({
          where: { id: existingSettings.id },
          data: {
            contactPhone: content.contactInfo.phone,
            contactEmail: content.contactInfo.email,
            contactAddress: content.contactInfo.address
          }
        });
      } else {
        await db.siteSettings.create({
          data: {
            siteName: 'Nusantara Tour',
            siteDescription: 'Tour and travel terpercaya untuk menjelajahi keindahan Indonesia',
            siteKeywords: 'tour, travel, indonesia, bromo, ijen, wisata',
            contactPhone: content.contactInfo.phone,
            contactEmail: content.contactInfo.email,
            contactAddress: content.contactInfo.address
          }
        });
      }
    }

    return NextResponse.json({ message: "Content updated successfully" });
  } catch (error) {
    console.error("Error updating content:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}