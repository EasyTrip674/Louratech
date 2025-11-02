"use client";

import { useState } from "react";
import { useModal } from "@/hooks/useModal";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

/**
 * Options de configuration pour le hook useDeleteConfirmation
 * @template TData Type des données retournées par la mutation
 * @template TVariables Type des variables passées à la mutation
 */
export interface UseDeleteConfirmationOptions<TData = unknown, TVariables = void> {
  /** Fonction de mutation à exécuter lors de la suppression */
  mutationFn: (variables: TVariables) => Promise<TData>;
  /** Message de succès à afficher */
  successMessage?: string;
  /** Titre du modal de succès */
  successTitle?: string;
  /** Message d'erreur par défaut */
  defaultErrorMessage?: string;
  /** Callback appelé après le succès de la mutation */
  onSuccess?: (data: TData, variables: TVariables) => void;
  /** Callback appelé en cas d'erreur */
  onError?: (error: Error, variables: TVariables) => void;
  /** Options supplémentaires pour useMutation */
  mutationOptions?: Omit<UseMutationOptions<TData, Error, TVariables>, "mutationFn" | "onSuccess" | "onError">;
}

/**
 * Hook réutilisable pour gérer les modales de confirmation de suppression
 *
 * Simplifie la gestion des états de modal, des mutations et des erreurs
 * pour les opérations de suppression dans toute l'application.
 *
 * @template TData Type des données retournées par la mutation
 * @template TVariables Type des variables passées à la fonction de mutation
 *
 * @example
 * ```tsx
 * const {
 *   isOpen,
 *   openModal,
 *   closeModal,
 *   handleConfirm,
 *   isDeleting,
 *   successModal,
 *   errorModal,
 *   serverError
 * } = useDeleteConfirmation({
 *   mutationFn: async (id: string) => {
 *     const result = await deleteClient({ id });
 *     if (!result?.data?.success) {
 *       throw new Error(result?.serverError || "Erreur");
 *     }
 *     return result;
 *   },
 *   successMessage: "Client supprimé avec succès",
 *   successTitle: "Suppression réussie"
 * });
 * ```
 */
export function useDeleteConfirmation<TData = unknown, TVariables = void>({
  mutationFn,
  successMessage = "Suppression réussie",
  successTitle = "Suppression réussie",
  defaultErrorMessage = "Une erreur est survenue lors de la suppression",
  onSuccess,
  onError,
  mutationOptions,
}: UseDeleteConfirmationOptions<TData, TVariables>) {
  const router = useRouter();

  // Gestion des modals
  const deleteModal = useModal();
  const successModal = useModal();
  const errorModal = useModal();

  // État d'erreur serveur
  const [serverError, setServerError] = useState<string | null>(null);

  // Mutation de suppression
  const deleteMutation = useMutation<TData, Error, TVariables>({
    mutationFn,
    onSuccess: (data, variables) => {
      deleteModal.closeModal();
      successModal.openModal();
      router.refresh();
      onSuccess?.(data, variables);
    },
    onError: (error, variables) => {
      const errorMessage = error.message || defaultErrorMessage;
      setServerError(errorMessage);
      errorModal.openModal();
      onError?.(error, variables);
    },
    ...mutationOptions,
  });

  /**
   * Gestionnaire de confirmation de suppression
   * @param variables Variables à passer à la fonction de mutation
   */
  const handleConfirm = (variables: TVariables) => {
    deleteMutation.mutate(variables);
  };

  /**
   * Réinitialise les erreurs et ferme les modals d'erreur
   */
  const clearError = () => {
    setServerError(null);
    errorModal.closeModal();
  };

  return {
    // États des modals
    isOpen: deleteModal.isOpen,
    openModal: deleteModal.openModal,
    closeModal: deleteModal.closeModal,

    // Modal de succès
    successModal: {
      isOpen: successModal.isOpen,
      openModal: successModal.openModal,
      closeModal: successModal.closeModal,
      message: successMessage,
      title: successTitle,
    },

    // Modal d'erreur
    errorModal: {
      isOpen: errorModal.isOpen,
      openModal: errorModal.openModal,
      closeModal: errorModal.closeModal,
      onRetry: deleteModal.openModal,
    },

    // États de la mutation
    handleConfirm,
    isDeleting: deleteMutation.isPending,
    isSuccess: deleteMutation.isSuccess,
    isError: deleteMutation.isError,

    // Gestion des erreurs
    serverError,
    clearError,

    // Accès direct à la mutation si nécessaire
    mutation: deleteMutation,
  };
}
