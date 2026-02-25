"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Save, Trash2, ChevronUp, ChevronDown, Plus, Image as ImageIcon, Link as LinkIcon, Edit, ArrowUpDown, AlertCircle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import Image from 'next/image';
import { getSafeImageUrl, isValidUrl } from '@/utils/image-utils';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminProjectsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    category: 'web',
    image: '',
    description: '',
    technologies: [''],
    link: '',
    githubUrl: '',
    featured: false,
  });
  
  // Get projects from Convex backend
  const projects = useQuery(api.projects.getAll);
  const createProject = useMutation(api.projects.create);
  const updateProject = useMutation(api.projects.update);
  const deleteProject = useMutation(api.projects.remove);
  const reorderProjects = useMutation(api.projects.reorder);
  
  // Verify authentication
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch('/api/verify-auth');
        
        if (!response.ok) {
          router.push('/');
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error verifying authentication:', error);
        router.push('/');
      }
    };
    
    verifyAuth();
  }, [router]);
  
  // Handle form input changes
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle technology input changes
  const handleTechChange = (index: number, value: string) => {
    const updatedTech = [...formData.technologies];
    updatedTech[index] = value;
    setFormData(prev => ({
      ...prev,
      technologies: updatedTech
    }));
  };
  
  // Add new technology field
  const addTechnology = () => {
    setFormData(prev => ({
      ...prev,
      technologies: [...prev.technologies, '']
    }));
  };
  
  // Remove technology field
  const removeTechnology = (index: number) => {
    const updatedTech = [...formData.technologies];
    updatedTech.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      technologies: updatedTech
    }));
  };
  
  // Handle dialog open for creating a new project
  const handleNewProject = () => {
    setSelectedProject(null);
    setFormData({
      title: '',
      category: 'web',
      image: '',
      description: '',
      technologies: [''],
      link: '',
      githubUrl: '',
      featured: false,
    });
    setIsDialogOpen(true);
  };
  
  // Handle dialog open for editing an existing project
  const handleEditProject = (project: any) => {
    setSelectedProject(project);
    setFormData({
      title: project.title || '',
      category: project.category || 'web',
      image: project.image || '',
      description: project.description || '',
      technologies: project.technologies?.length ? project.technologies : [''],
      link: project.link || '',
      githubUrl: project.githubUrl || '',
      featured: project.featured || false,
    });
    setIsDialogOpen(true);
  };
  
  // Handle saving a project (create or update)
  const handleSaveProject = async () => {
    try {
      // Basic validation
      if (!formData.title || !formData.category || !formData.description) {
        toast.error('Please fill in all required fields');
        return;
      }
      
      // Image URL validation
      if (formData.image && !isValidUrl(formData.image)) {
        toast.error('Please enter a valid image URL');
        return;
      }
      
      // Project URL validation
      if (formData.link && !isValidUrl(formData.link)) {
        toast.error('Please enter a valid project URL');
        return;
      }
      
      // GitHub URL validation
      if (formData.githubUrl && !isValidUrl(formData.githubUrl)) {
        toast.error('Please enter a valid GitHub URL');
        return;
      }
      
      // Filter out empty technologies
      const filteredTech = formData.technologies.filter(tech => tech.trim() !== '');
      
      if (selectedProject) {
        // Update existing project
        await updateProject({
          id: selectedProject._id,
          title: formData.title,
          category: formData.category,
          image: formData.image,
          description: formData.description,
          technologies: filteredTech,
          link: formData.link,
          githubUrl: formData.githubUrl || undefined,
          featured: formData.featured,
        });
        toast.success('Project updated successfully');
      } else {
        // Create new project
        await createProject({
          title: formData.title,
          category: formData.category,
          image: formData.image,
          description: formData.description,
          technologies: filteredTech,
          link: formData.link,
          githubUrl: formData.githubUrl || undefined,
          featured: formData.featured,
          order: projects?.length || 0,
        });
        toast.success('Project created successfully');
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Failed to save project');
    }
  };
  
  // Handle project deletion
  const handleDeleteProject = async () => {
    if (!selectedProject) return;
    
    try {
      await deleteProject({ id: selectedProject._id });
      toast.success('Project deleted successfully');
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };
  
  // Handle project reordering (move up)
  const handleMoveUp = async (index: number) => {
    if (index === 0 || !projects) return;
    
    try {
      const reorderedProjects = [...projects];
      const temp = reorderedProjects[index];
      reorderedProjects[index] = reorderedProjects[index - 1];
      reorderedProjects[index - 1] = temp;
      
      const projectsWithOrder = reorderedProjects.map((project, idx) => ({
        id: project._id,
        order: idx
      }));
      
      await reorderProjects({ projectIds: projectsWithOrder });
      toast.success('Projects reordered');
    } catch (error) {
      console.error('Error reordering projects:', error);
      toast.error('Failed to reorder projects');
    }
  };
  
  // Handle project reordering (move down)
  const handleMoveDown = async (index: number) => {
    if (!projects || index === projects.length - 1) return;
    
    try {
      const reorderedProjects = [...projects];
      const temp = reorderedProjects[index];
      reorderedProjects[index] = reorderedProjects[index + 1];
      reorderedProjects[index + 1] = temp;
      
      const projectsWithOrder = reorderedProjects.map((project, idx) => ({
        id: project._id,
        order: idx
      }));
      
      await reorderProjects({ projectIds: projectsWithOrder });
      toast.success('Projects reordered');
    } catch (error) {
      console.error('Error reordering projects:', error);
      toast.error('Failed to reorder projects');
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-10 px-4 md:px-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Projects</h1>
        <div className="flex items-center gap-4">
          <Button 
            onClick={handleNewProject}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Project
          </Button>
          <Button 
            variant="outline" 
            onClick={() => router.push('/admin')}
          >
            Back to Admin
          </Button>
        </div>
      </div>
      
      <div className="space-y-6">
        {!projects || projects.length === 0 ? (
          <div className="text-center py-20 border border-dashed rounded-lg">
            <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-xl font-medium mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-6">Add your first project to showcase your work</p>
            <Button onClick={handleNewProject}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Project
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {projects.map((project, index) => (
              <Card key={project._id} className="overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  {/* Project image/thumbnail - Updated with Next Image and safe URL handling */}
                  <div className="w-full md:w-64 h-48 bg-muted relative overflow-hidden">
                    {project.image ? (
                      <div className="relative w-full h-full">
                        <Image 
                          src={getSafeImageUrl(project.image)}
                          alt={project.title || "Project image"}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            // Show placeholder on error
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://via.placeholder.com/800x600?text=Image+Error';
                            target.onerror = null; // Prevent infinite error loop
                          }}
                        />
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-muted">
                        <ImageIcon className="h-12 w-12 text-muted-foreground/40" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
                    
                    {/* Featured badge */}
                    {project.featured && (
                      <div className="absolute top-2 left-2 px-2 py-1 bg-amber-500/90 text-white text-xs font-medium rounded">
                        Featured
                      </div>
                    )}
                    
                    {/* Category badge */}
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 text-white text-xs font-medium rounded">
                      {project.category}
                    </div>
                  </div>
                  
                  {/* Project details */}
                  <div className="flex-grow p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                        <p className="text-muted-foreground line-clamp-2 mb-3">{project.description}</p>
                      </div>
                      
                      {/* Action buttons */}
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleMoveUp(index)}
                          disabled={index === 0}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleMoveDown(index)}
                          disabled={!projects || index === projects.length - 1}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <ArrowUpDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleEditProject(project)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Project
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                setSelectedProject(project);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Project
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    
                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {project.technologies?.map((tech, i) => (
                        <span 
                          key={i} 
                          className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    {/* Links */}
                    <div className="flex gap-4 mt-4">
                      {project.link && (
                        <a 
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm flex items-center text-primary/80 hover:text-primary"
                        >
                          <LinkIcon className="h-3 w-3 mr-1" />
                          {new URL(project.link).hostname}
                        </a>
                      )}
                      
                      {project.githubUrl && (
                        <a 
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm flex items-center text-primary/80 hover:text-primary"
                        >
                          <svg className="h-3 w-3 mr-1" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z" />
                          </svg>
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Project Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedProject ? 'Edit Project' : 'Create New Project'}</DialogTitle>
            <DialogDescription>
              {selectedProject ? 'Update the details of your existing project' : 'Fill in the details to create a new project'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input 
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="My Awesome Project"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange('category', value)}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web">Web Development</SelectItem>
                    <SelectItem value="mobile">Mobile Apps</SelectItem>
                    <SelectItem value="design">Design Work</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input 
                  id="image"
                  value={formData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                <p className="text-sm text-muted-foreground">
                  Enter a URL for the project image or screenshot
                </p>
                {formData.image && (
                  <div className="mt-2 relative aspect-video bg-muted rounded-md overflow-hidden">
                    <Image
                      src={getSafeImageUrl(formData.image)}
                      alt="Image preview"
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/800x600?text=Invalid+Image';
                        target.onerror = null;
                      }}
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="featured">Featured Project</Label>
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => handleInputChange('featured', checked)}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Featured projects will be highlighted and use more space in the portfolio
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="A brief description of your project"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="link">Project URL</Label>
                <Input 
                  id="link"
                  value={formData.link}
                  onChange={(e) => handleInputChange('link', e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="githubUrl">GitHub URL (Optional)</Label>
                <Input 
                  id="githubUrl"
                  value={formData.githubUrl}
                  onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                  placeholder="https://github.com/username/repo"
                />
              </div>
            </div>
          </div>
          
          {/* Technologies section */}
          <div className="space-y-3 py-4">
            <div className="flex items-center justify-between">
              <Label>Technologies Used</Label>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={addTechnology}
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Technology
              </Button>
            </div>
            
            <div className="space-y-3">
              {formData.technologies.map((tech, index) => (
                <div key={index} className="flex gap-2">
                  <Input 
                    value={tech}
                    onChange={(e) => handleTechChange(index, e.target.value)}
                    placeholder="e.g. React, Node.js, etc."
                  />
                  {formData.technologies.length > 1 && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeTechnology(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProject}>
              <Save className="mr-2 h-4 w-4" />
              {selectedProject ? 'Update Project' : 'Create Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the project "{selectedProject?.title}"? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProject}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Project
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
