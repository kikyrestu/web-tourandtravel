"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  LayoutDashboard, 
  Package, 
  Image as ImageIcon, 
  MessageSquare, 
  HelpCircle, 
  FileText, 
  Settings, 
  LogOut,
  Users,
  Star,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Eye,
  Type,
  Palette,
  Smartphone,
  Monitor,
  Layers,
  FileEdit,
  Sliders,
  Heading,
  Mountain,
  MapPin,
  Users as UsersIcon,
  Mail,
  Phone,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Globe
} from "lucide-react";

interface ContentSection {
  id: string;
  title: string;
  description: string;
  content: any;
  lastModified: string;
  isActive: boolean;
}

interface HeaderContent {
  logoText: string;
  navItems: Array<{ text: string; href: string; isActive: boolean }>;
  ctaButton: { text: string; href: string; isActive: boolean };
  contactInfo: {
    phone: string;
    email: string;
    address: string;
  };
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
  };
}

interface HeroContent {
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  ctaButtons: Array<{ text: string; href: string; style: string; isActive: boolean }>;
  features: Array<{ text: string; icon: string; isActive: boolean }>;
  stats: {
    rating: number;
    reviews: number;
    tours: number;
  };
}

interface PackagesContent {
  title: string;
  subtitle: string;
  description: string;
  showFeaturedOnly: boolean;
  maxPackages: number;
}

interface TestimonialsContent {
  title: string;
  subtitle: string;
  description: string;
  autoRotate: boolean;
  rotateInterval: number;
  showRating: boolean;
}

interface FooterContent {
  logoText: string;
  description: string;
  quickLinks: Array<{ text: string; href: string; isActive: boolean }>;
  contactInfo: {
    phone: string;
    email: string;
    address: string;
  };
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
  };
  copyrightText: string;
}

interface ContactContent {
  title: string;
  subtitle: string;
  description: string;
  formFields: Array<{ name: string; label: string; type: string; required: boolean; isActive: boolean }>;
  contactInfo: {
    phone: string;
    email: string;
    address: string;
    workingHours: string;
  };
  showMap: boolean;
  mapUrl: string;
}

