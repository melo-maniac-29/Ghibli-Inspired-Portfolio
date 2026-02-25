import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  contacts: defineTable({
    name: v.string(),
    email: v.string(),
    subject: v.string(),
    message: v.string(),
    status: v.string(), // pending, processing, completed, rejected
    notes: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
  }),
  
  // Update contactPage table to support both icon and iconUrl during transition
  contactPage: defineTable({
    email: v.string(),
    phone: v.string(),
    address: v.string(),
    mapLocation: v.string(),
    headerTitle: v.string(),
    headerSubtitle: v.string(),
    locationTitle: v.string(),
    locationSubtitle: v.string(),
    socialLinks: v.array(
      v.object({
        platform: v.string(),
        url: v.string(),
        // Make both fields optional during the transition
        icon: v.optional(v.string()),
        iconUrl: v.optional(v.string()),
      })
    ),
  }),
  
  // Other schema definitions remain the same
  aboutPage: defineTable({
    data: v.any(),
    createdAt: v.string(),
    updatedAt: v.string()
  }),
});