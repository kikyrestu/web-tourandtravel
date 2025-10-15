"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Settings, Save, Globe, Mail, Phone, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
  seoSettings: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
  };
  isActive: boolean;
}

export default function AdminSettingsContent() {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'Nusantara Tour & Travel',
    siteDescription: 'Agent perjalanan terpercaya di Indonesia',
    contactEmail: 'info@nusantaratour.com',
    contactPhone: '+62 812-3456-7890',
    contactAddress: 'Jl. Wisata No. 123, Jakarta',
    socialLinks: {
      facebook: 'https://facebook.com/nusantaratour',
      instagram: 'https://instagram.com/nusantaratour',
      twitter: '',
      youtube: ''
    },
    seoSettings: {
      metaTitle: 'Nusantara Tour & Travel - Paket Wisata Terpercaya',
      metaDescription: 'Nikmati paket wisata terbaik ke berbagai destinasi di Indonesia dengan harga terjangkau',
      keywords: 'tour, travel, wisata, indonesia, paket tour'
    },
    isActive: true
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        toast.success('Settings updated successfully');
      } else {
        toast.error('Failed to update settings');
      }
    } catch (error) {
      toast.error('Error updating settings');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold">Site Settings</h3>
        <p className="text-gray-600">Manage your website configuration and preferences</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="siteDescription">Site Description</Label>
                <Input
                  id="siteDescription"
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactEmail">Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="contactPhone">Phone</Label>
                <Input
                  id="contactPhone"
                  value={settings.contactPhone}
                  onChange={(e) => setSettings({...settings, contactPhone: e.target.value})}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="contactAddress">Address</Label>
              <Input
                id="contactAddress"
                value={settings.contactAddress}
                onChange={(e) => setSettings({...settings, contactAddress: e.target.value})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={settings.socialLinks.facebook || ''}
                  onChange={(e) => setSettings({
                    ...settings, 
                    socialLinks: {...settings.socialLinks, facebook: e.target.value}
                  })}
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
              <div>
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={settings.socialLinks.instagram || ''}
                  onChange={(e) => setSettings({
                    ...settings, 
                    socialLinks: {...settings.socialLinks, instagram: e.target.value}
                  })}
                  placeholder="https://instagram.com/yourpage"
                />
              </div>
              <div>
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  value={settings.socialLinks.twitter || ''}
                  onChange={(e) => setSettings({
                    ...settings, 
                    socialLinks: {...settings.socialLinks, twitter: e.target.value}
                  })}
                  placeholder="https://twitter.com/yourpage"
                />
              </div>
              <div>
                <Label htmlFor="youtube">YouTube</Label>
                <Input
                  id="youtube"
                  value={settings.socialLinks.youtube || ''}
                  onChange={(e) => setSettings({
                    ...settings, 
                    socialLinks: {...settings.socialLinks, youtube: e.target.value}
                  })}
                  placeholder="https://youtube.com/yourchannel"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SEO Settings */}
        <Card>
          <CardHeader>
            <CardTitle>SEO Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input
                id="metaTitle"
                value={settings.seoSettings.metaTitle}
                onChange={(e) => setSettings({
                  ...settings, 
                  seoSettings: {...settings.seoSettings, metaTitle: e.target.value}
                })}
              />
            </div>
            <div>
              <Label htmlFor="metaDescription">Meta Description</Label>
              <textarea
                id="metaDescription"
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={3}
                value={settings.seoSettings.metaDescription}
                onChange={(e) => setSettings({
                  ...settings, 
                  seoSettings: {...settings.seoSettings, metaDescription: e.target.value}
                })}
              />
            </div>
            <div>
              <Label htmlFor="keywords">Keywords</Label>
              <Input
                id="keywords"
                value={settings.seoSettings.keywords}
                onChange={(e) => setSettings({
                  ...settings, 
                  seoSettings: {...settings.seoSettings, keywords: e.target.value}
                })}
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardHeader>
            <CardTitle>Site Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={settings.isActive}
                onCheckedChange={(checked) => setSettings({...settings, isActive: checked})}
              />
              <Label htmlFor="isActive">Site Active</Label>
              <Badge variant={settings.isActive ? "default" : "secondary"}>
                {settings.isActive ? "Online" : "Offline"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button type="submit" disabled={isLoading}>
            <Save className="w-4 h-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
}