"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { useEffect, useCallback } from "react";
import {
  Bold, Italic, Strikethrough, Code, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Minus, Link2, Image as ImageIcon, Undo, Redo,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  error?: string;
  label?: string;
}

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}

function ToolbarButton({ onClick, active, title, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        "p-1.5 rounded-lg text-sm transition-all duration-150",
        active
          ? "bg-brand-100 text-brand-700"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      )}
    >
      {children}
    </button>
  );
}

export function Editor({
  value,
  onChange,
  placeholder = "Start writing...",
  minHeight = "300px",
  error,
  label,
}: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-brand-600 underline" } }),
      Image.configure({ HTMLAttributes: { class: "rounded-xl max-w-full" } }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose-content outline-none",
        style: `min-height: ${minHeight}`,
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  const addLink = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Enter URL");
    if (url) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Enter image URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  const toolbarGroups = [
    [
      { icon: <Bold className="h-4 w-4" />, title: "Bold", action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive("bold") },
      { icon: <Italic className="h-4 w-4" />, title: "Italic", action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive("italic") },
      { icon: <Strikethrough className="h-4 w-4" />, title: "Strikethrough", action: () => editor.chain().focus().toggleStrike().run(), active: editor.isActive("strike") },
      { icon: <Code className="h-4 w-4" />, title: "Code", action: () => editor.chain().focus().toggleCode().run(), active: editor.isActive("code") },
    ],
    [
      { icon: <Heading1 className="h-4 w-4" />, title: "Heading 1", action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive("heading", { level: 1 }) },
      { icon: <Heading2 className="h-4 w-4" />, title: "Heading 2", action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive("heading", { level: 2 }) },
      { icon: <Heading3 className="h-4 w-4" />, title: "Heading 3", action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive("heading", { level: 3 }) },
    ],
    [
      { icon: <List className="h-4 w-4" />, title: "Bullet List", action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive("bulletList") },
      { icon: <ListOrdered className="h-4 w-4" />, title: "Ordered List", action: () => editor.chain().focus().toggleOrderedList().run(), active: editor.isActive("orderedList") },
      { icon: <Quote className="h-4 w-4" />, title: "Blockquote", action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive("blockquote") },
      { icon: <Minus className="h-4 w-4" />, title: "Divider", action: () => editor.chain().focus().setHorizontalRule().run(), active: false },
    ],
    [
      { icon: <Link2 className="h-4 w-4" />, title: "Link", action: addLink, active: editor.isActive("link") },
      { icon: <ImageIcon className="h-4 w-4" />, title: "Image", action: addImage, active: false },
    ],
    [
      { icon: <Undo className="h-4 w-4" />, title: "Undo", action: () => editor.chain().focus().undo().run(), active: false },
      { icon: <Redo className="h-4 w-4" />, title: "Redo", action: () => editor.chain().focus().redo().run(), active: false },
    ],
  ];

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <div
        className={cn(
          "rounded-xl border bg-white transition-all duration-200 tiptap-editor",
          error
            ? "border-red-400 focus-within:ring-2 focus-within:ring-red-400/20"
            : "border-slate-200 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20"
        )}
      >
        <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-slate-100">
          {toolbarGroups.map((group, groupIdx) => (
            <div
              key={groupIdx}
              className="flex items-center gap-0.5 pr-2 mr-1 border-r border-slate-200 last:border-r-0 last:pr-0 last:mr-0"
            >
              {group.map((btn, btnIdx) => (
                <ToolbarButton
                  key={btnIdx}
                  onClick={btn.action}
                  active={btn.active}
                  title={btn.title}
                >
                  {btn.icon}
                </ToolbarButton>
              ))}
            </div>
          ))}
        </div>
        <EditorContent editor={editor} className="px-1" />
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export function CodeEditor({
  value,
  onChange,
  placeholder = "Paste your code here...",
  label,
  error,
  rows = 12,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  rows?: number;
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={cn(
          "w-full rounded-xl border bg-slate-950 text-slate-100 font-mono text-sm px-4 py-3",
          "transition-all duration-200 outline-none resize-none",
          "placeholder:text-slate-600",
          "focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20",
          error ? "border-red-400" : "border-slate-700"
        )}
      />
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}
