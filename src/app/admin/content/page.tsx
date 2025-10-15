"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

export default function ContentEditor() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('header');
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
          content: activeSection === 'header' ? headerContent : heroContent
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
                    {activeSection !== 'header' && activeSection !== 'hero' && (
                      <div className="text-center py-8">
                        <FileEdit className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500">Editor for {activeSection} section coming soon...</p>
                      </div>
                    )}
                    
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