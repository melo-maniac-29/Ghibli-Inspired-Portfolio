import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Improved contact submission mutation with error handling
export const createContactSubmission = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    subject: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      // Insert with more detailed logging for debugging
      console.log("Attempting to create contact submission:", args.email);
      
      const contactId = await ctx.db.insert("contacts", {
        name: args.name,
        email: args.email,
        subject: args.subject,
        message: args.message,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      console.log("Contact submission created successfully:", contactId);
      return contactId;
    } catch (error) {
      // Enhanced error logging to help diagnose issues
      console.error("Failed to create contact submission:", error);
      console.error("Submission data:", JSON.stringify(args));
      throw new Error("Failed to submit your message. Please try again.");
    }
  },
});

// Get all contact submissions with improved reliability
export const getAllContactSubmissions = query({
  args: {},
  handler: async (ctx) => {
    try {
      const contacts = await ctx.db
        .query("contacts")
        .order("desc")
        .collect();
      return contacts;
    } catch (error) {
      console.error("Error fetching contact submissions:", error);
      return [];
    }
  },
});

// Update contact submission status
export const updateContactStatus = mutation({
  args: {
    id: v.id("contacts"),
    status: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, status, notes } = args;
    
    await ctx.db.patch(id, {
      status,
      notes,
      updatedAt: new Date().toISOString(),
    });
    
    return id;
  },
});

// Check status by email without any restrictions
export const checkSubmissionStatusByEmail = query({
  args: { 
    email: v.string()
  },
  handler: async (ctx, args) => {
    try {
      const { email } = args;
      
      // Find all contact submissions for this email without limitations
      const submissions = await ctx.db
        .query("contacts")
        .filter(q => q.eq(q.field("email"), email))
        .order("desc")
        .collect();
      
      return submissions;
    } catch (error) {
      console.error("Error checking submission status:", error);
      return [];
    }
  },
});
