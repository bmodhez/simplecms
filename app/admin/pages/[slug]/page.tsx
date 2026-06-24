import { notFound } from "next/navigation";
import { getPageBySlug } from "@/actions/pages";
import { PageForm } from "@/components/admin/PageForm";
import type { Metadata } from "next";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Edit Page – ${slug}` };
}

export default async function EditPagePage({ params }: Props) {
  const { slug } = await params;
  if (slug === "new") return <PageForm />;

  const result = await getPageBySlug(slug);
  if (!result.data) notFound();

  return <PageForm page={result.data} />;
}
