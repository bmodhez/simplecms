import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategoryBySlug } from "@/actions/categories";
import { getPublishedPosts } from "@/actions/posts";
import { Badge } from "@/components/ui/Badge";
import { formatDate, calculateReadingTime, stripHtml, truncate } from "@/lib/utils";
import { BookOpen, Calendar, Tag, ArrowLeft } from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/Motion";
import type { Metadata } from "next";
import type { Post } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: category } = await getCategoryBySlug(slug);
  if (!category) return { title: "Category Not Found" };
  return {
    title: `${category.name} – PremiumCMS`,
    description: `Browse all articles in the ${category.name} category.`,
  };
}

function PostCard({ post }: { post: Post }) {
  const readingTime = calculateReadingTime(post.content);
  const excerpt = post.excerpt || truncate(stripHtml(post.content), 120);

  return (
    <FadeIn delay={0.1}>
      <Link href={`/post/${post.slug}`} className="group block h-full">
        <article className="bg-white/80 backdrop-blur-md rounded-[2rem] border border-slate-100/50 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 flex flex-col h-full">
        {post.featuredImage ? (
          <div className="aspect-video overflow-hidden bg-slate-100">
            <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
        ) : (
          <div className="aspect-video bg-gradient-to-br from-brand-50 to-purple-50 flex items-center justify-center">
            <BookOpen className="h-10 w-10 text-brand-300" />
          </div>
        )}
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-slate-400">{readingTime} min read</span>
          </div>
          <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2 mb-2">
            {post.title}
          </h3>
          <p className="text-sm text-slate-500 line-clamp-2">{excerpt}</p>
          <div className="flex items-center gap-1 mt-4 text-xs text-slate-400">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatDate(post.createdAt)}</span>
          </div>
        </div>
      </article>
      </Link>
    </FadeIn>
  );
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const currentPage = Number(sp.page) || 1;

  const [{ data: category }, { items: posts, meta }] = await Promise.all([
    getCategoryBySlug(slug),
    getPublishedPosts(currentPage, 9, "", slug),
  ]);

  if (!category) notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <FadeIn className="mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          All posts
        </Link>
      </FadeIn>

      <FadeIn delay={0.1} className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-brand-50 rounded-2xl text-brand-600 shadow-sm border border-brand-100">
            <Tag className="h-5 w-5" />
          </div>
          <Badge variant="outline" className="bg-white">{meta.total} article{meta.total !== 1 ? "s" : ""}</Badge>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          {category.name}
        </h1>
        <p className="text-slate-500 mt-3 text-lg font-medium">Browse all articles in this category.</p>
      </FadeIn>

      {posts.length === 0 ? (
        <FadeIn delay={0.2} className="text-center py-20 bg-white/50 backdrop-blur-md rounded-[2.5rem] border border-white shadow-glass-sm">
          <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-700 mb-2">No posts yet</h3>
          <p className="text-slate-400">No published posts in this category.</p>
        </FadeIn>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post: import("@/types").Post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {meta.totalPages > 1 && (
        <div className="flex justify-center mt-10">
          <div className="flex items-center gap-2">
            {Array.from({ length: meta.totalPages }).map((_, i) => (
              <Link
                key={i}
                href={`/category/${slug}?page=${i + 1}`}
                className={`w-9 h-9 rounded-xl text-sm font-medium flex items-center justify-center transition-all ${
                  currentPage === i + 1 ? "bg-brand-600 text-white shadow-brand" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {i + 1}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
