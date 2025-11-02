import { cn } from "@/lib/utils";

export interface StatCardSkeletonProps {
  /** Taille de la carte (sm, md, lg) */
  size?: "sm" | "md" | "lg";
  /** Afficher la barre de progression */
  showProgressBar?: boolean;
  /** Afficher le badge */
  showBadge?: boolean;
  /** Classe CSS additionnelle */
  className?: string;
}

const sizeClasses = {
  sm: {
    container: "p-4",
    icon: "h-10 w-10",
    label: "h-3 w-20",
    value: "h-6 w-16",
  },
  md: {
    container: "p-6",
    icon: "h-12 w-12",
    label: "h-4 w-24",
    value: "h-8 w-20",
  },
  lg: {
    container: "p-8",
    icon: "h-16 w-16",
    label: "h-5 w-32",
    value: "h-10 w-24",
  },
};

export default function StatCardSkeleton({
  size = "md",
  showProgressBar = false,
  showBadge = false,
  className,
}: StatCardSkeletonProps) {
  const sizes = sizeClasses[size];

  return (
    <div
      className={cn(
        "bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700",
        "shadow-sm animate-pulse",
        sizes.container,
        className
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={cn("rounded-full bg-gray-200 dark:bg-gray-700", sizes.icon)} />
        {showBadge && (
          <div className="h-5 w-16 bg-gray-200 dark:bg-gray-700 rounded-full" />
        )}
      </div>

      <div className={cn("bg-gray-200 dark:bg-gray-700 rounded mb-2", sizes.label)} />
      <div className={cn("bg-gray-200 dark:bg-gray-700 rounded", sizes.value)} />

      {showProgressBar && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-3 dark:bg-gray-700" />
      )}
    </div>
  );
}
