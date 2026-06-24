"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { pageSchema } from "@/schemas";
import type { PageInput } from "@/schemas";

export async function getPages(
  page: number = 1,
  limit: number = 10,
  search: string = ""
) {
  const skip = (page - 1) * limit;
  const where = search
    ? { title: { contains: search, mode: "insensitive" as const } }
    : {};

  // Execute sequentially to prevent Neon connection pool exhaustion
  const pages = await prisma.page.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip,
    take: limit,
  });
  const total = await prisma.page.count({ where });

  return {
    success: true,
    message: "Pages fetched successfully",
    data: {
      items: pages,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    },
  };
}

export async function getPageBySlug(slug: string) {
  const pageData = await prisma.page.findUnique({ where: { slug } });
  return { success: !!pageData, data: pageData };
}

export async function createPage(data: PageInput) {
  const parsed = pageSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }

  const existing = await prisma.page.findUnique({
    where: { slug: parsed.data.slug },
  });
  if (existing) {
    return { success: false, message: "A page with this slug already exists" };
  }

  const pageData = await prisma.page.create({ data: parsed.data });
  revalidatePath("/admin/pages");
  revalidatePath(`/${pageData.slug}`);
  return { success: true, message: "Page created successfully", data: pageData };
}

export async function updatePage(id: string, data: PageInput) {
  const parsed = pageSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }

  const existing = await prisma.page.findFirst({
    where: { slug: parsed.data.slug, NOT: { id } },
  });
  if (existing) {
    return { success: false, message: "A page with this slug already exists" };
  }

  const pageData = await prisma.page.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePath("/admin/pages");
  revalidatePath(`/${pageData.slug}`);
  return { success: true, message: "Page updated successfully", data: pageData };
}

export async function deletePage(id: string) {
  const pageData = await prisma.page.delete({ where: { id } });
  revalidatePath("/admin/pages");
  return { success: true, message: "Page deleted successfully", data: pageData };
}
