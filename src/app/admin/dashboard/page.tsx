"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  FileEdit,
  Header,
  Mountain,
  Layers,
  Phone
} from "lucide-react";

interface DashboardStats {
  totalPackages: number;
  totalTestimonials: number;
  totalFaqs: number;
  totalArticles: number;
  totalGallery: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalPackages: 0,
    totalTestimonials: 0,
    totalFaqs: 0,
    totalArticles: 0,
    totalGallery: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    fetchStats();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setIsLoading(false);
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
        { title: "Header", icon: Header, href: "/admin/content?section=header" },
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

  const statCards = [
    {
      title: "Tour Packages",
      value: stats.totalPackages,
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Testimonials",
      value: stats.totalTestimonials,
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "FAQ",
      value: stats.totalFaqs,
      icon: HelpCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Artikel",
      value: stats.totalArticles,
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Gallery",
      value: stats.totalGallery,
      icon: ImageIcon,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
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
                            onClick={() => router.push(subItem.href)}
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
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
              <p className="text-gray-600">Selamat datang di panel admin Nusantara Tour</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {statCards.map((stat) => (
                <Card key={stat.title}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                      <div className={`p-3 rounded-full ${stat.bgColor}`}>
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Aksi Cepat</CardTitle>
                <CardDescription>
                  Akses cepat ke fitur-fitur yang sering digunakan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button
                    variant="outline"
                    className="h-20 flex-col"
                    onClick={() => router.push("/admin/content")}
                  >
                    <FileEdit className="h-6 w-6 mb-2" />
                    <span>Edit Konten</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col"
                    onClick={() => router.push("/admin/packages")}
                  >
                    <Plus className="h-6 w-6 mb-2" />
                    <span>Tambah Paket</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col"
                    onClick={() => router.push("/admin/gallery")}
                  >
                    <ImageIcon className="h-6 w-6 mb-2" />
                    <span>Upload Gambar</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col"
                    onClick={() => router.push("/admin/settings")}
                  >
                    <Settings className="h-6 w-6 mb-2" />
                    <span>Pengaturan</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}