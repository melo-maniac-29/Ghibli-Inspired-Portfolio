"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  PlusCircle, 
  Save, 
  Loader2, 
  Trash2, 
  GraduationCap, 
  Briefcase, 
  Award, 
  UserCircle, 
  Code,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  Upload,
  FileText,
  Link
} from 'lucide-react';
import { toast } from 'sonner';

interface AboutData {
  bio: {
    title: string;
    paragraphs: string[];
    quote: string;
    stats: Array<{ value: string; label: string }>;
  };
  education: Array<{
    degree: string;
    school: string;
    period: string;
    description: string;
  }>;
  experience: Array<{
    role: string;
    company: string;
    period: string;
    description: string;
  }>;
  awards: Array<{
    title: string;
    organization: string;
    year: string;
    description: string;
  }>;
  skills: {
    frontend: Array<{ name: string; level: number }>;
    backend: Array<{ name: string; level: number }>;
    design: Array<{ name: string; level: number }>;
    tools: Array<{ name: string; level: string }>;
  };
  resumeUrl?: string;
}

// Reorder an array item by moving it up or down
const reorderItem = <T extends any>(items: T[], index: number, direction: 'up' | 'down'): T[] => {
  if (!items || items.length <= 1) return items;
  
  const newItems = [...items];
  const newIndex = direction === 'up' 
    ? Math.max(0, index - 1) 
    : Math.min(items.length - 1, index + 1);
  
  // Swap items
  [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
  
  return newItems;
};

export default function AdminAboutPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("bio");

  // Get about page data from Convex backend
  const aboutData = useQuery(api.about.get);
  const updateAbout = useMutation(api.about.update);
  
  // Initialize form state with safe default values
  const [formData, setFormData] = useState<AboutData>({
    bio: {
      title: "",
      paragraphs: ["", "", ""],
      quote: "",
      stats: [
        { value: "", label: "" },
        { value: "", label: "" },
        { value: "", label: "" },
        { value: "", label: "" },
      ]
    },
    education: [],
    experience: [],
    awards: [],
    skills: {
      frontend: [],
      backend: [],
      design: [],
      tools: []
    },
    resumeUrl: ""
  });

  // Add a new state variable for the resume URL and upload status
  const [resumeUrl, setResumeUrl] = useState<string>('');
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Add generateUploadUrl mutation
  const generateUploadUrl = useMutation(api.about.generateUploadUrl);

  // Simplify the file upload handler
  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setUploadingResume(true);
      setUploadProgress(0);
      
      // Get upload URL from Convex
      const uploadUrl = await generateUploadUrl();
      if (!uploadUrl) {
        throw new Error("Failed to get upload URL");
      }
      
      // Create FormData
      const formData = new FormData();
      formData.append("file", file);
      
      // Use regular fetch with a timeout for more reliability
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json();
        const fileUrl = data.storageId;
        
        // Update the form data
        setResumeUrl(fileUrl);
        setFormData(prev => ({
          ...prev,
          resumeUrl: fileUrl
        }));
        
        toast.success("Resume uploaded successfully");
      } else {
        throw new Error(`Upload failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error uploading resume:", error);
      toast.error(`Failed to upload resume: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUploadingResume(false);
      setUploadProgress(0);
    }
  };

  // Populate form with data when available
  useEffect(() => {
    if (aboutData) {
      try {
        // Create a safe copy with all expected properties
        const safeData = {
          bio: {
            title: aboutData.bio?.title || "",
            paragraphs: Array.isArray(aboutData.bio?.paragraphs) 
              ? aboutData.bio.paragraphs 
              : ["", "", ""],
            quote: aboutData.bio?.quote || "",
            stats: Array.isArray(aboutData.bio?.stats) 
              ? aboutData.bio.stats 
              : [
                  { value: "", label: "" },
                  { value: "", label: "" },
                  { value: "", label: "" },
                  { value: "", label: "" },
                ]
          },
          education: Array.isArray(aboutData.education) ? aboutData.education : [],
          experience: Array.isArray(aboutData.experience) ? aboutData.experience : [],
          awards: Array.isArray(aboutData.awards) ? aboutData.awards : [],
          skills: {
            frontend: Array.isArray(aboutData.skills?.frontend) ? aboutData.skills.frontend : [],
            backend: Array.isArray(aboutData.skills?.backend) ? aboutData.skills.backend : [],
            design: Array.isArray(aboutData.skills?.design) ? aboutData.skills.design : [],
            tools: Array.isArray(aboutData.skills?.tools) ? aboutData.skills.tools : []
          },
          resumeUrl: aboutData.resumeUrl || ""
        };
        
        setFormData(safeData);
        setResumeUrl(safeData.resumeUrl);
      } catch (error) {
        console.error("Error processing about data:", error);
        // Keep the default state if there's an error
      }
      
      setIsLoading(false);
    }
  }, [aboutData]);

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

  // Save form data to backend
  const handleSave = async () => {
    try {
      setIsSaving(true);
      await updateAbout({ data: formData });
      toast.success('About page data saved successfully');
    } catch (error) {
      console.error('Error saving about page data:', error);
      toast.error('Failed to save about page data');
    } finally {
      setIsSaving(false);
    }
  };

  // Update bio information
  const updateBio = (field: string, value: string | string[] | Array<{ value: string; label: string }>) => {
    setFormData({
      ...formData,
      bio: {
        ...formData.bio,
        [field]: value
      }
    });
  };

  // Update bio paragraphs
  const updateParagraph = (index: number, value: string) => {
    const updatedParagraphs = [...formData.bio.paragraphs];
    updatedParagraphs[index] = value;
    updateBio('paragraphs', updatedParagraphs);
  };

  // Update bio stats
  const updateStat = (index: number, field: 'value' | 'label', value: string) => {
    const updatedStats = [...formData.bio.stats];
    updatedStats[index] = {
      ...updatedStats[index],
      [field]: value
    };
    updateBio('stats', updatedStats);
  };

  // Add new education item
  const addEducation = () => {
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        {
          degree: "",
          school: "",
          period: "",
          description: ""
        }
      ]
    });
  };

  // Update education item
  const updateEducation = (index: number, field: string, value: string) => {
    const updatedEducation = [...formData.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value
    };
    setFormData({
      ...formData,
      education: updatedEducation
    });
  };

  // Remove education item
  const removeEducation = (index: number) => {
    const updatedEducation = [...formData.education];
    updatedEducation.splice(index, 1);
    setFormData({
      ...formData,
      education: updatedEducation
    });
  };

  // Move education item up or down
  const moveEducation = (index: number, direction: 'up' | 'down') => {
    setFormData({
      ...formData,
      education: reorderItem(formData.education, index, direction)
    });
  };

  // Toggle collapse state for education items
  const [collapsedEducation, setCollapsedEducation] = useState<number[]>([]);
  const toggleEducationCollapse = (index: number) => {
    setCollapsedEducation(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };

  // Add new experience item
  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [
        ...formData.experience,
        {
          role: "",
          company: "",
          period: "",
          description: ""
        }
      ]
    });
  };

  // Update experience item
  const updateExperience = (index: number, field: string, value: string) => {
    const updatedExperience = [...formData.experience];
    updatedExperience[index] = {
      ...updatedExperience[index],
      [field]: value
    };
    setFormData({
      ...formData,
      experience: updatedExperience
    });
  };

  // Remove experience item
  const removeExperience = (index: number) => {
    const updatedExperience = [...formData.experience];
    updatedExperience.splice(index, 1);
    setFormData({
      ...formData,
      experience: updatedExperience
    });
  };

  // Move experience item up or down
  const moveExperience = (index: number, direction: 'up' | 'down') => {
    setFormData({
      ...formData,
      experience: reorderItem(formData.experience, index, direction)
    });
  };

  // Toggle collapse state for experience items
  const [collapsedExperience, setCollapsedExperience] = useState<number[]>([]);
  const toggleExperienceCollapse = (index: number) => {
    setCollapsedExperience(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };

  // Add new award item
  const addAward = () => {
    setFormData({
      ...formData,
      awards: [
        ...formData.awards,
        {
          title: "",
          organization: "",
          year: "",
          description: ""
        }
      ]
    });
  };

  // Update award item
  const updateAward = (index: number, field: string, value: string) => {
    const updatedAwards = [...formData.awards];
    updatedAwards[index] = {
      ...updatedAwards[index],
      [field]: value
    };
    setFormData({
      ...formData,
      awards: updatedAwards
    });
  };

  // Remove award item
  const removeAward = (index: number) => {
    const updatedAwards = [...formData.awards];
    updatedAwards.splice(index, 1);
    setFormData({
      ...formData,
      awards: updatedAwards
    });
  };

  // Move award item up or down
  const moveAward = (index: number, direction: 'up' | 'down') => {
    setFormData({
      ...formData,
      awards: reorderItem(formData.awards, index, direction)
    });
  };

  // Toggle collapse state for award items
  const [collapsedAwards, setCollapsedAwards] = useState<number[]>([]);
  const toggleAwardCollapse = (index: number) => {
    setCollapsedAwards(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };

  // Add new skill item
  const addSkill = (category: 'frontend' | 'backend' | 'design', name: string = "", level: number = 80) => {
    const updatedSkills = { ...formData.skills };
    updatedSkills[category] = [
      ...updatedSkills[category],
      { name, level }
    ];
    setFormData({
      ...formData,
      skills: updatedSkills
    });
  };

  // Update skill item
  const updateSkill = (category: 'frontend' | 'backend' | 'design', index: number, field: 'name' | 'level', value: string | number) => {
    const updatedSkills = { ...formData.skills };
    updatedSkills[category] = [...updatedSkills[category]];
    
    if (field === 'level' && typeof value === 'string') {
      value = parseInt(value);
    }
    
    updatedSkills[category][index] = {
      ...updatedSkills[category][index],
      [field]: value
    };
    
    setFormData({
      ...formData,
      skills: updatedSkills
    });
  };

  // Remove skill item
  const removeSkill = (category: 'frontend' | 'backend' | 'design', index: number) => {
    const updatedSkills = { ...formData.skills };
    updatedSkills[category] = [...updatedSkills[category]];
    updatedSkills[category].splice(index, 1);
    setFormData({
      ...formData,
      skills: updatedSkills
    });
  };

  // Add new tool item
  const addTool = () => {
    const updatedSkills = { ...formData.skills };
    updatedSkills.tools = [
      ...updatedSkills.tools,
      { name: "", level: "Intermediate" }
    ];
    setFormData({
      ...formData,
      skills: updatedSkills
    });
  };

  // Update tool item
  const updateTool = (index: number, field: string, value: string) => {
    const updatedSkills = { ...formData.skills };
    updatedSkills.tools = [...updatedSkills.tools];
    updatedSkills.tools[index] = {
      ...updatedSkills.tools[index],
      [field]: value
    };
    setFormData({
      ...formData,
      skills: updatedSkills
    });
  };

  // Remove tool item
  const removeTool = (index: number) => {
    const updatedSkills = { ...formData.skills };
    updatedSkills.tools = [...updatedSkills.tools];
    updatedSkills.tools.splice(index, 1);
    setFormData({
      ...formData,
      skills: updatedSkills
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading about page data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">About Page Admin</h1>
        <div className="flex items-center gap-4">
          <Button 
            onClick={handleSave}
            className="bg-primary hover:bg-primary/90"
            disabled={isSaving}
          >
            {isSaving ? (
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
            onClick={() => router.push('/admin')}
          >
            Back to Admin
          </Button>
        </div>
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full"
      >
        <TabsList className="grid grid-cols-5 mb-8 w-full">
          <TabsTrigger value="bio" className="flex items-center gap-2">
            <UserCircle className="h-4 w-4" />
            Bio
          </TabsTrigger>
          <TabsTrigger value="education" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Education
          </TabsTrigger>
          <TabsTrigger value="experience" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Experience
          </TabsTrigger>
          <TabsTrigger value="awards" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Awards
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Skills
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="h-[calc(100vh-220px)]">
          {/* Bio Section */}
          <TabsContent value="bio" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bio Information</CardTitle>
                <CardDescription>
                  Edit your personal bio, quote, and statistics.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="bio-title">Bio Title</Label>
                  <Input 
                    id="bio-title" 
                    value={formData?.bio?.title || ""} 
                    onChange={(e) => updateBio('title', e.target.value)}
                    placeholder="The Artist Behind the Magic"
                  />
                </div>

                {/* Paragraphs */}
                <div className="space-y-4">
                  <Label>Bio Paragraphs</Label>
                  {(formData?.bio?.paragraphs || ["", "", ""]).map((paragraph, index) => (
                    <div key={`paragraph-${index}`}>
                      <Textarea 
                        value={paragraph || ""}
                        onChange={(e) => updateParagraph(index, e.target.value)}
                        placeholder={`Paragraph ${index + 1}`}
                        rows={3}
                      />
                    </div>
                  ))}
                </div>

                {/* Quote */}
                <div className="space-y-2">
                  <Label htmlFor="bio-quote">Quote</Label>
                  <Textarea 
                    id="bio-quote"
                    value={formData?.bio?.quote || ""}
                    onChange={(e) => updateBio('quote', e.target.value)}
                    placeholder="Add an inspirational quote here..."
                    rows={2}
                  />
                </div>

                {/* Stats */}
                <div className="space-y-4">
                  <Label>Statistics</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(formData?.bio?.stats || []).map((stat, index) => (
                      <div key={`stat-${index}`} className="flex gap-4">
                        <div className="w-1/3">
                          <Input 
                            value={stat?.value || ""}
                            onChange={(e) => updateStat(index, 'value', e.target.value)}
                            placeholder="5+"
                          />
                        </div>
                        <div className="w-2/3">
                          <Input 
                            value={stat?.label || ""}
                            onChange={(e) => updateStat(index, 'label', e.target.value)}
                            placeholder="Years Experience"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resume Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle>Resume / CV</CardTitle>
                <CardDescription>Enter a link to your resume for visitors to download</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="resume-url">Resume URL</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="resume-url"
                      type="url"
                      value={formData.resumeUrl || ""}
                      onChange={(e) => {
                        setResumeUrl(e.target.value);
                        setFormData({
                          ...formData,
                          resumeUrl: e.target.value
                        });
                      }}
                      placeholder="https://example.com/my-resume.pdf"
                      className="flex-1"
                    />
                    {formData.resumeUrl && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          title="Open link"
                          onClick={() => window.open(formData.resumeUrl, '_blank')}
                        >
                          <Link className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-sm text-muted-foreground mt-4 space-y-3">
                    <div className="p-3 bg-amber-50 text-amber-800 border border-amber-200 rounded-md">
                      <p className="font-medium flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
                          <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                        </svg>
                        Download links need to be direct file URLs
                      </p>
                      <p className="mt-2">
                        For your resume to download correctly, you need a direct URL to the file. Regular Google Drive or Dropbox share links won't work properly as downloads.
                      </p>
                    </div>
                    
                    <div className="mt-4">
                      <p className="font-medium mb-2">Best options for resume links:</p>
                      <ol className="list-decimal list-inside space-y-2 pl-2">
                        <li>
                          <span className="font-medium">GitHub:</span> Upload your resume to a GitHub repository and use the raw file URL
                        </li>
                        <li>
                          <span className="font-medium">Your own website:</span> Upload your resume directly to your hosting
                        </li>
                        <li>
                          <span className="font-medium">File hosting service:</span> Use a service like Filebin, WeTransfer, or MediaFire that provides direct download links
                        </li>
                      </ol>
                    </div>
                    
                    <div className="mt-3 p-3 bg-muted rounded-md">
                      <p className="font-medium">GitHub Quick Tip:</p>
                      <ol className="list-decimal list-inside text-xs mt-1 space-y-1 pl-2">
                        <li>Upload your resume PDF to any GitHub repository</li>
                        <li>Navigate to the file in GitHub</li>
                        <li>Click "Raw" button near the top right of the file view</li>
                        <li>Copy that URL - it will look like: <span className="font-mono text-[10px] bg-gray-100 p-1 rounded">https://raw.githubusercontent.com/yourusername/repo/main/resume.pdf</span></li>
                        <li>This URL will directly download your file when clicked</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Education Section */}
          <TabsContent value="education" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Education</CardTitle>
                  <CardDescription>
                    Add your academic background and certifications.
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={addEducation}
                  className="flex items-center gap-1"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add Education
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {Array.isArray(formData.education) && formData.education.length === 0 ? (
                  <div className="text-center p-4 border border-dashed rounded-lg">
                    <p className="text-muted-foreground">No education items yet. Add your first one!</p>
                  </div>
                ) : (
                  Array.isArray(formData.education) && formData.education.map((edu, index) => (
                    <Card key={`edu-${index}`} className="relative">
                      <div className="absolute right-2 top-2 flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => toggleEducationCollapse(index)}
                        >
                          {collapsedEducation.includes(index) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronUp className="h-4 w-4" />
                          )}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => moveEducation(index, 'up')}
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => moveEducation(index, 'down')}
                          disabled={index === formData.education.length - 1}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => removeEducation(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <CardContent className={`pt-12 space-y-4 ${collapsedEducation.includes(index) ? 'hidden' : 'block'}`}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Degree/Certificate</Label>
                            <Input 
                              value={edu.degree}
                              onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                              placeholder="Master of Computer Science"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>School/Institution</Label>
                            <Input 
                              value={edu.school}
                              onChange={(e) => updateEducation(index, 'school', e.target.value)}
                              placeholder="University Name"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Period</Label>
                          <Input 
                            value={edu.period}
                            onChange={(e) => updateEducation(index, 'period', e.target.value)}
                            placeholder="2019 - 2021"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea 
                            value={edu.description}
                            onChange={(e) => updateEducation(index, 'description', e.target.value)}
                            placeholder="Describe your studies and achievements..."
                            rows={3}
                          />
                        </div>
                      </CardContent>
                      
                      <CardHeader className={`${collapsedEducation.includes(index) ? 'block' : 'hidden'} py-3`}>
                        <div className="flex items-center">
                          <div className="ml-2 flex-1 overflow-hidden">
                            <p className="text-sm font-medium truncate">{edu.degree || "New Education Entry"}</p>
                            <p className="text-xs text-muted-foreground truncate">{edu.school}</p>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Experience Section */}
          <TabsContent value="experience" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Professional Experience</CardTitle>
                  <CardDescription>
                    Add your work experience and professional roles.
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={addExperience}
                  className="flex items-center gap-1"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add Experience
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {Array.isArray(formData.experience) && formData.experience.length === 0 ? (
                  <div className="text-center p-4 border border-dashed rounded-lg">
                    <p className="text-muted-foreground">No experience items yet. Add your first one!</p>
                  </div>
                ) : (
                  Array.isArray(formData.experience) && formData.experience.map((exp, index) => (
                    <Card key={`exp-${index}`} className="relative">
                      <div className="absolute right-2 top-2 flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => toggleExperienceCollapse(index)}
                        >
                          {collapsedExperience.includes(index) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronUp className="h-4 w-4" />
                          )}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => moveExperience(index, 'up')}
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => moveExperience(index, 'down')}
                          disabled={index === formData.experience.length - 1}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => removeExperience(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <CardContent className={`pt-12 space-y-4 ${collapsedExperience.includes(index) ? 'hidden' : 'block'}`}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Role/Position</Label>
                            <Input 
                              value={exp.role}
                              onChange={(e) => updateExperience(index, 'role', e.target.value)}
                              placeholder="Senior Frontend Developer"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Company/Organization</Label>
                            <Input 
                              value={exp.company}
                              onChange={(e) => updateExperience(index, 'company', e.target.value)}
                              placeholder="Company Name"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Period</Label>
                          <Input 
                            value={exp.period}
                            onChange={(e) => updateExperience(index, 'period', e.target.value)}
                            placeholder="2021 - Present"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea 
                            value={exp.description}
                            onChange={(e) => updateExperience(index, 'description', e.target.value)}
                            placeholder="Describe your responsibilities and achievements..."
                            rows={3}
                          />
                        </div>
                      </CardContent>
                      
                      <CardHeader className={`${collapsedExperience.includes(index) ? 'block' : 'hidden'} py-3`}>
                        <div className="flex items-center">
                          <div className="ml-2 flex-1 overflow-hidden">
                            <p className="text-sm font-medium truncate">{exp.role || "New Experience Entry"}</p>
                            <p className="text-xs text-muted-foreground truncate">{exp.company}</p>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Awards Section */}
          <TabsContent value="awards" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Awards & Achievements</CardTitle>
                  <CardDescription>
                    Add your recognitions and special achievements.
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={addAward}
                  className="flex items-center gap-1"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add Award
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Show empty state if no awards */}
                {!Array.isArray(formData.awards) || formData.awards.length === 0 ? (
                  <div className="text-center p-4 border border-dashed rounded-lg">
                    <p className="text-muted-foreground">No awards items yet. Add your first one!</p>
                  </div>
                ) : (
                  /* Only create mapping function once with safe array check */
                  <div className="space-y-4">
                    {formData.awards.map((award, index) => (
                      <Card key={`award-${index}`} className="relative">
                        <div className="absolute right-2 top-2 flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            aria-label={collapsedAwards.includes(index) ? "Expand" : "Collapse"}
                            onClick={() => toggleAwardCollapse(index)}
                          >
                            {collapsedAwards.includes(index) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronUp className="h-4 w-4" />
                            )}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            aria-label="Move up" 
                            onClick={() => moveAward(index, 'up')}
                            disabled={index === 0}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            aria-label="Move down" 
                            onClick={() => moveAward(index, 'down')}
                            disabled={index === formData.awards.length - 1}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="icon" 
                            className="h-8 w-8"
                            aria-label="Remove award" 
                            onClick={() => removeAward(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        {/* Conditionally render content or header based on collapsed state */}
                        {collapsedAwards.includes(index) ? (
                          <CardHeader className="py-3">
                            <div className="flex items-center">
                              <div className="ml-2 flex-1 overflow-hidden">
                                <p className="text-sm font-medium truncate">{award.title || "New Award Entry"}</p>
                                <p className="text-xs text-muted-foreground truncate">{award.organization}</p>
                              </div>
                            </div>
                          </CardHeader>
                        ) : (
                          <CardContent className="pt-12 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Award Title</Label>
                                <Input 
                                  value={award.title || ""}
                                  onChange={(e) => updateAward(index, 'title', e.target.value)}
                                  placeholder="Innovation Award"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Organization</Label>
                                <Input 
                                  value={award.organization || ""}
                                  onChange={(e) => updateAward(index, 'organization', e.target.value)}
                                  placeholder="WebCraft Association"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label>Year</Label>
                              <Input 
                                value={award.year || ""}
                                onChange={(e) => updateAward(index, 'year', e.target.value)}
                                placeholder="2022"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Description</Label>
                              <Textarea 
                                value={award.description || ""}
                                onChange={(e) => updateAward(index, 'description', e.target.value)}
                                placeholder="Describe the award and its significance..."
                                rows={3}
                              />
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skills Section */}
          <TabsContent value="skills" className="space-y-6">
            {/* Frontend Skills */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Frontend Skills</CardTitle>
                  <CardDescription>
                    Your frontend development skills and proficiency levels.
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => addSkill('frontend')}
                  className="flex items-center gap-1"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add Skill
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.isArray(formData.skills?.frontend) && formData.skills.frontend.map((skill, index) => (
                    <div key={`frontend-${index}`} className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-5">
                        <Input 
                          value={skill.name}
                          onChange={(e) => updateSkill('frontend', index, 'name', e.target.value)}
                          placeholder="Skill name"
                        />
                      </div>
                      <div className="col-span-5">
                        <div className="flex items-center gap-2">
                          <Input 
                            type="range"
                            min="1"
                            max="100"
                            value={skill.level}
                            onChange={(e) => updateSkill('frontend', index, 'level', e.target.value)}
                          />
                          <span className="text-sm w-9">{skill.level}%</span>
                        </div>
                      </div>
                      <div className="col-span-2 flex justify-end">
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => removeSkill('frontend', index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Backend Skills */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Backend Skills</CardTitle>
                  <CardDescription>
                    Your backend development skills and proficiency levels.
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => addSkill('backend')}
                  className="flex items-center gap-1"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add Skill
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.isArray(formData.skills?.backend) && formData.skills.backend.map((skill, index) => (
                    <div key={`backend-${index}`} className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-5">
                        <Input 
                          value={skill.name}
                          onChange={(e) => updateSkill('backend', index, 'name', e.target.value)}
                          placeholder="Skill name"
                        />
                      </div>
                      <div className="col-span-5">
                        <div className="flex items-center gap-2">
                          <Input 
                            type="range"
                            min="1"
                            max="100"
                            value={skill.level}
                            onChange={(e) => updateSkill('backend', index, 'level', e.target.value)}
                          />
                          <span className="text-sm w-9">{skill.level}%</span>
                        </div>
                      </div>
                      <div className="col-span-2 flex justify-end">
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => removeSkill('backend', index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Design Skills */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Design Skills</CardTitle>
                  <CardDescription>
                    Your design and UX/UI skills and proficiency levels.
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => addSkill('design')}
                  className="flex items-center gap-1"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add Skill
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.isArray(formData.skills?.design) && formData.skills.design.map((skill, index) => (
                    <div key={`design-${index}`} className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-5">
                        <Input 
                          value={skill.name}
                          onChange={(e) => updateSkill('design', index, 'name', e.target.value)}
                          placeholder="Skill name"
                        />
                      </div>
                      <div className="col-span-5">
                        <div className="flex items-center gap-2">
                          <Input 
                            type="range"
                            min="1"
                            max="100"
                            value={skill.level}
                            onChange={(e) => updateSkill('design', index, 'level', e.target.value)}
                          />
                          <span className="text-sm w-9">{skill.level}%</span>
                        </div>
                      </div>
                      <div className="col-span-2 flex justify-end">
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => removeSkill('design', index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tools */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Tools & Technologies</CardTitle>
                  <CardDescription>
                    The tools and technologies you're proficient with.
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={addTool}
                  className="flex items-center gap-1"
                >
                  <PlusCircle className="h-4 w-4" />
                  Add Tool
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.isArray(formData.skills?.tools) && formData.skills.tools.map((tool, index) => (
                    <div key={`tool-${index}`} className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-5">
                        <Input 
                          value={tool.name}
                          onChange={(e) => updateTool(index, 'name', e.target.value)}
                          placeholder="Tool name"
                        />
                      </div>
                      <div className="col-span-5">
                        <select
                          value={tool.level}
                          onChange={(e) => updateTool(index, 'level', e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Expert">Expert</option>
                        </select>
                      </div>
                      <div className="col-span-2 flex justify-end">
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={() => removeTool(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}
