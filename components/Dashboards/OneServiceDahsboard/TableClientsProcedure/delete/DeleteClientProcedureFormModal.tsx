"use client";
import React, { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModal } from "@/hooks/useModal";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { AlertTriangle, Trash, Database, Info } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import SuccessModal from "@/components/alerts/SuccessModal";
import ErrorModal from "@/components/alerts/ErrorModal";
import { doDeleteClientProcedure } from "./clientProcedure.delete.action";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { deleteClientProcedureSchema } from "./stepClient.delete.shema";

// Infer the TypeScript type from the Zod schema
type ClientProcedureFormData = z.infer<typeof deleteClientProcedureSchema>;

export default function DeleteClientProcedureFormModal({  inPageProfile = false ,ClientProcedureName, authozise =false,clientProcedureId,procedureId}:
   { ClientProcedureName:string, authozise:boolean , inPageProfile?: boolean, clientProcedureId:string,procedureId:string }) {
  const { isOpen, openModal, closeModal } = useModal();
  const router = useRouter();
  const successModal = useModal();
  const errorModal = useModal();
  const [serverError, setServerError] = useState<string | null>(null);
  const [nameMatch, setNameMatch] = useState(false);

  // Create a custom Zod schema that validates the name matches the ClientProceddoDeleteClientProcedure's name
  const enhancedDeleteClientProcedureSchema = deleteClientProcedureSchema.extend({
    ClientProcedureName: z.string()
      .min(1, "Veuillez saisir le nom de l'etape")
      .refine((val) => val.toLowerCase() === ClientProcedureName.toLowerCase(), {
        message: "Le nom saisi ne correspond pas au nom de l'etape",
      }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<ClientProcedureFormData>({
    resolver: zodResolver(enhancedDeleteClientProcedureSchema),
    defaultValues: {
      ClientProcedureId:clientProcedureId,
      ClientProcedureName: "",
      deleteTransactionAssocied: false
    },
    mode: "onChange",
  });

  // Watch name field to check for matching
  const watchedname = watch("ClientProcedureName");
  const watchDeleteTransactions = watch("deleteTransactionAssocied");
  
  useEffect(() => {
    setNameMatch(watchedname?.toLowerCase() === ClientProcedureName.toLowerCase());
  }, [watchedname, ClientProcedureName]);

  const DeleteMutation = useMutation({
    mutationFn: async (data: ClientProcedureFormData) => {
      try {
        const result = await doDeleteClientProcedure(data);
        if (result?.data?.success) {
          closeModal();
          reset();
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

  const onSubmit = (data: ClientProcedureFormData) => {
    if (nameMatch) {
      DeleteMutation.mutate(data);
    }
  };

  const handleClose = () => {
    closeModal();
    reset();
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

      <Modal 
        isOpen={isOpen} 
        onClose={handleClose} 
        className="max-w-[584px] p-5 lg:p-10"
      >
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h4 className="text-lg font-medium text-red-700 dark:text-red-400">Supprimer ce module pour ce client</h4>
          </div>

          <div className="p-4 mb-6 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/10 dark:border-red-900/30">
            <p className="text-sm text-red-700 dark:text-red-300">
              <strong>Attention :</strong> Vous êtes sur le point de supprimer définitivement le module pour ce client <span className="font-medium">{ClientProcedureName}</span> et toutes les procédures associées.
            </p>
            <p className="mt-2 text-sm text-red-700 dark:text-red-300">
              Cette action est irréversible et entraînera la perte de toutes les données liées à ce module pour ce client.
            </p>
          </div>

          <div className="border-b border-gray-200 dark:border-gray-800 pb-6">
            <Label className="block mb-2">
              Pour confirmer la suppression, veuillez saisir le nom du module pour ce client <span className="font-medium italic text-amber-300">{ClientProcedureName}</span>
            </Label>
            <Input 
              {...register("ClientProcedureName")} 
              error={!!errors.ClientProcedureName} 
              hint={errors.ClientProcedureName?.message} 
              type="text" 
              placeholder={`Saisir "${ClientProcedureName}"`}
              className={`${nameMatch ? "border-green-500 dark:border-green-500" : ""}`}
            />
            
            {nameMatch && !errors.ClientProcedureName && (
              <div className="flex items-center gap-2 mt-2 text-green-600 dark:text-green-400">
                <div className="flex-shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-xs font-medium">Le nom correspond</p>
              </div>
            )}
          </div>

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
                    {...register("deleteTransactionAssocied")}
                    id="deleteTransactionAssocied"
                    type="checkbox"
                    className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-red-600 dark:ring-offset-gray-800"
                  />
                </div>
                <div className="ml-2 text-sm">
                  <label htmlFor="deleteTransactionAssocied" className="font-medium text-gray-900 dark:text-gray-100">
                    Supprimer également les transactions associées
                  </label>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {watchDeleteTransactions 
                      ? "Les transactions liées à ce module pour ce client seront définitivement supprimées."
                      : "Les transactions liées seront conservées mais leur référence au module pour ce client sera supprimée."
                    }
                  </p>
                </div>
              </div>

              {/* Avertissement conditionnel */}
              {watchDeleteTransactions && (
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

          <div className="flex items-center justify-end w-full gap-3 mt-6">
            <Button 
              type="button" 
              size="sm" 
              variant="outline" 
              onClick={handleClose}
            >
              Annuler
            </Button>
            <Button 
              type="button" 
              size="sm" 
              disabled={DeleteMutation.isPending || !nameMatch || !isValid}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-600"
              onClick={handleSubmit(onSubmit)}
            >
              {DeleteMutation.isPending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Suppression...
                </>
              ) : (
                <>
                  <Trash className="w-4 h-4 mr-2" />
                  Confirmer la suppression
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}