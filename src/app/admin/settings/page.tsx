"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, 
  LayoutDashboard,
  LogOut,
  Save,
  Upload,
  Palette,
  Globe,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter
} from "lucide-react";

interface SiteSettings {
  id: string;
  siteName: string;
  siteDescription: string;
  siteKeywords: string;
  headerBackground?: string;
  logo?: string;
  favicon?: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  socialLinks: string;
  seoMetaTitle?: string;
  seoMetaDescription?: string;
  seoMetaKeywords?: string;
}

export default function AdminSettings() {
  const router = useRouter();
  const [settings, setSettings] = useState<SiteSettings>({
    id: "",
    siteName: "Nusantara Tour",
    siteDescription: "",
    siteKeywords: "",
    headerBackground: "",
    logo: "",
    favicon: "",
    contactEmail: "",
    contactPhone: "",
    contactAddress: "",
    socialLinks: "{}",
    seoMetaTitle: "",
    seoMetaDescription: "",
    seoMetaKeywords: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadType, setUploadType] = useState<"logo" | "favicon" | "header">("logo");

  useEffect(() => {
    checkAuth();
    fetchSettings();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
    }
  };

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/admin/settings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        alert("Pengaturan berhasil disimpan!");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Gagal menyimpan pengaturan!");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("adminToken");
      const xhr = new XMLHttpRequest();

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          setUploadProgress(progress);
        }
      };

      xhr.onload = async () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          
          // Update settings with uploaded file path
          setSettings(prev => ({
            ...prev,
            [uploadType]: response.filePath
          }));
        } else {
          console.error("Upload failed");
        }
        setUploadProgress(0);
      };

      xhr.onerror = () => {
        console.error("Upload error");
        setUploadProgress(0);
      };

      xhr.open("POST", "/api/admin/upload");
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      xhr.send(formData);
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadProgress(0);
    }
  };

  const handleRegenerateSitemap = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/admin/regenerate-sitemap", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Sitemap berhasil di-regenerate!");
      } else {
        alert("Gagal regenerate sitemap!");
      }
    } catch (error) {
      console.error("Error regenerating sitemap:", error);
      alert("Gagal regenerate sitemap!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin/login");
  };

  const socialLinks = JSON.parse(settings.socialLinks || "{}");

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
              <h1 className="text-2xl font-bold text-gray-900">Pengaturan</h1>
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
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Pengaturan Situs</h2>
          <p className="text-gray-600">Kelola pengaturan umum, SEO, dan tampilan situs</p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">Umum</TabsTrigger>
            <TabsTrigger value="appearance">Tampilan</TabsTrigger>
            <TabsTrigger value="contact">Kontak</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Pengaturan Umum
                </CardTitle>
                <CardDescription>
                  Informasi dasar tentang situs Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="siteName">Nama Situs</Label>
                    <Input
                      id="siteName"
                      value={settings.siteName}
                      onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="siteKeywords">Keywords</Label>
                    <Input
                      id="siteKeywords"
                      value={settings.siteKeywords}
                      onChange={(e) => setSettings({ ...settings, siteKeywords: e.target.value })}
                      placeholder="tour, travel, indonesia, bromo, ijen"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="siteDescription">Deskripsi Situs</Label>
                  <Textarea
                    id="siteDescription"
                    value={settings.siteDescription}
                    onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                    rows={3}
                    placeholder="Deskripsi singkat tentang situs Anda"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Tampilan
                </CardTitle>
                <CardDescription>
                  Kelola logo, favicon, dan background header
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Logo Upload */}
                <div>
                  <Label>Logo</Label>
                  <div className="mt-2 space-y-2">
                    {settings.logo && (
                      <div className="flex items-center space-x-4">
                        <img
                          src={settings.logo}
                          alt="Logo"
                          className="h-16 w-16 object-contain border rounded"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSettings({ ...settings, logo: "" })}
                        >
                          Hapus
                        </Button>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setUploadType("logo")}
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Upload Logo
                      </Button>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="logo-upload"
                      />
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById("logo-upload")?.click()}
                      >
                        Pilih File
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Favicon Upload */}
                <div>
                  <Label>Favicon</Label>
                  <div className="mt-2 space-y-2">
                    {settings.favicon && (
                      <div className="flex items-center space-x-4">
                        <img
                          src={settings.favicon}
                          alt="Favicon"
                          className="h-8 w-8 object-contain border rounded"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSettings({ ...settings, favicon: "" })}
                        >
                          Hapus
                        </Button>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setUploadType("favicon")}
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Upload Favicon
                      </Button>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="favicon-upload"
                      />
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById("favicon-upload")?.click()}
                      >
                        Pilih File
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Header Background */}
                <div>
                  <Label>Background Header</Label>
                  <div className="mt-2 space-y-2">
                    {settings.headerBackground && (
                      <div className="flex items-center space-x-4">
                        <img
                          src={settings.headerBackground}
                          alt="Header Background"
                          className="h-20 w-32 object-cover border rounded"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSettings({ ...settings, headerBackground: "" })}
                        >
                          Hapus
                        </Button>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setUploadType("header")}
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Upload Background
                      </Button>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="header-upload"
                      />
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById("header-upload")?.click()}
                      >
                        Pilih File
                      </Button>
                    </div>
                  </div>
                </div>

                {uploadProgress > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Informasi Kontak
                </CardTitle>
                <CardDescription>
                  Kelola informasi kontak situs Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactEmail">Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactPhone">Telepon</Label>
                    <Input
                      id="contactPhone"
                      value={settings.contactPhone}
                      onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="contactAddress">Alamat</Label>
                  <Textarea
                    id="contactAddress"
                    value={settings.contactAddress}
                    onChange={(e) => setSettings({ ...settings, contactAddress: e.target.value })}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Media Sosial</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="facebook">Facebook</Label>
                      <Input
                        id="facebook"
                        value={socialLinks.facebook || ""}
                        onChange={(e) => {
                          const updated = { ...socialLinks, facebook: e.target.value };
                          setSettings({ ...settings, socialLinks: JSON.stringify(updated) });
                        }}
                        placeholder="https://facebook.com/..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input
                        id="instagram"
                        value={socialLinks.instagram || ""}
                        onChange={(e) => {
                          const updated = { ...socialLinks, instagram: e.target.value };
                          setSettings({ ...settings, socialLinks: JSON.stringify(updated) });
                        }}
                        placeholder="https://instagram.com/..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="twitter">Twitter</Label>
                      <Input
                        id="twitter"
                        value={socialLinks.twitter || ""}
                        onChange={(e) => {
                          const updated = { ...socialLinks, twitter: e.target.value };
                          setSettings({ ...settings, socialLinks: JSON.stringify(updated) });
                        }}
                        placeholder="https://twitter.com/..."
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  SEO Settings
                </CardTitle>
                <CardDescription>
                  Pengaturan SEO untuk optimasi mesin pencari
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="seoMetaTitle">Meta Title</Label>
                  <Input
                    id="seoMetaTitle"
                    value={settings.seoMetaTitle || ""}
                    onChange={(e) => setSettings({ ...settings, seoMetaTitle: e.target.value })}
                    placeholder="Judul untuk SEO (60 karakter)"
                  />
                </div>
                <div>
                  <Label htmlFor="seoMetaDescription">Meta Description</Label>
                  <Textarea
                    id="seoMetaDescription"
                    value={settings.seoMetaDescription || ""}
                    onChange={(e) => setSettings({ ...settings, seoMetaDescription: e.target.value })}
                    rows={3}
                    placeholder="Deskripsi untuk SEO (160 karakter)"
                  />
                </div>
                <div>
                  <Label htmlFor="seoMetaKeywords">Meta Keywords</Label>
                  <Input
                    id="seoMetaKeywords"
                    value={settings.seoMetaKeywords || ""}
                    onChange={(e) => setSettings({ ...settings, seoMetaKeywords: e.target.value })}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-8 space-x-4">
          <Button 
            variant="outline" 
            onClick={handleRegenerateSitemap}
            className="flex items-center gap-2"
          >
            <Globe className="h-4 w-4" />
            Regenerate Sitemap
          </Button>
          <Button onClick={handleSaveSettings} disabled={isSaving} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            {isSaving ? "Menyimpan..." : "Simpan Pengaturan"}
          </Button>
        </div>
      </div>
    </div>
  );
}