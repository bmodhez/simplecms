import { Suspense } from "react";
import { getDashboardStats } from "@/actions/settings";
import { StatsCard } from "@/components/admin/StatsCard";
import { StatCardSkeleton } from "@/components/ui/Skeleton";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import {
  FileText, BookOpen, Tag, CheckCircle2, Clock, TrendingUp, Plus,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

async function DashboardStats() {
  const stats = await getDashboardStats();

  const cards = [
    {
      label: "Total Posts",
      value: stats.totalPosts,
      description: "All posts including drafts",
      icon: <FileText className="h-5 w-5" />,
      color: "blue" as const,
    },
    {
      label: "Published",
      value: stats.publishedPosts,
      description: "Live and visible to readers",
      icon: <CheckCircle2 className="h-5 w-5" />,
      color: "green" as const,
    },
    {
      label: "Drafts",
      value: stats.draftPosts,
      description: "Unpublished posts",
      icon: <Clock className="h-5 w-5" />,
      color: "orange" as const,
    },
    {
      label: "Pages",
      value: stats.totalPages,
      description: "Static pages",
      icon: <BookOpen className="h-5 w-5" />,
      color: "purple" as const,
    },
    {
      label: "Categories",
      value: stats.totalCategories,
      description: "Content categories",
      icon: <Tag className="h-5 w-5" />,
      color: "red" as const,
    },
    {
      label: "Engagement",
      value: stats.totalPosts > 0 ? Math.round((stats.publishedPosts / stats.totalPosts) * 100) + "%" : "0%",
      description: "Publish rate",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "green" as const,
    },
  ];

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {cards.map((card, i) => (
          <StatsCard key={card.label} {...card} index={i} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle description="Your most recently created posts">
            Recent Activity
          </CardTitle>
          <Link href="/admin/posts">
            <Button variant="outline" size="sm">
              View all
            </Button>
          </Link>
        </CardHeader>
        {stats.recentPosts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-400 text-sm">No posts yet.</p>
            <Link href="/admin/posts">
              <Button className="mt-4" size="sm" icon={<Plus className="h-4 w-4" />}>
                Create your first post
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {stats.recentPosts.map((post: import("@/types").Post) => (
              <div
                key={post.id}
                className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-2 h-2 rounded-full flex-shrink-0 bg-brand-500" />
                  <div className="min-w-0">
                    <Link
                      href={`/admin/posts/${post.slug}`}
                      className="text-sm font-medium text-slate-800 hover:text-brand-600 transition-colors truncate block"
                    >
                      {post.title}
                    </Link>
                    <p className="text-xs text-slate-400">
                      {formatDate(post.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                  {post.category && (
                    <Badge variant="outline" size="sm">
                      {post.category.name}
                    </Badge>
                  )}
                  <Badge
                    variant={post.published ? "success" : "warning"}
                    size="sm"
                  >
                    {post.published ? "Published" : "Draft"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">
          Welcome back! Here&apos;s what&apos;s happening with your site.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <DashboardStats />
      </Suspense>
    </div>
  );
}
