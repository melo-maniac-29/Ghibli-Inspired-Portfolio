"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Loader2, Trash2, PlusCircle, Mail, Phone, MapPin } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

export default function AdminContactPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  
  // Form state - support both fields during migration
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    address: '',
    mapLocation: '',
    headerTitle: '',
    headerSubtitle: '',
    locationTitle: '',
    locationSubtitle: '',
    socialLinks: [
      { platform: 'Twitter', url: '', iconUrl: '𝕏', icon: '𝕏' },
      { platform: 'LinkedIn', url: '', iconUrl: 'in', icon: 'in' },
      { platform: 'GitHub', url: '', iconUrl: 'github', icon: 'github' },
      { platform: 'Instagram', url: '', iconUrl: 'instagram', icon: 'instagram' },
    ]
  });
  
  // Fetch contact page content
  const contactPageContent = useQuery(api.contactPage.get);
  const updateContactPageContent = useMutation(api.contactPage.update);
  
  // Populate form with existing data
  useEffect(() => {
    if (contactPageContent) {
      setFormData({
        email: contactPageContent.email || '',
        phone: contactPageContent.phone || '',
        address: contactPageContent.address || '',
        mapLocation: contactPageContent.mapLocation || '',
        headerTitle: contactPageContent.headerTitle || '',
        headerSubtitle: contactPageContent.headerSubtitle || '',
        locationTitle: contactPageContent.locationTitle || '',
        locationSubtitle: contactPageContent.locationSubtitle || '',
        socialLinks: contactPageContent.socialLinks?.map(link => ({
          platform: link.platform || '',
          url: link.url || '',
          // Map both fields to maintain compatibility
          iconUrl: link.iconUrl || link.icon || '',
          icon: link.icon || link.iconUrl || ''
        })) || [
          { platform: 'Twitter', url: '', iconUrl: '𝕏', icon: '𝕏' },
          { platform: 'LinkedIn', url: '', iconUrl: 'in', icon: 'in' },
          { platform: 'GitHub', url: '', iconUrl: 'github', icon: 'github' },
          { platform: 'Instagram', url: '', iconUrl: 'instagram', icon: 'instagram' },
        ]
      });
      setLoading(false);
    }
  }, [contactPageContent]);
  
  // Verify authentication
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch('/api/verify-auth');
        
        if (!response.ok) {
          router.push('/');
        }
      } catch (error) {
        console.error('Error verifying authentication:', error);
        router.push('/');
      }
    };
    
    verifyAuth();
  }, [router]);
  
  // Update social link to handle both fields
  const updateSocialLink = (index, field, value) => {
    const updatedLinks = [...formData.socialLinks];
    
    // Update the specified field
    updatedLinks[index] = {
      ...updatedLinks[index],
      [field]: value
    };
    
    // If updating iconUrl, also update icon for backward compatibility
    if (field === 'iconUrl') {
      updatedLinks[index].icon = value;
    }
    // If updating icon, also update iconUrl for forward compatibility
    else if (field === 'icon') {
      updatedLinks[index].iconUrl = value;
    }
    
    setFormData(prev => ({
      ...prev,
      socialLinks: updatedLinks
    }));
  };
  
  // Add new social link
  const addSocialLink = () => {
    setFormData(prev => ({
      ...prev,
      socialLinks: [
        ...prev.socialLinks,
        { platform: '', url: '', iconUrl: '', icon: '' }
      ]
    }));
  };
  
  // Remove social link
  const removeSocialLink = (index) => {
    const updatedLinks = [...formData.socialLinks];
    updatedLinks.splice(index, 1);
    
    setFormData(prev => ({
      ...prev,
      socialLinks: updatedLinks
    }));
  };
  
  // Update form field
  const updateField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Save contact page content
  const handleSave = async () => {
    try {
      setSaving(true);
      
      await updateContactPageContent({
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        mapLocation: formData.mapLocation,
        headerTitle: formData.headerTitle,
        headerSubtitle: formData.headerSubtitle,
        locationTitle: formData.locationTitle,
        locationSubtitle: formData.locationSubtitle,
        socialLinks: formData.socialLinks.map(link => ({
          platform: link.platform,
          url: link.url,
          // Include both fields for compatibility
          iconUrl: link.iconUrl || link.icon || '',
          icon: link.icon || link.iconUrl || ''
        }))
      });
      
      toast({
        title: "Contact page updated",
        description: "Your contact page content has been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving contact page:', error);
      toast({
        title: "Error saving changes",
        description: "There was a problem updating your contact page.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };
  
  // Handle navigation back to admin page
  const handleBackToAdmin = () => {
    router.push('/admin');
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-10 px-4 md:px-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Contact Page Settings</h1>
        <div className="flex items-center gap-4">
          <Button 
            onClick={handleSave}
            className="bg-primary hover:bg-primary/90"
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleBackToAdmin}
          >
            Back to Admin
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="headers">Page Text</TabsTrigger>
          <TabsTrigger value="social">Social Links</TabsTrigger>
        </TabsList>
        
        {/* Basic Info Tab */}
        <TabsContent value="basic" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Your basic contact information displayed on the contact page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="email">Email Address</Label>
                </div>
                <Input
                  id="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="your@email.com"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="phone">Phone Number</Label>
                </div>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="address">Address</Label>
                </div>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  placeholder="New York, NY, USA"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mapLocation">Map Location URL</Label>
                <Input
                  id="mapLocation"
                  value={formData.mapLocation}
                  onChange={(e) => updateField('mapLocation', e.target.value)}
                  placeholder="https://maps.google.com/?q=your-address"
                />
                <p className="text-sm text-muted-foreground">
                  Enter a Google Maps URL or any map service link that shows your location.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Headers Tab */}
        <TabsContent value="headers" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Page Headers & Text</CardTitle>
              <CardDescription>
                Customize the headers and descriptive text on your contact page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="headerTitle">Main Header Title</Label>
                <Input
                  id="headerTitle"
                  value={formData.headerTitle}
                  onChange={(e) => updateField('headerTitle', e.target.value)}
                  placeholder="Send a Message"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="headerSubtitle">Header Subtitle</Label>
                <Textarea
                  id="headerSubtitle"
                  value={formData.headerSubtitle}
                  onChange={(e) => updateField('headerSubtitle', e.target.value)}
                  placeholder="Like a magical letter carried by the wind in a Ghibli film..."
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="locationTitle">Location Section Title</Label>
                <Input
                  id="locationTitle"
                  value={formData.locationTitle}
                  onChange={(e) => updateField('locationTitle', e.target.value)}
                  placeholder="Find Me Here"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="locationSubtitle">Location Section Subtitle</Label>
                <Textarea
                  id="locationSubtitle"
                  value={formData.locationSubtitle}
                  onChange={(e) => updateField('locationSubtitle', e.target.value)}
                  placeholder="Like a hidden spot in a Ghibli landscape..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Social Links Tab */}
        <TabsContent value="social" className="space-y-6 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Social Media Links</CardTitle>
                <CardDescription>
                  Your social media profiles displayed on the contact page.
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={addSocialLink}
                className="flex items-center gap-1"
              >
                <PlusCircle className="h-4 w-4" />
                Add Link
              </Button>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {formData.socialLinks.map((link, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Platform</Label>
                        <Input
                          value={link.platform}
                          onChange={(e) => updateSocialLink(index, 'platform', e.target.value)}
                          placeholder="Twitter"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Icon</Label>
                        <Input
                          value={link.iconUrl}
                          onChange={(e) => updateSocialLink(index, 'iconUrl', e.target.value)}
                          placeholder="𝕏"
                        />
                        <p className="text-xs text-muted-foreground">
                          Use a character or name like "github", "instagram", etc.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label>URL</Label>
                        <Input
                          value={link.url}
                          onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                          placeholder="https://twitter.com/username"
                        />
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0 mt-8"
                    onClick={() => removeSocialLink(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              {formData.socialLinks.length === 0 && (
                <div className="text-center py-4 border border-dashed rounded-lg">
                  <p className="text-muted-foreground">No social links added yet. Add your first one!</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-muted/50 flex justify-between">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Note:</span> These social links will be displayed on your contact page
              </p>
            </CardFooter>
          </Card>
          
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 rounded-lg border border-amber-200 dark:border-amber-900/50">
            <h3 className="font-medium mb-2">Icon Tips:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>For Twitter: Use "𝕏" character</li>
              <li>For LinkedIn: Use "in" text</li>
              <li>For GitHub: Use "github" text</li>
              <li>For Instagram: Use "instagram" text</li>
              <li>You can also use emoji or any special character for custom icons</li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
