import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug, getPublishedPosts, getRelatedPosts } from "@/actions/posts";
import { Badge } from "@/components/ui/Badge";
import { formatDate, calculateReadingTime, stripHtml, truncate } from "@/lib/utils";
import { Calendar, Clock, Tag, Share2, BookOpen, ArrowLeft } from "lucide-react";
import { CopyButton } from "@/components/ui/CopyButton";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/Motion";
import type { Metadata } from "next";
import type { Post } from "@/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: post } = await getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description: post.excerpt || truncate(stripHtml(post.content), 160),
    openGraph: {
      title: post.title,
      description: post.excerpt || truncate(stripHtml(post.content), 160),
      images: post.featuredImage ? [post.featuredImage] : [],
      type: "article",
    },
  };
}

export async function generateStaticParams() {
  const { items } = await getPublishedPosts(1, 100);
  return items.map((post: { slug: string }) => ({ slug: post.slug }));
}

function RelatedPostCard({ post }: { post: import("@/types").Post }) {
  return (
    <Link href={`/post/${post.slug}`} className="group block">
      <div className="flex gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
        {post.featuredImage ? (
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-brand-50 to-purple-50 flex items-center justify-center flex-shrink-0">
            <BookOpen className="h-5 w-5 text-brand-300" />
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-800 group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug">
            {post.title}
          </p>
          <p className="text-xs text-slate-400 mt-1">{formatDate(post.createdAt)}</p>
        </div>
      </div>
    </Link>
  );
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const { data: post } = await getPostBySlug(slug);

  if (!post || !post.published) notFound();

  const relatedPosts = await getRelatedPosts(post.id, post.categoryId).catch(() => []);
  const readingTime = calculateReadingTime(post.content);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <FadeIn className="mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors bg-white/60 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200/60 shadow-soft">
          <ArrowLeft className="h-4 w-4" />
          Back to all posts
        </Link>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main article */}
        <article className="lg:col-span-2">
          <FadeIn delay={0.1}>
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {post.category && (
                <Link href={`/category/${post.category.slug}`}>
                  <Badge variant="outline" className="gap-1 bg-white">
                    <Tag className="h-3 w-3" />
                    {post.category.name}
                  </Badge>
                </Link>
              )}
              <span className="flex items-center gap-1.5 text-sm text-slate-500 font-medium bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                <Calendar className="h-4 w-4" />
                {formatDate(post.createdAt)}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-brand-600 font-medium bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
                <Clock className="h-4 w-4" />
                {readingTime} min read
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
              {post.title}
            </h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-slate-500 leading-relaxed mb-8 font-light">
                {post.excerpt}
              </p>
            )}

            {/* Featured image */}
            {post.featuredImage && (
              <div className="rounded-[2rem] overflow-hidden mb-10 aspect-[2/1] bg-slate-100 shadow-glass-sm border border-slate-200/50">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </FadeIn>

          <FadeIn delay={0.2}>
            {/* Content */}
            <div
              className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-brand-600 hover:prose-a:text-brand-700 prose-img:rounded-2xl leading-loose"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Share */}
            <div className="mt-16 pt-8 border-t border-slate-200/60 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <p className="text-sm font-semibold text-slate-700 flex items-center gap-2 uppercase tracking-widest">
                <Share2 className="h-4 w-4 text-brand-500" />
                Share Article
              </p>
              <div className="flex gap-3">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`${process.env.NEXTAUTH_URL}/post/${post.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 bg-slate-50 hover:bg-black hover:text-white rounded-full text-slate-600 transition-colors shadow-soft"
                >
                  𝕏
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${process.env.NEXTAUTH_URL}/post/${post.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 bg-slate-50 hover:bg-blue-600 hover:text-white rounded-full text-slate-600 transition-colors shadow-soft font-bold"
                >
                  f
                </a>
                <CopyButton />
              </div>
            </div>
          </FadeIn>
        </article>

        {/* Sidebar */}
        <aside className="space-y-8">
          <FadeIn delay={0.3}>
            {/* Article info */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-white shadow-glass-sm p-6">
              <h3 className="text-sm font-bold text-slate-900 mb-5 uppercase tracking-wider flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-500" />
                Article Info
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-500">Published</span>
                  <span className="font-semibold text-slate-800">{formatDate(post.createdAt)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-500">Reading time</span>
                  <span className="font-semibold text-slate-800">{readingTime} min</span>
                </div>
                {post.category && (
                  <div className="flex justify-between items-center py-2 border-b border-slate-100">
                    <span className="text-slate-500">Category</span>
                    <Link href={`/category/${post.category.slug}`} className="font-semibold text-brand-600 hover:text-brand-700">
                      {post.category.name}
                    </Link>
                  </div>
                )}
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-500">Last Updated</span>
                  <span className="font-semibold text-slate-800">{formatDate(post.updatedAt)}</span>
                </div>
              </div>
            </div>
          </FadeIn>

          {relatedPosts.length > 0 && (
            <FadeIn delay={0.4}>
              <div className="bg-slate-50/80 rounded-3xl border border-slate-200/60 p-6">
                <h3 className="text-sm font-bold text-slate-900 mb-5 uppercase tracking-wider flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  Related Reads
                </h3>
                <div className="space-y-2">
                  {relatedPosts.map((rp: Post) => (
                    <RelatedPostCard key={rp.id} post={rp} />
                  ))}
                </div>
              </div>
            </FadeIn>
          )}
        </aside>
      </div>
    </div>
  );
}
