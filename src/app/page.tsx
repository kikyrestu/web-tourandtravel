"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, Users, Calendar, ChevronLeft, ChevronRight, Facebook, Instagram, Twitter, Phone, Mail, MapPinned, Clock3, Quote, Play, Mountain, Camera, Heart, Sparkles, HelpCircle, ChevronDown, ChevronUp, Search, ZoomIn, Share } from "lucide-react";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const heroSlides = [
    {
      title: "Jelajahi Keindahan Bromo",
      subtitle: "Sunrise spektakuler di puncak gunung yang memukau - nikmati keajaiban alam Jawa Timur yang memukau hati",
      image: "/bromo-sunrise.jpg",
      videoId: "bromo-intro",
      features: ["Sunrise Penanjakan", "Lautan Pasir", "Kawah Bromo", "Hutan Pinus"],
      stats: { rating: 4.8, reviews: 2341, tours: 1567 }
    },
    {
      title: "Petualangan Blue Fire Ijen",
      subtitle: "Saksikan fenomena api biru yang memukau di tengah malam - pengalaman langka yang hanya ada di dua tempat di dunia",
      image: "/ijen-bluefire.jpg",
      videoId: "ijen-bluefire",
      features: ["Blue Fire", "Kawah Ijen", "Air Terjun", "Kebun Kopi"],
      stats: { rating: 4.9, reviews: 1876, tours: 892 }
    },
    {
      title: "Wisata Alam Nusantara",
      subtitle: "Temukan keajaiban alam Indonesia yang tak terlupakan - dari sabana hingga lautan pasir yang mempesona",
      image: "/nusantara-landscape.jpg",
      videoId: "nusantara-adventure",
      features: ["Savana Hill", "Traditional Village", "Cultural Experience", "Local Cuisine"],
      stats: { rating: 4.7, reviews: 3241, tours: 2134 }
    }
  ];

  const tourPackages = [
    {
      id: 1,
      name: "Paket Bromo Midnight",
      duration: "2 Hari 1 Malam",
      price: "Rp 750.000",
      originalPrice: "Rp 950.000",
      discount: "21%",
      rating: 4.8,
      reviews: 234,
      location: "Bromo, Jawa Timur",
      highlights: ["Sunrise Penanjakan", "Lautan Pasir", "Kawah Bromo", "Hutan Pinus"],
      description: "Nikmati pengalaman tak terlupakan menyaksikan sunrise spektakuler dari puncak Penanjakan. Paket ini mencakup transportasi, penginapan, makan, dan pemandu wisata profesional.",
      image: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=600&h=400&dpr=1"
    },
    {
      id: 2,
      name: "Paket Ijen Blue Fire",
      duration: "3 Hari 2 Malam",
      price: "Rp 1.250.000",
      originalPrice: "Rp 1.550.000",
      discount: "19%",
      rating: 4.9,
      reviews: 189,
      location: "Ijen, Jawa Timur",
      highlights: ["Blue Fire", "Kawah Ijen", "Air Terjun", "Kebun Kopi"],
      description: "Petualangan ekstrem menyaksikan fenomena alam langka Blue Fire di tengah malam. Dilengkapi dengan safety equipment dan pemandu berpengalaman.",
      image: "https://images.unsplash.com/photo-1582009635269-2330ae079f1b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=600&h=400&dpr=1"
    },
    {
      id: 3,
      name: "Paket Bromo Ijen Combo",
      duration: "4 Hari 3 Malam",
      price: "Rp 1.850.000",
      originalPrice: "Rp 2.350.000",
      discount: "21%",
      rating: 4.9,
      reviews: 156,
      location: "Bromo & Ijen, Jawa Timur",
      highlights: ["Bromo Sunrise", "Ijen Blue Fire", "Savana Hill", "Traditional Village"],
      description: "Paket lengkap mengunjungi dua destinasi legendaris Jawa Timur. Gabungan antara keindahan sunrise Bromo dan misteri Blue Fire Ijen dalam satu perjalanan.",
      image: "https://images.unsplash.com/photo-1637292872273-1fc99340ac04?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=600&h=400&dpr=1"
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Sarah Wijaya",
      rating: 5,
      comment: "Pengalaman yang luar biasa! Pemandu sangat ramah dan profesional. Bromo sunrise-nya benar-benar memukau. Fasilitas lengkap dan jadwal perjalanan sangat teratur. Recommended banget untuk keluarga maupun rombongan.",
      date: "2 minggu yang lalu",
      tour: "Paket Bromo Midnight",
      detail: "Perjalanan dimulai dari Surabaya malam hari, sampai di Bromo tepat waktu untuk menyaksikan sunrise. Pemandu kami Pak Budi sangat informatif dan sabar menjawab semua pertanyaan."
    },
    {
      id: 2,
      name: "Budi Santoso",
      rating: 5,
      comment: "Blue Fire Ijen adalah pengalaman terindah dalam hidup saya. Terima kasih Nusantara Tour! Tim sangat profesional dan safety oriented. Perjalanan melelahkan tapi sangat berharga.",
      date: "1 bulan yang lalu",
      tour: "Paket Ijen Blue Fire",
      detail: "Start trekking jam 2 pagi, cukup menantang tapi pemandu selalu memastikan kondisi fisik kami ok. Safety equipment lengkap, termasuk gas masker yang sangat penting."
    },
    {
      id: 3,
      name: "Maya Putri",
      rating: 4,
      comment: "Perjalanan yang sangat menyenangkan, fasilitas lengkap dan pelayanan memuaskan. Paket combo Bromo-Ijen sangat worth it. Hanya saja penginapan bisa sedikit lebih baik.",
      date: "3 minggu yang lalu",
      tour: "Paket Bromo Ijen Combo",
      detail: "4 hari 3 malam yang padat tapi menyenangkan. Bromo sunrise-nya cantik, Blue Fire Ijen magis. Makanan enak, transport nyaman. Overall sangat recommended!"
    },
    {
      id: 4,
      name: "Rizki Pratama",
      rating: 5,
      comment: "Harga terjangkau dengan kualitas premium. Recommended banget untuk liburan keluarga. Anak-anak sangat menikmati petualangan ini. Tim Nusantara Tour sangat helpful.",
      date: "1 bulan yang lalu",
      tour: "Paket Bromo Midnight",
      detail: "Bawa keluarga 4 orang, semua senang. Driver ramah, mobil bersih dan nyaman. Hotel di Bromo area cukup bagus dengan view langsung ke gunung. Breakfast dengan view sunrise luar biasa!"
    },
    {
      id: 5,
      name: "Dewi Lestari",
      rating: 5,
      comment: "Service luar biasa! Dari mulai booking hingga selesai perjalanan sangat smooth. Tim Nusantara Tour sangat detail dan memperhatikan kebutuhan pelanggan. Bromo memang selalu memukau!",
      date: "2 bulan yang lalu",
      tour: "Paket Bromo Midnight",
      detail: "Ini kunjungan ketiga saya ke Bromo dengan Nusantara Tour. Kali ini saya bawa teman-teman kantor dan semuanya puas. Pelayanan konsisten dari tahun ke tahun."
    },
    {
      id: 6,
      name: "Ahmad Fauzi",
      rating: 4,
      comment: "Petualangan seru ke Ijen! Blue Fire-nya memang spektakuler. Pemandu kami sangat berpengalaman dan tahu spot-spot terbaik untuk foto. Recommended untuk yang suka tantangan!",
      date: "3 minggu yang lalu",
      tour: "Paket Ijen Blue Fire",
      detail: "Trekking cukup berat tapi hasilnya sepadan. Pemandu Pak Andi sangat sabar dan selalu memotivasi. Safety equipment lengkap, jadi merasa aman selama perjalanan."
    },
    {
      id: 7,
      name: "Siti Nurhaliza",
      rating: 5,
      comment: "Liburan keluarga yang tak terlupakan! Anak-anak sangat menikmati perjalanan ke Bromo. Tim Nusantara Tour sangat ramah dengan anak-anak. Fasilitas ramah keluarga.",
      date: "1 bulan yang lalu",
      tour: "Paket Bromo Midnight",
      detail: "Bawa 2 anak kecil, khawatir mereka akan capek. Tapi tim Nusantara Tour sangat perhatian, jadwal disesuaikan dengan kondisi anak-anak. Mereka senang banget!"
    },
    {
      id: 8,
      name: "Hendra Wijaya",
      rating: 5,
      comment: "Combo Bromo-Ijen adalah pilihan terbaik! Dua destinasi legendaris dalam satu paket. Tim sangat profesional dan selalu memastikan kenyamanan pelanggan. Worth every penny!",
      date: "2 minggu yang lalu",
      tour: "Paket Bromo Ijen Combo",
      detail: "4 hari penuh petualangan. Bromo sunrise-nya epic, Blue Fire Ijen magical. Transport nyaman, hotel bersih, makanan enak. Tim sangat kooperatif dan fleksibel."
    },
    {
      id: 9,
      name: "Rina Susanti",
      rating: 4,
      comment: "Pengalaman pertama ke Bromo dan hasilnya luar biasa! Nusantara Tour membuat perjalanan pertama saya menjadi sangat berkesan. Pemandu sangat knowledgeable tentang Bromo.",
      date: "3 minggu yang lalu",
      tour: "Paket Bromo Midnight",
      detail: "Sebagai first timer, saya banyak pertanyaan. Pemandu kami Mbak Ani sangat sabar menjelaskan semuanya. Dari sejarah Bromo hingga tips fotografi, sangat informatif!"
    },
    {
      id: 10,
      name: "Fajar Nugroho",
      rating: 5,
      comment: "Blue Fire Ijen adalah pengalaman spiritual yang tak terlupakan! Nusantara Tour tidak hanya menyediakan jasa tour, tapi juga pengalaman yang mendalam. Tim sangat profesional dan caring.",
      date: "1 bulan yang lalu",
      tour: "Paket Ijen Blue Fire",
      detail: "Perjalanan spiritual sekaligus petualangan. Pemandu Pak Budi tidak hanya guide, tapi juga teman berbagi cerita. Pengalaman yang mengubah perspektif saya tentang alam."
    },
    {
      id: 11,
      name: "Linda Kartika",
      rating: 5,
      comment: "Honeymoon yang sempurna! Suami dan saya memilih paket Bromo untuk honeymoon dan hasilnya luar biasa. Nusantara Tour memberikan sentuhan khusus untuk pasangan honeymoon.",
      date: "2 bulan yang lalu",
      tour: "Paket Bromo Midnight",
      detail: "Kasih tahu tim ini untuk honeymoon, mereka kasih treatment khusus. Hotel di Bromo dengan view sunrise romantis, bahkan ada surprise kecil dari tim. Very memorable!"
    },
    {
      id: 12,
      name: "Bambang Suryanto",
      rating: 4,
      comment: "Team building perusahaan yang sukses! Bawa 20 orang karyawan ke Bromo dan semuanya puas. Nusantara Tour sangat profesional dalam handle group besar. Recommended untuk corporate!",
      date: "1 bulan yang lalu",
      tour: "Paket Bromo Midnight",
      detail: "Handle 20 orang tidak gampang, tapi Nusantara Tour sangat terorganisir. Dari transport, akomodasi, hingga jadwal semua berjalan smooth. Team building jadi lebih efektif!"
    }
  ];

  const articles = [
    {
      id: 1,
      title: "Tips Liburan ke Bromo Untuk Pemula",
      excerpt: "Panduan lengkap untuk Anda yang pertama kali mengunjungi Gunung Bromo. Dari persiapan hingga tips fotografi. Artikel ini akan membahas segala hal yang perlu Anda ketahui sebelum memulai petualangan ke salah satu gunung berapi paling terkenal di Indonesia.",
      content: "Gunung Bromo merupakan salah satu destinasi wisata paling populer di Jawa Timur. Bagi pemula, persiapan yang matang sangat penting untuk memastikan perjalanan berjalan lancar. Artikel ini akan membahas mulai dari transportasi, penginapan, hingga tips fotografi terbaik.",
      category: "Tips Wisata",
      readTime: "5 menit",
      image: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=600&h=400&dpr=1"
    },
    {
      id: 2,
      title: "Misteri Blue Fire Kawah Ijen",
      excerpt: "Mengungkap fenomena alam unik api biru yang hanya ada di dua tempat di dunia, salah satunya di Indonesia. Blue Fire atau api biru merupakan fenomena langka yang terjadi akibat pembakaran gas belerang.",
      content: "Fenomena Blue Fire di Kawah Ijen adalah salah satu keajaiban alam paling langka di dunia. Hanya ada di dua tempat di dunia dimana Anda bisa menyaksikan fenomena ini, dan salah satunya ada di Indonesia. Artikel ini menjelaskan secara detail proses terbentuknya Blue Fire.",
      category: "Fakta Unik",
      readTime: "7 menit",
      image: "https://images.unsplash.com/photo-1582009635269-2330ae079f1b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=600&h=400&dpr=1"
    },
    {
      id: 3,
      title: "Waktu Terbaik Mengunjungi Bromo",
      excerpt: "Panduan memilih waktu yang tepat untuk berkunjung ke Bromo agar mendapatkan pengalaman terbaik. Bromo bisa dikunjungi sepanjang tahun, namun ada waktu-waktu tertentu yang lebih ideal.",
      content: "Memilih waktu yang tepat untuk mengunjungi Bromo sangat penting untuk mendapatkan pengalaman terbaik. Artikel ini membahas tentang musim, cuaca, dan event khusus di Bromo yang bisa menjadi pertimbangan Anda dalam merencanakan liburan.",
      category: "Travel Guide",
      readTime: "4 menit",
      image: "https://images.unsplash.com/photo-1637292872273-1fc99340ac04?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=600&h=400&dpr=1"
    },
    {
      id: 4,
      title: "Peralatan Wajib Pendakian Ijen",
      excerpt: "Daftar perlengkapan penting yang harus dibawa saat mendaki Gunung Ijen untuk keselamatan dan kenyamanan. Pendakian Ijen memerlukan persiapan khusus karena medan yang cukup berat.",
      content: "Pendakian ke Gunung Ijen memerlukan persiapan matang, terutama untuk peralatan keselamatan. Artikel ini memberikan daftar lengkap perlengkapan yang harus dibawa, mulai dari pakaian hingga safety equipment yang sangat penting.",
      category: "Tips Wisata",
      readTime: "6 menit",
      image: "https://images.unsplash.com/photo-1582009635269-2330ae079f1b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=600&h=400&dpr=1"
    },
    {
      id: 5,
      title: "Spot Foto Terbaik di Bromo",
      excerpt: "Rekomendasi lokasi fotografi terbaik di Bromo untuk menghasilkan foto yang Instagramable. Bromo menawarkan banyak spot foto menakjubkan dengan latar belakang yang spektakuler.",
      content: "Bromo adalah surga bagi para fotografer. Dari sunrise di Penanjakan hingga landscape di lautan pasir, setiap sudut Bromo menawarkan keindahan yang memukau. Artikel ini merangkum spot-spot foto terbaik dengan tips fotografi profesional.",
      category: "Fotografi",
      readTime: "5 menit",
      image: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=600&h=400&dpr=1"
    },
    {
      id: 6,
      title: "Cerita di Balik Nama Gunung Bromo",
      excerpt: "Asal usul dan filosofi nama Gunung Bromo yang erat kaitannya dengan mitologi Jawa. Nama Bromo berasal dari kata Brahma, dewa pencipta dalam agama Hindu.",
      content: "Gunung Bromo tidak hanya menawarkan keindahan alam yang memukau, tetapi juga memiliki kisah sejarah dan filosofi yang mendalam. Artikel ini mengungkap asal usul nama Bromo dan makna filosofisnya dalam budaya Jawa.",
      category: "Budaya",
      readTime: "8 menit",
      image: "https://images.unsplash.com/photo-1637292872273-1fc99340ac04?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=600&h=400&dpr=1"
    }
  ];

  const faqs = [
    {
      id: 1,
      question: "Apa saja yang termasuk dalam paket tour?",
      answer: "Transportasi AC, penginapan, makan, tiket destinasi, pemandu profesional, dan dokumentasi foto."
    },
    {
      id: 2,
      question: "Kapan waktu terbaik mengunjungi Bromo?",
      answer: "Bulan Mei - September saat cuaca cerah. Sunrise start jam 3-4 pagi."
    },
    {
      id: 3,
      question: "Apakah tour aman untuk anak-anak dan orang tua?",
      answer: "Ya, aman untuk semua usia dengan rute dan kendaraan yang disesuaikan."
    },
    {
      id: 4,
      question: "Bagaimana sistem pembayarannya?",
      answer: "DP 30% untuk booking, pelunasan 70% H-3 sebelum keberangkatan."
    },
    {
      id: 5,
      question: "Apa yang harus dibawa selama tour?",
      answer: "Pakaian hangat, sepatu trekking, jaket, topi, kamera, dan obat-obatan pribadi."
    }
  ];

  const galleryImages = [
    {
      id: 1,
      title: "Sunrise Bromo",
      category: "bromo",
      description: "Sunrise spektakuler dari puncak Penanjakan dengan view Gunung Bromo yang memukau",
      image: "/bromo-sunrise.jpg",
      featured: true
    },
    {
      id: 2,
      title: "Blue Fire Ijen",
      category: "ijen",
      description: "Fenomena alam langka Blue Fire di Kawah Ijen pada dini hari",
      image: "/ijen-bluefire.jpg",
      featured: true
    },
    {
      id: 3,
      title: "Lautan Pasir Bromo",
      category: "bromo",
      description: "Hamparan lautan pasir yang luas dengan background Gunung Bromo",
      image: "/bromo-jeep.jpg",
      featured: false
    },
    {
      id: 4,
      title: "Kawah Ijen",
      category: "ijen",
      description: "Kawah hijau terbesar di dunia dengan pemandangan yang menakjubkan",
      image: "/ijen-crater.jpg",
      featured: true
    },
    {
      id: 5,
      title: "Savana Bromo",
      category: "bromo",
      description: "Padang savana hijau dengan rumput yang melimpah",
      image: "/bromo-savanna.jpg",
      featured: false
    },
    {
      id: 6,
      title: "Penambang Belerang",
      category: "ijen",
      description: "Penambang belerang tradisional yang bekerja di Kawah Ijen",
      image: "/ijen-crater.jpg",
      featured: false
    },
    {
      id: 7,
      title: "Pura Luhur Poten",
      category: "bromo",
      description: "Pura suci masyarakat Hindu di kaki Gunung Bromo",
      image: "/bromo-sunrise.jpg",
      featured: false
    },
    {
      id: 8,
      title: "Air Terjun Ijen",
      category: "ijen",
      description: "Air terjun yang mempesona di sekitar area Kawah Ijen",
      image: "/ijen-waterfall.jpg",
      featured: false
    },
    {
      id: 9,
      title: "Jeep Adventure",
      category: "bromo",
      description: "Petualangan jeep di lautan pasir Bromo yang seru",
      image: "/bromo-jeep.jpg",
      featured: true
    },
    {
      id: 10,
      title: "Trekking Ijen",
      category: "ijen",
      description: "Jalur trekking menuju puncak Kawah Ijen",
      image: "/ijen-crater.jpg",
      featured: false
    },
    {
      id: 11,
      title: "Bromo Milky Way",
      category: "bromo",
      description: "Galaksi Bima Sakti di atas Gunung Bromo yang memukau",
      image: "/bromo-sunrise.jpg",
      featured: true
    },
    {
      id: 12,
      title: "Sunrise Ijen",
      category: "ijen",
      description: "Sunrise dari puncak Kawah Ijen dengan view yang spektakuler",
      image: "/ijen-bluefire.jpg",
      featured: true
    }
  ];

  const galleryCategories = [
    { id: 'all', name: 'Semua', icon: '📷' },
    { id: 'bromo', name: 'Bromo', icon: '🌋' },
    { id: 'ijen', name: 'Ijen', icon: '🔥' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        setIsAnimating(false);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroSlides.length]);

  // Scroll progress effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const progress = Math.min(scrollPosition / windowHeight, 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const testimonialsPerSlide = 4;
  const totalTestimonialSlides = Math.ceil(testimonials.length / testimonialsPerSlide);

  useEffect(() => {
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % totalTestimonialSlides);
    }, 6000);

    return () => clearInterval(testimonialInterval);
  }, [totalTestimonialSlides]);

  const nextSlide = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      setIsAnimating(false);
    }, 500);
  };

  const prevSlide = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
      setIsAnimating(false);
    }, 500);
  };

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % totalTestimonialSlides);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + totalTestimonialSlides) % totalTestimonialSlides);
  };

  const toggleVideo = () => {
    setIsVideoPlaying(!isVideoPlaying);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  const openImageModal = (imageId: number) => {
    setSelectedImage(imageId);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const filteredGalleryImages = selectedGalleryCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedGalleryCategory);

  const featuredImages = galleryImages.filter(img => img.featured);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${index < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">NT</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Nusantara Tour</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-600 hover:text-orange-500 transition-colors">Beranda</a>
              <a href="#packages" className="text-gray-600 hover:text-orange-500 transition-colors">Paket Tour</a>
              <a href="#about" className="text-gray-600 hover:text-orange-500 transition-colors">Tentang Kami</a>
              <a href="#testimonials" className="text-gray-600 hover:text-orange-500 transition-colors">Testimoni</a>
              <a href="#articles" className="text-gray-600 hover:text-orange-500 transition-colors">Artikel</a>
              <a href="#gallery" className="text-gray-600 hover:text-orange-500 transition-colors">Galeri</a>
              <a href="#faq" className="text-gray-600 hover:text-orange-500 transition-colors">FAQ</a>
            </nav>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              Hubungi Kami
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section with Enhanced Features */}
      <section className="relative h-screen overflow-hidden">
        {/* Scroll Progress Bar */}
        <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
          <div 
            className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-300"
            style={{ width: `${scrollProgress * 100}%` }}
          ></div>
        </div>

        {/* Background Slides with Parallax Effect */}
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ${
                index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-110"
              }`}
              style={{
                transform: `translateY(${scrollProgress * 50}px) scale(${index === currentSlide ? 1 : 1.1})`
              }}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
                unoptimized
              />
            </div>
          ))}
        </div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 text-white/20 animate-bounce">
            <Mountain className="w-8 h-8" />
          </div>
          <div className="absolute top-40 right-20 text-white/20 animate-pulse">
            <Camera className="w-6 h-6" />
          </div>
          <div className="absolute bottom-40 left-20 text-white/20 animate-bounce delay-1000">
            <Heart className="w-5 h-5" />
          </div>
          <div className="absolute bottom-20 right-10 text-white/20 animate-pulse delay-2000">
            <Sparkles className="w-7 h-7" />
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Content - Main Hero Text */}
              <div className="lg:col-span-7 text-white">
                {/* Badge */}
                <div className={`flex items-center space-x-2 mb-6 transform transition-all duration-1000 ${
                  isAnimating ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"
                }`}>
                  <Badge className="bg-orange-500 text-white border-orange-400">
                    <Star className="w-4 h-4 mr-1" />
                    {heroSlides[currentSlide].stats.rating}/5.0
                  </Badge>
                  <Badge variant="outline" className="border-white text-white">
                    {heroSlides[currentSlide].stats.reviews.toLocaleString()} Reviews
                  </Badge>
                  <Badge variant="outline" className="border-white text-white">
                    {heroSlides[currentSlide].stats.tours.toLocaleString()}+ Tours
                  </Badge>
                </div>

                {/* Main Title with Animated Underline */}
                <div className={`relative mb-6 transform transition-all duration-1000 ${
                  isAnimating ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"
                }`}>
                  <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                    {heroSlides[currentSlide].title}
                  </h1>
                  <div className="absolute -bottom-2 left-0 w-32 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-pulse"></div>
                </div>

                {/* Subtitle */}
                <p className={`text-lg md:text-xl mb-6 text-gray-100 leading-relaxed transform transition-all duration-1000 delay-200 ${
                  isAnimating ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"
                }`}>
                  {heroSlides[currentSlide].subtitle}
                </p>

                {/* Description */}
                <p className={`text-base md:text-lg mb-8 text-gray-200 leading-relaxed transform transition-all duration-1000 delay-300 ${
                  isAnimating ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"
                }`}>
                  Bergabunglah dengan ribuan pelanggan yang telah merasakan pengalaman wisata tak terlupakan bersama kami. 
                  Dapatkan penawaran terbaik dan pelayanan profesional untuk liburan impian Anda.
                </p>

                {/* Feature Tags */}
                <div className={`flex flex-wrap gap-3 mb-8 transform transition-all duration-1000 delay-400 ${
                  isAnimating ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"
                }`}>
                  {heroSlides[currentSlide].features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                      <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                      <span className="text-sm text-white">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className={`flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 transform transition-all duration-1000 delay-500 ${
                  isAnimating ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"
                }`}>
                  <Button 
                    size="lg" 
                    className="bg-orange-500 hover:bg-orange-600 text-white group relative overflow-hidden"
                    onClick={() => scrollToSection('packages')}
                  >
                    <span className="relative z-10 flex items-center">
                      Jelajahi Sekarang
                      <Mountain className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                  </Button>
                  
                  <Button 
                    size="lg" 
                    className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900"
                    onClick={toggleVideo}
                  >
                    <Play className="mr-2 w-5 h-5" />
                    {isVideoPlaying ? 'Tutup Video' : 'Tonton Video'}
                  </Button>

                  <Button 
                    size="lg" 
                    variant="ghost" 
                    className="text-white hover:bg-white/10 border border-white/20"
                    onClick={() => scrollToSection('testimonials')}
                  >
                    <Star className="mr-2 w-5 h-5" />
                    Lihat Testimoni
                  </Button>
                </div>
              </div>

              {/* Right Content - Visual Elements */}
              <div className="lg:col-span-5 hidden lg:block">
                <div className={`relative transform transition-all duration-1000 delay-300 ${
                  isAnimating ? "translate-x-4 opacity-0" : "translate-x-0 opacity-100"
                }`}>
                  {/* Decorative Elements */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-500/20 rounded-full blur-xl"></div>
                  <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-red-500/20 rounded-full blur-xl"></div>
                  
                  {/* Stats Cards */}
                  <div className="space-y-4 relative z-10">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-300">Customer Rating</p>
                          <p className="text-2xl font-bold text-white">{heroSlides[currentSlide].stats.rating}/5.0</p>
                        </div>
                        <Star className="w-8 h-8 text-orange-400" />
                      </div>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-300">Happy Travelers</p>
                          <p className="text-2xl font-bold text-white">{heroSlides[currentSlide].stats.reviews.toLocaleString()}+</p>
                        </div>
                        <Users className="w-8 h-8 text-blue-400" />
                      </div>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-300">Successful Tours</p>
                          <p className="text-2xl font-bold text-white">{heroSlides[currentSlide].stats.tours.toLocaleString()}+</p>
                        </div>
                        <MapPin className="w-8 h-8 text-green-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Modal (Conditional) */}
        {isVideoPlaying && (
          <div className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 transform transition-all duration-500 ${
            isVideoPlaying ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}>
            <div className="relative max-w-4xl w-full bg-white rounded-lg overflow-hidden">
              <button 
                onClick={toggleVideo}
                className="absolute top-4 right-4 z-10 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
              >
                ✕
              </button>
              <div className="aspect-video bg-gray-900 flex items-center justify-center">
                <div className="text-center text-white">
                  <Play className="w-16 h-16 mx-auto mb-4 text-orange-500" />
                  <h3 className="text-xl font-semibold mb-2">Video Preview</h3>
                  <p className="text-gray-400">Video untuk {heroSlides[currentSlide].title}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAnimating(true);
                setTimeout(() => {
                  setCurrentSlide(index);
                  setIsAnimating(false);
                }, 500);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? "bg-white w-8 shadow-lg" 
                  : "bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/20 transition-all duration-300 border border-white/20"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/20 transition-all duration-300 border border-white/20"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 right-8 text-white/60 animate-bounce">
          <div className="flex flex-col items-center">
            <span className="text-sm mb-2">Scroll</span>
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Tentang Nusantara Tour & Travel
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Nusantara Tour & Travel adalah agen wisata terpercaya yang telah berpengalaman lebih dari 10 tahun 
              dalam menyediakan layanan tour terbaik di Indonesia. Kami berkomitmen untuk memberikan pengalaman 
              wisata yang tak terlupakan dengan harga terjangkau dan pelayanan prima.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Didirikan pada tahun 2014, Nusantara Tour & Travel telah melayani lebih dari 10,000 pelanggan 
              dari berbagai penjuru Indonesia dan mancanegara. Tim kami terdiri dari para profesional yang 
              berpengalaman di bidang pariwisata, siap memberikan pelayanan terbaik untuk membuat liburan 
              Anda menjadi pengalaman yang tak terlupakan.
            </p>
            <p className="text-lg text-gray-600 mb-12 leading-relaxed">
              Kami mengkhususkan diri dalam paket wisata ke Gunung Bromo dan Kawah Ijen, dua destinasi 
              legendaris di Jawa Timur yang menawarkan keindahan alam yang spektakuler. Setiap paket tour 
              kami dirancang dengan matang, mempertimbangkan aspek keselamatan, kenyamanan, dan kepuasan 
              pelanggan sebagai prioritas utama.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">10,000+</h3>
                <p className="text-gray-600">Pelanggan Puas</p>
                <p className="text-sm text-gray-500 mt-2">Dari seluruh Indonesia dan mancanegara</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">50+</h3>
                <p className="text-gray-600">Destinasi Wisata</p>
                <p className="text-sm text-gray-500 mt-2">Destinasi terbaik di Indonesia</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">4.9/5</h3>
                <p className="text-gray-600">Rating Pelanggan</p>
                <p className="text-sm text-gray-500 mt-2">Berdasarkan 2,500+ review</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tour Packages Section */}
      <section id="packages" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Paket Tour Unggulan
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
              Pilih paket tour terbaik kami untuk pengalaman wisata yang tak terlupakan
            </p>
            <p className="text-md text-gray-500 max-w-3xl mx-auto">
              Setiap paket tour kami dirancang dengan matang untuk memberikan pengalaman wisata yang optimal. 
              Dari fasilitas lengkap, pemandu profesional, hingga jadwal perjalanan yang teratur, 
              kami memastikan liburan Anda menjadi momen yang berharga dan tak terlupakan.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {tourPackages.map((tour) => (
              <Card key={tour.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative group cursor-pointer" onClick={() => window.location.href = `/packages/${tour.id}`}>
                  <Image src={tour.image} alt={tour.name} width={400} height={200} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" unoptimized />
                  <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                    {tour.discount} OFF
                  </Badge>
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <CardContent className="p-6">
                  <CardTitle className="text-xl mb-2 cursor-pointer hover:text-orange-500 transition-colors" onClick={() => window.location.href = `/packages/${tour.id}`}>
                    {tour.name}
                  </CardTitle>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{tour.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600 mb-4">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="text-sm">{tour.duration}</span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                    {tour.description}
                  </p>
                  
                  <div className="flex items-center mb-4">
                    <div className="flex mr-2">
                      {renderStars(tour.rating)}
                    </div>
                    <span className="text-sm text-gray-600">
                      {tour.rating} ({tour.reviews} reviews)
                    </span>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Highlight:</h4>
                    <div className="flex flex-wrap gap-2">
                      {tour.highlights.map((highlight, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-orange-500">{tour.price}</span>
                      <span className="text-sm text-gray-500 line-through ml-2">{tour.originalPrice}</span>
                    </div>
                  </div>

                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white" onClick={() => window.location.href = `/packages/${tour.id}`}>
                    Lihat Detail & Pesan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Apa Kata Mereka
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
              Testimoni dari pelanggan yang telah merasakan pengalaman tak terlupakan bersama kami
            </p>
            <p className="text-md text-gray-500 max-w-3xl mx-auto">
              Kepuasan pelanggan adalah prioritas utama kami. Setiap testimoni berikut adalah bukti 
              komitmen kami dalam memberikan pelayanan terbaik dan pengalaman wisata yang berkualitas. 
              Kami bangga telah menjadi bagian dari liburan tak terlupakan ribuan keluarga dan wisatawan.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="relative">
              {/* Testimonial Carousel */}
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentTestimonial * 25}%)` }}
                >
                  {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="w-1/4 flex-shrink-0 px-3">
                      <Card className="p-6 hover:shadow-lg transition-shadow h-full">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-orange-500 font-bold text-lg">
                              {testimonial.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold">{testimonial.name}</h4>
                            <p className="text-sm text-gray-600">{testimonial.date}</p>
                          </div>
                        </div>
                        
                        <div className="flex mb-3">
                          {renderStars(testimonial.rating)}
                        </div>
                        
                        <div className="relative mb-3">
                          <Quote className="absolute -top-2 -left-2 w-6 h-6 text-orange-200" />
                          <p className="text-gray-700 text-sm leading-relaxed italic pl-4">
                            "{testimonial.comment}"
                          </p>
                        </div>
                        
                        <p className="text-gray-600 text-xs mb-3 leading-relaxed line-clamp-2">
                          {testimonial.detail}
                        </p>
                        <p className="text-orange-500 font-medium text-sm">- {testimonial.tour}</p>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>

              {/* Carousel Controls */}
              <button
                onClick={prevTestimonial}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors -ml-4 z-10"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={nextTestimonial}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors -mr-4 z-10"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>

              {/* Carousel Indicators */}
              <div className="flex justify-center mt-6 space-x-2">
                {Array.from({ length: totalTestimonialSlides }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentTestimonial ? "bg-orange-500 w-6" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section id="articles" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Artikel Wisata
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-4">
              Baca artikel menarik seputar wisata dan tips liburan
            </p>
            <p className="text-md text-gray-500 max-w-3xl mx-auto">
              Dapatkan informasi lengkap seputar destinasi wisata, tips perjalanan, dan panduan liburan 
              dari tim ahli kami. Setiap artikel ditulis dengan detail dan pengalaman nyata untuk membantu 
              Anda merencanakan liburan yang sempurna dan tak terlupakan.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Card key={article.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <Image src={article.image} alt={article.title} width={400} height={200} className="w-full h-48 object-cover" unoptimized />
                <CardContent className="p-6">
                  <Badge variant="secondary" className="mb-3">{article.category}</Badge>
                  <CardTitle className="text-lg mb-3 line-clamp-2">{article.title}</CardTitle>
                  <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">{article.excerpt}</p>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">{article.content}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{article.readTime} baca</span>
                    <Button variant="link" className="text-orange-500 hover:text-orange-600 p-0">
                      Baca Selengkapnya →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-500 text-sm">
              Jawaban untuk pertanyaan yang sering diajukan
            </p>
          </div>

          {/* FAQ Grid Layout */}
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {faqs.slice(0, 4).map((faq) => (
                <div 
                  key={faq.id}
                  className="group cursor-pointer"
                  onClick={() => toggleFAQ(faq.id)}
                >
                  <div className="bg-gray-50 rounded-lg p-4 hover:bg-orange-50 transition-colors border border-gray-200 group-hover:border-orange-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800 text-sm mb-2">
                          {faq.question}
                        </h3>
                        <div className={`overflow-hidden transition-all duration-300 ${
                          openFAQ === faq.id ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
                        }`}>
                          <p className="text-gray-600 text-xs leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                      <div className="ml-3 flex-shrink-0">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                          openFAQ === faq.id 
                            ? 'border-orange-500 bg-orange-500' 
                            : 'border-gray-300 group-hover:border-orange-300'
                        }`}>
                          {openFAQ === faq.id ? (
                            <div className="w-1 h-1 bg-white rounded-full"></div>
                          ) : (
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Last FAQ - Full Width */}
            <div className="mt-4">
              <div 
                className="group cursor-pointer"
                onClick={() => toggleFAQ(faqs[4].id)}
              >
                <div className="bg-orange-50 rounded-lg p-4 hover:bg-orange-100 transition-colors border border-orange-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800 text-sm mb-2">
                        {faqs[4].question}
                      </h3>
                      <div className={`overflow-hidden transition-all duration-300 ${
                        openFAQ === faqs[4].id ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
                      }`}>
                        <p className="text-gray-600 text-xs leading-relaxed">
                          {faqs[4].answer}
                        </p>
                      </div>
                    </div>
                    <div className="ml-3 flex-shrink-0">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        openFAQ === faqs[4].id 
                          ? 'border-orange-500 bg-orange-500' 
                          : 'border-orange-300'
                      }`}>
                        {openFAQ === faqs[4].id ? (
                          <div className="w-1 h-1 bg-white rounded-full"></div>
                        ) : (
                          <div className="w-1 h-1 bg-orange-400 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-200 to-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-200 to-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-yellow-200 to-red-200 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-bounce"></div>
          
          {/* Geometric Shapes */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-orange-300 transform rotate-45 opacity-10 animate-spin-slow"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-blue-300 rounded-full opacity-10 animate-ping"></div>
          <div className="absolute top-1/3 right-20 w-16 h-40 bg-purple-300 transform rotate-12 opacity-10 animate-pulse"></div>
          <div className="absolute bottom-1/3 left-20 w-40 h-16 bg-pink-300 transform -rotate-12 opacity-10 animate-bounce delay-500"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Creative Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center mb-6 relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full blur-lg opacity-30 animate-pulse"></div>
              <div className="relative bg-white rounded-full p-4 shadow-xl">
                <Camera className="w-10 h-10 text-orange-500" />
              </div>
            </div>
            
            <h2 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6 relative">
              <span className="relative z-10">Galeri Wisata</span>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-full"></div>
            </h2>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4 leading-relaxed">
              Jelajahi keindahan destinasi wisata melalui kamera kami
            </p>
            <p className="text-lg text-gray-500 max-w-3xl mx-auto">
              Koleksi foto-foto terbaik dari perjalanan kami ke Gunung Bromo dan Kawah Ijen. 
              Setiap gambar menceritakan kisah pengalaman tak terlupakan yang bisa Anda rasakan juga.
            </p>
          </div>

          {/* Abstract Featured Images */}
          <div className="mb-16 relative">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 border-2 border-dashed border-orange-300 rounded-full transform rotate-12 opacity-20"></div>
            </div>
            
            <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center relative">
              <span className="bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                Foto Unggulan
              </span>
            </h3>
            
            <div className="relative">
              {/* Floating Abstract Elements */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-orange-400 rounded-full opacity-60 animate-bounce"></div>
              <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-pink-400 rounded-full opacity-60 animate-ping"></div>
              
              <div className="grid md:grid-cols-3 gap-8 relative">
                {featuredImages.slice(0, 3).map((image, index) => (
                  <div 
                    key={image.id} 
                    className={`relative group cursor-pointer overflow-hidden rounded-2xl shadow-2xl transform transition-all duration-500 hover:scale-105 hover:rotate-1 ${
                      index === 0 ? 'md:-translate-y-4' : index === 2 ? 'md:translate-y-4' : ''
                    }`}
                    onClick={() => openImageModal(image.id)}
                  >
                    {/* Abstract Frame */}
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
                    
                    <img 
                      src={image.image} 
                      alt={image.title}
                      className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Creative Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <div className="flex items-center mb-2">
                          <div className="w-2 h-2 bg-orange-400 rounded-full mr-2 animate-pulse"></div>
                          <h4 className="font-bold text-xl">{image.title}</h4>
                        </div>
                        <p className="text-sm text-gray-200 leading-relaxed">{image.description}</p>
                      </div>
                    </div>
                    
                    {/* Floating Badge */}
                    <div className="absolute top-6 right-6 transform group-hover:scale-110 transition-transform duration-300">
                      <div className="relative">
                        <div className="absolute inset-0 bg-orange-500 rounded-full blur-lg opacity-60"></div>
                        <Badge className="relative bg-orange-500 text-white border-orange-400 shadow-lg">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Corner Decorations */}
                    <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-orange-400 rounded-tl-2xl opacity-60"></div>
                    <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-pink-400 rounded-br-2xl opacity-60"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Creative Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12 relative">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent opacity-30"></div>
            </div>
            
            {galleryCategories.map((category, index) => (
              <Button
                key={category.id}
                variant={selectedGalleryCategory === category.id ? "default" : "outline"}
                className={`relative group transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 ${
                  selectedGalleryCategory === category.id 
                    ? "bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg" 
                    : "border-2 border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400"
                }`}
                onClick={() => setSelectedGalleryCategory(category.id)}
              >
                <div className={`absolute inset-0 rounded-lg ${
                  selectedGalleryCategory === category.id 
                    ? "bg-gradient-to-r from-orange-400 to-pink-400 opacity-30" 
                    : "bg-orange-100 opacity-0 group-hover:opacity-30"
                } transition-opacity duration-300`}></div>
                
                <div className="relative z-10 flex items-center space-x-2">
                  <span className="text-lg">{category.icon}</span>
                  <span className="font-medium">{category.name}</span>
                </div>
                
                {/* Floating Effect */}
                {selectedGalleryCategory === category.id && (
                  <div className="absolute -top-2 -right-2 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                )}
              </Button>
            ))}
          </div>

          {/* Abstract Gallery Grid */}
          <div className="relative mb-16">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="w-full h-full bg-repeat" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff6b35' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundSize: '60px 60px'
              }}></div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 relative">
              {filteredGalleryImages.map((image, index) => {
                const rotation = (index % 3) - 1; // -1, 0, or 1 degree rotation
                const translateY = (index % 2) === 0 ? '-2px' : '2px';
                
                return (
                  <div 
                    key={image.id} 
                    className={`relative group cursor-pointer overflow-hidden rounded-xl shadow-lg transform transition-all duration-500 hover:scale-105 hover:rotate-1 hover:shadow-2xl`}
                    style={{
                      transform: `rotate(${rotation}deg) translateY(${translateY})`
                    }}
                    onClick={() => openImageModal(image.id)}
                  >
                    {/* Abstract Border */}
                    <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-orange-300 transition-all duration-500"></div>
                    
                    {/* Image Container */}
                    <div className="relative overflow-hidden rounded-xl">
                      <img 
                        src={image.image} 
                        alt={image.title}
                        className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      
                      {/* Creative Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                          <h4 className="font-bold text-base mb-1">{image.title}</h4>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
                              {image.category}
                            </Badge>
                            {image.featured && (
                              <Badge className="text-xs bg-orange-500 text-white">
                                <Star className="w-2 h-2 mr-1" />
                                Featured
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {/* Center Zoom Icon */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-500 shadow-xl">
                          <div className="relative">
                            <div className="absolute inset-0 bg-orange-400 rounded-full blur-lg opacity-60"></div>
                            <ZoomIn className="w-6 h-6 text-orange-500 relative z-10" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Corner Accents */}
                      <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-white/50 rounded-tl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-white/50 rounded-br opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    
                    {/* Floating Element */}
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-500 animate-pulse"></div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Creative Gallery Stats */}
          <div className="text-center relative">
            <div className="inline-flex items-center space-x-12 bg-gradient-to-r from-white via-gray-50 to-white rounded-full px-12 py-6 shadow-2xl border border-gray-200 relative overflow-hidden">
              {/* Background Effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-100 to-pink-100 opacity-30"></div>
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-16 bg-gradient-to-b from-orange-400 to-pink-400 rounded-full"></div>
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-16 bg-gradient-to-b from-pink-400 to-purple-400 rounded-full"></div>
              
              {[
                { value: galleryImages.length, label: 'Total Foto', color: 'from-orange-500 to-red-500' },
                { value: featuredImages.length, label: 'Foto Unggulan', color: 'from-pink-500 to-purple-500' },
                { value: galleryCategories.length - 1, label: 'Destinasi', color: 'from-purple-500 to-blue-500' }
              ].map((stat, index) => (
                <div key={index} className="relative z-10 text-center">
                  <div className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                  <div className="w-8 h-1 bg-gradient-to-r from-orange-300 to-pink-300 rounded-full mx-auto mt-2"></div>
                </div>
              ))}
            </div>
            
            {/* Floating Decorations */}
            <div className="absolute -top-4 left-1/4 w-3 h-3 bg-orange-400 rounded-full animate-bounce"></div>
            <div className="absolute -bottom-4 right-1/4 w-3 h-3 bg-pink-400 rounded-full animate-ping"></div>
          </div>
        </div>

        {/* Image Modal */}
        {selectedImage !== null && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeImageModal}>
            <div className="relative max-w-4xl w-full max-h-[90vh] overflow-hidden rounded-lg" onClick={(e) => e.stopPropagation()}>
              <button 
                onClick={closeImageModal}
                className="absolute top-4 right-4 z-10 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
              >
                ✕
              </button>
              
              {(() => {
                const image = galleryImages.find(img => img.id === selectedImage);
                if (!image) return null;
                
                return (
                  <>
                    <img 
                      src={image.image} 
                      alt={image.title}
                      className="w-full h-auto max-h-[70vh] object-contain"
                    />
                    <div className="bg-white p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-800">{image.title}</h3>
                        <div className="flex space-x-2">
                          <Badge variant="outline" className="text-orange-600 border-orange-300">
                            {image.category}
                          </Badge>
                          {image.featured && (
                            <Badge className="bg-orange-500 text-white">
                              <Star className="w-3 h-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4">{image.description}</p>
                      <div className="flex items-center justify-between">
                        <Button 
                          variant="outline" 
                          className="text-orange-500 border-orange-300 hover:bg-orange-50"
                          onClick={() => scrollToSection('packages')}
                        >
                          <Mountain className="w-4 h-4 mr-2" />
                          Pesan Tour
                        </Button>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost" className="text-gray-600">
                            <Heart className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-gray-600">
                            <Share className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">NT</span>
                </div>
                <h3 className="text-xl font-bold">Nusantara Tour</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Agen wisata terpercaya untuk petualangan tak terlupakan di Indonesia.
              </p>
              <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                Sejak 2014, kami telah berkomitmen untuk menyediakan layanan wisata berkualitas 
                dengan harga terjangkau. Tim profesional siap membantu mewujudkan liburan impian Anda.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Beranda</a></li>
                <li><a href="#packages" className="text-gray-400 hover:text-white transition-colors">Paket Tour</a></li>
                <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">Tentang Kami</a></li>
                <li><a href="#testimonials" className="text-gray-400 hover:text-white transition-colors">Testimoni</a></li>
                <li><a href="#articles" className="text-gray-400 hover:text-white transition-colors">Artikel Wisata</a></li>
                <li><a href="#gallery" className="text-gray-400 hover:text-white transition-colors">Galeri</a></li>
                <li><a href="#faq" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
              </ul>
              <p className="text-gray-500 text-sm mt-4">
                Akses cepat ke informasi penting tentang layanan kami.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Destinasi Populer</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Gunung Bromo</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Kawah Ijen</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Bali</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Yogyakarta</a></li>
              </ul>
              <p className="text-gray-500 text-sm mt-4">
                Jelajahi destinasi wisata terbaik di Indonesia.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Kontak Kami</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>+62 812-3456-7890</span>
                </li>
                <li className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>info@nusantaratour.com</span>
                </li>
                <li className="flex items-center">
                  <MapPinned className="w-4 h-4 mr-2" />
                  <span>Jl. Wisata No. 123, Jakarta</span>
                </li>
                <li className="flex items-center">
                  <Clock3 className="w-4 h-4 mr-2" />
                  <span>Senin - Sabtu: 09:00 - 18:00</span>
                </li>
              </ul>
              <p className="text-gray-500 text-sm mt-4">
                Hubungi kami untuk konsultasi gratis dan penawaran terbaik.
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Nusantara Tour & Travel. All rights reserved.</p>
            <p className="mt-2 text-sm">Mewujudkan impian wisata Anda dengan pengalaman tak terlupakan bersama kami.</p>
            <div className="mt-4 flex justify-center space-x-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}