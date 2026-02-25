import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Define project schema
const projectSchema = {
  title: v.string(),
  category: v.string(),
  image: v.string(),
  description: v.string(),
  technologies: v.array(v.string()),
  link: v.string(),
  githubUrl: v.optional(v.string()),
  featured: v.boolean(),
  order: v.optional(v.number()),
};

// Query to get all projects
export const getAll = query({
  handler: async (ctx) => {
    const projects = await ctx.db.query("projects").collect();
    // Sort by order field if it exists, otherwise by _creationTime
    return projects.sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      return a._creationTime - b._creationTime;
    });
  },
});

// Query to get featured projects only
export const getFeatured = query({
  handler: async (ctx) => {
    const projects = await ctx.db
      .query("projects")
      .filter((q) => q.eq(q.field("featured"), true))
      .collect();
    
    return projects.sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      return a._creationTime - b._creationTime;
    });
  },
});

// Query to get projects by category
export const getByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    const projects = await ctx.db
      .query("projects")
      .filter((q) => q.eq(q.field("category"), args.category))
      .collect();
    
    return projects.sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      return a._creationTime - b._creationTime;
    });
  },
});

// Mutation to create a new project
export const create = mutation({
  args: projectSchema,
  handler: async (ctx, args) => {
    return await ctx.db.insert("projects", args);
  },
});

// Mutation to update an existing project
export const update = mutation({
  args: { id: v.id("projects"), ...projectSchema },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, data);
    return id;
  },
});

// Mutation to delete a project
export const remove = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});

// Mutation to reorder projects
export const reorder = mutation({
  args: { 
    projectIds: v.array(v.object({
      id: v.id("projects"),
      order: v.number()
    }))
  },
  handler: async (ctx, args) => {
    for (const item of args.projectIds) {
      await ctx.db.patch(item.id, { order: item.order });
    }
    return true;
  },
});
