import { notFound } from "next/navigation";
import { getPageBySlug } from "@/actions/pages";
import type { Metadata } from "next";
import { FadeIn } from "@/components/ui/Motion";
import { Sparkles } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: page } = await getPageBySlug(slug);
  if (!page) return { title: "Page Not Found" };
  return { title: page.title };
}

export default async function StaticPage({ params }: Props) {
  const { slug } = await params;
  const { data: page } = await getPageBySlug(slug);

  if (!page || !page.published) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <FadeIn className="text-center mb-16">

        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
          {page.title}
        </h1>
        <div className="w-20 h-1.5 bg-brand-500 mx-auto rounded-full opacity-80" />
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="bg-white/80 backdrop-blur-2xl rounded-3xl md:rounded-[2.5rem] border border-white shadow-glass-lg p-5 sm:p-8 md:p-14">
          <div
            className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-brand-600 hover:prose-a:text-brand-700 prose-img:rounded-2xl"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>
      </FadeIn>
    </div>
  );
}
