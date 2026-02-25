import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Define the data structure for the about page
const aboutSchema = v.object({
  bio: v.object({
    title: v.string(),
    paragraphs: v.array(v.string()),
    quote: v.string(),
    stats: v.array(v.object({
      value: v.string(),
      label: v.string()
    }))
  }),
  education: v.array(v.object({
    degree: v.string(),
    school: v.string(),
    period: v.string(),
    description: v.string()
  })),
  experience: v.array(v.object({
    role: v.string(),
    company: v.string(),
    period: v.string(),
    description: v.string()
  })),
  awards: v.array(v.object({
    title: v.string(),
    organization: v.string(),
    year: v.string(),
    description: v.string()
  })),
  skills: v.object({
    frontend: v.array(v.object({
      name: v.string(),
      level: v.number()
    })),
    backend: v.array(v.object({
      name: v.string(),
      level: v.number()
    })),
    design: v.array(v.object({
      name: v.string(),
      level: v.number()
    })),
    tools: v.array(v.object({
      name: v.string(),
      level: v.string()
    }))
  }),
  resumeUrl: v.optional(v.string())
});

// Get about page data
export const get = query({
  handler: async (ctx) => {
    const aboutData = await ctx.db
      .query("aboutPage")
      .order("desc")
      .first();
    
    // Return default data if nothing is found
    if (!aboutData) {
      return {
        bio: {
          title: "The Artist Behind the Magic",
          paragraphs: [
            "I'm a creative developer with a passion for building immersive digital experiences that blend artistry with functionality. Drawing inspiration from Studio Ghibli's enchanting worlds, I craft websites that tell stories and create emotional connections.",
            "My approach balances technical excellence with creative vision, allowing me to transform complex ideas into intuitive, beautiful interfaces. Each project is an opportunity to create something magical that resonates with users while delivering measurable results.",
            "When I'm not crafting code or designing interfaces, you'll find me exploring new artistic techniques, studying animation principles, or wandering in nature to gather fresh inspiration for my next digital creation."
          ],
          quote: "In our creations, we find the courage to bring dreams into reality. Digital spaces, like Ghibli's worlds, can inspire wonder and tell profound stories.",
          stats: [
            { value: "5+", label: "Years Experience" },
            { value: "50+", label: "Projects Completed" },
            { value: "30+", label: "Happy Clients" },
            { value: "15+", label: "Tech Stack" }
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
      };
    }
    
    return aboutData.data;
  },
});

// Update about page data
export const update = mutation({
  args: { data: aboutSchema },
  handler: async (ctx, args) => {
    // Check if there's an existing about page entry
    const existingAbout = await ctx.db
      .query("aboutPage")
      .order("desc")
      .first();
    
    if (existingAbout) {
      // Update existing entry
      return await ctx.db.patch(existingAbout._id, {
        data: args.data,
        updatedAt: new Date().toISOString()
      });
    } else {
      // Create new entry
      return await ctx.db.insert("aboutPage", {
        data: args.data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
  },
});

// Generate a URL for resume upload
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  }
});
