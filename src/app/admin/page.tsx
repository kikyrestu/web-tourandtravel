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
  Heading,
  Mountain,
  Layers,
  Phone
} from "lucide-react";

// Import komponen-komponen admin
import AdminDashboardContent from "@/components/admin/AdminDashboardContent";
import AdminPackagesContent from "@/components/admin/AdminPackagesContent";
import AdminHeroContent from "@/components/admin/AdminHeroContent";
import AdminTestimonialsContent from "@/components/admin/AdminTestimonialsContent";
import AdminFaqsContent from "@/components/admin/AdminFaqsContent";
import AdminGalleryContent from "@/components/admin/AdminGalleryContent";
import AdminSettingsContent from "@/components/admin/AdminSettingsContent";

type ActiveView = 'dashboard' | 'packages' | 'hero' | 'testimonials' | 'faqs' | 'gallery' | 'settings';

interface DashboardStats {
  totalPackages: number;
  totalTestimonials: number;
  totalFaqs: number;
  totalArticles: number;
  totalGallery: number;
}

export default function AdminLayout() {
  const router = useRouter();
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
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
      
      if (!token) {
        router.push("/admin/login");
        return;
      }

      const response = await fetch("/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        if (response.status === 401) {
          localStorage.removeItem("adminToken");
          router.push("/admin/login");
        }
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
      // Set default values to show something
      setStats({
        totalPackages: 2,
        totalTestimonials: 3,
        totalFaqs: 2,
        totalArticles: 0,
        totalGallery: 0,
      });
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
      id: 'dashboard' as ActiveView,
      title: "Dashboard",
      icon: LayoutDashboard,
      description: "Overview dan statistik",
    },
    {
      id: 'packages' as ActiveView,
      title: "Tour Packages",
      icon: Package,
      description: "Kelola paket tour",
    },
    {
      id: 'hero' as ActiveView,
      title: "Hero Slides",
      icon: Mountain,
      description: "Kelola hero section slides",
    },
    {
      id: 'testimonials' as ActiveView,
      title: "Testimonials",
      icon: MessageSquare,
      description: "Kelola testimonial",
    },
    {
      id: 'faqs' as ActiveView,
      title: "FAQ",
      icon: HelpCircle,
      description: "Kelola pertanyaan umum",
    },
    {
      id: 'gallery' as ActiveView,
      title: "Gallery",
      icon: ImageIcon,
      description: "Kelola gambar gallery",
    },
    {
      id: 'settings' as ActiveView,
      title: "Pengaturan",
      icon: Settings,
      description: "Pengaturan situs",
    },
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <AdminDashboardContent stats={stats} isLoading={isLoading} onRefresh={fetchStats} />;
      case 'packages':
        return <AdminPackagesContent />;
      case 'hero':
        return <AdminHeroContent />;
      case 'testimonials':
        return <AdminTestimonialsContent />;
      case 'faqs':
        return <AdminFaqsContent />;
      case 'gallery':
        return <AdminGalleryContent />;
      case 'settings':
        return <AdminSettingsContent />;
      default:
        return <AdminDashboardContent stats={stats} isLoading={isLoading} onRefresh={fetchStats} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <LayoutDashboard className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
              <Badge variant="outline" className="text-xs">Nusantara Tour</Badge>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeView === item.id ? "default" : "ghost"}
              className="w-full justify-start h-auto p-3"
              onClick={() => setActiveView(item.id)}
            >
              <div className="flex items-start gap-3">
                <item.icon className="h-5 w-5 mt-0.5" />
                <div className="text-left">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                </div>
              </div>
            </Button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full justify-start"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {menuItems.find(item => item.id === activeView)?.title || 'Dashboard'}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {menuItems.find(item => item.id === activeView)?.description}
                </p>
              </div>
              
              {/* Quick Stats */}
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.totalPackages}</div>
                  <div className="text-xs text-gray-500">Packages</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{stats.totalTestimonials}</div>
                  <div className="text-xs text-gray-500">Testimonials</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.totalFaqs}</div>
                  <div className="text-xs text-gray-500">FAQs</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}