"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  MapPin, 
  Clock, 
  Users, 
  Calendar, 
  Mountain, 
  Camera, 
  Heart,
  Share,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Phone,
  Mail,
  CreditCard,
  Shield,
  Car,
  Utensils,
  Coffee,
  Home,
  Camera as CameraIcon,
  MapPinned,
  Clock3
} from "lucide-react";

interface PackageDetail {
  id: number;
  name: string;
  duration: string;
  price: string;
  originalPrice: string;
  discount: string;
  rating: number;
  reviews: number;
  location: string;
  highlights: string[];
  description: string;
  image: string;
  itinerary: DayPlan[];
  includes: string[];
  excludes: string[];
  gallery: string[];
  meetingPoint: string;
  bestTime: string;
  difficulty: string;
  groupSize: string;
  guide: string;
  transportation: string;
  accommodation: string;
  meals: string;
}

interface DayPlan {
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals: string[];
  accommodation: string;
}

const packageDetails: PackageDetail[] = [
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
    image: "/bromo-sunrise.jpg",
    itinerary: [
      {
        day: 1,
        title: "Perjalanan Menuju Bromo",
        description: "Start perjalanan dari Surabaya menuju Bromo dengan jeep adventure",
        activities: [
          "22:00 - Penjemputan di Surabaya",
          "23:30 - Tiba di Bromo area, check-in penginapan",
          "Istirahat untuk persiapan sunrise"
        ],
        meals: ["Tidak termasuk"],
        accommodation: "Hotel Bromo area"
      },
      {
        day: 2,
        title: "Sunrise Adventure & Explore Bromo",
        description: "Nikmati sunrise spektakuler dan jelajahi keindahan Bromo",
        activities: [
          "03:00 - Start dengan jeep menuju Penanjakan",
          "04:30 - Menunggu sunrise di puncak Penanjakan",
          "06:00 - Explore Lautan Pasir dan Kawah Bromo",
          "08:00 - Breakfast di hotel",
          "10:00 - Check-out dan kembali ke Surabaya"
        ],
        meals: ["Breakfast"],
        accommodation: "-"
      }
    ],
    includes: [
      "Transportasi AC (Surabaya - Bromo PP)",
      "Jeep adventure di Bromo",
      "Penginapan 1 malam (twin share)",
      "Breakfast",
      "Tiket masuk semua destinasi",
      "Pemandu wisata profesional",
      "Dokumentasi foto",
      "Parkir"
    ],
    excludes: [
      "Lunch & dinner",
      "Personal expenses",
      "Tip untuk pemandu",
      "Asuransi perjalanan",
      "Rental horse di Bromo"
    ],
    gallery: [
      "/bromo-sunrise.jpg",
      "/bromo-jeep.jpg",
      "/bromo-savanna.jpg",
      "/ijen-crater.jpg"
    ],
    meetingPoint: "Surabaya (Hotel/Station/Airport)",
    bestTime: "Mei - September (cuaca cerah)",
    difficulty: "Mudah",
    groupSize: "2-12 orang",
    guide: "Berbahasa Indonesia & Inggris",
    transportation: "AC Bus + Jeep 4x4",
    accommodation: "Hotel ** di Bromo area",
    meals: "1x breakfast"
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
    image: "/ijen-bluefire.jpg",
    itinerary: [
      {
        day: 1,
        title: "Perjalanan ke Ijen Area",
        description: "Start perjalanan menuju Ijen area dengan pemandangan alam yang menakjubkan",
        activities: [
          "08:00 - Penjemputan di Surabaya/Banyuwangi",
          "12:00 - Makan siang di local restaurant",
          "15:00 - Check-in penginapan di Ijen area",
          "18:00 - Dinner dan briefing untuk Blue Fire trekking"
        ],
        meals: ["Lunch", "Dinner"],
        accommodation: "Hotel Ijen area"
      },
      {
        day: 2,
        title: "Blue Fire Adventure",
        description: "Trekking tengah malam untuk menyaksikan fenomena Blue Fire yang memukau",
        activities: [
          "00:00 - Start trekking ke puncak Ijen",
          "02:00 - Sampai di puncak, menyaksikan Blue Fire",
          "04:00 - Sunrise dengan view Kawah Ijen",
          "07:00 - Turun ke base camp",
          "10:00 - Explore coffee plantation",
          "14:00 - Kembali ke hotel, rest"
        ],
        meals: ["Breakfast", "Lunch"],
        accommodation: "Hotel Ijen area"
      },
      {
        day: 3,
        title: "Waterfall & Return",
        description: "Explore air terjun dan kembali ke kota asal",
        activities: [
          "08:00 - Explore air terjun di sekitar Ijen",
          "11:00 - Shopping oleh-oleh local",
          "13:00 - Lunch",
          "15:00 - Start perjalanan kembali",
          "19:00 - Tiba di Surabaya/Banyuwangi"
        ],
        meals: ["Breakfast", "Lunch"],
        accommodation: "-"
      }
    ],
    includes: [
      "Transportasi AC full",
      "Penginapan 2 malam",
      "Meals sesuai program",
      "Tiket masuk semua destinasi",
      "Pemandu berpengalaman",
      "Safety equipment (gas masker, headlamp)",
      "Dokumentasi foto",
      "Mineral water"
    ],
    excludes: [
      "Personal expenses",
      "Tip untuk pemandu & driver",
      "Asuransi perjalanan",
      "Porter (kalo perlu)",
      "Extra meals"
    ],
    gallery: [
      "/ijen-bluefire.jpg",
      "/ijen-crater.jpg",
      "/ijen-waterfall.jpg",
      "/bromo-sunrise.jpg"
    ],
    meetingPoint: "Surabaya/Banyuwangi",
    bestTime: "Juli - November (kering)",
    difficulty: "Sedang - Menantang",
    groupSize: "2-10 orang",
    guide: "Berbahasa Indonesia & Inggris",
    transportation: "AC Bus",
    accommodation: "Hotel ** di Ijen area",
    meals: "2x breakfast, 2x lunch, 1x dinner"
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
    image: "/nusantara-landscape.jpg",
    itinerary: [
      {
        day: 1,
        title: "Surabaya - Bromo",
        description: "Start perjalanan dari Surabaya menuju Bromo",
        activities: [
          "09:00 - Penjemputan di Surabaya",
          "13:00 - Makan siang di local restaurant",
          "16:00 - Check-in hotel Bromo area",
          "18:00 - Dinner dan briefing"
        ],
        meals: ["Lunch", "Dinner"],
        accommodation: "Hotel ** Bromo area"
      },
      {
        day: 2,
        title: "Bromo Sunrise & Explore",
        description: "Sunrise adventure dan explore Bromo",
        activities: [
          "03:00 - Start dengan jeep menuju Penanjakan",
          "04:30 - Sunrise di puncak Penanjakan",
          "06:30 - Explore Lautan Pasir & Kawah Bromo",
          "09:00 - Breakfast di hotel",
          "11:00 - Check-out, menuju Ijen area",
          "16:00 - Check-in hotel Ijen area"
        ],
        meals: ["Breakfast", "Lunch", "Dinner"],
        accommodation: "Hotel ** Ijen area"
      },
      {
        day: 3,
        title: "Ijen Blue Fire",
        description: "Blue Fire adventure dan sunrise Ijen",
        activities: [
          "00:00 - Start trekking ke puncak Ijen",
          "02:00 - Blue Fire viewing",
          "04:30 - Sunrise di Kawah Ijen",
          "08:00 - Turun ke base camp",
          "12:00 - Explore coffee plantation",
          "16:00 - Rest di hotel"
        ],
        meals: ["Breakfast", "Lunch", "Dinner"],
        accommodation: "Hotel ** Ijen area"
      },
      {
        day: 4,
        title: "Return to Surabaya",
        description: "Explore air terjun dan kembali ke Surabaya",
        activities: [
          "08:00 - Check-out hotel",
          "10:00 - Explore air terjun",
          "13:00 - Makan siang",
          "15:00 - Start perjalanan kembali ke Surabaya",
          "19:00 - Tiba di Surabaya"
        ],
        meals: ["Breakfast", "Lunch"],
        accommodation: "-"
      }
    ],
    includes: [
      "Transportasi AC full",
      "Penginapan 3 malam (hotel **)",
      "Meals sesuai program",
      "Jeep adventure di Bromo",
      "Tiket masuk semua destinasi",
      "Pemandu profesional",
      "Safety equipment",
      "Dokumentasi foto",
      "Mineral water"
    ],
    excludes: [
      "Personal expenses",
      "Tip untuk pemandu & driver",
      "Asuransi perjalanan",
      "Extra transport",
      "Porter service"
    ],
    gallery: [
      "/bromo-sunrise.jpg",
      "/ijen-bluefire.jpg",
      "/bromo-savanna.jpg",
      "/ijen-crater.jpg",
      "/nusantara-landscape.jpg"
    ],
    meetingPoint: "Surabaya",
    bestTime: "Mei - Oktober",
    difficulty: "Sedang",
    groupSize: "4-15 orang",
    guide: "Berbahasa Indonesia & Inggris",
    transportation: "AC Bus + Jeep 4x4",
    accommodation: "Hotel ** di Bromo & Ijen",
    meals: "3x breakfast, 4x lunch, 2x dinner"
  }
];

