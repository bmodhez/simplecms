"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Plus, Search, Tag, Edit, Trash2, Wand2, X } from "lucide-react";
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/actions/categories";
import { categorySchema, CategoryInput } from "@/schemas";
import { generateSlug } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Pagination } from "@/components/ui/Pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { TableRowSkeleton } from "@/components/ui/Skeleton";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import type { Category } from "@/types";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } =
    useForm<CategoryInput>({ resolver: zodResolver(categorySchema) as any });

  const nameValue = watch("name");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    if (!slugEdited && !editing && nameValue) {
      setValue("slug", generateSlug(nameValue));
    }
  }, [nameValue, slugEdited, editing, setValue]);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getCategories(page, 10, debouncedSearch);
      if (result.data) {
        setCategories(result.data.items as unknown as Category[]);
        setTotal(result.data.meta.total);
        setTotalPages(result.data.meta.totalPages);
      }
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const openCreate = () => {
    setEditing(null);
    reset({ name: "", slug: "" });
    setSlugEdited(false);
    setModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    reset({ name: cat.name, slug: cat.slug });
    setSlugEdited(true);
    setModalOpen(true);
  };

  const onSubmit = async (data: CategoryInput) => {
    setSaving(true);
    try {
      const result = editing
        ? await updateCategory(editing.id, data)
        : await createCategory(data);
      if (result.success) {
        toast.success(result.message);
        setModalOpen(false);
        fetchCategories();
      } else {
        toast.error(result.message);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const result = await deleteCategory(deleteId);
      if (result.success) {
        toast.success("Category deleted");
        fetchCategories();
      } else {
        toast.error("Failed to delete");
      }
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Categories</h1>
          <p className="text-slate-500 text-sm mt-1">{total} categor{total !== 1 ? "ies" : "y"} total</p>
        </div>
        <Button onClick={openCreate} icon={<Plus className="h-4 w-4" />}>
          New Category
        </Button>
      </div>

      <Card padding="none">
        <div className="p-4 border-b border-slate-100">
          <Input
            placeholder="Search categories..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            icon={<Search className="h-4 w-4" />}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                {["Name", "Slug", "Posts", "Actions"].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3 last:text-right">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => <TableRowSkeleton key={i} cols={4} />)
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <EmptyState
                      icon={<Tag className="h-8 w-8" />}
                      title="No categories found"
                      description="Create categories to organize your posts."
                      action={{ label: "Create Category", onClick: openCreate, icon: <Plus className="h-4 w-4" /> }}
                    />
                  </td>
                </tr>
              ) : (
                categories.map((cat, i) => (
                  <motion.tr
                    key={cat.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-slate-800">{cat.name}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-lg">
                        {cat.slug}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="default" size="sm">
                        {(cat as unknown as { _count: { posts: number } })._count?.posts ?? 0} posts
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost" size="sm"
                          onClick={() => openEdit(cat)}
                          className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost" size="sm"
                          onClick={() => setDeleteId(cat.id)}
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

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Category" : "New Category"}
        size="sm"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Name"
            placeholder="Technology"
            error={errors.name?.message}
            {...register("name")}
          />
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Input
                label="Slug"
                placeholder="technology"
                error={errors.slug?.message}
                {...register("slug", { onChange: () => setSlugEdited(true) })}
              />
            </div>
            <Button
              type="button" variant="outline" size="md"
              onClick={() => { setValue("slug", generateSlug(nameValue || "")); setSlugEdited(false); }}
              icon={<Wand2 className="h-4 w-4" />}
            >
              Auto
            </Button>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" loading={saving}>
              {editing ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        description="Posts in this category will become uncategorized."
        confirmLabel="Delete Category"
        loading={deleting}
      />
    </div>
  );
}
