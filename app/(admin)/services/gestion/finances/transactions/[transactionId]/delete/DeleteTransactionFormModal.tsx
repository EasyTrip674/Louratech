"use client";
import React, { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModal } from "@/hooks/useModal";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { AlertTriangle, Trash } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import SuccessModal from "@/components/alerts/SuccessModal";
import ErrorModal from "@/components/alerts/ErrorModal";
import { doDeleteTransaction } from "./transaction.delete.action";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { confirmMessage, deleteTransactionSchema } from "./transaction.delete.shema";

// Infer the TypeScript type from the Zod schema
type TransactionFormData = z.infer<typeof deleteTransactionSchema>;

export default function DeleteTransactionFormModal({ transactionId , authorize = false }: { transactionId:string,  authorize:boolean}) {
  const { isOpen, openModal, closeModal } = useModal();
  const router = useRouter();
  const successModal = useModal();
  const errorModal = useModal();
  const [serverError, setServerError] = useState<string | null>(null);
  const [nameMatch, setNameMatch] = useState(false);

  const message = confirmMessage

  // Create a custom Zod schema that validates the confirmMessage matches the Transaction's confirmMessage
  const enhancedDeleteTransactionSchema = deleteTransactionSchema.extend({
    confirmMessage: z.string()
      .min(1, "Veuillez saisir le nom du Transaction")
      .refine((val) => val.toLowerCase() === message?.toLowerCase(), {
        message: "Le message ne correspond pas au message indiqué",
      }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(enhancedDeleteTransactionSchema),
    defaultValues: {
      transactionId:transactionId,
     confirmMessage: ""
    },
    mode: "onChange",
  });

  // Watch confirmMessage field to check for matching
  const watchedconfirmMessage = watch("confirmMessage");
  
  useEffect(() => {
    setNameMatch(watchedconfirmMessage?.toLowerCase() === message?.toLowerCase());
  }, [watchedconfirmMessage]);

  const DeleteMutation = useMutation({
    mutationFn: async (data: TransactionFormData) => {
      try {
        const result = await doDeleteTransaction(data);
        if (result?.data?.success) {
          closeModal();
          reset();
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

  const onSubmit = (data: TransactionFormData) => {
    if (nameMatch) {
      DeleteMutation.mutate(data);
    }
  };

  const handleClose = () => {
    closeModal();
    reset();
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

      {/* {inPageProfile ? (
        <button
          onClick={openModal}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-red-300 bg-white px-4 py-3 text-sm font-medium text-red-700 shadow-theme-xs hover:bg-red-50 hover:text-red-800 dark:border-red-800 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300 lg:inline-flex lg:w-auto"
        >
          <Trash className="w-4 h-4" />
          Supprimer ce Transaction
        </button>
      ) : (
        <Button variant="outline"  size="sm" onClick={openModal} className="!text-red-600 hover:!bg-red-50 hover:!border-red-300 dark:hover:bg-red-900/20 dark:!hover:border-red-800">
          <Trash className="w-4 h-4" />
        </Button>
      )} */}


      <Button variant="outline"  size="sm" onClick={openModal} className="!text-red-600 hover:!bg-red-50 hover:!border-red-300 dark:hover:bg-red-900/20 dark:!hover:border-red-800">
                <Trash className="w-4 h-4" />
              </Button>
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
            <h4 className="text-lg font-medium text-red-700 dark:text-red-400">Supprimer cette Transaction</h4>
          </div>

          <div className="p-4 mb-6 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/10 dark:border-red-900/30">
            <p className="text-sm text-red-700 dark:text-red-300">
              <strong>Attention :</strong> Vous êtes sur le point de supprimer définitivement le Transaction <span className="font-medium">{message}</span> et toutes les factures associées.
            </p>
            <p className="mt-2 text-sm text-red-700 dark:text-red-300">
              Cette action est irréversible et entraînera la perte de toutes les données liées à cette Transaction.
            </p>
          </div>

          <div className="border-b border-gray-200 dark:border-gray-800 pb-6">
            <Label className="block mb-2">
              Pour confirmer la suppression, veuillez saisir <span className="font-medium text-amber-300 italic">{message}</span>
            </Label>
            <Input 
              {...register("confirmMessage")} 
              error={!!errors.confirmMessage} 
              hint={errors.confirmMessage?.message} 
              type="text" 
              placeholder={`Saisir "${message}"`}
              className={`${nameMatch ? "border-green-500 dark:border-green-500" : ""}`}
            />
            
            {nameMatch && !errors.confirmMessage && (
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