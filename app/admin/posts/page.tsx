"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Plus, Search, FileText, Edit, Trash2, Eye, EyeOff, Filter,
} from "lucide-react";
import { getPosts, deletePost, togglePublishPost } from "@/actions/posts";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { TableRowSkeleton } from "@/components/ui/Skeleton";
import { formatDate } from "@/lib/utils";
import type { Post } from "@/types";
import Link from "next/link";

export default function PostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getPosts(page, 10, debouncedSearch);
      if (result.data) {
        setPosts(result.data.items as Post[]);
        setTotal(result.data.meta.total);
        setTotalPages(result.data.meta.totalPages);
      }
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const result = await deletePost(deleteId);
      if (result.success) {
        toast.success("Post deleted");
        fetchPosts();
      } else {
        toast.error("Failed to delete post");
      }
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const handleTogglePublish = async (id: string) => {
    setTogglingId(id);
    try {
      const result = await togglePublishPost(id);
      if (result.success) {
        toast.success(result.message);
        fetchPosts();
      }
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Posts</h1>
          <p className="text-slate-500 text-sm mt-1">
            {total} post{total !== 1 ? "s" : ""} total
          </p>
        </div>
        <Button
          onClick={() => router.push("/admin/posts/new")}
          icon={<Plus className="h-4 w-4" />}
        >
          New Post
        </Button>
      </div>

      <Card padding="none">
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <div className="flex-1">
            <Input
              placeholder="Search posts..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              icon={<Search className="h-4 w-4" />}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">
                  Title
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">
                  Category
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">
                  Status
                </th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">
                  Date
                </th>
                <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRowSkeleton key={i} cols={5} />
                ))
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <EmptyState
                      icon={<FileText className="h-8 w-8" />}
                      title="No posts found"
                      description={
                        debouncedSearch
                          ? `No results for "${debouncedSearch}"`
                          : "Start by creating your first post."
                      }
                      action={
                        !debouncedSearch
                          ? {
                              label: "Create Post",
                              onClick: () => router.push("/admin/posts/new"),
                              icon: <Plus className="h-4 w-4" />,
                            }
                          : undefined
                      }
                    />
                  </td>
                </tr>
              ) : (
                posts.map((post, i) => (
                  <motion.tr
                    key={post.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-slate-800 group-hover:text-brand-600 transition-colors line-clamp-1">
                          {post.title}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5 font-mono">
                          /{post.slug}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {post.category ? (
                        <Badge variant="outline" size="sm">
                          {post.category.name}
                        </Badge>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={post.published ? "success" : "warning"}
                        size="sm"
                      >
                        {post.published ? "Published" : "Draft"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">
                      {formatDate(post.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTogglePublish(post.id)}
                          loading={togglingId === post.id}
                          title={post.published ? "Unpublish" : "Publish"}
                          className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                        >
                          {post.published ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Link href={`/admin/posts/${post.slug}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            title="Edit"
                            className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(post.id)}
                          title="Delete"
                          className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </Card>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Post"
        description="This action cannot be undone. The post will be permanently deleted."
        confirmLabel="Delete Post"
        loading={deleting}
      />
    </div>
  );
}
