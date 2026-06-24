"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Save, Wand2, ExternalLink } from "lucide-react";
import { pageSchema, PageInput } from "@/schemas";
import { createPage, updatePage } from "@/actions/pages";
import { generateSlug } from "@/lib/utils";
import { CodeEditor } from "@/components/ui/Editor";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { Page } from "@/types";
import Link from "next/link";

interface PageFormProps {
  page?: Page;
}

export function PageForm({ page }: PageFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);

  const {
    register, handleSubmit, control, watch, setValue,
    formState: { errors },
  } = useForm<PageInput>({
    resolver: zodResolver(pageSchema) as any,
    defaultValues: {
      title: page?.title || "",
      slug: page?.slug || "",
      content: page?.content || "",
      published: page?.published || false,
    },
  });

  const title = watch("title");
  const published = watch("published");

  useEffect(() => {
    if (!slugEdited && !page && title) {
      setValue("slug", generateSlug(title));
    }
  }, [title, slugEdited, page, setValue]);

  const onSubmit = async (data: PageInput) => {
    setSaving(true);
    try {
      const result = page
        ? await updatePage(page.id, data)
        : await createPage(data);

      if (result.success) {
        toast.success(result.message);
        if (!page) router.push("/admin/pages");
      } else {
        toast.error(result.message);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {page ? "Edit Page" : "New Page"}
          </h1>
          {page && (
            <p className="text-sm text-slate-400 mt-0.5 font-mono truncate max-w-[280px] sm:max-w-none">/{page.slug}</p>
          )}
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {page?.published && (
            <Link href={`/${page.slug}`} target="_blank">
              <Button variant="outline" size="sm" icon={<ExternalLink className="h-4 w-4" />}>
                View Live
              </Button>
            </Link>
          )}
          <Button type="submit" loading={saving} icon={<Save className="h-4 w-4" />}>
            {saving ? "Saving..." : "Save Page"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <div className="space-y-4">
              <Input
                label="Title"
                placeholder="Page title..."
                error={errors.title?.message}
                {...register("title")}
              />
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <Input
                    label="Slug"
                    placeholder="page-slug"
                    error={errors.slug?.message}
                    {...register("slug", {
                      onChange: () => setSlugEdited(true),
                    })}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setValue("slug", generateSlug(title || ""));
                    setSlugEdited(false);
                  }}
                  icon={<Wand2 className="h-4 w-4" />}
                >
                  Auto
                </Button>
              </div>
            </div>
          </Card>

          <Card padding="none">
            <div className="p-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-700">HTML Content</h3>
              <p className="text-xs text-slate-400 mt-0.5">Raw HTML rendered on public page</p>
            </div>
            <div className="p-4">
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <CodeEditor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="<h1>Page content...</h1>"
                    error={errors.content?.message}
                    rows={20}
                  />
                )}
              />
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Publish</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <p className="text-sm font-medium text-slate-700">Status</p>
                  <p className="text-xs text-slate-400">
                    {published ? "Visible to visitors" : "Hidden from visitors"}
                  </p>
                </div>
                <Controller
                  name="published"
                  control={control}
                  render={({ field }) => (
                    <button
                      type="button"
                      onClick={() => field.onChange(!field.value)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                        field.value ? "bg-brand-600" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                          field.value ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  )}
                />
              </div>
              <Badge
                variant={published ? "success" : "warning"}
                className="w-full justify-center py-2"
              >
                {published ? "● Published" : "○ Draft"}
              </Badge>
            </div>
          </Card>

          <Card padding="sm">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Preview URL</h3>
            <p className="text-xs font-mono text-slate-500 bg-slate-50 p-2 rounded-lg break-all">
              {`/${watch("slug") || "page-slug"}`}
            </p>
          </Card>
        </div>
      </div>
    </form>
  );
}
