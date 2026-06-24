import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export function Card({
  children,
  className,
  glass = false,
  hover = false,
  padding = "md",
}: CardProps) {
  const paddings = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white",
        "shadow-soft transition-all duration-200",
        glass && "glass",
        hover && "hover:shadow-soft-lg hover:-translate-y-0.5 cursor-pointer",
        paddings[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between mb-6", className)}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: React.ReactNode;
  description?: string;
  className?: string;
}

export function CardTitle({ children, description, className }: CardTitleProps) {
  return (
    <div className={className}>
      <h2 className="text-lg font-semibold text-slate-900">{children}</h2>
      {description && (
        <p className="text-sm text-slate-500 mt-0.5">{description}</p>
      )}
    </div>
  );
}
