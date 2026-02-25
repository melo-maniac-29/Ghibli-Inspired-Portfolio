import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Default contact page content - use iconUrl for consistency
const defaultContactContent = {
  email: "allenbobby2003@gmail.com",
  phone: "+91 6238128951",
  address: "kerala,india",
  mapLocation: "https://maps.google.com/?q=kerala,india",
  headerTitle: "Send a Message",
  headerSubtitle: "Like a magical letter carried by the wind in a Ghibli film, your message will find its way to me. Let's start our creative journey together.",
  locationTitle: "Find Me Here",
  locationSubtitle: "Like a hidden spot in a Ghibli landscape, here's where you can find me.",
  socialLinks: [
    { platform: "Twitter", url: "https://twitter.com", iconUrl: "𝕏" },
    { platform: "LinkedIn", url: "https://www.linkedin.com/in/allenbobby/", iconUrl: "in" },
    { platform: "GitHub", url: "https://github.com/melo-maniac-29", iconUrl: "github" },
    { platform: "Instagram", url: "https://instagram.com", iconUrl: "instagram" },
  ]
};

// Get contact page content
export const get = query({
  handler: async (ctx) => {
    // Try to find existing contact page content
    const contactPageData = await ctx.db
      .query("contactPage")
      .first();
    
    // Return existing data or default
    return contactPageData || defaultContactContent;
  },
});

// Update the schema to support both icon and iconUrl during transition
const contactPageSchema = {
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
      // Support both fields during transition
      icon: v.optional(v.string()),
      iconUrl: v.optional(v.string()),
    })
  ),
};

// Update contact page content
export const update = mutation({
  args: contactPageSchema,
  handler: async (ctx, args) => {
    try {
      // Check if a record already exists
      const existingRecord = await ctx.db
        .query("contactPage")
        .first();
      
      // Process social links to normalize data
      const processedArgs = {
        ...args,
        socialLinks: args.socialLinks.map(link => {
          // Prioritize iconUrl if it exists
          if (link.iconUrl) {
            return {
              platform: link.platform,
              url: link.url,
              iconUrl: link.iconUrl,
              // Include icon for backward compatibility if it exists
              ...(link.icon ? { icon: link.icon } : {})
            };
          } 
          // Fallback to icon if iconUrl doesn't exist
          else if (link.icon) {
            return {
              platform: link.platform,
              url: link.url,
              icon: link.icon,
              // Also copy icon value to iconUrl for forward compatibility
              iconUrl: link.icon
            };
          }
          // Default case - both are empty
          return {
            platform: link.platform,
            url: link.url,
            iconUrl: "", // Provide a default
          };
        })
      };
      
      if (existingRecord) {
        // Update existing record
        return await ctx.db.patch(existingRecord._id, processedArgs);
      } else {
        // Create new record
        return await ctx.db.insert("contactPage", processedArgs);
      }
    } catch (error) {
      console.error("Error updating contact page:", error);
      throw new Error("Failed to update contact page content");
    }
  },
});

// Public query to get contact page content for the frontend
export const getPublic = query({
  handler: async (ctx) => {
    const contactPageData = await ctx.db
      .query("contactPage")
      .first();
    
    return contactPageData || defaultContactContent;
  },
});
