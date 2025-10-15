"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Save, X, MoveUp, MoveDown, Upload, Link } from 'lucide-react';
import { toast } from 'sonner';

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  image?: string;
  videoId?: string;
  features: string[];
  stats: Record<string, string>;
  isActive: boolean;
  sortOrder: number;
}

interface FeatureInput {
  id: string;
  value: string;
}

interface StatInput {
  key: string;
  value: string;
}

export default function AdminHeroContent() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  // Form states
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [image, setImage] = useState('');
  const [videoId, setVideoId] = useState('');
  const [features, setFeatures] = useState<FeatureInput[]>([{ id: '1', value: '' }]);
  const [stats, setStats] = useState<StatInput[]>([{ key: '', value: '' }]);
  const [isActive, setIsActive] = useState(true);
  
  // Image upload states
  const [uploading, setUploading] = useState(false);
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/hero', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setSlides(data.data);
      } else {
        if (response.status === 401) {
          toast.error('Session expired. Please login again.');
          // Redirect to login or handle accordingly
        } else {
          toast.error('Failed to fetch hero slides');
        }
      }
    } catch (error) {
      toast.error('Error fetching hero slides');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setTitle(slide.title);
    setSubtitle(slide.subtitle);
    setImage(slide.image || '');
    setVideoId(slide.videoId || '');
    setFeatures(slide.features.map((f, i) => ({ id: i.toString(), value: f })));
    setStats(Object.entries(slide.stats).map(([key, value]) => ({ key, value })));
    setIsActive(slide.isActive);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setEditingSlide(null);
    setTitle('');
    setSubtitle('');
    setImage('');
    setVideoId('');
    setFeatures([{ id: '1', value: '' }]);
    setStats([{ key: '', value: '' }]);
    setIsActive(true);
    setIsCreating(true);
  };

  const handleCancel = () => {
    setEditingSlide(null);
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

  const addFeature = () => {
    setFeatures([...features, { id: Date.now().toString(), value: '' }]);
  };

  const removeFeature = (id: string) => {
    setFeatures(features.filter(f => f.id !== id));
  };

  const updateFeature = (id: string, value: string) => {
    setFeatures(features.map(f => f.id === id ? { ...f, value } : f));
  };

  const addStat = () => {
    setStats([...stats, { key: '', value: '' }]);
  };

  const removeStat = (index: number) => {
    setStats(stats.filter((_, i) => i !== index));
  };

  const updateStat = (index: number, field: 'key' | 'value', value: string) => {
    setStats(stats.map((stat, i) => i === index ? { ...stat, [field]: value } : stat));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const featuresArray = features.filter(f => f.value.trim()).map(f => f.value.trim());
    const statsObject = stats.reduce((acc, stat) => {
      if (stat.key.trim() && stat.value.trim()) {
        acc[stat.key.trim()] = stat.value.trim();
      }
      return acc;
    }, {} as Record<string, string>);

    const payload = {
      title,
      subtitle,
      image: image || null,
      videoId: videoId || null,
      features: featuresArray,
      stats: statsObject,
      isActive
    };

    try {
      const url = editingSlide ? `/api/admin/hero/${editingSlide.id}` : '/api/admin/hero';
      const method = editingSlide ? 'PUT' : 'POST';
      
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
        toast.success(editingSlide ? 'Hero slide updated successfully' : 'Hero slide created successfully');
        handleCancel();
        fetchSlides();
      } else {
        toast.error('Failed to save hero slide');
      }
    } catch (error) {
      toast.error('Error saving hero slide');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this hero slide?')) {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`/api/admin/hero/${id}`, { 
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          toast.success('Hero slide deleted successfully');
          fetchSlides();
        } else {
          toast.error('Failed to delete hero slide');
        }
      } catch (error) {
        toast.error('Error deleting hero slide');
      }
    }
  };

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = slides.findIndex(s => s.id === id);
    if (currentIndex === -1) return;

    const newSlides = [...slides];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= newSlides.length) return;

    // Swap sort orders
    const temp = newSlides[currentIndex].sortOrder;
    newSlides[currentIndex].sortOrder = newSlides[targetIndex].sortOrder;
    newSlides[targetIndex].sortOrder = temp;

    // Update in database
    try {
      const token = localStorage.getItem('adminToken');
      await Promise.all([
        fetch(`/api/admin/hero/${newSlides[currentIndex].id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ sortOrder: newSlides[currentIndex].sortOrder })
        }),
        fetch(`/api/admin/hero/${newSlides[targetIndex].id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ sortOrder: newSlides[targetIndex].sortOrder })
        })
      ]);

      // Re-sort array
      newSlides.sort((a, b) => a.sortOrder - b.sortOrder);
      setSlides(newSlides);
      toast.success('Hero slide reordered successfully');
    } catch (error) {
      toast.error('Failed to reorder hero slide');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Hero Slides Management</h3>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Slide
        </Button>
      </div>

      {/* Slides List */}
      <div className="overflow-x-auto"> {/* Prevent horizontal overflow */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-w-max"> {/* Prevent card compression */}
          {slides.map((slide, index) => (
            <Card key={slide.id} className="hover:shadow-lg transition-shadow relative group w-80"> {/* Fixed width for consistency */}
            {/* Action Buttons - Overlay on hover */}
            <div className="absolute top-2 right-2 z-50 opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-sm rounded-lg p-1 shadow-lg border"> {/* Higher z-index and border */}
              <div className="flex flex-col gap-1">
                {/* Only show reorder buttons if there are multiple slides */}
                {slides.length > 1 && (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleReorder(slide.id, 'up')}
                      disabled={index === 0}
                      className="h-8 w-8 p-0"
                      title="Move Up"
                    >
                      <MoveUp className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleReorder(slide.id, 'down')}
                      disabled={index === slides.length - 1}
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
                  onClick={() => handleEdit(slide)}
                  className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(slide.id)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <CardHeader className="pb-3">
              <div className="pr-12"> {/* Add right padding for action buttons space */}
                <CardTitle className="text-lg line-clamp-2">{slide.title}</CardTitle>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{slide.subtitle}</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {slide.image && (
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img 
                      src={slide.image} 
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="flex flex-wrap gap-1">
                  {slide.features.slice(0, 3).map((feature, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                  {slide.features.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{slide.features.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${slide.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-xs text-gray-500">
                    {slide.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit/Create Form */}
      {(isCreating || editingSlide) && (
        <Card>
          <CardHeader>
            <CardTitle>{isCreating ? 'Create New Hero Slide' : 'Edit Hero Slide'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="subtitle">Subtitle</Label>
                  <Textarea
                    id="subtitle"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Image</Label>
                  <div className="space-y-3">
                    {/* Toggle between URL and Upload */}
                    <div className="flex gap-2">
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

                    {/* URL Input */}
                    {imageMode === 'url' && (
                      <Input
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                      />
                    )}

                    {/* File Upload */}
                    {imageMode === 'upload' && (
                      <div className="space-y-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploading}
                        />
                        {uploading && (
                          <p className="text-sm text-gray-500">Uploading...</p>
                        )}
                      </div>
                    )}

                    {/* Image Preview */}
                    {image && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 mb-1">Preview:</p>
                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
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
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="videoId">Video ID (YouTube)</Label>
                  <Input
                    id="videoId"
                    value={videoId}
                    onChange={(e) => setVideoId(e.target.value)}
                    placeholder="dQw4w9WgXcQ"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Features</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Feature
                  </Button>
                </div>
                {features.map((feature, index) => (
                  <div key={feature.id} className="flex gap-2 mb-2">
                    <Input
                      value={feature.value}
                      onChange={(e) => updateFeature(feature.id, e.target.value)}
                      placeholder={`Feature ${index + 1}`}
                    />
                    {features.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeFeature(feature.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Stats</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addStat}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Stat
                  </Button>
                </div>
                {stats.map((stat, index) => (
                  <div key={index} className="grid grid-cols-2 gap-2 mb-2">
                    <Input
                      value={stat.key}
                      onChange={(e) => updateStat(index, 'key', e.target.value)}
                      placeholder="Stat name (e.g., Tours)"
                    />
                    <div className="flex gap-2">
                      <Input
                        value={stat.value}
                        onChange={(e) => updateStat(index, 'value', e.target.value)}
                        placeholder="Value (e.g., 150+)"
                      />
                      {stats.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeStat(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
                <Label htmlFor="isActive">Active</Label>
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
    </div>
  );
}