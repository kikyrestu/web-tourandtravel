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
  LogOut,
  Image as ImageIcon,
  Tag,
  DollarSign,
  Calendar,
  X,
  PlusCircle
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
  const [newHighlight, setNewHighlight] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    price: "",
    originalPrice: "",
    discount: "",
    rating: 4.5,
    reviews: 0,
    location: "",
    highlights: [] as string[],
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
          highlights: formData.highlights,
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
          highlights: formData.highlights,
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
      highlights: pkg.highlights,
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
      highlights: [],
      description: "",
      image: "",
      isActive: true,
    });
    setNewHighlight("");
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  };

  const addHighlight = () => {
    if (newHighlight.trim() && !formData.highlights.includes(newHighlight.trim())) {
      setFormData({
        ...formData,
        highlights: [...formData.highlights, newHighlight.trim()]
      });
      setNewHighlight("");
    }
  };

  const removeHighlight = (index: number) => {
    setFormData({
      ...formData,
      highlights: formData.highlights.filter((_, i) => i !== index)
    });
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
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  {editingPackage ? "Edit Paket Tour" : "Tambah Paket Tour Baru"}
                </DialogTitle>
                <DialogDescription>
                  {editingPackage ? "Edit informasi paket tour yang sudah ada" : "Buat paket tour baru dengan informasi lengkap"}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Informasi Dasar
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium">Nama Paket</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Paket Bromo Midnight"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="duration" className="text-sm font-medium">Durasi</Label>
                      <Input
                        id="duration"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        placeholder="2 Hari 1 Malam"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Pricing Information */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Informasi Harga
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="price" className="text-sm font-medium">Harga *</Label>
                      <Input
                        id="price"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="Rp 750.000"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="originalPrice" className="text-sm font-medium">Harga Asli</Label>
                      <Input
                        id="originalPrice"
                        value={formData.originalPrice}
                        onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                        placeholder="Rp 950.000"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="discount" className="text-sm font-medium">Diskon</Label>
                      <Input
                        id="discount"
                        value={formData.discount}
                        onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                        placeholder="21%"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Location & Rating */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Lokasi & Rating
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="location" className="text-sm font-medium">Lokasi *</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="Bromo, Jawa Timur"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="rating" className="text-sm font-medium">Rating</Label>
                      <Input
                        id="rating"
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        value={formData.rating}
                        onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="reviews" className="text-sm font-medium">Jumlah Review</Label>
                      <Input
                        id="reviews"
                        type="number"
                        value={formData.reviews}
                        onChange={(e) => setFormData({ ...formData, reviews: parseInt(e.target.value) })}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Highlights Management */}
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Highlights / Fitur Unggulan
                  </h3>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        value={newHighlight}
                        onChange={(e) => setNewHighlight(e.target.value)}
                        placeholder="Tambah highlight baru..."
                        onKeyPress={(e) => e.key === 'Enter' && addHighlight()}
                        className="flex-1"
                      />
                      <Button onClick={addHighlight} type="button" size="sm">
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.highlights.map((highlight, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {highlight}
                          <X 
                            className="h-3 w-3 cursor-pointer hover:text-red-500" 
                            onClick={() => removeHighlight(index)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Deskripsi & Gambar
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="description" className="text-sm font-medium">Deskripsi Paket</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                        placeholder="Deskripsikan pengalaman yang akan didapatkan pelanggan..."
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="image" className="text-sm font-medium">URL Gambar</Label>
                      <Input
                        id="image"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        placeholder="https://example.com/image.jpg atau /path/to/image.jpg"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Status Paket</h3>
                      <p className="text-sm text-gray-600">Aktifkan atau non-aktifkan paket tour</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isActive"
                        checked={formData.isActive}
                        onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                      />
                      <Label htmlFor="isActive" className="text-sm font-medium">
                        {formData.isActive ? "Aktif" : "Non-aktif"}
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button onClick={editingPackage ? handleUpdatePackage : handleCreatePackage}>
                    {editingPackage ? "Update Paket" : "Simpan Paket"}
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