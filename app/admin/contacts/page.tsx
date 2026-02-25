"use client";

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from 'next/navigation';
import { Loader2, Search, CheckCircle2, Clock, AlertCircle, LoaderCircle, ChevronDown, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function AdminContactsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Form state for updating contact
  const [updateData, setUpdateData] = useState({
    status: '',
    notes: ''
  });
  
  // Mutations and queries
  const allContacts = useQuery(api.contact.getAllContactSubmissions);
  const updateContactStatus = useMutation(api.contact.updateContactStatus);
  
  // Effect to handle loading state
  useEffect(() => {
    // Avoid setState during render by checking if allContacts is defined
    if (typeof allContacts !== 'undefined') {
      setIsLoading(false);
    }
  }, [allContacts]);
  
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
  
  // Handle contact selection for viewing details
  const handleViewContact = (contact: any) => {
    setSelectedContact(contact);
    setIsViewDialogOpen(true);
  };
  
  // Handle opening update dialog
  const handleUpdateStatus = (contact: any) => {
    setSelectedContact(contact);
    setUpdateData({
      status: contact.status || 'pending',
      notes: contact.notes || ''
    });
    setIsUpdateDialogOpen(true);
  };
  
  // Handle saving status update
  const handleSaveStatusUpdate = async () => {
    if (!selectedContact || !updateData.status) {
      toast.error('Missing required information');
      return;
    }

    try {
      await updateContactStatus({
        id: selectedContact._id,
        status: updateData.status,
        notes: updateData.notes || undefined
      });
      
      toast.success('Contact status updated successfully');
      setIsUpdateDialogOpen(false);
    } catch (error) {
      console.error('Error updating contact status:', error);
      toast.error('Failed to update contact status');
    }
  };
  
  // Improve the filtering with more robust null/undefined checks
  const filteredContacts = Array.isArray(allContacts) && allContacts ? allContacts.filter(contact => {
    if (!contact) return false;
    
    // Apply status filter
    if (statusFilter !== 'all' && contact.status !== statusFilter) {
      return false;
    }
    
    // Apply search filter with more robust handling
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        (contact.name || '').toLowerCase().includes(searchLower) ||
        (contact.email || '').toLowerCase().includes(searchLower) ||
        (contact.subject || '').toLowerCase().includes(searchLower) ||
        (contact.message || '').toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  }) : [];
  
  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return { variant: 'outline' as const, icon: <Clock className="mr-1 h-3 w-3" /> };
      case 'processing':
        return { variant: 'secondary' as const, icon: <LoaderCircle className="mr-1 h-3 w-3 animate-spin" /> };
      case 'completed':
        return { variant: 'default' as const, icon: <CheckCircle2 className="mr-1 h-3 w-3" /> };
      case 'rejected':
        return { variant: 'destructive' as const, icon: <AlertCircle className="mr-1 h-3 w-3" /> };
      default:
        return { variant: 'outline' as const, icon: null };
    }
  };
  
  // Get counts for each status
  const getCounts = () => {
    if (!Array.isArray(allContacts)) return { all: 0, pending: 0, processing: 0, completed: 0, rejected: 0 };
    
    return {
      all: allContacts.length,
      pending: allContacts.filter(c => c.status === 'pending').length,
      processing: allContacts.filter(c => c.status === 'processing').length,
      completed: allContacts.filter(c => c.status === 'completed').length,
      rejected: allContacts.filter(c => c.status === 'rejected').length
    };
  };
  
  const counts = getCounts();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading contact submissions...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-10 px-4 md:px-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Contact Requests</h1>
        <Button 
          variant="outline" 
          onClick={() => router.push('/admin')}
        >
          Back to Admin
        </Button>
      </div>
      
      {/* Stats overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {['all', 'pending', 'processing', 'completed', 'rejected'].map((status, index) => {
          if (status === 'all' && index > 0) return null; // Skip duplicate "all"
          
          const count = status === 'all' 
            ? counts.all
            : counts[status as keyof typeof counts] || 0;
          
          return (
            <Card 
              key={status}
              className={`cursor-pointer transition-all ${statusFilter === status ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setStatusFilter(status)}
            >
              <CardHeader className="py-4">
                <CardTitle className="text-lg flex items-center">
                  {status === 'pending' && <Clock className="mr-2 h-4 w-4 text-amber-500" />}
                  {status === 'processing' && <LoaderCircle className="mr-2 h-4 w-4 text-blue-500" />}
                  {status === 'completed' && <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />}
                  {status === 'rejected' && <AlertCircle className="mr-2 h-4 w-4 text-red-500" />}
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{count}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  {status === 'all' ? 'Total requests' : `${status} requests`}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pb-4">
        <div className="relative w-full sm:w-auto flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Contact requests table */}
      <div className="rounded-md border">
        <Table>
          <TableCaption>A list of all contact form submissions.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No contact requests found
                </TableCell>
              </TableRow>
            ) : (
              filteredContacts.map((contact) => (
                <TableRow key={contact?._id || Math.random().toString()}>
                  <TableCell className="font-medium">{contact?.name || 'N/A'}</TableCell>
                  <TableCell>{contact?.email || 'N/A'}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {contact?.subject || "No subject"}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={getStatusBadge(contact?.status || 'pending').variant} 
                      className="flex w-fit items-center"
                    >
                      {getStatusBadge(contact?.status || 'pending').icon}
                      <span>
                        {(contact?.status || 'pending').charAt(0).toUpperCase() + 
                         (contact?.status || 'pending').slice(1)}
                      </span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {contact?.createdAt ? 
                      new Date(contact.createdAt).toLocaleDateString() : 
                      'N/A'
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleViewContact(contact)}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUpdateStatus(contact)}>
                          Update Status
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* View contact dialog */}
      {selectedContact && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-3xl overflow-y-auto max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Contact Request Details</DialogTitle>
              <DialogDescription>
                Submission ID: {selectedContact._id}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* Status badge */}
              <div className="flex items-center justify-between">
                <Badge variant={getStatusBadge(selectedContact.status || 'pending').variant} className="flex items-center px-3 py-1">
                  {getStatusBadge(selectedContact.status || 'pending').icon}
                  <span className="text-sm">
                    {(selectedContact.status || 'pending').charAt(0).toUpperCase() + (selectedContact.status || 'pending').slice(1)}
                  </span>
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {selectedContact.createdAt 
                    ? new Date(selectedContact.createdAt).toLocaleString() 
                    : 'Unknown date'}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                  <p className="text-lg">{selectedContact.name || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                  <p className="text-lg">{selectedContact.email || 'N/A'}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Subject</h3>
                <p className="text-lg">{selectedContact.subject || "No subject"}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Message</h3>
                <div className="p-4 rounded-md bg-muted mt-2">
                  <p className="whitespace-pre-wrap">{selectedContact.message || 'No message content'}</p>
                </div>
              </div>
              
              {selectedContact.notes && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Admin Notes</h3>
                  <div className="p-4 rounded-md bg-muted mt-2">
                    <p className="whitespace-pre-wrap">{selectedContact.notes}</p>
                  </div>
                </div>
              )}
            </div>
            
            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="ghost" onClick={() => setIsViewDialogOpen(false)}>
                Close
              </Button>
              <Button onClick={() => {
                setIsViewDialogOpen(false);
                handleUpdateStatus(selectedContact);
              }}>
                Update Status
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Update status dialog */}
      {selectedContact && (
        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Request Status</DialogTitle>
              <DialogDescription>
                Update the status for {selectedContact.name || 'this contact'}'s request.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select 
                  value={updateData.status} 
                  onValueChange={(value) => setUpdateData({...updateData, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Notes (optional)</label>
                <Textarea
                  value={updateData.notes}
                  onChange={(e) => setUpdateData({...updateData, notes: e.target.value})}
                  placeholder="Add any notes or feedback for this request"
                  rows={4}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveStatusUpdate}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
