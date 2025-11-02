import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  /** Icône à afficher (composant Lucide) */
  icon: LucideIcon;
  /** Couleur du thème (blue, green, amber, purple, red, etc.) */
  color?: "blue" | "green" | "amber" | "purple" | "red" | "indigo" | "pink";
  /** Titre/label de la statistique */
  label: string;
  /** Valeur principale à afficher */
  value: string | number;
  /** Badge optionnel en haut à droite */
  badge?: string;
  /** Afficher une barre de progression (0-100) */
  progressBar?: number;
  /** Texte additionnel sous la valeur */
  subtitle?: string;
  /** Taille de la carte (sm, md, lg) */
  size?: "sm" | "md" | "lg";
  /** Classe CSS additionnelle */
  className?: string;
  /** Contenu personnalisé à la place de la valeur */
  children?: ReactNode;
}

const colorClasses = {
  blue: {
    iconBg: "bg-blue-100 dark:bg-blue-900",
    iconColor: "text-blue-600 dark:text-blue-300",
    badgeBg: "bg-blue-50 dark:bg-blue-900/30",
    badgeColor: "text-blue-600 dark:text-blue-300",
    progressBg: "bg-blue-600 dark:bg-blue-500",
  },
  green: {
    iconBg: "bg-green-100 dark:bg-green-900",
    iconColor: "text-green-600 dark:text-green-300",
    badgeBg: "bg-green-50 dark:bg-green-900/30",
    badgeColor: "text-green-600 dark:text-green-300",
    progressBg: "bg-green-600 dark:bg-green-500",
  },
  amber: {
    iconBg: "bg-amber-100 dark:bg-amber-900",
    iconColor: "text-amber-600 dark:text-amber-300",
    badgeBg: "bg-amber-50 dark:bg-amber-900/30",
    badgeColor: "text-amber-600 dark:text-amber-300",
    progressBg: "bg-amber-600 dark:bg-amber-500",
  },
  purple: {
    iconBg: "bg-purple-100 dark:bg-purple-900",
    iconColor: "text-purple-600 dark:text-purple-300",
    badgeBg: "bg-purple-50 dark:bg-purple-900/30",
    badgeColor: "text-purple-600 dark:text-purple-300",
    progressBg: "bg-purple-600 dark:bg-purple-500",
  },
  red: {
    iconBg: "bg-red-100 dark:bg-red-900",
    iconColor: "text-red-600 dark:text-red-300",
    badgeBg: "bg-red-50 dark:bg-red-900/30",
    badgeColor: "text-red-600 dark:text-red-300",
    progressBg: "bg-red-600 dark:bg-red-500",
  },
  indigo: {
    iconBg: "bg-indigo-100 dark:bg-indigo-900",
    iconColor: "text-indigo-600 dark:text-indigo-300",
    badgeBg: "bg-indigo-50 dark:bg-indigo-900/30",
    badgeColor: "text-indigo-600 dark:text-indigo-300",
    progressBg: "bg-indigo-600 dark:bg-indigo-500",
  },
  pink: {
    iconBg: "bg-pink-100 dark:bg-pink-900",
    iconColor: "text-pink-600 dark:text-pink-300",
    badgeBg: "bg-pink-50 dark:bg-pink-900/30",
    badgeColor: "text-pink-600 dark:text-pink-300",
    progressBg: "bg-pink-600 dark:bg-pink-500",
  },
};

const sizeClasses = {
  sm: {
    container: "p-4",
    icon: "h-5 w-5",
    iconContainer: "p-2",
    label: "text-xs",
    value: "text-xl",
    badge: "text-xs px-2 py-0.5",
  },
  md: {
    container: "p-6",
    icon: "h-6 w-6",
    iconContainer: "p-3",
    label: "text-sm",
    value: "text-3xl",
    badge: "text-xs px-2.5 py-0.5",
  },
  lg: {
    container: "p-8",
    icon: "h-8 w-8",
    iconContainer: "p-4",
    label: "text-base",
    value: "text-4xl",
    badge: "text-sm px-3 py-1",
  },
};

export default function StatCard({
  icon: Icon,
  color = "blue",
  label,
  value,
  badge,
  progressBar,
  subtitle,
  size = "md",
  className,
  children,
}: StatCardProps) {
  const colors = colorClasses[color];
  const sizes = sizeClasses[size];

  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700",
        "shadow-sm hover:shadow-md transition-shadow",
        sizes.container,
        className
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={cn("rounded-full", colors.iconBg, sizes.iconContainer)}>
          <Icon className={cn(sizes.icon, colors.iconColor)} />
        </div>
        {badge && (
          <div
            className={cn(
              "font-medium rounded-full",
              colors.badgeBg,
              colors.badgeColor,
              sizes.badge
            )}
          >
            {badge}
          </div>
        )}
      </div>

      <p className={cn("text-gray-600 dark:text-gray-400 font-medium mb-1", sizes.label)}>
        {label}
      </p>

      {children || (
        <p className={cn("font-bold text-gray-900 dark:text-white", sizes.value)}>
          {value}
        </p>
      )}

      {subtitle && (
        <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{subtitle}</p>
      )}

      {progressBar !== undefined && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3 dark:bg-gray-700">
          <div
            className={cn("h-2.5 rounded-full", colors.progressBg)}
            style={{ width: `${Math.min(100, Math.max(0, progressBar))}%` }}
          />
        </div>
      )}
    </div>
  );
}