export default function ContentEditor() {
  const router = useRouter();
const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState(searchParams.get('section') || 'header');
  const [headerContent, setHeaderContent] = useState<HeaderContent>({
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
  });

  const [heroContent, setHeroContent] = useState<HeroContent>({
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
  });

  const [packagesContent, setPackagesContent] = useState<PackagesContent>({
    title: 'Paket Tour Kami',
    subtitle: 'Pilih paket tour terbaik untuk petualangan Anda',
    description: 'Kami menawarkan berbagai paket tour dengan harga terjangkau dan pelayanan terbaik. Dari paket hemat hingga paket premium, semua dirancang untuk memberikan pengalaman tak terlupakan.',
    showFeaturedOnly: false,
    maxPackages: 6
  });

  const [testimonialsContent, setTestimonialsContent] = useState<TestimonialsContent>({
    title: 'Testimoni Pelanggan',
    subtitle: 'Apa kata mereka tentang kami',
    description: 'Ribuan pelanggan telah merasakan pengalaman wisata tak terlupakan bersama kami. Berikut adalah testimoni dari beberapa pelanggan kami.',
    autoRotate: true,
    rotateInterval: 5000,
    showRating: true
  });

  const [footerContent, setFooterContent] = useState<FooterContent>({
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
  });

  const [contactContent, setContactContent] = useState<ContactContent>({
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
  });

  useEffect(() => {
    checkAuth();
    fetchContent();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
    }
  };

  const fetchContent = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      // Fetch content from API
      const response = await fetch("/api/admin/content", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Update state with fetched data
        if (data.header) setHeaderContent(data.header);
        if (data.hero) setHeroContent(data.hero);
        if (data.packages) setPackagesContent(data.packages);
        if (data.testimonials) setTestimonialsContent(data.testimonials);
        if (data.footer) setFooterContent(data.footer);
        if (data.contact) setContactContent(data.contact);
      }
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/admin/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          section: activeSection,
          content: activeSection === 'header' ? headerContent : 
                   activeSection === 'hero' ? heroContent :
                   activeSection === 'packages' ? packagesContent :
                   activeSection === 'testimonials' ? testimonialsContent :
                   activeSection === 'footer' ? footerContent :
                   contactContent
        }),
      });

      if (response.ok) {
        alert("Content saved successfully!");
      } else {
        alert("Failed to save content");
      }
    } catch (error) {
      console.error("Error saving content:", error);
      alert("Error saving content");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin/dashboard",
      description: "Overview dan statistik",
    },
    {
      title: "Edit Konten",
      icon: FileEdit,
      href: "/admin/content",
      description: "Edit konten website",
      submenu: [
        { title: "Header", icon: Heading, href: "/admin/content?section=header" },
        { title: "Hero Section", icon: Mountain, href: "/admin/content?section=hero" },
        { title: "Tour Packages", icon: Package, href: "/admin/content?section=packages" },
        { title: "Testimonials", icon: MessageSquare, href: "/admin/content?section=testimonials" },
        { title: "Footer", icon: Layers, href: "/admin/content?section=footer" },
        { title: "Contact Info", icon: Phone, href: "/admin/content?section=contact" },
      ]
    },
    {
      title: "Tour Packages",
      icon: Package,
      href: "/admin/packages",
      description: "Kelola paket tour",
    },
    {
      title: "Gallery",
      icon: ImageIcon,
      href: "/admin/gallery",
      description: "Kelola gambar gallery",
    },
    {
      title: "Testimonials",
      icon: MessageSquare,
      href: "/admin/testimonials",
      description: "Kelola testimonial",
    },
    {
      title: "FAQ",
      icon: HelpCircle,
      href: "/admin/faqs",
      description: "Kelola pertanyaan umum",
    },
    {
      title: "Pengaturan",
      icon: Settings,
      href: "/admin/settings",
      description: "Pengaturan situs",
    },
  ];

  const contentSections = [
    { id: 'header', title: 'Header', icon: Heading, description: 'Edit header website' },
    { id: 'hero', title: 'Hero Section', icon: Mountain, description: 'Edit hero section' },
    { id: 'packages', title: 'Tour Packages', icon: Package, description: 'Edit tour packages section' },
    { id: 'testimonials', title: 'Testimonials', icon: MessageSquare, description: 'Edit testimonials section' },
    { id: 'footer', title: 'Footer', icon: Layers, description: 'Edit footer website' },
    { id: 'contact', title: 'Contact Info', icon: Phone, description: 'Edit contact information' },
  ];

  const renderHeaderEditor = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="logoText">Logo Text</Label>
        <Input
          id="logoText"
          value={headerContent.logoText}
          onChange={(e) => setHeaderContent({ ...headerContent, logoText: e.target.value })}
          placeholder="Enter logo text"
        />
      </div>

      <div>
        <Label>Navigation Items</Label>
        <div className="space-y-3 mt-2">
          {headerContent.navItems.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                value={item.text}
                onChange={(e) => {
                  const newNavItems = [...headerContent.navItems];
                  newNavItems[index].text = e.target.value;
                  setHeaderContent({ ...headerContent, navItems: newNavItems });
                }}
                placeholder="Nav item text"
              />
              <Input
                value={item.href}
                onChange={(e) => {
                  const newNavItems = [...headerContent.navItems];
                  newNavItems[index].href = e.target.value;
                  setHeaderContent({ ...headerContent, navItems: newNavItems });
                }}
                placeholder="Href"
                className="w-32"
              />
              <Switch
                checked={item.isActive}
                onCheckedChange={(checked) => {
                  const newNavItems = [...headerContent.navItems];
                  newNavItems[index].isActive = checked;
                  setHeaderContent({ ...headerContent, navItems: newNavItems });
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="ctaText">CTA Button Text</Label>
        <Input
          id="ctaText"
          value={headerContent.ctaButton.text}
          onChange={(e) => setHeaderContent({
            ...headerContent,
            ctaButton: { ...headerContent.ctaButton, text: e.target.value }
          })}
          placeholder="CTA button text"
        />
      </div>

      <div>
        <Label>Contact Information</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          <div>
            <Label htmlFor="phone" className="text-sm">Phone</Label>
            <Input
              id="phone"
              value={headerContent.contactInfo.phone}
              onChange={(e) => setHeaderContent({
                ...headerContent,
                contactInfo: { ...headerContent.contactInfo, phone: e.target.value }
              })}
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-sm">Email</Label>
            <Input
              id="email"
              value={headerContent.contactInfo.email}
              onChange={(e) => setHeaderContent({
                ...headerContent,
                contactInfo: { ...headerContent.contactInfo, email: e.target.value }
              })}
            />
          </div>
          <div>
            <Label htmlFor="address" className="text-sm">Address</Label>
            <Input
              id="address"
              value={headerContent.contactInfo.address}
              onChange={(e) => setHeaderContent({
                ...headerContent,
                contactInfo: { ...headerContent.contactInfo, address: e.target.value }
              })}
            />
          </div>
        </div>
      </div>

      <div>
        <Label>Social Links</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div className="flex items-center space-x-2">
            <Facebook className="w-4 h-4" />
            <Input
              value={headerContent.socialLinks.facebook}
              onChange={(e) => setHeaderContent({
                ...headerContent,
                socialLinks: { ...headerContent.socialLinks, facebook: e.target.value }
              })}
              placeholder="Facebook URL"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Instagram className="w-4 h-4" />
            <Input
              value={headerContent.socialLinks.instagram}
              onChange={(e) => setHeaderContent({
                ...headerContent,
                socialLinks: { ...headerContent.socialLinks, instagram: e.target.value }
              })}
              placeholder="Instagram URL"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Twitter className="w-4 h-4" />
            <Input
              value={headerContent.socialLinks.twitter}
              onChange={(e) => setHeaderContent({
                ...headerContent,
                socialLinks: { ...headerContent.socialLinks, twitter: e.target.value }
              })}
              placeholder="Twitter URL"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Youtube className="w-4 h-4" />
            <Input
              value={headerContent.socialLinks.youtube}
              onChange={(e) => setHeaderContent({
                ...headerContent,
                socialLinks: { ...headerContent.socialLinks, youtube: e.target.value }
              })}
              placeholder="YouTube URL"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderHeroEditor = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="heroTitle">Hero Title</Label>
        <Input
          id="heroTitle"
          value={heroContent.title}
          onChange={(e) => setHeroContent({ ...heroContent, title: e.target.value })}
          placeholder="Enter hero title"
        />
      </div>

      <div>
        <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
        <Textarea
          id="heroSubtitle"
          value={heroContent.subtitle}
          onChange={(e) => setHeroContent({ ...heroContent, subtitle: e.target.value })}
          placeholder="Enter hero subtitle"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="heroDescription">Hero Description</Label>
        <Textarea
          id="heroDescription"
          value={heroContent.description}
          onChange={(e) => setHeroContent({ ...heroContent, description: e.target.value })}
          placeholder="Enter hero description"
          rows={4}
        />
      </div>

      <div>
        <Label htmlFor="heroBackground">Background Image URL</Label>
        <Input
          id="heroBackground"
          value={heroContent.backgroundImage}
          onChange={(e) => setHeroContent({ ...heroContent, backgroundImage: e.target.value })}
          placeholder="/path/to/image.jpg"
        />
      </div>

      <div>
        <Label>CTA Buttons</Label>
        <div className="space-y-3 mt-2">
          {heroContent.ctaButtons.map((button, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                value={button.text}
                onChange={(e) => {
                  const newButtons = [...heroContent.ctaButtons];
                  newButtons[index].text = e.target.value;
                  setHeroContent({ ...heroContent, ctaButtons: newButtons });
                }}
                placeholder="Button text"
              />
              <Input
                value={button.href}
                onChange={(e) => {
                  const newButtons = [...heroContent.ctaButtons];
                  newButtons[index].href = e.target.value;
                  setHeroContent({ ...heroContent, ctaButtons: newButtons });
                }}
                placeholder="Href"
                className="w-32"
              />
              <Switch
                checked={button.isActive}
                onCheckedChange={(checked) => {
                  const newButtons = [...heroContent.ctaButtons];
                  newButtons[index].isActive = checked;
                  setHeroContent({ ...heroContent, ctaButtons: newButtons });
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Features</Label>
        <div className="space-y-3 mt-2">
          {heroContent.features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                value={feature.text}
                onChange={(e) => {
                  const newFeatures = [...heroContent.features];
                  newFeatures[index].text = e.target.value;
                  setHeroContent({ ...heroContent, features: newFeatures });
                }}
                placeholder="Feature text"
              />
              <Switch
                checked={feature.isActive}
                onCheckedChange={(checked) => {
                  const newFeatures = [...heroContent.features];
                  newFeatures[index].isActive = checked;
                  setHeroContent({ ...heroContent, features: newFeatures });
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Stats</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          <div>
            <Label htmlFor="rating" className="text-sm">Rating</Label>
            <Input
              id="rating"
              type="number"
              step="0.1"
              value={heroContent.stats.rating}
              onChange={(e) => setHeroContent({
                ...heroContent,
                stats: { ...heroContent.stats, rating: parseFloat(e.target.value) }
              })}
            />
          </div>
          <div>
            <Label htmlFor="reviews" className="text-sm">Reviews</Label>
            <Input
              id="reviews"
              type="number"
              value={heroContent.stats.reviews}
              onChange={(e) => setHeroContent({
                ...heroContent,
                stats: { ...heroContent.stats, reviews: parseInt(e.target.value) }
              })}
            />
          </div>
          <div>
            <Label htmlFor="tours" className="text-sm">Tours</Label>
            <Input
              id="tours"
              type="number"
              value={heroContent.stats.tours}
              onChange={(e) => setHeroContent({
                ...heroContent,
                stats: { ...heroContent.stats, tours: parseInt(e.target.value) }
              })}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPackagesEditor = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="packagesTitle">Section Title</Label>
        <Input
          id="packagesTitle"
          value={packagesContent.title}
          onChange={(e) => setPackagesContent({ ...packagesContent, title: e.target.value })}
          placeholder="Enter section title"
        />
      </div>

      <div>
        <Label htmlFor="packagesSubtitle">Section Subtitle</Label>
        <Textarea
          id="packagesSubtitle"
          value={packagesContent.subtitle}
          onChange={(e) => setPackagesContent({ ...packagesContent, subtitle: e.target.value })}
          placeholder="Enter section subtitle"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="packagesDescription">Section Description</Label>
        <Textarea
          id="packagesDescription"
          value={packagesContent.description}
          onChange={(e) => setPackagesContent({ ...packagesContent, description: e.target.value })}
          placeholder="Enter section description"
          rows={4}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="showFeaturedOnly"
          checked={packagesContent.showFeaturedOnly}
          onCheckedChange={(checked) => setPackagesContent({ ...packagesContent, showFeaturedOnly: checked })}
        />
        <Label htmlFor="showFeaturedOnly">Show Featured Packages Only</Label>
      </div>

      <div>
        <Label htmlFor="maxPackages">Maximum Packages to Display</Label>
        <Input
          id="maxPackages"
          type="number"
          value={packagesContent.maxPackages}
          onChange={(e) => setPackagesContent({ ...packagesContent, maxPackages: parseInt(e.target.value) })}
          placeholder="Enter maximum number of packages"
        />
      </div>
    </div>
  );

  const renderTestimonialsEditor = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="testimonialsTitle">Section Title</Label>
        <Input
          id="testimonialsTitle"
          value={testimonialsContent.title}
          onChange={(e) => setTestimonialsContent({ ...testimonialsContent, title: e.target.value })}
          placeholder="Enter section title"
        />
      </div>

      <div>
        <Label htmlFor="testimonialsSubtitle">Section Subtitle</Label>
        <Textarea
          id="testimonialsSubtitle"
          value={testimonialsContent.subtitle}
          onChange={(e) => setTestimonialsContent({ ...testimonialsContent, subtitle: e.target.value })}
          placeholder="Enter section subtitle"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="testimonialsDescription">Section Description</Label>
        <Textarea
          id="testimonialsDescription"
          value={testimonialsContent.description}
          onChange={(e) => setTestimonialsContent({ ...testimonialsContent, description: e.target.value })}
          placeholder="Enter section description"
          rows={4}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="autoRotate"
          checked={testimonialsContent.autoRotate}
          onCheckedChange={(checked) => setTestimonialsContent({ ...testimonialsContent, autoRotate: checked })}
        />
        <Label htmlFor="autoRotate">Auto Rotate Testimonials</Label>
      </div>

      {testimonialsContent.autoRotate && (
        <div>
          <Label htmlFor="rotateInterval">Rotation Interval (milliseconds)</Label>
          <Input
            id="rotateInterval"
            type="number"
            value={testimonialsContent.rotateInterval}
            onChange={(e) => setTestimonialsContent({ ...testimonialsContent, rotateInterval: parseInt(e.target.value) })}
            placeholder="Enter rotation interval"
          />
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Switch
          id="showRating"
          checked={testimonialsContent.showRating}
          onCheckedChange={(checked) => setTestimonialsContent({ ...testimonialsContent, showRating: checked })}
        />
        <Label htmlFor="showRating">Show Rating Stars</Label>
      </div>
    </div>
  );

  const renderFooterEditor = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="footerLogoText">Logo Text</Label>
        <Input
          id="footerLogoText"
          value={footerContent.logoText}
          onChange={(e) => setFooterContent({ ...footerContent, logoText: e.target.value })}
          placeholder="Enter logo text"
        />
      </div>

      <div>
        <Label htmlFor="footerDescription">Footer Description</Label>
        <Textarea
          id="footerDescription"
          value={footerContent.description}
          onChange={(e) => setFooterContent({ ...footerContent, description: e.target.value })}
          placeholder="Enter footer description"
          rows={4}
        />
      </div>

      <div>
        <Label>Quick Links</Label>
        <div className="space-y-3 mt-2">
          {footerContent.quickLinks.map((link, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                value={link.text}
                onChange={(e) => {
                  const newLinks = [...footerContent.quickLinks];
                  newLinks[index].text = e.target.value;
                  setFooterContent({ ...footerContent, quickLinks: newLinks });
                }}
                placeholder="Link text"
              />
              <Input
                value={link.href}
                onChange={(e) => {
                  const newLinks = [...footerContent.quickLinks];
                  newLinks[index].href = e.target.value;
                  setFooterContent({ ...footerContent, quickLinks: newLinks });
                }}
                placeholder="Href"
                className="w-32"
              />
              <Switch
                checked={link.isActive}
                onCheckedChange={(checked) => {
                  const newLinks = [...footerContent.quickLinks];
                  newLinks[index].isActive = checked;
                  setFooterContent({ ...footerContent, quickLinks: newLinks });
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Contact Information</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          <div>
            <Label htmlFor="footerPhone" className="text-sm">Phone</Label>
            <Input
              id="footerPhone"
              value={footerContent.contactInfo.phone}
              onChange={(e) => setFooterContent({
                ...footerContent,
                contactInfo: { ...footerContent.contactInfo, phone: e.target.value }
              })}
            />
          </div>
          <div>
            <Label htmlFor="footerEmail" className="text-sm">Email</Label>
            <Input
              id="footerEmail"
              value={footerContent.contactInfo.email}
              onChange={(e) => setFooterContent({
                ...footerContent,
                contactInfo: { ...footerContent.contactInfo, email: e.target.value }
              })}
            />
          </div>
          <div>
            <Label htmlFor="footerAddress" className="text-sm">Address</Label>
            <Input
              id="footerAddress"
              value={footerContent.contactInfo.address}
              onChange={(e) => setFooterContent({
                ...footerContent,
                contactInfo: { ...footerContent.contactInfo, address: e.target.value }
              })}
            />
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="copyrightText">Copyright Text</Label>
        <Input
          id="copyrightText"
          value={footerContent.copyrightText}
          onChange={(e) => setFooterContent({ ...footerContent, copyrightText: e.target.value })}
          placeholder="Enter copyright text"
        />
      </div>
    </div>
  );

  const renderContactEditor = () => (
    <div className="space-y-6">
      <div>
        <Label htmlFor="contactTitle">Section Title</Label>
        <Input
          id="contactTitle"
          value={contactContent.title}
          onChange={(e) => setContactContent({ ...contactContent, title: e.target.value })}
          placeholder="Enter section title"
        />
      </div>

      <div>
        <Label htmlFor="contactSubtitle">Section Subtitle</Label>
        <Textarea
          id="contactSubtitle"
          value={contactContent.subtitle}
          onChange={(e) => setContactContent({ ...contactContent, subtitle: e.target.value })}
          placeholder="Enter section subtitle"
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="contactDescription">Section Description</Label>
        <Textarea
          id="contactDescription"
          value={contactContent.description}
          onChange={(e) => setContactContent({ ...contactContent, description: e.target.value })}
          placeholder="Enter section description"
          rows={4}
        />
      </div>

      <div>
        <Label>Form Fields</Label>
        <div className="space-y-3 mt-2">
          {contactContent.formFields.map((field, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <Input
                value={field.name}
                onChange={(e) => {
                  const newFields = [...contactContent.formFields];
                  newFields[index].name = e.target.value;
                  setContactContent({ ...contactContent, formFields: newFields });
                }}
                placeholder="Field name"
              />
              <Input
                value={field.label}
                onChange={(e) => {
                  const newFields = [...contactContent.formFields];
                  newFields[index].label = e.target.value;
                  setContactContent({ ...contactContent, formFields: newFields });
                }}
                placeholder="Field label"
              />
              <select
                value={field.type}
                onChange={(e) => {
                  const newFields = [...contactContent.formFields];
                  newFields[index].type = e.target.value;
                  setContactContent({ ...contactContent, formFields: newFields });
                }}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="tel">Phone</option>
                <option value="textarea">Textarea</option>
              </select>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={field.required}
                  onCheckedChange={(checked) => {
                    const newFields = [...contactContent.formFields];
                    newFields[index].required = checked;
                    setContactContent({ ...contactContent, formFields: newFields });
                  }}
                />
                <Switch
                  checked={field.isActive}
                  onCheckedChange={(checked) => {
                    const newFields = [...contactContent.formFields];
                    newFields[index].isActive = checked;
                    setContactContent({ ...contactContent, formFields: newFields });
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Contact Information</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div>
            <Label htmlFor="contactPhone" className="text-sm">Phone</Label>
            <Input
              id="contactPhone"
              value={contactContent.contactInfo.phone}
              onChange={(e) => setContactContent({
                ...contactContent,
                contactInfo: { ...contactContent.contactInfo, phone: e.target.value }
              })}
            />
          </div>
          <div>
            <Label htmlFor="contactEmail" className="text-sm">Email</Label>
            <Input
              id="contactEmail"
              value={contactContent.contactInfo.email}
              onChange={(e) => setContactContent({
                ...contactContent,
                contactInfo: { ...contactContent.contactInfo, email: e.target.value }
              })}
            />
          </div>
          <div>
            <Label htmlFor="contactAddress" className="text-sm">Address</Label>
            <Input
              id="contactAddress"
              value={contactContent.contactInfo.address}
              onChange={(e) => setContactContent({
                ...contactContent,
                contactInfo: { ...contactContent.contactInfo, address: e.target.value }
              })}
            />
          </div>
          <div>
            <Label htmlFor="workingHours" className="text-sm">Working Hours</Label>
            <Input
              id="workingHours"
              value={contactContent.contactInfo.workingHours}
              onChange={(e) => setContactContent({
                ...contactContent,
                contactInfo: { ...contactContent.contactInfo, workingHours: e.target.value }
              })}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="showMap"
          checked={contactContent.showMap}
          onCheckedChange={(checked) => setContactContent({ ...contactContent, showMap: checked })}
        />
        <Label htmlFor="showMap">Show Map</Label>
      </div>

      {contactContent.showMap && (
        <div>
          <Label htmlFor="mapUrl">Map URL</Label>
          <Input
            id="mapUrl"
            value={contactContent.mapUrl}
            onChange={(e) => setContactContent({ ...contactContent, mapUrl: e.target.value })}
            placeholder="Enter map URL"
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Content Editor</h1>
              <Badge variant="outline" className="ml-3">Nusantara Tour</Badge>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Menu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {menuItems.map((item) => (
                  <div key={item.title}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => router.push(item.href)}
                    >
                      <item.icon className="h-4 w-4 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">{item.title}</div>
                        <div className="text-xs text-gray-500">{item.description}</div>
                      </div>
                    </Button>
                    {item.submenu && (
                      <div className="ml-6 mt-1 space-y-1">
                        {item.submenu.map((subItem) => (
                          <Button
                            key={subItem.title}
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-xs"
                            onClick={() => {
                              setActiveSection(subItem.title.toLowerCase().replace(' ', ''));
                              router.push(subItem.href);
                            }}
                          >
                            <subItem.icon className="h-3 w-3 mr-2" />
                            {subItem.title}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Sections</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {contentSections.map((section) => (
                  <Button
                    key={section.id}
                    variant={activeSection === section.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveSection(section.id)}
                  >
                    <section.icon className="h-4 w-4 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">{section.title}</div>
                      <div className="text-xs text-gray-500">{section.description}</div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Edit {contentSections.find(s => s.id === activeSection)?.title}
              </h2>
              <p className="text-gray-600">
                {contentSections.find(s => s.id === activeSection)?.description}
              </p>
            </div>

            {/* Content Editor */}
            <Card>
              <CardHeader>
                <CardTitle>Content Settings</CardTitle>
                <CardDescription>
                  Edit konten untuk {contentSections.find(s => s.id === activeSection)?.title}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {activeSection === 'header' && renderHeaderEditor()}
                    {activeSection === 'hero' && renderHeroEditor()}
                    {activeSection === 'packages' && renderPackagesEditor()}
                    {activeSection === 'testimonials' && renderTestimonialsEditor()}
                    {activeSection === 'footer' && renderFooterEditor()}
                    {activeSection === 'contact' && renderContactEditor()}
                    
                    <div className="flex justify-end space-x-4 pt-6 border-t">
                      <Button variant="outline" onClick={() => router.push('/admin/dashboard')}>
                        Cancel
                      </Button>
                      <Button onClick={handleSave} disabled={saving}>
                        {saving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}