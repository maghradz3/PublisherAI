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
      author: user[0].name,
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

// this mutation will delete the podcast.
export const deletePublication = mutation({
  args: {
    publicationId: v.id("publishments"),
    imageStorageId: v.id("_storage"),
    audioStorageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const podcast = await ctx.db.get(args.publicationId);

    if (!podcast) {
      throw new ConvexError("Podcast not found");
    }

    await ctx.storage.delete(args.imageStorageId);
    await ctx.storage.delete(args.audioStorageId);
    return await ctx.db.delete(args.publicationId);
  },
});

// this query will get the podcast by the search query.
export const getPublicationBySearch = query({
  args: {
    search: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.search === "") {
      return await ctx.db.query("publishments").order("desc").collect();
    }

    const authorSearch = await ctx.db
      .query("publishments")
      .withSearchIndex("search_author", (q) => q.search("author", args.search))
      .take(10);

    if (authorSearch.length > 0) {
      return authorSearch;
    }

    const titleSearch = await ctx.db
      .query("publishments")
      .withSearchIndex("search_title", (q) =>
        q.search("publishmentTitle", args.search)
      )
      .take(10);

    if (titleSearch.length > 0) {
      return titleSearch;
    }

    return await ctx.db
      .query("publishments")
      .withSearchIndex("search_body", (q) =>
        q.search("publishmentDescription" || "publishmentTitle", args.search)
      )
      .take(10);
  },
});

// this query will get the podcast by the authorId.
export const getPublicationsByAuthorId = query({
  args: {
    authorId: v.string(),
  },
  handler: async (ctx, args) => {
    const publications = await ctx.db
      .query("publishments")
      .filter((q) => q.eq(q.field("authorId"), args.authorId))
      .collect();

    const totalListeners = publications.reduce(
      (sum, podcast) => sum + podcast.views,
      0
    );

    return { publications, listeners: totalListeners };
  },
});
