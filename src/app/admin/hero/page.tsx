'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Save, X, MoveUp, MoveDown } from 'lucide-react';
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

export default function HeroPage() {
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

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const response = await fetch('/api/admin/hero');
      if (response.ok) {
        const data = await response.json();
        setSlides(data.data);
      } else {
        toast.error('Failed to fetch hero slides');
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
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
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
        const response = await fetch(`/api/admin/hero/${id}`, { method: 'DELETE' });
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
      await Promise.all([
        fetch(`/api/admin/hero/${newSlides[currentIndex].id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sortOrder: newSlides[currentIndex].sortOrder })
        }),
        fetch(`/api/admin/hero/${newSlides[targetIndex].id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
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
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Hero Slides Management</h1>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Slide
        </Button>
      </div>

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
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                  />
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

      <div className="grid gap-4">
        {slides.map((slide, index) => (
          <Card key={slide.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{slide.title}</h3>
                    <Badge variant={slide.isActive ? "default" : "secondary"}>
                      {slide.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-2">{slide.subtitle}</p>
                  
                  {slide.image && (
                    <p className="text-sm text-gray-500 mb-1">
                      Image: {slide.image}
                    </p>
                  )}
                  
                  {slide.videoId && (
                    <p className="text-sm text-gray-500 mb-2">
                      Video ID: {slide.videoId}
                    </p>
                  )}
                  
                  {slide.features.length > 0 && (
                    <div className="mb-2">
                      <p className="text-sm font-medium mb-1">Features:</p>
                      <div className="flex flex-wrap gap-1">
                        {slide.features.map((feature, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {Object.keys(slide.stats).length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-1">Stats:</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {Object.entries(slide.stats).map(([key, value]) => (
                          <div key={key} className="text-xs bg-gray-50 p-2 rounded">
                            <div className="font-medium">{key}</div>
                            <div>{value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReorder(slide.id, 'up')}
                    disabled={index === 0}
                  >
                    <MoveUp className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReorder(slide.id, 'down')}
                    disabled={index === slides.length - 1}
                  >
                    <MoveDown className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(slide)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(slide.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {slides.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No hero slides found. Create your first slide!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}