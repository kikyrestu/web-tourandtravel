'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Save, X, MoveUp, MoveDown, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

interface ContentSection {
  id: string;
  title: string;
  content: string;
  sectionType: string;
  position: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function ContentSectionsPage() {
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<ContentSection | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [sectionType, setSectionType] = useState('text');
  const [position, setPosition] = useState(0);
  const [isActive, setIsActive] = useState(true);

  // Rich text editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing your content here...',
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  useEffect(() => {
    fetchSections();
  }, []);

  useEffect(() => {
    if (editor && editingSection) {
      editor.commands.setContent(editingSection.content);
    } else if (editor) {
      editor.commands.setContent('');
    }
  }, [editor, editingSection]);

  const fetchSections = async () => {
    try {
      const response = await fetch('/api/admin/content-sections');
      if (response.ok) {
        const data = await response.json();
        setSections(data);
      } else {
        toast.error('Failed to fetch content sections');
      }
    } catch (error) {
      toast.error('Error fetching content sections');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (section: ContentSection) => {
    setEditingSection(section);
    setTitle(section.title);
    setContent(section.content);
    setSectionType(section.sectionType);
    setPosition(section.position);
    setIsActive(section.isActive);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setEditingSection(null);
    setTitle('');
    setContent('');
    setSectionType('text');
    setPosition(sections.length);
    setIsActive(true);
    setIsCreating(true);
  };

  const handleCancel = () => {
    setEditingSection(null);
    setIsCreating(false);
    if (editor) {
      editor.commands.setContent('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      title,
      content,
      sectionType,
      position,
      isActive
    };

    try {
      const url = editingSection ? `/api/admin/content-sections/${editingSection.id}` : '/api/admin/content-sections';
      const method = editingSection ? 'PUT' : 'POST';
      
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
        toast.success(editingSection ? 'Content section updated successfully' : 'Content section created successfully');
        handleCancel();
        fetchSections();
      } else {
        toast.error('Failed to save content section');
      }
    } catch (error) {
      toast.error('Error saving content section');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this content section?')) {
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`/api/admin/content-sections/${id}`, { 
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          toast.success('Content section deleted successfully');
          fetchSections();
        } else {
          toast.error('Failed to delete content section');
        }
      } catch (error) {
        toast.error('Error deleting content section');
      }
    }
  };

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = sections.findIndex(s => s.id === id);
    if (currentIndex === -1) return;

    const newSections = [...sections];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (targetIndex < 0 || targetIndex >= newSections.length) return;

    // Swap positions
    const temp = newSections[currentIndex].position;
    newSections[currentIndex].position = newSections[targetIndex].position;
    newSections[targetIndex].position = temp;

    // Update in database
    try {
      const token = localStorage.getItem('adminToken');
      await Promise.all([
        fetch(`/api/admin/content-sections/${newSections[currentIndex].id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ position: newSections[currentIndex].position })
        }),
        fetch(`/api/admin/content-sections/${newSections[targetIndex].id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ position: newSections[targetIndex].position })
        })
      ]);

      // Re-sort array
      newSections.sort((a, b) => a.position - b.position);
      setSections(newSections);
      toast.success('Content section reordered successfully');
    } catch (error) {
      toast.error('Failed to reorder content section');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Content Sections Management</h1>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Section
        </Button>
      </div>

      {(isCreating || editingSection) && (
        <Card>
          <CardHeader>
            <CardTitle>{isCreating ? 'Create New Content Section' : 'Edit Content Section'}</CardTitle>
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
                    placeholder="Enter section title"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="sectionType">Section Type</Label>
                  <Select value={sectionType} onValueChange={setSectionType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select section type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">General Text</SelectItem>
                      <SelectItem value="about">About Us</SelectItem>
                      <SelectItem value="mission">Mission</SelectItem>
                      <SelectItem value="vision">Vision</SelectItem>
                      <SelectItem value="story">Our Story</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <div className="border rounded-md min-h-[200px]">
                  {editor && (
                    <EditorContent 
                      editor={editor} 
                      className="prose prose-sm max-w-none p-4 focus:outline-none"
                    />
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Use the toolbar above for formatting (bold, italic, lists, etc.)
                </p>
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
        {sections.map((section, index) => (
          <Card key={section.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{section.title}</h3>
                    <Badge variant={section.isActive ? "default" : "secondary"}>
                      {section.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {section.sectionType}
                    </Badge>
                  </div>
                  
                  <div 
                    className="text-gray-600 mb-2 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                  
                  <p className="text-xs text-gray-500">
                    Position: {section.position} | Updated: {new Date(section.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReorder(section.id, 'up')}
                    disabled={index === 0}
                  >
                    <MoveUp className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReorder(section.id, 'down')}
                    disabled={index === sections.length - 1}
                  >
                    <MoveDown className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(section)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(section.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {sections.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No content sections found</p>
              <p className="text-sm text-gray-400 mt-2">Create your first content section to add text below the hero section</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}