export default function PackageDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = useState<PackageDetail | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    participants: 2,
    message: ''
  });

  useEffect(() => {
    const packageId = parseInt(params.id as string);
    const pkg = packageDetails.find(p => p.id === packageId);
    if (pkg) {
      setSelectedPackage(pkg);
    } else {
      router.push('/#packages');
    }
  }, [params.id, router]);

  if (!selectedPackage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading package details...</p>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === selectedPackage.gallery.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? selectedPackage.gallery.length - 1 : prev - 1
    );
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the booking data to your API
    alert('Terima kasih! Booking Anda akan segera kami proses. Tim kami akan menghubungi Anda dalam 1x24 jam.');
    setIsBookingModalOpen(false);
    setBookingForm({
      name: '',
      email: '',
      phone: '',
      date: '',
      participants: 2,
      message: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Abstract Background */}
      <section className="relative h-96 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-200 to-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-blue-200 to-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        </div>

        {/* Main Image */}
        <div className="relative h-full">
          <Image
            src={selectedPackage.image}
            alt={selectedPackage.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
          
          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="container mx-auto">
              <nav className="mb-4">
                <ol className="flex items-center space-x-2 text-sm">
                  <li><a href="/" className="hover:text-orange-300 transition-colors">Beranda</a></li>
                  <li>/</li>
                  <li><a href="/#packages" className="hover:text-orange-300 transition-colors">Paket Tour</a></li>
                  <li>/</li>
                  <li className="text-orange-300">{selectedPackage.name}</li>
                </ol>
              </nav>
              
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <Badge className="bg-orange-500 text-white">
                  <Star className="w-4 h-4 mr-1" />
                  {selectedPackage.rating}/5.0
                </Badge>
                <Badge variant="outline" className="border-white text-white">
                  {selectedPackage.reviews} Reviews
                </Badge>
                <Badge variant="outline" className="border-white text-white">
                  <MapPin className="w-4 h-4 mr-1" />
                  {selectedPackage.location}
                </Badge>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {selectedPackage.name}
              </h1>
              <p className="text-xl text-gray-200 max-w-3xl">
                {selectedPackage.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Package Info Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Info */}
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Clock className="w-6 h-6 text-orange-500" />
                      </div>
                      <h3 className="font-semibold text-gray-800">Durasi</h3>
                      <p className="text-sm text-gray-600">{selectedPackage.duration}</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Users className="w-6 h-6 text-blue-500" />
                      </div>
                      <h3 className="font-semibold text-gray-800">Group Size</h3>
                      <p className="text-sm text-gray-600">{selectedPackage.groupSize}</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Mountain className="w-6 h-6 text-green-500" />
                      </div>
                      <h3 className="font-semibold text-gray-800">Difficulty</h3>
                      <p className="text-sm text-gray-600">{selectedPackage.difficulty}</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Calendar className="w-6 h-6 text-purple-500" />
                      </div>
                      <h3 className="font-semibold text-gray-800">Best Time</h3>
                      <p className="text-sm text-gray-600">{selectedPackage.bestTime}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Highlights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="w-5 h-5 mr-2 text-orange-500" />
                    Highlights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {selectedPackage.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center space-x-2 bg-orange-50 rounded-full px-4 py-2">
                        <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                        <span className="text-sm text-gray-700">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Itinerary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                    Itinerary Perjalanan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {selectedPackage.itinerary.map((day, index) => (
                      <div key={day.day} className="relative">
                        {/* Timeline Line */}
                        {index < selectedPackage.itinerary.length - 1 && (
                          <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
                        )}
                        
                        <div className="flex space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                              {day.day}
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                              {day.title}
                            </h3>
                            <p className="text-gray-600 mb-3">{day.description}</p>
                            
                            <div className="space-y-2">
                              <div>
                                <h4 className="font-medium text-gray-700 mb-1">Activities:</h4>
                                <ul className="space-y-1">
                                  {day.activities.map((activity, actIndex) => (
                                    <li key={actIndex} className="flex items-start space-x-2 text-sm text-gray-600">
                                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                      <span>{activity}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              
                              {day.meals.length > 0 && (
                                <div>
                                  <h4 className="font-medium text-gray-700 mb-1">Meals:</h4>
                                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    <Utensils className="w-4 h-4" />
                                    <span>{day.meals.join(", ")}</span>
                                  </div>
                                </div>
                              )}
                              
                              {day.accommodation && day.accommodation !== "-" && (
                                <div>
                                  <h4 className="font-medium text-gray-700 mb-1">Accommodation:</h4>
                                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    <Home className="w-4 h-4" />
                                    <span>{day.accommodation}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Includes & Excludes */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-green-600">
                      <Check className="w-5 h-5 mr-2" />
                      Termasuk
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {selectedPackage.includes.map((item, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm">
                          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-red-600">
                      <X className="w-5 h-5 mr-2" />
                      Tidak Termasuk
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {selectedPackage.excludes.map((item, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm">
                          <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Booking Card */}
              <Card className="sticky top-6">
                <CardContent className="p-6">
                  {/* Price */}
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <span className="text-2xl font-bold text-orange-500">{selectedPackage.price}</span>
                      <span className="text-sm text-gray-400 line-through">{selectedPackage.originalPrice}</span>
                      <Badge className="bg-red-500 text-white">{selectedPackage.discount}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">per orang</p>
                  </div>

                  {/* CTA Button */}
                  <Button 
                    size="lg" 
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white mb-4"
                    onClick={() => setIsBookingModalOpen(true)}
                  >
                    Pesan Sekarang
                  </Button>

                  {/* Contact Info */}
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">+62 812-3456-7890</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">info@nusantaratour.com</span>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Meeting Point:</span>
                      <span className="text-gray-800 font-medium">{selectedPackage.meetingPoint}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Transportation:</span>
                      <span className="text-gray-800 font-medium">{selectedPackage.transportation}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Guide:</span>
                      <span className="text-gray-800 font-medium">{selectedPackage.guide}</span>
                    </div>
                  </div>

                  {/* Trust Badges */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-center space-x-4">
                      <Shield className="w-5 h-5 text-green-500" />
                      <CreditCard className="w-5 h-5 text-blue-500" />
                      <Car className="w-5 h-5 text-purple-500" />
                    </div>
                    <p className="text-xs text-gray-500 text-center mt-2">
                      Booking aman & terpercaya
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Gallery Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Camera className="w-5 h-5 mr-2 text-purple-500" />
                    Galeri Foto
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                    <Image
                      src={selectedPackage.gallery[currentImageIndex]}
                      alt={`${selectedPackage.name} - Image ${currentImageIndex + 1}`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20"></div>
                    
                    {/* Navigation */}
                    <button 
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 hover:bg-white transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex justify-center space-x-2">
                    {selectedPackage.gallery.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex ? 'bg-orange-500' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-800">Form Pemesanan</h3>
                <button 
                  onClick={() => setIsBookingModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm({...bookingForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={bookingForm.email}
                    onChange={(e) => setBookingForm({...bookingForm, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    No. Telepon
                  </label>
                  <input
                    type="tel"
                    required
                    value={bookingForm.phone}
                    onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Keberangkatan
                  </label>
                  <input
                    type="date"
                    required
                    value={bookingForm.date}
                    onChange={(e) => setBookingForm({...bookingForm, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jumlah Peserta
                  </label>
                  <select
                    value={bookingForm.participants}
                    onChange={(e) => setBookingForm({...bookingForm, participants: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                      <option key={num} value={num}>{num} orang</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pesan Tambahan (Opsional)
                  </label>
                  <textarea
                    value={bookingForm.message}
                    onChange={(e) => setBookingForm({...bookingForm, message: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Special requests, dietary restrictions, etc."
                  />
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit"
                    size="lg"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Konfirmasi Pemesanan
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}