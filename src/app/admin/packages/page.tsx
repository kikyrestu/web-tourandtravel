"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Star, 
  MapPin, 
  Clock, 
  Users,
  LayoutDashboard,
  LogOut
} from "lucide-react";

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
  createdAt: string;
  updatedAt: string;
}

export default function AdminPackages() {
  const router = useRouter();
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<TourPackage[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<TourPackage | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    price: "",
    originalPrice: "",
    discount: "",
    rating: 4.5,
    reviews: 0,
    location: "",
    highlights: "",
    description: "",
    image: "",
    isActive: true,
  });

  useEffect(() => {
    checkAuth();
    fetchPackages();
  }, []);

  useEffect(() => {
    filterPackages();
  }, [packages, searchTerm]);

  const checkAuth = () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
    }
  };

  const fetchPackages = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/admin/packages", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPackages(data);
      }
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterPackages = () => {
    if (!searchTerm) {
      setFilteredPackages(packages);
      return;
    }

    const filtered = packages.filter(pkg =>
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPackages(filtered);
  };

  const handleCreatePackage = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/admin/packages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          highlights: formData.highlights.split(",").map(h => h.trim()),
        }),
      });

      if (response.ok) {
        await fetchPackages();
        setIsDialogOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error creating package:", error);
    }
  };

  const handleUpdatePackage = async () => {
    if (!editingPackage) return;

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/packages/${editingPackage.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          highlights: formData.highlights.split(",").map(h => h.trim()),
        }),
      });

      if (response.ok) {
        await fetchPackages();
        setIsDialogOpen(false);
        resetForm();
      }
    } catch (error) {
      console.error("Error updating package:", error);
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus paket ini?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/admin/packages/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchPackages();
      }
    } catch (error) {
      console.error("Error deleting package:", error);
    }
  };

  const handleEditPackage = (pkg: TourPackage) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      duration: pkg.duration,
      price: pkg.price,
      originalPrice: pkg.originalPrice || "",
      discount: pkg.discount || "",
      rating: pkg.rating,
      reviews: pkg.reviews,
      location: pkg.location,
      highlights: pkg.highlights.join(", "),
      description: pkg.description,
      image: pkg.image || "",
      isActive: pkg.isActive,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setEditingPackage(null);
    setFormData({
      name: "",
      duration: "",
      price: "",
      originalPrice: "",
      discount: "",
      rating: 4.5,
      reviews: 0,
      location: "",
      highlights: "",
      description: "",
      image: "",
      isActive: true,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => router.push("/admin/dashboard")}
                className="mr-4"
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Tour Packages</h1>
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Kelola Tour Packages</h2>
            <p className="text-gray-600">Tambah, edit, atau hapus paket tour</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Paket
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingPackage ? "Edit Paket" : "Tambah Paket Baru"}
                </DialogTitle>
                <DialogDescription>
                  {editingPackage ? "Edit informasi paket tour" : "Tambah paket tour baru"}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nama Paket</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">Durasi</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="2 Hari 1 Malam"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price">Harga</Label>
                    <Input
                      id="price"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="Rp 750.000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="originalPrice">Harga Asli</Label>
                    <Input
                      id="originalPrice"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      placeholder="Rp 950.000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="discount">Diskon</Label>
                    <Input
                      id="discount"
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                      placeholder="21%"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="rating">Rating</Label>
                    <Input
                      id="rating"
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="reviews">Jumlah Review</Label>
                    <Input
                      id="reviews"
                      type="number"
                      value={formData.reviews}
                      onChange={(e) => setFormData({ ...formData, reviews: parseInt(e.target.value) })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Lokasi</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Bromo, Jawa Timur"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="highlights">Highlights (comma separated)</Label>
                  <Input
                    id="highlights"
                    value={formData.highlights}
                    onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                    placeholder="Sunrise Penanjakan, Lautan Pasir, Kawah Bromo"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Deskripsi</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="image">URL Gambar</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label htmlFor="isActive">Aktif</Label>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button onClick={editingPackage ? handleUpdatePackage : handleCreatePackage}>
                    {editingPackage ? "Update" : "Simpan"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Cari paket tour..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Packages Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Paket Tour</CardTitle>
            <CardDescription>
              Total {filteredPackages.length} paket tour
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Paket</TableHead>
                  <TableHead>Durasi</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Lokasi</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPackages.map((pkg) => (
                  <TableRow key={pkg.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{pkg.name}</div>
                        <div className="text-sm text-gray-500">{pkg.description.substring(0, 50)}...</div>
                      </div>
                    </TableCell>
                    <TableCell>{pkg.duration}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{pkg.price}</div>
                        {pkg.originalPrice && (
                          <div className="text-sm text-gray-500 line-through">{pkg.originalPrice}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{pkg.location}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span>{pkg.rating}</span>
                        <span className="text-gray-500 ml-1">({pkg.reviews})</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={pkg.isActive ? "default" : "secondary"}>
                        {pkg.isActive ? "Aktif" : "Non-aktif"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditPackage(pkg)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePackage(pkg.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}