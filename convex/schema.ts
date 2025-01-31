import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  publishments: defineTable({
    audioStorageId: v.optional(v.id("_storage")),
    user: v.id("users"),
    publishmentTitle: v.string(),
    publishmentDescription: v.string(),
    audioUrl: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
    author: v.string(),
    authorId: v.string(),
    authorImageUrl: v.string(),
    voicePrompt: v.string(),
    imagePrompt: v.string(),
    voiceType: v.string(),
    audioDuration: v.number(),
    views: v.number(),
  })
    .searchIndex("search_author", { searchField: "author" })
    .searchIndex("search_title", {
      searchField: "publishmentTitle",
    })
    .searchIndex("search_body", { searchField: "publishmentDescription" }),
  users: defineTable({
    email: v.string(),
    imageUrl: v.string(),
    clerkId: v.string(),
    name: v.string(),
  }),
});
