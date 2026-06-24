"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/utils";
import { postSchema } from "@/schemas";
import type { PostInput } from "@/schemas";

export async function getPosts(
  page: number = 1,
  limit: number = 10,
  search: string = ""
) {
  const skip = (page - 1) * limit;
  const where = search
    ? {
        OR: [
          { title: { contains: search, mode: "insensitive" as const } },
          { excerpt: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  // Execute sequentially to prevent Neon connection pool exhaustion
  const posts = await prisma.post.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
  });
  const total = await prisma.post.count({ where });

  return {
    success: true,
    message: "Posts fetched successfully",
    data: {
      items: posts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    },
  };
}

export async function getPostBySlug(slug: string) {
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { category: true },
  });

  return { success: !!post, data: post };
}

export async function createPost(data: PostInput) {
  const parsed = postSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }

  const existingPost = await prisma.post.findUnique({
    where: { slug: parsed.data.slug },
  });

  if (existingPost) {
    return { success: false, message: "A post with this slug already exists" };
  }

  const post = await prisma.post.create({
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      excerpt: parsed.data.excerpt || null,
      content: parsed.data.content,
      featuredImage: parsed.data.featuredImage || null,
      published: parsed.data.published,
      categoryId: parsed.data.categoryId || null,
    },
  });

  revalidatePath("/admin/posts");
  revalidatePath("/");
  return { success: true, message: "Post created successfully", data: post };
}

export async function updatePost(id: string, data: PostInput) {
  const parsed = postSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }

  const existingPost = await prisma.post.findFirst({
    where: { slug: parsed.data.slug, NOT: { id } },
  });

  if (existingPost) {
    return { success: false, message: "A post with this slug already exists" };
  }

  const post = await prisma.post.update({
    where: { id },
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      excerpt: parsed.data.excerpt || null,
      content: parsed.data.content,
      featuredImage: parsed.data.featuredImage || null,
      published: parsed.data.published,
      categoryId: parsed.data.categoryId || null,
    },
  });

  revalidatePath("/admin/posts");
  revalidatePath(`/post/${post.slug}`);
  revalidatePath("/");
  return { success: true, message: "Post updated successfully", data: post };
}

export async function deletePost(id: string) {
  const post = await prisma.post.delete({ where: { id } });
  revalidatePath("/admin/posts");
  revalidatePath("/");
  return { success: true, message: "Post deleted successfully", data: post };
}

export async function togglePublishPost(id: string) {
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) return { success: false, message: "Post not found" };

  const updated = await prisma.post.update({
    where: { id },
    data: { published: !post.published },
  });

  revalidatePath("/admin/posts");
  revalidatePath("/");
  return {
    success: true,
    message: updated.published ? "Post published" : "Post unpublished",
    data: updated,
  };
}

export async function getPublishedPosts(
  page: number = 1,
  limit: number = 9,
  search: string = "",
  categorySlug: string = ""
) {
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = { published: true };

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { excerpt: { contains: search, mode: "insensitive" } },
    ];
  }

  if (categorySlug) {
    where.category = { slug: categorySlug };
  }

  // Execute sequentially to prevent Neon connection pool exhaustion
  const posts = await prisma.post.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
  });
  const total = await prisma.post.count({ where });

  return {
    items: posts,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
}

export async function getRelatedPosts(postId: string, categoryId?: string | null) {
  const where: Record<string, unknown> = {
    published: true,
    NOT: { id: postId },
  };
  if (categoryId) where.categoryId = categoryId;

  return prisma.post.findMany({
    where,
    include: { category: true },
    take: 3,
    orderBy: { createdAt: "desc" },
  });
}
