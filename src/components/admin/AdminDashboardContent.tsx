"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Star, 
  HelpCircle, 
  FileText, 
  ImageIcon,
  TrendingUp,
  Plus,
  FileEdit,
  Settings
} from "lucide-react";

interface DashboardStats {
  totalPackages: number;
  totalTestimonials: number;
  totalFaqs: number;
  totalArticles: number;
  totalGallery: number;
}

interface AdminDashboardContentProps {
  stats: DashboardStats;
  isLoading: boolean;
  onRefresh: () => void;
}

export default function AdminDashboardContent({ stats, isLoading, onRefresh }: AdminDashboardContentProps) {
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
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Selamat Datang di Admin Panel</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Kelola semua konten website Nusantara Tour & Travel dengan mudah dan efisien
        </p>
      </div>

      {/* Stats Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Statistik Overview</h2>
          <Button variant="outline" onClick={onRefresh}>
            <TrendingUp className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 5 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                      <div className="h-8 bg-gray-200 rounded w-12"></div>
                    </div>
                    <div className="p-3 rounded-full bg-gray-200">
                      <div className="h-6 w-6 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            statCards.map((stat) => (
              <Card key={stat.title} className="hover:shadow-lg transition-shadow">
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
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Aksi Cepat
          </CardTitle>
          <CardDescription>
            Akses cepat ke fitur-fitur yang sering digunakan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-20 flex-col hover:bg-blue-50 hover:border-blue-200"
            >
              <FileEdit className="h-6 w-6 mb-2 text-blue-600" />
              <span className="font-medium">Edit Konten</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col hover:bg-green-50 hover:border-green-200"
            >
              <Plus className="h-6 w-6 mb-2 text-green-600" />
              <span className="font-medium">Tambah Paket</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col hover:bg-purple-50 hover:border-purple-200"
            >
              <ImageIcon className="h-6 w-6 mb-2 text-purple-600" />
              <span className="font-medium">Upload Gambar</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col hover:bg-gray-50 hover:border-gray-200"
            >
              <Settings className="h-6 w-6 mb-2 text-gray-600" />
              <span className="font-medium">Pengaturan</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Aktivitas Terkini</CardTitle>
          <CardDescription>
            Log aktivitas terakhir di sistem
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-full">
                <Package className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Paket tour baru ditambahkan</p>
                <p className="text-sm text-gray-500">Paket Bromo Sunrise - 2 jam yang lalu</p>
              </div>
              <Badge variant="secondary">Tour</Badge>
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-yellow-100 rounded-full">
                <Star className="h-4 w-4 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Testimonial baru ditambahkan</p>
                <p className="text-sm text-gray-500">Budi Santoso - 5 jam yang lalu</p>
              </div>
              <Badge variant="secondary">Testimonial</Badge>
            </div>
            
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="p-2 bg-green-100 rounded-full">
                <HelpCircle className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">FAQ diperbarui</p>
                <p className="text-sm text-gray-500">FAQ tentang pembayaran - 1 hari yang lalu</p>
              </div>
              <Badge variant="secondary">FAQ</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Database</span>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Connected
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">API Server</span>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Online
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Storage</span>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Normal
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Pengguna</p>
              <p className="text-2xl font-bold">1</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Last Login</p>
              <p className="text-sm">Admin - 2 jam yang lalu</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Version</p>
              <p className="text-sm">v1.0.0</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}