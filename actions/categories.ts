"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/schemas";
import type { CategoryInput } from "@/schemas";

export async function getCategories(
  page: number = 1,
  limit: number = 10,
  search: string = ""
) {
  const skip = (page - 1) * limit;
  const where = search
    ? { name: { contains: search, mode: "insensitive" as const } }
    : {};

  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      where,
      include: { _count: { select: { posts: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.category.count({ where }),
  ]);

  return {
    success: true,
    message: "Categories fetched successfully",
    data: {
      items: categories,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    },
  };
}

export async function getAllCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true } } },
  });
}

export async function getCategoryBySlug(slug: string) {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: { _count: { select: { posts: true } } },
  });
  return { success: !!category, data: category };
}

export async function createCategory(data: CategoryInput) {
  const parsed = categorySchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }

  const existing = await prisma.category.findUnique({
    where: { slug: parsed.data.slug },
  });
  if (existing) {
    return {
      success: false,
      message: "A category with this slug already exists",
    };
  }

  const category = await prisma.category.create({ data: parsed.data });
  revalidatePath("/admin/categories");
  return {
    success: true,
    message: "Category created successfully",
    data: category,
  };
}

export async function updateCategory(id: string, data: CategoryInput) {
  const parsed = categorySchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }

  const existing = await prisma.category.findFirst({
    where: { slug: parsed.data.slug, NOT: { id } },
  });
  if (existing) {
    return {
      success: false,
      message: "A category with this slug already exists",
    };
  }

  const category = await prisma.category.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePath("/admin/categories");
  return {
    success: true,
    message: "Category updated successfully",
    data: category,
  };
}

export async function deleteCategory(id: string) {
  const category = await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
  revalidatePath("/admin/posts");
  return {
    success: true,
    message: "Category deleted successfully",
    data: category,
  };
}
