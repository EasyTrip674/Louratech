"use client";
import React, { useState } from "react";
import { useModal } from "@/hooks/useModal";
import Button from "@/components/ui/button/Button";
import { Trash, Database, Info } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import SuccessModal from "@/components/alerts/SuccessModal";
import ErrorModal from "@/components/alerts/ErrorModal";
import { doDeleteProcedure } from "./procedure.delete.action";
import { useRouter } from "next/navigation";
import DeleteConfirmationModal from "@/components/ui/modal/DeleteConfirmationModal";
import Label from "@/components/form/Label";

export default function DeleteProcedureFormModal({ procedureId, countClient, inPageProfile = false, procedureName, authozise = false }: { procedureId: string, procedureName: string, authozise: boolean, inPageProfile?: boolean, countClient: number }) {
  const { isOpen, openModal, closeModal } = useModal();
  const router = useRouter();
  const successModal = useModal();
  const errorModal = useModal();
  const [serverError, setServerError] = useState<string | null>(null);
  const [deleteTransactionAssocied, setDeleteTransactionAssocied] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const result = await doDeleteProcedure({
        procedureId,
        procedureName,
        deleteTransactionAssocied
      });

      if (result?.data?.success) {
        closeModal();
        successModal.openModal();
        router.refresh();
        router.push("/services/gestion/procedures");
        return result;
      } else {
        setServerError(result?.serverError || "Erreur lors de la suppression");
        errorModal.openModal();
        throw new Error("Failed to delete procedure");
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

  const handleClose = () => {
    closeModal();
    setDeleteTransactionAssocied(false);
  };

  if (!authozise || countClient !== 0) {
    return null;
  }

  return (
    <>
      <SuccessModal
        successModal={successModal}
        message="Procedure supprimé avec succès"
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
          Supprimer ce Procedure
        </button>
      ) : (
        <Button variant="outline" size="sm" onClick={openModal} className="!text-red-600 hover:!bg-red-50 hover:!border-red-300 dark:hover:bg-red-900/20 dark:!hover:border-red-800">
          <Trash className="w-4 h-4" />
        </Button>
      )}

      <DeleteConfirmationModal
        isOpen={isOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        entityType="cette procédure"
        itemName={procedureName}
        isLoading={deleteMutation.isPending}
        warningMessage={
          <>
            <strong>Attention :</strong> Vous êtes sur le point de supprimer définitivement le service <span className="font-medium">{procedureName}</span> et toutes les procédures associées.
          </>
        }
        warningSubMessage="Cette action est irréversible et entraînera la perte de toutes les données liées à ce service."
      >
        {/* Additional content for transaction deletion checkbox */}
        <div className="py-6 border-b border-gray-200 dark:border-gray-800">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30">
                <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <Label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Gestion des transactions associées
                </Label>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Choisissez comment traiter les transactions liées à ce service
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 ml-11">
              <div className="flex items-center h-5">
                <input
                  id="deleteTransactionAssocied"
                  type="checkbox"
                  checked={deleteTransactionAssocied}
                  onChange={(e) => setDeleteTransactionAssocied(e.target.checked)}
                  className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-red-600 dark:ring-offset-gray-800"
                />
              </div>
              <div className="ml-2 text-sm">
                <label htmlFor="deleteTransactionAssocied" className="font-medium text-gray-900 dark:text-gray-100">
                  Supprimer également les transactions associées
                </label>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {deleteTransactionAssocied
                    ? "Les transactions liées à ce service seront définitivement supprimées."
                    : "Les transactions liées seront conservées mais leur référence au service sera supprimée."
                  }
                </p>
              </div>
            </div>

            {/* Avertissement conditionnel */}
            {deleteTransactionAssocied && (
              <div className="ml-11 p-3 border border-amber-200 rounded-lg bg-amber-50 dark:bg-amber-900/10 dark:border-amber-900/30">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-amber-800 dark:text-amber-200">
                      Attention - Suppression définitive
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                      Toutes les transactions, revenus et dépenses associées à ce service seront définitivement supprimés. Cette action ne peut pas être annulée.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DeleteConfirmationModal>
    </>
  );
}