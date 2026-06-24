import Link from "next/link";
import { getPublishedPosts } from "@/actions/posts";
import { getAllCategories } from "@/actions/categories";
import { Badge } from "@/components/ui/Badge";
import { formatDate, calculateReadingTime, stripHtml, truncate } from "@/lib/utils";
import { Search, ArrowRight, BookOpen, Calendar, ArrowUpRight } from "lucide-react";
import type { Post } from "@/types";
import type { Metadata } from "next";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/Motion";
import { AnimatedSearch } from "@/components/ui/AnimatedSearch";

export const metadata: Metadata = {
  title: "Lumina – Stories Worth Reading",
  description: "Discover insightful articles, tutorials, and stories crafted for curious minds.",
};

function PostCard({ post }: { post: Post }) {
  const readingTime = calculateReadingTime(post.content);
  const excerpt = post.excerpt || truncate(stripHtml(post.content), 120);

  return (
    <FadeIn delay={0.1}>
      <Link href={`/post/${post.slug}`} className="group block h-full">
        <article className="bg-white/80 backdrop-blur-md rounded-[2rem] border border-slate-100/50 overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-500 flex flex-col h-full">
          {post.featuredImage ? (
            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 p-2">
              <div className="w-full h-full rounded-[1.5rem] overflow-hidden relative">
                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
              </div>
            </div>
          ) : (
            <div className="aspect-[4/3] bg-gradient-to-br from-brand-50 to-purple-50 flex items-center justify-center m-2 rounded-[1.5rem]">
              <BookOpen className="h-12 w-12 text-brand-300" />
            </div>
          )}
          <div className="p-6 flex flex-col flex-1">
            <div className="flex items-center justify-between mb-4">
              {post.category && (
                <Badge variant="outline" size="sm" className="bg-white/50 backdrop-blur border-slate-200 text-slate-600">
                  {post.category.name}
                </Badge>
              )}
              <span className="text-xs font-medium text-slate-400">{readingTime} min read</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2 mb-3 leading-snug">
              {post.title}
            </h3>
            <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed mb-6 flex-1">
              {excerpt}
            </p>
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors text-slate-400">
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </article>
      </Link>
    </FadeIn>
  );
}

function FeaturedPost({ post }: { post: Post }) {
  const readingTime = calculateReadingTime(post.content);
  const excerpt = post.excerpt || truncate(stripHtml(post.content), 200);

  return (
    <FadeIn delay={0.2}>
      <Link href={`/post/${post.slug}`} className="group block">
        <article className="relative bg-slate-900 rounded-[2.5rem] overflow-hidden min-h-[500px] flex flex-col justify-end shadow-2xl hover:shadow-brand-lg transition-all duration-700 hover:-translate-y-2 border border-slate-800">
          {post.featuredImage && (
            <div className="absolute inset-0">
              <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700 ease-out" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/50 to-transparent" />
          
          <div className="relative p-10 md:p-14 md:w-2/3 lg:w-1/2">
            <div className="flex items-center gap-3 mb-5">
              <Badge variant="outline" className="bg-white/10 backdrop-blur-md border-white/20 text-white font-medium px-3 py-1">
                ⭐ Featured
              </Badge>
              {post.category && (
                <Badge variant="outline" className="bg-white/10 backdrop-blur-md border-white/20 text-white font-medium px-3 py-1">
                  {post.category.name}
                </Badge>
              )}
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 leading-tight group-hover:text-brand-200 transition-colors">
              {post.title}
            </h2>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-8 line-clamp-2 md:line-clamp-3 font-light">
              {excerpt}
            </p>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4 text-sm text-slate-400 font-medium">
                <span>{formatDate(post.createdAt)}</span>
                <span className="w-1 h-1 rounded-full bg-slate-600" />
                <span>{readingTime} min read</span>
              </div>
              <span className="hidden md:flex h-10 px-5 bg-white text-slate-900 items-center justify-center rounded-full text-sm font-bold group-hover:bg-brand-50 transition-colors">
                Read Article
              </span>
            </div>
          </div>
        </article>
      </Link>
    </FadeIn>
  );
}

interface HomePageProps {
  searchParams: Promise<{ page?: string; search?: string; category?: string }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const search = params.search || "";
  const category = params.category || "";

  // Execute sequentially to prevent Neon connection pool exhaustion
  const { items: posts, meta } = await getPublishedPosts(currentPage, 9, search, category);
  const categories = await getAllCategories();

  const featuredPost = !search && !category && currentPage === 1 ? posts[0] : null;
  const gridPosts = featuredPost ? posts.slice(1) : posts;

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Premium Hero Section */}
      {!search && !category && currentPage === 1 && (
        <FadeIn className="text-center pt-10 pb-20 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 shadow-sm rounded-full text-slate-600 text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
            Welcome to the new Lumina
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 leading-[1.1]">
            Read stories that <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600">
              ignite your curiosity.
            </span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            Discover a curated collection of insightful articles, technical deep-dives, and inspiring stories crafted for the modern mind.
          </p>
        </FadeIn>
      )}

      {/* Search & Categories */}
      <AnimatedSearch defaultValue={search} />

      {categories.length > 0 && (
        <FadeIn delay={0.15} className="flex flex-wrap gap-2 justify-center mb-16">
          <Link
            href="/"
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              !category ? "bg-slate-900 text-white shadow-md scale-105" : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60 shadow-sm"
            }`}
          >
            All
          </Link>
          {categories.map((cat: { id: string; name: string; slug: string }) => (
            <Link
              key={cat.id}
              href={`/?category=${cat.slug}`}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                category === cat.slug ? "bg-slate-900 text-white shadow-md scale-105" : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60 shadow-sm"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </FadeIn>
      )}

      {/* Featured Post */}
      {featuredPost && (
        <div className="mb-20">
          <FeaturedPost post={featuredPost} />
        </div>
      )}

      {/* Posts Grid */}
      <div className="mb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            {search ? "Search Results" : category ? "Latest in Category" : "Recent Articles"}
          </h2>
        </div>

        {gridPosts.length === 0 && !featuredPost ? (
          <div className="text-center py-32 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-slate-300">
            <BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-slate-700 mb-2">No posts found</h3>
            <p className="text-slate-500 font-medium">Try adjusting your search or category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gridPosts.map((post: Post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>

      {/* Premium Pagination */}
      {meta.totalPages > 1 && (
        <FadeIn className="flex justify-center pb-20">
          <div className="flex items-center gap-2 p-2 bg-white/80 backdrop-blur border border-slate-200 rounded-2xl shadow-sm">
            {Array.from({ length: meta.totalPages }).map((_, i) => (
              <Link
                key={i}
                href={`/?page=${i + 1}${search ? `&search=${search}` : ""}${category ? `&category=${category}` : ""}`}
                className={`w-10 h-10 rounded-xl text-sm font-bold flex items-center justify-center transition-all ${
                  currentPage === i + 1
                    ? "bg-slate-900 text-white shadow-md scale-105"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {i + 1}
              </Link>
            ))}
          </div>
        </FadeIn>
      )}
    </div>
  );
}
