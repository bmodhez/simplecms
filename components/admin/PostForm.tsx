"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Save, Eye, EyeOff, Wand2, ExternalLink } from "lucide-react";
import { postSchema, PostInput } from "@/schemas";
import { createPost, updatePost } from "@/actions/posts";
import { getAllCategories } from "@/actions/categories";
import { generateSlug } from "@/lib/utils";
import { Editor } from "@/components/ui/Editor";
import { Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { Post, Category } from "@/types";
import Link from "next/link";

interface PostFormProps {
  post?: Post;
}

export function PostForm({ post }: PostFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);

  const {
    register, handleSubmit, control, watch, setValue,
    formState: { errors, isDirty },
  } = useForm<PostInput>({
    resolver: zodResolver(postSchema) as any,
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      excerpt: post?.excerpt || "",
      content: post?.content || "",
      featuredImage: post?.featuredImage || "",
      published: post?.published || false,
      categoryId: post?.categoryId || null,
    },
  });

  const title = watch("title");
  const published = watch("published");

  useEffect(() => {
    getAllCategories().then(setCategories);
  }, []);

  useEffect(() => {
    if (!slugEdited && !post && title) {
      setValue("slug", generateSlug(title));
    }
  }, [title, slugEdited, post, setValue]);

  const onSubmit = async (data: PostInput) => {
    setSaving(true);
    try {
      const result = post
        ? await updatePost(post.id, data)
        : await createPost(data);

      if (result.success) {
        toast.success(result.message);
        if (!post) router.push("/admin/posts");
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
            {post ? "Edit Post" : "New Post"}
          </h1>
          {post && (
            <p className="text-sm text-slate-400 mt-0.5 font-mono truncate max-w-[280px] sm:max-w-none">
              /{post.slug}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {post?.published && (
            <Link href={`/post/${post.slug}`} target="_blank">
              <Button variant="outline" size="sm" icon={<ExternalLink className="h-4 w-4" />}>
                View Live
              </Button>
            </Link>
          )}
          <Button
            type="submit"
            loading={saving}
            icon={<Save className="h-4 w-4" />}
          >
            {saving ? "Saving..." : "Save Post"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <div className="space-y-4">
              <Input
                label="Title"
                placeholder="Post title..."
                error={errors.title?.message}
                {...register("title")}
              />
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <Input
                    label="Slug"
                    placeholder="post-slug"
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
                  title="Generate from title"
                >
                  Auto
                </Button>
              </div>
              <Textarea
                label="Excerpt"
                placeholder="Brief description of the post..."
                rows={2}
                error={errors.excerpt?.message}
                {...register("excerpt")}
              />
            </div>
          </Card>

          <Card padding="none">
            <div className="p-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-700">Content</h3>
            </div>
            <div className="p-4">
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <Editor
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Start writing your post..."
                    minHeight="400px"
                    error={errors.content?.message}
                  />
                )}
              />
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Publish</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <p className="text-sm font-medium text-slate-700">Status</p>
                  <p className="text-xs text-slate-400">
                    {published ? "Visible to readers" : "Hidden from readers"}
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

          <Card>
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Category</h3>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => field.onChange(null)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${
                      !field.value
                        ? "bg-brand-50 text-brand-700 font-medium border border-brand-200"
                        : "text-slate-600 hover:bg-slate-50 border border-transparent"
                    }`}
                  >
                    Uncategorized
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => field.onChange(cat.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-all ${
                        field.value === cat.id
                          ? "bg-brand-50 text-brand-700 font-medium border border-brand-200"
                          : "text-slate-600 hover:bg-slate-50 border border-transparent"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                  {categories.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-2">
                      No categories yet.
                    </p>
                  )}
                </div>
              )}
            />
          </Card>

          <Card>
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Featured Image</h3>
            <Input
              placeholder="https://..."
              error={errors.featuredImage?.message}
              {...register("featuredImage")}
            />
            {watch("featuredImage") && (
              <div className="mt-3 rounded-xl overflow-hidden aspect-video bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={watch("featuredImage") || ""}
                  alt="Featured"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}
          </Card>
        </div>
      </div>
    </form>
  );
}
