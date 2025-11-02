"use client";
import React, { useState } from "react";
import { useModal } from "@/hooks/useModal";
import Button from "@/components/ui/button/Button";
import { Trash } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import SuccessModal from "@/components/alerts/SuccessModal";
import ErrorModal from "@/components/alerts/ErrorModal";
import { doDeleteClient } from "./client.delete.action";
import type { clientsTableOrganizationDB, clientProfileDB } from '@/lib/services/client.service';
import { useRouter } from "next/navigation";
import DeleteConfirmationModal from "@/components/ui/modal/DeleteConfirmationModal";

export default function DeleteClientFormModal({ client, inPageProfile = false }: { client: clientsTableOrganizationDB[0] | clientProfileDB, inPageProfile?: boolean }) {
  const { isOpen, openModal, closeModal } = useModal();
  const router = useRouter();
  const successModal = useModal();
  const errorModal = useModal();
  const [serverError, setServerError] = useState<string | null>(null);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const result = await doDeleteClient({
        id: client?.id,
        lastName: client?.lastName
      });

      if (result?.data?.success) {
        closeModal();
        successModal.openModal();
        router.refresh();
        return result;
      } else {
        setServerError(result?.serverError || "Erreur lors de la suppression");
        errorModal.openModal();
        throw new Error("Failed to delete client");
      }
    },
    onError: () => {
      setServerError("Une erreur est survenue lors de la suppression");
      errorModal.openModal();
    }
  });

  const handleConfirm = async () => {
    deleteMutation.mutate();
  };

  return (
    <>
      <SuccessModal
        successModal={successModal}
        message='Client supprimé avec succès'
        title="Suppression réussie"
      />

      <ErrorModal
        errorModal={errorModal}
        onRetry={openModal}
        message={serverError || "Erreur lors de la suppression"}
      />

      {inPageProfile ? (
        <button
          onClick={openModal}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-red-300 bg-white px-4 py-3 text-sm font-medium text-red-700 shadow-theme-xs hover:bg-red-50 hover:text-red-800 dark:border-red-800 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300 lg:inline-flex lg:w-auto"
        >
          <Trash className="w-4 h-4" />
          Supprimer ce client
        </button>
      ) : (
        <Button variant="outline" size="sm" onClick={openModal} className="!text-red-600 hover:!bg-red-50 hover:!border-red-300 dark:hover:bg-red-900/20 dark:!hover:border-red-800">
          <Trash className="w-4 h-4" />
        </Button>
      )}

      <DeleteConfirmationModal
        isOpen={isOpen}
        onClose={closeModal}
        onConfirm={handleConfirm}
        entityType="ce client"
        itemName={client?.lastName || ""}
        isLoading={deleteMutation.isPending}
        warningMessage={
          <>
            <strong>Attention :</strong> Vous êtes sur le point de supprimer définitivement le client <span className="font-medium">{client?.firstName} {client?.lastName}</span> et toutes les procédures associées.
          </>
        }
        warningSubMessage="Cette action est irréversible et entraînera la perte de toutes les données liées à ce client."
      />
    </>
  );
}