"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, Users, Calendar, ChevronLeft, ChevronRight, Facebook, Instagram, Twitter, Phone, Mail, MapPinned, Clock3, Quote, Play, Mountain, Camera, Heart, Sparkles, HelpCircle, ChevronDown, ChevronUp, Search, ZoomIn, Share } from "lucide-react";

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  image?: string;
  videoId?: string;
  features: string[];
  stats: any;
  isActive: boolean;
  sortOrder: number;
}

interface TourPackage {
  id: string;
  name: string;
  duration: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  rating: number;
  reviews: number;
  location: string;
  highlights: string[];
  description: string;
  image?: string;
  isActive: boolean;
}

interface Testimonial {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  tour: string;
  detail?: string;
  isActive: boolean;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  isActive: boolean;
  sortOrder: number;
}

interface SiteSettings {
  id: string;
  siteName: string;
  siteDescription: string;
  siteKeywords: string;
  headerBackground?: string;
  logo?: string;
  favicon?: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  socialLinks: any;
  seoMetaTitle?: string;
  seoMetaDescription?: string;
  seoMetaKeywords?: string;
}

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  // Data from backend
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [tourPackages, setTourPackages] = useState<TourPackage[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setError(null);
      const [heroRes, packagesRes, testimonialsRes, faqsRes, settingsRes] = await Promise.all([
        fetch('/api/public/hero'),
        fetch('/api/public/packages'),
        fetch('/api/public/testimonials'),
        fetch('/api/public/faqs'),
        fetch('/api/public/settings')
      ]);

      // Check if any response failed
      const responses = [heroRes, packagesRes, testimonialsRes, faqsRes, settingsRes];
      const hasError = responses.some(res => !res.ok);
      
      if (hasError) {
        throw new Error('Some API requests failed');
      }

      const [heroData, packagesData, testimonialsData, faqsData, settingsData] = await Promise.all([
        heroRes.json(),
        packagesRes.json(),
        testimonialsRes.json(),
        faqsRes.json(),
        settingsRes.json()
      ]);

      // Ensure arrays are properly set
      setHeroSlides(Array.isArray(heroData) ? heroData : []);
      setTourPackages(Array.isArray(packagesData) ? packagesData : []);
      setTestimonials(Array.isArray(testimonialsData) ? testimonialsData : []);
      setFaqs(Array.isArray(faqsData) ? faqsData : []);
      setSettings(settingsData || null);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please try again later.');
      // Set empty arrays as fallback
      setHeroSlides([]);
      setTourPackages([]);
      setTestimonials([]);
      setFaqs([]);
      setSettings(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (heroSlides.length > 0) {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (testimonials.length > 0) {
        setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextSlide = () => {
    if (heroSlides.length === 0) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      setIsAnimating(false);
    }, 300);
  };

  const prevSlide = () => {
    if (heroSlides.length === 0) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
      setIsAnimating(false);
    }, 300);
  };

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const nextTestimonial = () => {
    if (testimonials.length === 0) return;
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    if (testimonials.length === 0) return;
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchData}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {heroSlides.length > 0 && heroSlides[currentSlide] && (
          <>
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={heroSlides[currentSlide].image || '/nusantara-landscape.jpg'}
                alt={heroSlides[currentSlide].title}
                fill
                className="object-cover"
                priority
              />
              {/* Simple Clean Overlay */}
              <div className="absolute inset-0 bg-black/60" />
            </div>
<<<<<<< HEAD
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
=======
            
            <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
              <div className={`max-w-5xl mx-auto transition-all duration-1000 ${isAnimating ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'}`}>
                {/* Clean Single Color Title */}
                <div className="mb-8">
                  <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
                    {heroSlides[currentSlide].title}
                  </h1>
                  {/* Simple Decorative Line */}
                  <div className="w-24 h-1 bg-white mx-auto rounded-full mb-6"></div>
                </div>
                
                {/* Clean Subtitle */}
                <p className="text-xl md:text-2xl mb-12 text-gray-100 max-w-4xl mx-auto leading-relaxed">
                  {heroSlides[currentSlide].subtitle}
                </p>
                
                {/* Simple Features */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                  {heroSlides[currentSlide].features.map((feature, index) => (
                    <div key={index} className="group">
                      <Badge 
                        variant="secondary" 
                        className="text-lg px-6 py-3 bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30 transition-all duration-300"
                      >
                        {feature}
                      </Badge>
>>>>>>> aa23a612af37c7ab4f90e150c2ff31f938807a6f
                    </div>
                  ))}
                </div>

                {/* Clean CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                  <Button 
                    size="lg" 
                    className="bg-white text-gray-900 hover:bg-gray-100 px-10 py-5 text-xl rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
                  >
                    <span className="flex items-center gap-3">
                      <Calendar className="h-6 w-6" />
                      Pesan Sekarang
                    </span>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-10 py-5 text-xl rounded-full backdrop-blur-sm transition-all duration-300"
                  >
                    <span className="flex items-center gap-3">
                      <Play className="h-6 w-6" />
                      Lihat Video
                    </span>
                  </Button>
                </div>

                {/* Clean Stats */}
                <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                  {heroSlides[currentSlide].stats && (
                    <>
                      <div className="group transform hover:scale-105 transition-transform duration-300">
                        <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                          {heroSlides[currentSlide].stats.rating}
                        </div>
                        <div className="text-sm text-gray-300 uppercase tracking-wider">Rating</div>
                        <div className="flex justify-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400 mx-0.5" />
                          ))}
                        </div>
                      </div>
                      <div className="group transform hover:scale-105 transition-transform duration-300">
                        <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                          {heroSlides[currentSlide].stats.reviews}
                        </div>
                        <div className="text-sm text-gray-300 uppercase tracking-wider">Reviews</div>
                        <div className="w-8 h-0.5 bg-white mx-auto mt-1 rounded-full"></div>
                      </div>
                      <div className="group transform hover:scale-105 transition-transform duration-300">
                        <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                          {heroSlides[currentSlide].stats.tours}
                        </div>
                        <div className="text-sm text-gray-300 uppercase tracking-wider">Tours</div>
                        <div className="w-8 h-0.5 bg-white mx-auto mt-1 rounded-full"></div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Clean Navigation Buttons */}
            <button 
              onClick={prevSlide}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Clean Indicators */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`transition-all duration-300 ${currentSlide === index ? 'scale-125' : ''}`}
                >
                  <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentSlide === index 
                      ? 'bg-white' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}></div>
                </button>
              ))}
            </div>

            {/* Simple Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
              <ChevronDown className="h-6 w-6 text-white/60" />
            </div>
          </>
        )}
      </section>

      {/* Tour Packages Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Paket Tour Unggulan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Pilih paket tour terbaik kami dan nikmati pengalaman tak terlupakan menjelajahi keindahan Indonesia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tourPackages.map((pkg) => (
              <Card key={pkg.id} className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border-0 shadow-lg">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={pkg.image || '/nusantara-landscape.jpg'}
                    alt={pkg.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {pkg.discount && (
                    <Badge className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full shadow-lg">
                      {pkg.discount} OFF
                    </Badge>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{pkg.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{pkg.duration}</span>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <CardTitle className="text-xl font-bold mb-3 text-gray-800">{pkg.name}</CardTitle>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{pkg.rating}</span>
                      <span className="text-gray-500">({pkg.reviews} reviews)</span>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-3">{pkg.description}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {pkg.highlights.slice(0, 3).map((highlight, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                    {pkg.highlights.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{pkg.highlights.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      {pkg.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">{pkg.originalPrice}</span>
                      )}
                      <div className="text-2xl font-bold text-blue-600">{pkg.price}</div>
                    </div>
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Detail Paket
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {tourPackages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Belum ada paket tour tersedia</p>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Testimoni Pelanggan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Dengarkan pengalaman mereka yang telah menjelajahi Indonesia bersama kami
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {testimonials.length > 0 && testimonials[currentTestimonial] && (
              <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12 shadow-xl">
                <Quote className="absolute top-8 left-8 h-12 w-12 text-blue-200 opacity-50" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {testimonials[currentTestimonial].name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{testimonials[currentTestimonial].name}</h3>
                      <p className="text-gray-600">{testimonials[currentTestimonial].tour}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-5 w-5 ${i < testimonials[currentTestimonial].rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                      />
                    ))}
                    <span className="ml-2 text-gray-600">{testimonials[currentTestimonial].date}</span>
                  </div>

                  <p className="text-lg text-gray-700 leading-relaxed mb-6 italic">
                    "{testimonials[currentTestimonial].comment}"
                  </p>

                  {testimonials[currentTestimonial].detail && (
                    <p className="text-gray-600 leading-relaxed">
                      {testimonials[currentTestimonial].detail}
                    </p>
                  )}
                </div>

                <button 
                  onClick={prevTestimonial}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm text-gray-800 p-2 rounded-full hover:bg-white transition-all duration-300 shadow-lg"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button 
                  onClick={nextTestimonial}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm text-gray-800 p-2 rounded-full hover:bg-white transition-all duration-300 shadow-lg"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${currentTestimonial === index ? 'bg-blue-600 scale-125' : 'bg-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {testimonials.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Belum ada testimoni tersedia</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Pertanyaan Umum
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Temukan jawaban untuk pertanyaan yang sering diajukan tentang layanan kami
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div key={faq.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                >
                  <span className="font-semibold text-gray-800 flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 text-blue-600" />
                    {faq.question}
                  </span>
                  {openFAQ === index ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
                </button>
                {openFAQ === index && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}

            {faqs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Belum ada FAQ tersedia</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Hubungi Kami
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Siap memulai petualangan Anda? Hubungi kami sekarang juga!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {settings && (
              <>
                <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <Phone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Telepon</h3>
                  <p className="text-gray-600">{settings.contactPhone}</p>
                </Card>

                <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <Mail className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Email</h3>
                  <p className="text-gray-600">{settings.contactEmail}</p>
                </Card>

                <Card className="text-center p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                  <MapPinned className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Alamat</h3>
                  <p className="text-gray-600">{settings.contactAddress}</p>
                </Card>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {settings?.siteName || 'Nusantara Tour'}
              </h3>
              <p className="text-gray-400 mb-4">
                {settings?.siteDescription || 'Travel and Tour Agency specializing in Indonesian destinations'}
              </p>
              <div className="flex gap-4">
                {settings?.socialLinks && (
                  <>
                    {settings.socialLinks.facebook && (
                      <a href={settings.socialLinks.facebook} className="text-gray-400 hover:text-white transition-colors">
                        <Facebook className="h-6 w-6" />
                      </a>
                    )}
                    {settings.socialLinks.instagram && (
                      <a href={settings.socialLinks.instagram} className="text-gray-400 hover:text-white transition-colors">
                        <Instagram className="h-6 w-6" />
                      </a>
                    )}
                    {settings.socialLinks.twitter && (
                      <a href={settings.socialLinks.twitter} className="text-gray-400 hover:text-white transition-colors">
                        <Twitter className="h-6 w-6" />
                      </a>
                    )}
                  </>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Beranda</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Paket Tour</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Testimoni</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Destinasi</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Bromo</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Ijen</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Malang</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Surabaya</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
              <p className="text-gray-400 mb-4">Dapatkan penawaran terbaik dan tips wisata langsung di email Anda</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Email Anda" 
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 {settings?.siteName || 'Nusantara Tour'}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}