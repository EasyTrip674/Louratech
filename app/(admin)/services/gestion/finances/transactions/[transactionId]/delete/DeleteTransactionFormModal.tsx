"use client";
import React, { useState } from "react";
import { useModal } from "@/hooks/useModal";
import Button from "@/components/ui/button/Button";
import { Trash } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import SuccessModal from "@/components/alerts/SuccessModal";
import ErrorModal from "@/components/alerts/ErrorModal";
import DeleteConfirmationModal from "@/components/ui/modal/DeleteConfirmationModal";
import { doDeleteTransaction } from "./transaction.delete.action";
import { useRouter } from "next/navigation";
import { confirmMessage } from "./transaction.delete.shema";

export default function DeleteTransactionFormModal({ transactionId , authorize = false }: { transactionId:string,  authorize:boolean}) {
  const { isOpen, openModal, closeModal } = useModal();
  const router = useRouter();
  const successModal = useModal();
  const errorModal = useModal();
  const [serverError, setServerError] = useState<string | null>(null);

  const DeleteMutation = useMutation({
    mutationFn: async () => {
      try {
        const result = await doDeleteTransaction({
          transactionId,
          confirmMessage
        });
        if (result?.data?.success) {
          closeModal();
          successModal.openModal();
          router.refresh();
          return result;
        } else {
          setServerError(result?.serverError || "Erreur lors de la suppression");
          errorModal.openModal();
          throw new Error("Failed to delete Transaction");
        }
      } catch (error) {
        setServerError("Une erreur est survenue lors de la suppression");
        errorModal.openModal();
        throw error;
      }
    },
  });

  const handleConfirm = async () => {
    await DeleteMutation.mutateAsync();
  };

  if (!authorize){
    return null;
  }

  return (
    <>
      <SuccessModal
        successModal={successModal}
        message='Transaction supprimé avec succès'
        title="Suppression réussie"
      />

      <ErrorModal
        errorModal={errorModal}
        onRetry={openModal}
        message={serverError ? serverError : "Erreur lors de la suppression"}
      />

      <Button variant="outline"  size="sm" onClick={openModal} className="!text-red-600 hover:!bg-red-50 hover:!border-red-300 dark:hover:bg-red-900/20 dark:!hover:border-red-800">
        <Trash className="w-4 h-4" />
      </Button>

      <DeleteConfirmationModal
        isOpen={isOpen}
        onClose={closeModal}
        onConfirm={handleConfirm}
        entityType="cette transaction"
        itemName={confirmMessage}
        title="Supprimer cette transaction"
        isLoading={DeleteMutation.isPending}
        requireNameConfirmation={true}
        warningMessage={
          <p className="text-sm text-red-700 dark:text-red-300">
            <strong>Attention :</strong> Vous êtes sur le point de supprimer définitivement cette transaction et toutes les données associées.
          </p>
        }
        warningSubMessage="Cette action est irréversible et entraînera la perte de toutes les données liées à cette transaction."
      />
    </>
  );
}