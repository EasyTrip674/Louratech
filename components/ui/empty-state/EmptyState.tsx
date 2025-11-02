import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  /** Icône à afficher (composant Lucide) */
  icon: LucideIcon;
  /** Titre principal */
  title: string;
  /** Description/message */
  description?: string;
  /** Action/bouton optionnel */
  action?: ReactNode;
  /** Taille de l'icône (sm, md, lg) */
  iconSize?: "sm" | "md" | "lg";
  /** Afficher l'icône avec un fond */
  withIconBackground?: boolean;
  /** Classe CSS additionnelle */
  className?: string;
}

const iconSizeClasses = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-16 h-16",
};

const iconContainerSizeClasses = {
  sm: "p-2",
  md: "p-4",
  lg: "p-6",
};

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  iconSize = "md",
  withIconBackground = true,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 text-center",
        className
      )}
    >
      <div
        className={cn(
          "flex justify-center mb-4",
          withIconBackground && [
            "rounded-full bg-gray-100 dark:bg-gray-800",
            iconContainerSizeClasses[iconSize],
          ]
        )}
      >
        <Icon className={cn(iconSizeClasses[iconSize], "text-gray-400")} />
      </div>

      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        {title}
      </h3>

      {description && (
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-4">
          {description}
        </p>
      )}

      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
