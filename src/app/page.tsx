"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, Users, Calendar, ChevronLeft, ChevronRight, Facebook, Instagram, Twitter, Phone, Mail, MapPinned, Clock3, Quote, Play, Mountain, Camera, Heart, Sparkles, HelpCircle, ChevronDown, ChevronUp, Search, ZoomIn, Share, Youtube } from "lucide-react";


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
  const [currentPackageIndex, setCurrentPackageIndex] = useState(0);

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

      if (!heroRes.ok || !packagesRes.ok || !testimonialsRes.ok || !faqsRes.ok || !settingsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const [heroData, packagesData, testimonialsData, faqsData, settingsData] = await Promise.all([
        heroRes.json(),
        packagesRes.json(),
        testimonialsRes.json(),
        faqsRes.json(),
        settingsRes.json()
      ]);

      setHeroSlides(heroData.data || []);
      setTourPackages(packagesData.data || []);
      setTestimonials(testimonialsData.data || []);
      setFaqs(faqsData.data || []);
      setSettings(settingsData.data || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleVideo = () => {
    setIsVideoPlaying(!isVideoPlaying);
  };

  const nextSlide = () => {
    if (heroSlides.length === 0) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      setIsAnimating(false);
    }, 500);
  };

  const prevSlide = () => {
    if (heroSlides.length === 0) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
      setIsAnimating(false);
    }, 500);
  };

  const nextTestimonial = () => {
    if (testimonials.length === 0) return;
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    if (testimonials.length === 0) return;
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Package carousel functions
  const getVisiblePackages = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width >= 1280) return 3; // xl
      if (width >= 1024) return 2; // lg
      return 1; // mobile
    }
    return 1;
  };

  const nextPackage = () => {
    const maxIndex = Math.max(0, tourPackages.length - getVisiblePackages());
    if (currentPackageIndex < maxIndex) {
      setCurrentPackageIndex(currentPackageIndex + 1);
    }
  };

  const prevPackage = () => {
    if (currentPackageIndex > 0) {
      setCurrentPackageIndex(currentPackageIndex - 1);
    }
  };

  // Handle scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollTop / docHeight;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-advance slides
  useEffect(() => {
    if (heroSlides.length === 0) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

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
          className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-300"
          style={{ width: `${scrollProgress * 100}%` }}
        ></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative w-10 h-10">
                <Image
                  src="/logo.svg"
                  alt="Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold text-gray-900">
                {settings?.siteName || 'Nusantara Tour'}
              </span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-gray-700 hover:text-orange-500 transition-colors">Beranda</a>
              <a href="#packages" className="text-gray-700 hover:text-orange-500 transition-colors">Paket</a>
              <a href="#testimonials" className="text-gray-700 hover:text-orange-500 transition-colors">Testimoni</a>
              <a href="#contact" className="text-gray-700 hover:text-orange-500 transition-colors">Kontak</a>
            </nav>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              Hubungi Kami
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden mt-16">
        {/* Background Slides */}
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-1000 ${
                index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-110"
              }`}
            >
              {slide.image && (
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                />
              )}
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
          ))}
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
                    {heroSlides[currentSlide]?.stats?.rating || '4.8'}/5.0
                  </Badge>
                  <Badge variant="outline" className="border-white text-white">
                    {heroSlides[currentSlide]?.stats?.reviews?.toLocaleString() || '2341'} Reviews
                  </Badge>
                  <Badge variant="outline" className="border-white text-white">
                    {heroSlides[currentSlide]?.stats?.tours?.toLocaleString() || '1567'}+ Tours
                  </Badge>
                </div>

                {/* Main Title */}
                <div className={`relative mb-6 transform transition-all duration-1000 ${
                  isAnimating ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"
                }`}>
                  <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                    {heroSlides[currentSlide]?.title || 'Jelajahi Keindahan Indonesia'}
                  </h1>
                  <div className="absolute -bottom-2 left-0 w-32 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-pulse"></div>
                </div>

                {/* Subtitle */}
                <p className={`text-lg md:text-xl mb-6 text-gray-100 leading-relaxed transform transition-all duration-1000 delay-200 ${
                  isAnimating ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"
                }`}>
                  {heroSlides[currentSlide]?.subtitle || 'Temukan keajaiban alam Indonesia yang tak terlupakan'}
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
                  {heroSlides[currentSlide]?.features?.map((feature, index) => (
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
                          <p className="text-2xl font-bold text-white">{heroSlides[currentSlide]?.stats?.rating || '4.8'}/5.0</p>
                        </div>
                        <Star className="w-8 h-8 text-orange-400" />
                      </div>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-300">Happy Travelers</p>
                          <p className="text-2xl font-bold text-white">{heroSlides[currentSlide]?.stats?.reviews?.toLocaleString() || '2341'}+</p>
                        </div>
                        <Users className="w-8 h-8 text-blue-400" />
                      </div>
                    </div>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-300">Successful Tours</p>
                          <p className="text-2xl font-bold text-white">{heroSlides[currentSlide]?.stats?.tours?.toLocaleString() || '1567'}+</p>
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

        {/* Video Modal */}
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
                  <p className="text-gray-400">Video untuk {heroSlides[currentSlide]?.title || 'Nusantara Tour'}</p>
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
                index === currentSlide ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </section>

      {/* About Section - Like Screenshot */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Tentang Nusantara Tour</h2>
            
            <div className="text-center mb-12">
              <p className="text-gray-700 leading-relaxed mb-6">
                Nusantara Tour & Travel adalah agen perjalanan wisata terpercaya di Indonesia yang telah beroperasi 
                selama lebih dari 10 tahun. Didirikan pada tahun 2014, kami telah melayani lebih dari 10.000 pelanggan 
                dengan tim profesional yang berdedikasi.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                Kami mengkhususkan diri dalam paket wisata ke destinasi terbaik di Jawa Timur, khususnya Gunung Bromo 
                dan Kawah Ijen. Dengan mengutamakan keselamatan, kenyamanan, dan kepuasan pelanggan, kami berkomitmen 
                untuk memberikan pengalaman wisata yang tak terlupakan.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Setiap paket tour kami dirancang dengan matang, didukung oleh pemandu berpengalaman dan fasilitas 
                terbaik untuk memastikan perjalanan Anda menjadi kenangan indah seumur hidup.
              </p>
            </div>

            {/* Stats Section - Like Screenshot */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">10,000+</h3>
                <p className="text-gray-600">Pelanggan Puas</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">50+</h3>
                <p className="text-gray-600">Destinasi Wisata</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">4.9/5</h3>
                <p className="text-gray-600">Rating Pelanggan</p>
                <p className="text-sm text-gray-500">(berdasarkan 2.500+ ulasan)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Horizontal Divider - Like Screenshot */}
      <div className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="h-0.5 bg-gray-300 w-full max-w-2xl"></div>
          </div>
        </div>
      </div>

      {/* Tour Packages Section */}
      <section id="packages" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Paket Tour Kami</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Pilih paket tour terbaik untuk pengalaman wisata tak terlupakan bersama kami
            </p>
          </div>

          {/* Carousel Tour Packages with Arrow Buttons */}
          <div className="relative">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentPackageIndex * (500 + 32)}px)` }}
              >
                {tourPackages.map((pkg) => (
                  <div key={pkg.id} className="flex-shrink-0 mr-8" style={{ width: '500px' }}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full" style={{ minHeight: '280px' }}>
                      <div className="flex h-full">
                        {/* Left Side - Image */}
                        <div className="relative w-1/3">
                          {pkg.image && (
                            <img
                              src={pkg.image}
                              alt={pkg.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                          {pkg.discount && (
                            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                              {pkg.discount} OFF
                            </div>
                          )}
                        </div>
                        
                        {/* Right Side - Content */}
                        <div className="w-2/3 p-6 flex flex-col justify-between h-full">
                          <div>
                            <div className="flex justify-between items-start mb-3">
                              <CardTitle className="text-xl">{pkg.name}</CardTitle>
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-sm font-semibold">{pkg.rating}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                              <Clock className="w-4 h-4" />
                              <span>{pkg.duration}</span>
                              <MapPin className="w-4 h-4 ml-2" />
                              <span>{pkg.location}</span>
                            </div>
                            
                            <p className="text-gray-600 mb-4 text-sm line-clamp-3">{pkg.description}</p>
                            
                            <div className="space-y-2 mb-4">
                              {pkg.highlights?.slice(0, 3).map((highlight, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                                  <span className="text-sm text-gray-600">{highlight}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              {pkg.originalPrice && (
                                <span className="text-sm text-gray-500 line-through">{pkg.originalPrice}</span>
                              )}
                              <div className="text-xl font-bold text-orange-500">{pkg.price}</div>
                            </div>
                            <Button className="bg-orange-500 hover:bg-orange-600">
                              Pesan Sekarang
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            {/* Arrow Buttons */}
            {tourPackages.length > 0 && (
              <>
                <button
                  onClick={prevPackage}
                  disabled={currentPackageIndex === 0}
                  className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full shadow-lg ${
                    currentPackageIndex === 0 
                      ? 'bg-gray-300 cursor-not-allowed' 
                      : 'bg-white hover:bg-gray-100'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <button
                  onClick={nextPackage}
                  disabled={currentPackageIndex >= tourPackages.length - getVisiblePackages()}
                  className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full shadow-lg ${
                    currentPackageIndex >= tourPackages.length - getVisiblePackages()
                      ? 'bg-gray-300 cursor-not-allowed' 
                      : 'bg-white hover:bg-gray-100'
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {tourPackages.length === 0 && (
            <div className="text-center py-12">
              <Mountain className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Belum ada paket tour tersedia</p>
            </div>
          )}
        </div>
      </section>

      {/* Horizontal Divider - After Tour Packages */}
      <div className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="h-0.5 bg-gray-300 w-full max-w-2xl"></div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Testimoni Pelanggan</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Dengarkan pengalaman langsung dari pelanggan yang telah berwisata bersama kami
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {testimonials.length > 0 ? (
              <div className="relative">
                <Card className="p-8">
                  <CardContent className="text-center">
                    <Quote className="w-12 h-12 mx-auto text-orange-400 mb-6" />
                    <p className="text-lg text-gray-700 mb-6 italic">
                      "{testimonials[currentTestimonial].comment}"
                    </p>
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < testimonials[currentTestimonial].rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonials[currentTestimonial].name}</h4>
                      <p className="text-sm text-gray-600">{testimonials[currentTestimonial].tour}</p>
                      <p className="text-xs text-gray-500 mt-1">{testimonials[currentTestimonial].date}</p>
                    </div>
                  </CardContent>
                </Card>

                <button
                  onClick={prevTestimonial}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-600" />
                </button>
                <button
                  onClick={nextTestimonial}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <ChevronRight className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            ) : (
              <div className="text-center py-12">
                <Quote className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Belum ada testimoni tersedia</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Pertanyaan Umum</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Temukan jawaban untuk pertanyaan yang sering diajukan tentang layanan kami
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {faqs.length > 0 ? (
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <Card key={faq.id}>
                    <CardHeader>
                      <Button
                        variant="ghost"
                        className="w-full justify-between p-0 h-auto"
                        onClick={() => toggleFAQ(index)}
                      >
                        <span className="text-left font-semibold">{faq.question}</span>
                        {openFAQ === index ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </Button>
                    </CardHeader>
                    {openFAQ === index && (
                      <CardContent>
                        <p className="text-gray-600">{faq.answer}</p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <HelpCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Belum ada FAQ tersedia</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">{settings?.siteName || 'Nusantara Tour'}</h3>
              <p className="text-gray-400">{settings?.siteDescription || 'Temukan keajaiban Indonesia bersama kami'}</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Beranda</a></li>
                <li><a href="#packages" className="hover:text-white transition-colors">Paket Tour</a></li>
                <li><a href="#testimonials" className="hover:text-white transition-colors">Testimoni</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Kontak</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Kontak</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>{settings?.contactPhone || '+62 812-3456-7890'}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>{settings?.contactEmail || 'info@nusantaratour.com'}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <MapPinned className="w-4 h-4" />
                  <span>{settings?.contactAddress || 'Jakarta, Indonesia'}</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                {settings?.socialLinks?.facebook && (
                  <a href={settings.socialLinks.facebook} className="text-gray-400 hover:text-white transition-colors">
                    <Facebook className="w-6 h-6" />
                  </a>
                )}
                {settings?.socialLinks?.instagram && (
                  <a href={settings.socialLinks.instagram} className="text-gray-400 hover:text-white transition-colors">
                    <Instagram className="w-6 h-6" />
                  </a>
                )}
                {settings?.socialLinks?.twitter && (
                  <a href={settings.socialLinks.twitter} className="text-gray-400 hover:text-white transition-colors">
                    <Twitter className="w-6 h-6" />
                  </a>
                )}
                {settings?.socialLinks?.youtube && (
                  <a href={settings.socialLinks.youtube} className="text-gray-400 hover:text-white transition-colors">
                    <Youtube className="w-6 h-6" />
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 {settings?.siteName || 'Nusantara Tour'}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}