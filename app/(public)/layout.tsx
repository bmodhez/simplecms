import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { getAllCategories } from "@/actions/categories";

async function PublicNav() {
  const categories = await getAllCategories().catch(() => []);

  return (
    <header className="fixed top-4 md:top-6 left-0 right-0 z-50 flex justify-center px-3 md:px-4">
      <div className="w-full max-w-4xl bg-white/60 backdrop-blur-2xl border border-white/40 shadow-glass-lg rounded-full px-4 md:px-6 h-14 md:h-16 flex items-center justify-between transition-all duration-500">
        <Link href="/" className="flex items-center gap-2 md:gap-3 group">
          <img src="/logo.png" alt="Lumina Logo" className="w-8 h-8 md:w-9 md:h-9 object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-sm" />
          <span className="font-extrabold text-slate-900 tracking-tight text-base md:text-lg">Lumina</span>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          <Link href="/" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white/50 rounded-full transition-all">
            Home
          </Link>
          {categories.slice(0, 3).map((cat: { id: string; name: string; slug: string }) => (
            <Link
              key={cat.id}
              href={`/?category=${cat.slug}`}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white/50 rounded-full transition-all"
            >
              {cat.name}
            </Link>
          ))}
        </nav>

        <Link
          href="/admin"
          className="flex items-center gap-1.5 md:gap-2 px-4 md:px-5 py-2 md:py-2.5 text-xs md:text-sm font-semibold bg-slate-900 text-white rounded-full hover:bg-brand-600 hover:shadow-brand transition-all duration-300 group"
        >
          <span>Sign In</span>
          <ArrowRight className="h-3 w-3 md:h-4 md:w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </header>
  );
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative selection:bg-brand-200 selection:text-brand-900">
      {/* Subtle Dot Pattern */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-60"
        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(148, 163, 184, 0.25) 1px, transparent 0)', backgroundSize: '32px 32px' }}
      />
      
      {/* Floating Blur Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full bg-brand-400/20 blur-[80px] md:blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[250px] md:w-[400px] h-[250px] md:h-[400px] rounded-full bg-purple-400/20 blur-[80px] md:blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full bg-blue-300/15 blur-[100px] md:blur-[120px]" />
      </div>

      <PublicNav />
      {/* Premium Background Mesh Gradient */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-mesh-gradient opacity-40 pointer-events-none z-0" />
      
      <main className="flex-1 pt-32 pb-16 relative z-10">{children}</main>
      
      <footer className="relative z-10 border-t border-slate-200/60 bg-white/80 backdrop-blur-lg py-10 md:py-12 mt-16">
        <div className="max-w-6xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Lumina Logo" className="w-7 h-7 md:w-8 md:h-8 object-contain drop-shadow-sm" />
            <span className="font-bold text-slate-900 text-base">Lumina</span>
          </div>
          <p className="text-slate-500 text-sm font-medium text-center md:text-left">
            © {new Date().getFullYear()} Lumina. Crafted with precision.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm font-medium text-slate-500">
            <Link href="/privacy-policy" className="hover:text-brand-600 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-brand-600 transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-brand-600 transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
