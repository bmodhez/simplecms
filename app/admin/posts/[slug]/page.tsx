import { notFound } from "next/navigation";
import { getPostBySlug } from "@/actions/posts";
import { PostForm } from "@/components/admin/PostForm";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: slug === "new" ? "New Post" : `Edit Post` };
}

export default async function EditPostPage({ params }: Props) {
  const { slug } = await params;
  if (slug === "new") return <PostForm />;

  const result = await getPostBySlug(slug);
  if (!result.data) notFound();

  return <PostForm post={result.data} />;
}
