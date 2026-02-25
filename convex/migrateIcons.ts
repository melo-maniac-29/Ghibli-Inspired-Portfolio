import { mutation } from "./_generated/server";

// One-time migration to convert 'icon' to 'iconUrl' in socialLinks
export const migrateIconsToIconUrl = mutation({
  handler: async (ctx) => {
    // Get all contactPage records
    const contactPages = await ctx.db.query("contactPage").collect();
    
    // Process each record
    for (const page of contactPages) {
      // Check if the record has socialLinks
      if (!page.socialLinks || !Array.isArray(page.socialLinks)) continue;
      
      // Create a new array with the correct field name
      const updatedLinks = page.socialLinks.map(link => {
        // If link already has iconUrl, no change needed
        if (link.iconUrl) return link;
        
        // Create a new object with iconUrl instead of icon
        return {
          platform: link.platform,
          url: link.url,
          iconUrl: link.icon // Move value from icon to iconUrl
        };
      });
      
      // Update the record with the new socialLinks array
      await ctx.db.patch(page._id, {
        socialLinks: updatedLinks
      });
    }
    
    return { success: true, message: "Migration completed successfully" };
  }
});
