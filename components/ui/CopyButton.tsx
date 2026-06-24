"use client";

import { Link2 } from "lucide-react";
import toast from "react-hot-toast";

export function CopyButton() {
  return (
    <button
      onClick={() => {
        if (typeof navigator !== "undefined") {
          navigator.clipboard.writeText(window.location.href);
          toast.success("Link copied to clipboard!");
        }
      }}
      className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm text-slate-600 font-medium transition-colors"
    >
      <Link2 className="h-4 w-4" />
      Copy link
    </button>
  );
}
