"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-4">
      <div className="text-center max-w-md">
        <div className="relative mb-8">
          <p className="text-[120px] font-black text-slate-100 leading-none select-none">404</p>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-6xl font-black text-transparent bg-clip-text bg-gradient-brand">
              404
            </p>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Page Not Found</h1>
        <p className="text-slate-500 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/">
            <Button icon={<Home className="h-4 w-4" />}>Go Home</Button>
          </Link>
          <div onClick={() => window.history.back()}>
            <Button variant="outline" icon={<ArrowLeft className="h-4 w-4" />}>
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
