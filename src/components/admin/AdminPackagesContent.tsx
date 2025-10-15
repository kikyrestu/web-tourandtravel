"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Save, X, MoveUp, MoveDown, Upload, Link, DollarSign, MapPin, Clock, Star, Tag, Calendar, Users, Settings } from 'lucide-react';
import { toast } from 'sonner';

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

interface HighlightInput {
  id: string;
  value: string;
}

export default function AdminPackagesContent() {
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPackage, setEditingPackage] = useState<TourPackage | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  // Form states
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [rating, setRating] = useState(4.5);
  const [reviews, setReviews] = useState(0);
  const [location, setLocation] = useState('');
  const [highlights, setHighlights] = useState<HighlightInput[]>([{ id: '1', value: '' }]);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [isActive, setIsActive] = useState(true);
  
  // Image upload states
  const [uploading, setUploading] = useState(false);
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/packages', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPackages(data);
      } else {
        toast.error('Failed to fetch tour packages');
      }
    } catch (error) {
      toast.error('Error fetching tour packages');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pkg: TourPackage) => {
    setEditingPackage(pkg);
    setName(pkg.name);
    setDuration(pkg.duration);
    setPrice(pkg.price);
    setOriginalPrice(pkg.originalPrice || '');
    setDiscount(pkg.discount || '');
    setRating(pkg.rating);
    setReviews(pkg.reviews);
    setLocation(pkg.location);
    setHighlights(pkg.highlights.map((h, i) => ({ id: i.toString(), value: h })));
    setDescription(pkg.description);
    setImage(pkg.image || '');
    setIsActive(pkg.isActive);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setEditingPackage(null);
    setName('');
    setDuration('');
    setPrice('');
    setOriginalPrice('');
    setDiscount('');
    setRating(4.5);
    setReviews(0);
    setLocation('');
    setHighlights([{ id: '1', value: '' }]);
    setDescription('');
    setImage('');
    setIsActive(true);
    setIsCreating(true);
  };

  const handleCancel = () => {
    setEditingPackage(null);
    setIsCreating(false);
    setImageMode('url');
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setImage(data.filePath);
        toast.success('Image uploaded successfully!');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to upload image');
      }
    } catch (error) {
      toast.error('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const addHighlight = () => {
    setHighlights([...highlights, { id: Date.now().toString(), value: '' }]);
  };

  const removeHighlight = (id: string) => {
    setHighlights(highlights.filter(h => h.id !== id));
  };

  const updateHighlight = (id: string, value: string) => {
    setHighlights(highlights.map(h => h.id === id ? { ...h, value } : h));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!name.trim()) {
      toast.error('Package name is required');
      return;
    }
    if (!duration.trim()) {
      toast.error('Duration is required');
      return;
    }
    if (!price.trim()) {
      toast.error('Price is required');
      return;
    }
    if (!location.trim()) {
      toast.error('Location is required');
      return;
    }

    const highlightsArray = highlights.filter(h => h.value.trim()).map(h => h.value.trim());

    const payload = {
      name,
      duration,
      price,
      originalPrice: originalPrice || null,
      discount: discount || null,
      rating,
      reviews,
      location,
      highlights: highlightsArray,
      description,
      image: image || null,
      isActive
    };

    try {
      const url = editingPackage ? `/api/admin/packages/${editingPackage.id}` : '/api/admin/packages';
      const method = editingPackage ? 'PUT' : 'POST';
      
      const token = localStorage.getItem('adminToken');
      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        toast.success(editingPackage ? 'Tour package updated successfully' : 'Tour package created successfully');
        handleCancel();
        fetchPackages();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to save tour package');
      }
    } catch (error) {
      toast.error('Error saving tour package');
    }
  };

  const handleDelete = async (id: string) => {
    const pkg = packages.find(p => p.id === id);
    if (!pkg) return;

    if (!confirm(`Are you sure you want to delete "${pkg.name}"?`)) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/packages/${id}`, { 
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        toast.success('Tour package deleted successfully');
        fetchPackages();
      } else {
        toast.error('Failed to delete tour package');
      }
    } catch (error) {
      toast.error('Error deleting tour package');
    }
  };

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = packages.findIndex(p => p.id === id);
    if (currentIndex === -1) return;

    const newPackages = [...packages];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= newPackages.length) return;

    // Swap packages in array
    const temp = newPackages[currentIndex];
    newPackages[currentIndex] = newPackages[targetIndex];
    newPackages[targetIndex] = temp;

    setPackages(newPackages);
    toast.success('Tour package reordered successfully');
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Tour Packages Management</h3>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Package
        </Button>
      </div>

      {/* Packages List */}
      <div className="overflow-x-auto"> {/* Prevent horizontal overflow */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-w-max"> {/* Prevent card compression */}
        {packages.map((pkg, index) => (
          <Card key={pkg.id} className="hover:shadow-lg transition-shadow relative group w-80"> {/* Fixed width for consistency */}
            {/* Action Buttons - Overlay on hover */}
            <div className="absolute top-2 right-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-sm rounded-lg p-1 shadow-lg border"> {/* Higher z-index and border */}
              <div className="flex flex-col gap-1">
                {/* Only show reorder buttons if there are multiple packages */}
                {packages.length > 1 && (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleReorder(pkg.id, 'up')}
                      disabled={index === 0}
                      className="h-8 w-8 p-0"
                      title="Move Up"
                    >
                      <MoveUp className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleReorder(pkg.id, 'down')}
                      disabled={index === packages.length - 1}
                      className="h-8 w-8 p-0"
                      title="Move Down"
                    >
                      <MoveDown className="w-4 h-4" />
                    </Button>
                  </>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleEdit(pkg)}
                  className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(pkg.id)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <CardHeader className="pb-3">
              <div className="pr-12"> {/* Add right padding for action buttons space */}
                <CardTitle className="text-lg line-clamp-2">{pkg.name}</CardTitle>
                <p className="text-sm text-gray-600 mt-1">{pkg.duration}</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pkg.image && (
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img 
                      src={pkg.image} 
                      alt={pkg.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.jpg';
                      }}
                    />
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-600">{pkg.price}</span>
                  {pkg.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">{pkg.originalPrice}</span>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{pkg.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{pkg.location}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {pkg.highlights.slice(0, 3).map((highlight, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {highlight}
                    </Badge>
                  ))}
                  {pkg.highlights.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{pkg.highlights.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${pkg.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-xs text-gray-500">
                    {pkg.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        </div>
      </div>

      {/* Edit/Create Form */}
      {(isCreating || editingPackage) && (
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5" />
              {isCreating ? 'Create New Tour Package' : 'Edit Tour Package'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Basic Information */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-800">
                  <Calendar className="w-5 h-5" />
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-blue-700">Package Name *</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Paket Bromo Sunrise"
                      className="mt-1 border-blue-200 focus:border-blue-400"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration" className="text-sm font-medium text-blue-700">Duration *</Label>
                    <Input
                      id="duration"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="2 Hari 1 Malam"
                      className="mt-1 border-blue-200 focus:border-blue-400"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Pricing Information */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-green-800">
                  <DollarSign className="w-5 h-5" />
                  Pricing Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price" className="text-sm font-medium text-green-700">Price *</Label>
                    <Input
                      id="price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="1.250.000"
                      className="mt-1 border-green-200 focus:border-green-400"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="originalPrice" className="text-sm font-medium text-green-700">Original Price</Label>
                    <Input
                      id="originalPrice"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                      placeholder="1.500.000"
                      className="mt-1 border-green-200 focus:border-green-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="discount" className="text-sm font-medium text-green-700">Discount</Label>
                    <Input
                      id="discount"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      placeholder="20%"
                      className="mt-1 border-green-200 focus:border-green-400"
                    />
                  </div>
                </div>
              </div>

              {/* Location & Rating */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-purple-800">
                  <MapPin className="w-5 h-5" />
                  Location & Rating
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="location" className="text-sm font-medium text-purple-700">Location *</Label>
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Bromo, Jawa Timur"
                      className="mt-1 border-purple-200 focus:border-purple-400"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="rating" className="text-sm font-medium text-purple-700">Rating</Label>
                    <Input
                      id="rating"
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={rating}
                      onChange={(e) => setRating(parseFloat(e.target.value) || 0)}
                      className="mt-1 border-purple-200 focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="reviews" className="text-sm font-medium text-purple-700">Reviews</Label>
                    <Input
                      id="reviews"
                      type="number"
                      value={reviews}
                      onChange={(e) => setReviews(parseInt(e.target.value) || 0)}
                      className="mt-1 border-purple-200 focus:border-purple-400"
                    />
                  </div>
                </div>
              </div>

              {/* Image & Media */}
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-5 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-amber-800">
                  <Upload className="w-5 h-5" />
                  Image & Media
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex gap-2 mb-3">
                      <Button
                        type="button"
                        variant={imageMode === 'url' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setImageMode('url')}
                        className="flex-1"
                      >
                        <Link className="w-4 h-4 mr-1" />
                        URL
                      </Button>
                      <Button
                        type="button"
                        variant={imageMode === 'upload' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setImageMode('upload')}
                        className="flex-1"
                      >
                        <Upload className="w-4 h-4 mr-1" />
                        Upload
                      </Button>
                    </div>

                    {imageMode === 'url' && (
                      <div>
                        <Label className="text-sm font-medium text-amber-700">Image URL</Label>
                        <Input
                          value={image}
                          onChange={(e) => setImage(e.target.value)}
                          placeholder="https://example.com/image.jpg"
                          className="mt-1 border-amber-200 focus:border-amber-400"
                        />
                      </div>
                    )}

                    {imageMode === 'upload' && (
                      <div>
                        <Label className="text-sm font-medium text-amber-700">Upload Image</Label>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploading}
                          className="mt-1 border-amber-200 focus:border-amber-400"
                        />
                        {uploading && (
                          <p className="text-sm text-gray-500 mt-1">Uploading...</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-amber-700">Preview</Label>
                    {image ? (
                      <div className="mt-1">
                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border">
                          <img 
                            src={image} 
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder.jpg';
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="mt-1 aspect-video bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <p className="text-sm text-gray-500">No image selected</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Highlights & Description */}
              <div className="bg-gradient-to-r from-red-50 to-pink-50 p-5 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-800">
                  <Star className="w-5 h-5" />
                  Highlights & Description
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium text-red-700">Highlights</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addHighlight}>
                        <Plus className="w-4 h-4 mr-1" />
                        Add Highlight
                      </Button>
                    </div>
                    {highlights.map((highlight, index) => (
                      <div key={highlight.id} className="flex gap-2 mb-2">
                        <Input
                          value={highlight.value}
                          onChange={(e) => updateHighlight(highlight.id, e.target.value)}
                          placeholder={`Highlight ${index + 1}`}
                          className="border-red-200 focus:border-red-400"
                        />
                        {highlights.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeHighlight(highlight.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-sm font-medium text-red-700">Description</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Deskripsi lengkap paket tour..."
                      className="mt-1 border-red-200 focus:border-red-400"
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              {/* Settings */}
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-5 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                  <Settings className="w-5 h-5" />
                  Settings
                </h3>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={isActive}
                    onCheckedChange={setIsActive}
                  />
                  <Label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active</Label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}