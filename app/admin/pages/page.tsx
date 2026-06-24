"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Plus, Search, BookOpen, Edit, Trash2 } from "lucide-react";
import { getPages, deletePage } from "@/actions/pages";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { TableRowSkeleton } from "@/components/ui/Skeleton";
import { formatDate } from "@/lib/utils";
import type { Page } from "@/types";
import Link from "next/link";

export default function PagesPage() {
  const router = useRouter();
  const [pages, setPages] = useState<Page[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchPages = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getPages(page, 10, debouncedSearch);
      if (result.data) {
        setPages(result.data.items as Page[]);
        setTotal(result.data.meta.total);
        setTotalPages(result.data.meta.totalPages);
      }
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => { fetchPages(); }, [fetchPages]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const result = await deletePage(deleteId);
      if (result.success) {
        toast.success("Page deleted");
        fetchPages();
      } else {
        toast.error("Failed to delete");
      }
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Pages</h1>
          <p className="text-slate-500 text-sm mt-1">{total} page{total !== 1 ? "s" : ""} total</p>
        </div>
        <Button onClick={() => router.push("/admin/pages/new")} icon={<Plus className="h-4 w-4" />}>
          New Page
        </Button>
      </div>

      <Card padding="none">
        <div className="p-4 border-b border-slate-100">
          <Input
            placeholder="Search pages..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            icon={<Search className="h-4 w-4" />}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                {["Title", "Status", "Date", "Actions"].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 last:text-right">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => <TableRowSkeleton key={i} cols={4} />)
              ) : pages.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <EmptyState
                      icon={<BookOpen className="h-8 w-8" />}
                      title="No pages found"
                      description={debouncedSearch ? `No results for "${debouncedSearch}"` : "Create your first page."}
                      action={!debouncedSearch ? { label: "Create Page", onClick: () => router.push("/admin/pages/new"), icon: <Plus className="h-4 w-4" /> } : undefined}
                    />
                  </td>
                </tr>
              ) : (
                pages.map((pg, i) => (
                  <motion.tr
                    key={pg.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-slate-800 group-hover:text-brand-600 transition-colors">{pg.title}</p>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">/{pg.slug}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={pg.published ? "success" : "warning"} size="sm">
                        {pg.published ? "Published" : "Draft"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">{formatDate(pg.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/pages/${pg.slug}`}>
                          <Button variant="ghost" size="sm" className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost" size="sm"
                          onClick={() => setDeleteId(pg.id)}
                          className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity text-red-500 hover:bg-red-50"
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
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}
      </Card>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Page"
        description="This action cannot be undone."
        confirmLabel="Delete Page"
        loading={deleting}
      />
    </div>
  );
}
