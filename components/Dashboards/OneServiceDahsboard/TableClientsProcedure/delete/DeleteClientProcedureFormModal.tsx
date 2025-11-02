"use client";
import React, { useState } from "react";
import { useModal } from "@/hooks/useModal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import { Trash, Database, Info } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import SuccessModal from "@/components/alerts/SuccessModal";
import ErrorModal from "@/components/alerts/ErrorModal";
import DeleteConfirmationModal from "@/components/ui/modal/DeleteConfirmationModal";
import { doDeleteClientProcedure } from "./clientProcedure.delete.action";
import { useRouter } from "next/navigation";

export default function DeleteClientProcedureFormModal({  inPageProfile = false ,ClientProcedureName, authozise =false,clientProcedureId,procedureId}:
   { ClientProcedureName:string, authozise:boolean , inPageProfile?: boolean, clientProcedureId:string,procedureId:string }) {
  const { isOpen, openModal, closeModal } = useModal();
  const router = useRouter();
  const successModal = useModal();
  const errorModal = useModal();
  const [serverError, setServerError] = useState<string | null>(null);
  const [deleteTransactions, setDeleteTransactions] = useState(false);

  const DeleteMutation = useMutation({
    mutationFn: async () => {
      try {
        const result = await doDeleteClientProcedure({
          ClientProcedureId: clientProcedureId,
          ClientProcedureName,
          deleteTransactionAssocied: deleteTransactions
        });
        if (result?.data?.success) {
          closeModal();
          setDeleteTransactions(false);
          successModal.openModal();
          router.refresh();
          router.push(`/services/gestion/procedures/${procedureId}`)
          return result;
        } else {
          setServerError(result?.serverError || "Erreur lors de la suppression");
          errorModal.openModal();
          throw new Error("Failed to delete client Procedure");
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

  const handleClose = () => {
    closeModal();
    setDeleteTransactions(false);
  };

  if (!authozise ){
    return null;
  }

  return (
    <>
      <SuccessModal
        successModal={successModal}
        message='Inscription supprimé avec succès'
        title="Suppression réussie"
      />

      <ErrorModal
        errorModal={errorModal}
        onRetry={openModal}
        message={serverError ? serverError : "Erreur lors de la suppression"}
      />

      {inPageProfile ? (
        <div>
        <Button
          size="sm"
          onClick={openModal}
          variant="outline"
          className="border-orange-200 text-orange-700 hover:bg-orange-50 hover:border-orange-300 dark:border-orange-700 dark:text-orange-400 dark:hover:bg-orange-900/20 dark:hover:border-orange-600 transition-colors duration-200"
        >
          <Trash className="w-4 h-4" />
          Supprimer
        </Button>
       </div>

      ) : (
        <Button variant="outline"  size="sm" onClick={openModal} className="!text-red-600 hover:!bg-red-50 hover:!border-red-300 dark:hover:bg-red-900/20 dark:!hover:border-red-800">
          <Trash className="w-4 h-4" />
        </Button>
      )}

      <DeleteConfirmationModal
        isOpen={isOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        entityType="ce dossier client"
        itemName={ClientProcedureName}
        title="Supprimer ce module pour ce client"
        isLoading={DeleteMutation.isPending}
        requireNameConfirmation={true}
        warningMessage={
          <p className="text-sm text-red-700 dark:text-red-300">
            <strong>Attention :</strong> Vous êtes sur le point de supprimer définitivement le module pour ce client <span className="font-medium">{ClientProcedureName}</span> et toutes les procédures associées.
          </p>
        }
        warningSubMessage="Cette action est irréversible et entraînera la perte de toutes les données liées à ce module pour ce client."
      >
        {/* Checkbox pour supprimer les transactions associées */}
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
                  Choisissez comment traiter les transactions liées à ce module pour ce client
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 ml-11">
              <div className="flex items-center h-5">
                <input
                  id="deleteTransactionAssocied"
                  type="checkbox"
                  checked={deleteTransactions}
                  onChange={(e) => setDeleteTransactions(e.target.checked)}
                  className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-red-600 dark:ring-offset-gray-800"
                />
              </div>
              <div className="ml-2 text-sm">
                <label htmlFor="deleteTransactionAssocied" className="font-medium text-gray-900 dark:text-gray-100">
                  Supprimer également les transactions associées
                </label>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {deleteTransactions
                    ? "Les transactions liées à ce module pour ce client seront définitivement supprimées."
                    : "Les transactions liées seront conservées mais leur référence au module pour ce client sera supprimée."
                  }
                </p>
              </div>
            </div>

            {/* Avertissement conditionnel */}
            {deleteTransactions && (
              <div className="ml-11 p-3 border border-amber-200 rounded-lg bg-amber-50 dark:bg-amber-900/10 dark:border-amber-900/30">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-amber-800 dark:text-amber-200">
                      Attention - Suppression définitive
                    </p>
                    <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                      Toutes les transactions, revenus et dépenses associées à ce module pour ce client seront définitivement supprimés. Cette action ne peut pas être annulée.
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