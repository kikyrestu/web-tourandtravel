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
            <div className="absolute inset-0">
              <Image
                src={heroSlides[currentSlide].image || '/nusantara-landscape.jpg'}
                alt={heroSlides[currentSlide].title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/50" />
            </div>
            
            <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
              <div className={`max-w-4xl mx-auto transition-all duration-1000 ${isAnimating ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'}`}>
                <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {heroSlides[currentSlide].title}
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto leading-relaxed">
                  {heroSlides[currentSlide].subtitle}
                </p>
                
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                  {heroSlides[currentSlide].features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-lg px-4 py-2 bg-white/20 backdrop-blur-sm border-white/30">
                      {feature}
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300">
                    <Calendar className="mr-2 h-5 w-5" />
                    Pesan Sekarang
                  </Button>
                  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg rounded-full backdrop-blur-sm">
                    <Play className="mr-2 h-5 w-5" />
                    Lihat Video
                  </Button>
                </div>

                <div className="mt-12 flex justify-center gap-8 text-center">
                  {heroSlides[currentSlide].stats && (
                    <>
                      <div>
                        <div className="text-3xl font-bold text-yellow-400">{heroSlides[currentSlide].stats.rating}</div>
                        <div className="text-sm text-gray-300">Rating</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-yellow-400">{heroSlides[currentSlide].stats.reviews}</div>
                        <div className="text-sm text-gray-300">Reviews</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-yellow-400">{heroSlides[currentSlide].stats.tours}</div>
                        <div className="text-sm text-gray-300">Tours</div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-white scale-125' : 'bg-white/50'}`}
                />
              ))}
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