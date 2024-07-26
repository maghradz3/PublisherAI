import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";

export const getUrl = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

export const createPublication = mutation({
  args: {
    publishmentTitle: v.string(),
    publishmentDescription: v.string(),
    audioUrl: v.string(),
    imageUrl: v.string(),
    imagePrompt: v.string(),
    voiceType: v.string(),
    voicePrompt: v.string(),
    views: v.number(),
    audioDuration: v.number(),
    audioStorageId: v.id("_storage"),
    imageStorageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("User not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .collect();

    if (user.length === 0) {
      throw new ConvexError("User not found");
    }

    const publication = await ctx.db.insert("publishments", {
      ...args,
      user: user[0]._id,
      author: user[0]._id,
      authorId: user[0].clerkId,
      authorImageUrl: user[0].imageUrl,
    });

    return publication;
  },
});

export const getTrandingPublications = query({
  handler: async (ctx) => {
    const publications = await ctx.db.query("publishments").collect();

    return publications;
  },
});

export const getPublicationsById = query({
  args: { publishmentId: v.id("publishments") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.publishmentId);
  },
});

// this query will get all the podcasts based on the voiceType of the podcast , which we are showing in the Similar Podcasts section.
export const getPodcastByAuthor = query({
  args: {
    publishmentId: v.id("publishments"),
  },
  handler: async (ctx, args) => {
    const podcast = await ctx.db.get(args.publishmentId);

    return await ctx.db
      .query("publishments")
      .filter((q) =>
        q.and(
          q.eq(q.field("authorId"), podcast?.authorId),
          q.neq(q.field("_id"), args.publishmentId)
        )
      )
      .collect();
  },
});
