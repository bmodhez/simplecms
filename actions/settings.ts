"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { settingsSchema } from "@/schemas";
import type { SettingsInput } from "@/schemas";

export async function getSiteSettings() {
  const settings = await prisma.siteSettings.findFirst();
  return settings;
}

export async function updateSiteSettings(data: SettingsInput) {
  const parsed = settingsSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }

  const existing = await prisma.siteSettings.findFirst();

  let settings;
  if (existing) {
    settings = await prisma.siteSettings.update({
      where: { id: existing.id },
      data: parsed.data,
    });
  } else {
    settings = await prisma.siteSettings.create({ data: parsed.data });
  }

  revalidatePath("/");
  return {
    success: true,
    message: "Settings updated successfully",
    data: settings,
  };
}

export async function getDashboardStats() {
  const [totalPosts, totalPages, totalCategories, publishedPosts, draftPosts, recentPosts] =
    await Promise.all([
      prisma.post.count(),
      prisma.page.count(),
      prisma.category.count(),
      prisma.post.count({ where: { published: true } }),
      prisma.post.count({ where: { published: false } }),
      prisma.post.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { category: true },
      }),
    ]);

  return {
    totalPosts,
    totalPages,
    totalCategories,
    publishedPosts,
    draftPosts,
    recentPosts,
  };
}
