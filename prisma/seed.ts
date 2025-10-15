import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.adminUser.upsert({
    where: { email: "admin@nusantaratour.com" },
    update: {},
    create: {
      email: "admin@nusantaratour.com",
      password: hashedPassword,
      name: "Admin Nusantara Tour",
      role: "admin",
    },
  });

  console.log("✅ Admin user created:", admin.email);

  // Create site settings
  const settings = await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      siteName: "Nusantara Tour",
      siteDescription: "Tour and Travel terpercaya untuk menjelajahi keindahan Indonesia",
      siteKeywords: "tour, travel, indonesia, bromo, ijen, wisata",
      contactEmail: "info@nusantaratour.com",
      contactPhone: "+62 812-3456-7890",
      contactAddress: "Jl. Wisata No. 123, Surabaya, Jawa Timur",
      socialLinks: JSON.stringify({
        facebook: "https://facebook.com/nusantaratour",
        instagram: "https://instagram.com/nusantaratour",
        twitter: "https://twitter.com/nusantaratour",
      }),
    },
  });

  console.log("✅ Site settings created");

  // Create sample tour packages
  const packages = await Promise.all([
    prisma.tourPackage.upsert({
      where: { id: "package-1" },
      update: {},
      create: {
        name: "Paket Bromo Midnight",
        duration: "2 Hari 1 Malam",
        price: "Rp 750.000",
        originalPrice: "Rp 950.000",
        discount: "21%",
        rating: 4.8,
        reviews: 234,
        location: "Bromo, Jawa Timur",
        highlights: JSON.stringify(["Sunrise Penanjakan", "Lautan Pasir", "Kawah Bromo", "Hutan Pinus"]),
        description: "Nikmati pengalaman tak terlupakan menyaksikan sunrise spektakuler dari puncak Penanjakan. Paket ini mencakup transportasi, penginapan, makan, dan pemandu wisata profesional.",
        image: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=600&h=400&dpr=1",
      },
    }),
    prisma.tourPackage.upsert({
      where: { id: "package-2" },
      update: {},
      create: {
        name: "Paket Ijen Blue Fire",
        duration: "3 Hari 2 Malam",
        price: "Rp 1.250.000",
        originalPrice: "Rp 1.550.000",
        discount: "19%",
        rating: 4.9,
        reviews: 189,
        location: "Ijen, Jawa Timur",
        highlights: JSON.stringify(["Blue Fire", "Kawah Ijen", "Air Terjun", "Kebun Kopi"]),
        description: "Petualangan ekstrem menyaksikan fenomena alam langka Blue Fire di tengah malam. Dilengkapi dengan safety equipment dan pemandu berpengalaman.",
        image: "https://images.unsplash.com/photo-1582009635269-2330ae079f1b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=600&h=400&dpr=1",
      },
    }),
    prisma.tourPackage.upsert({
      where: { id: "package-3" },
      update: {},
      create: {
        name: "Paket Bromo Ijen Combo",
        duration: "4 Hari 3 Malam",
        price: "Rp 1.850.000",
        originalPrice: "Rp 2.350.000",
        discount: "21%",
        rating: 4.9,
        reviews: 156,
        location: "Bromo & Ijen, Jawa Timur",
        highlights: JSON.stringify(["Bromo Sunrise", "Ijen Blue Fire", "Savana Hill", "Traditional Village"]),
        description: "Paket lengkap mengunjungi dua destinasi legendaris Jawa Timur. Gabungan antara keindahan sunrise Bromo dan misteri Blue Fire Ijen dalam satu perjalanan.",
        image: "https://images.unsplash.com/photo-1637292872273-1fc99340ac04?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=600&h=400&dpr=1",
      },
    }),
  ]);

  console.log("✅ Tour packages created:", packages.length);

  // Create hero slides
  const heroSlides = await Promise.all([
    prisma.heroSlide.upsert({
      where: { id: "hero-1" },
      update: {},
      create: {
        title: "Jelajahi Keindahan Bromo",
        subtitle: "Sunrise spektakuler di puncak gunung yang memukau - nikmati keajaiban alam Jawa Timur yang memukau hati",
        image: "/bromo-sunrise.jpg",
        features: JSON.stringify(["Sunrise Penanjakan", "Lautan Pasir", "Kawah Bromo", "Hutan Pinus"]),
        stats: JSON.stringify({ rating: 4.8, reviews: 2341, tours: 1567 }),
        sortOrder: 0,
      },
    }),
    prisma.heroSlide.upsert({
      where: { id: "hero-2" },
      update: {},
      create: {
        title: "Petualangan Blue Fire Ijen",
        subtitle: "Saksikan fenomena api biru yang memukau di tengah malam - pengalaman langka yang hanya ada di dua tempat di dunia",
        image: "/ijen-bluefire.jpg",
        features: JSON.stringify(["Blue Fire", "Kawah Ijen", "Air Terjun", "Kebun Kopi"]),
        stats: JSON.stringify({ rating: 4.9, reviews: 1876, tours: 892 }),
        sortOrder: 1,
      },
    }),
  ]);

  console.log("✅ Hero slides created:", heroSlides.length);

  // Create sample testimonials
  const testimonials = await Promise.all([
    prisma.testimonial.upsert({
      where: { id: "testimonial-1" },
      update: {},
      create: {
        name: "Sarah Wijaya",
        rating: 5,
        comment: "Pengalaman yang luar biasa! Pemandu sangat ramah dan profesional. Bromo sunrise-nya benar-benar memukau.",
        date: "2 minggu yang lalu",
        tour: "Paket Bromo Midnight",
        detail: "Perjalanan dimulai dari Surabaya malam hari, sampai di Bromo tepat waktu untuk menyaksikan sunrise.",
      },
    }),
    prisma.testimonial.upsert({
      where: { id: "testimonial-2" },
      update: {},
      create: {
        name: "Budi Santoso",
        rating: 5,
        comment: "Blue Fire Ijen adalah pengalaman terindah dalam hidup saya. Terima kasih Nusantara Tour!",
        date: "1 bulan yang lalu",
        tour: "Paket Ijen Blue Fire",
        detail: "Start trekking jam 2 pagi, cukup menantang tapi pemandu selalu memastikan kondisi fisik kami ok.",
      },
    }),
  ]);

  console.log("✅ Testimonials created:", testimonials.length);

  // Create sample FAQs
  const faqs = await Promise.all([
    prisma.fAQ.upsert({
      where: { id: "faq-1" },
      update: {},
      create: {
        question: "Apa saja yang termasuk dalam paket tour?",
        answer: "Transportasi AC, penginapan, makan, tiket destinasi, pemandu profesional, dan dokumentasi foto.",
        sortOrder: 0,
      },
    }),
    prisma.fAQ.upsert({
      where: { id: "faq-2" },
      update: {},
      create: {
        question: "Kapan waktu terbaik mengunjungi Bromo?",
        answer: "Bulan Mei - September saat cuaca cerah. Sunrise start jam 3-4 pagi.",
        sortOrder: 1,
      },
    }),
  ]);

  console.log("✅ FAQs created:", faqs.length);

  console.log("🎉 Database seeded successfully!");
  console.log("🔑 Admin login: admin@nusantaratour.com / admin123");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });