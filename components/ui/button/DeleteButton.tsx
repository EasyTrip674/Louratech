import { Trash } from "lucide-react";
import Button from "./Button";
import { cn } from "@/lib/utils";

export interface DeleteButtonProps {
  /** Fonction appelée au clic */
  onClick: () => void;
  /** Variante: bouton complet ou juste l'icône */
  variant?: "icon" | "full";
  /** Texte du bouton (pour variant="full") */
  label?: string;
  /** Classe CSS additionnelle */
  className?: string;
  /** Désactiver le bouton */
  disabled?: boolean;
}

export default function DeleteButton({
  onClick,
  variant = "icon",
  label = "Supprimer",
  className,
  disabled = false,
}: DeleteButtonProps) {
  if (variant === "full") {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-full",
          "border border-red-300 bg-white px-4 py-3",
          "text-sm font-medium text-red-700 shadow-theme-xs",
          "hover:bg-red-50 hover:text-red-800",
          "dark:border-red-800 dark:bg-gray-800 dark:text-red-400",
          "dark:hover:bg-red-900/20 dark:hover:text-red-300",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "lg:inline-flex lg:w-auto",
          className
        )}
      >
        <Trash className="w-4 h-4" />
        {label}
      </button>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "!text-red-600 hover:!bg-red-50 hover:!border-red-300",
        "dark:hover:bg-red-900/20 dark:!hover:border-red-800",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
    >
      <Trash className="w-4 h-4" />
    </Button>
  );
}
