"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  label: string;
  value: number | string;
  description?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    positive?: boolean;
  };
  color?: "blue" | "green" | "purple" | "orange" | "red";
  index?: number;
}

const colorMap = {
  blue: {
    bg: "bg-blue-50",
    icon: "text-blue-600",
    badge: "bg-blue-100 text-blue-700",
    gradient: "from-blue-500 to-blue-600",
  },
  green: {
    bg: "bg-emerald-50",
    icon: "text-emerald-600",
    badge: "bg-emerald-100 text-emerald-700",
    gradient: "from-emerald-500 to-emerald-600",
  },
  purple: {
    bg: "bg-purple-50",
    icon: "text-purple-600",
    badge: "bg-purple-100 text-purple-700",
    gradient: "from-purple-500 to-purple-600",
  },
  orange: {
    bg: "bg-orange-50",
    icon: "text-orange-600",
    badge: "bg-orange-100 text-orange-700",
    gradient: "from-orange-500 to-orange-600",
  },
  red: {
    bg: "bg-red-50",
    icon: "text-red-600",
    badge: "bg-red-100 text-red-700",
    gradient: "from-red-500 to-red-600",
  },
};

export function StatsCard({
  label,
  value,
  description,
  icon,
  trend,
  color = "blue",
  index = 0,
}: StatsCardProps) {
  const colors = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
      className="bg-white rounded-2xl border border-slate-200 p-6 shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-0.5 group"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        <div
          className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300",
            colors.bg,
            colors.icon,
            "group-hover:scale-110"
          )}
        >
          {icon}
        </div>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold text-slate-900 tracking-tight">
          {value}
        </span>
        {trend && (
          <span
            className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full mb-1",
              trend.positive
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            )}
          >
            {trend.positive ? "+" : "-"}{trend.value}%
          </span>
        )}
      </div>
      {description && (
        <p className="text-xs text-slate-400 mt-1">{description}</p>
      )}
    </motion.div>
  );
}
