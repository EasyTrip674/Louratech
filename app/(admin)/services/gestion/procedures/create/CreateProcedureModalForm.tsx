"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModal } from "@/hooks/useModal";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import { Plus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import SuccessModal from "@/components/alerts/SuccessModal";
import ErrorModal from "@/components/alerts/ErrorModal";
import { createProcedureScheme } from "./procedure.create.sheme";
import { doCreateProcedure } from "./procedure.create.action";
import { authClient } from "@/lib/auth-client";

// Zod validation schema

// Infer the TypeScript type from the Zod schema
type ProcedureFormData = z.infer<typeof createProcedureScheme>;

export default function CreateProcedureFormModal() {
  const { isOpen, openModal, closeModal } = useModal();
  const successModal = useModal();
  const errorModal = useModal();


  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProcedureFormData>({
    resolver: zodResolver(createProcedureScheme),
    defaultValues: {
     name: "",
    },
  });



  // Watch form values in real-time
  // const watchedValues = watch();

  const createMutation = useMutation({
    mutationFn: async (data: ProcedureFormData) => {
    const result = await doCreateProcedure(data);
    if (result?.data?.success) {
      closeModal();
      reset();
      successModal.openModal();
    } else {
      closeModal();
      errorModal.openModal();
    }
  },
    onSuccess: () => {
      console.log("Procedure created successfully");
    },
    onError: () => {
      console.error("Failed to create Procedure");
    },
    
  });



  const onSubmit = async (data: ProcedureFormData) => {
    console.log("Saving Procedure data:", data);
    // TODO: Save Procedure data to the database
    // INFO: You can use the `data` object to send the form data to the server
     await createMutation.mutateAsync(data);
    
  };

  const session = authClient.useSession();
  if (!session.data?.userDetails?.authorize?.canEditProcedure) return null;


  return (
    <>
    <SuccessModal successModal={successModal}
               message="Service créé avec succès"
               title="" />
    <ErrorModal errorModal={errorModal} onRetry={openModal}
        message="Erreur lors de la création du service" />
       <button className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 text-sm font-medium" onClick={openModal}>
              <Plus className="h-4 w-4" />
              Nouveau service
        </button>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[584px] p-5 lg:p-10">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">Ajouter un nouveau service</h4>
          
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 border-b border-gray-200 dark:border-gray-800 pb-6">
            <div className="col-span-2">
                <Input 
                label="Nom du service"
                required
                {...register("name")} 
                error={!!errors.name} 
                hint={errors.name?.message} 
                type="text" 
                placeholder="Entrer nom de la procedure ou service" 
              />
            </div>
            
          </div>


          <div className="flex items-center justify-end w-full gap-3 mt-6">
            <Button type="button" size="sm" variant="outline" onClick={() => { closeModal(); reset(); }}>
              Annuler
            </Button>
            <Button type="submit" size="sm" disabled={createMutation.isPending}>
              {createMutation.isPending ? "En cours..." : "Enregistrer"}
            </Button>
          </div>
        </form>
        
      </Modal>
    </>
  );
}