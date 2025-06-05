"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModal } from "@/hooks/useModal";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { Plus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import SuccessModal from "@/components/alerts/SuccessModal";
import ErrorModal from "@/components/alerts/ErrorModal";
import { createStepProcedureSchema } from "./step.create.shema";
import type { z } from "zod";
import TextArea from "@/components/form/input/TextArea";
import { doCreateStep } from "./step.create.action";
import { authClient } from "@/lib/auth-client";

// Infer the TypeScript type from the Zod schema
type StepProcedureScheme = z.infer<typeof createStepProcedureSchema>;

export default function CreateStepFormModal({procedureId}:{
  procedureId:string
}) {
  const { isOpen, openModal, closeModal } = useModal();
  const successModal = useModal();
  const errorModal = useModal();
  const session = authClient.useSession()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch
  } = useForm<StepProcedureScheme>({
    resolver: zodResolver(createStepProcedureSchema),
    defaultValues: {
      name: "",
      description: "",
      isRequired: true,
      procedureId: procedureId,
    }
  });

  const currentAmount = watch("price");

  const createMutation = useMutation({
    mutationFn: async (data: StepProcedureScheme) => {
      const result = await doCreateStep(data);
      if (result?.data?.success) {
        closeModal();
        reset();
        successModal.openModal();
        return result;
      } else {
        errorModal.openModal();
        throw new Error("Failed to create step");
      }
    }
  });

  const onSubmit = (data: StepProcedureScheme) => {
    console.log(data);
    createMutation.mutate(data);
  };

  return (
    <>
      <SuccessModal 
        successModal={successModal}
        message="Module créé avec succès"
        title="Création réussie" 
      />
      
      <ErrorModal 
        errorModal={errorModal} 
        onRetry={openModal}
        message="Erreur lors de la création du module" 
      />
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={openModal} 
        className="bg-gray-200 hover:bg-gray-300 transition-colors"
      >
       Creer un module <Plus className="w-4 h-4 dark:text-white" />
      </Button>
      
      <Modal 
        isOpen={isOpen} 
        onClose={() => {
          closeModal();
          reset();
        }} 
        className="max-w-[584px] p-5 lg:p-10"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
            Ajouter un nouveau module
          </h4>
          
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 border-b border-gray-200 dark:border-gray-800 pb-6">
            {/* Name field */}
            <div className="col-span-1">
              <Input 
                label="Nom du module"
                required
                {...register("name")} 
                error={!!errors.name} 
                hint={errors.name?.message}  
                type="text" 
                placeholder="Entrez le nom du module" 
              />
            </div>
            
            {/* Description field */}
            <div className="col-span-1">
              <Label>Description (Optionel)</Label>
              <TextArea 
                {...register("description")}
                error={!!errors.description} 
                hint={errors.description?.message} 
                placeholder="Entrez une description détaillée du module" 
                onChangeValue={()=>register("description").onChange}
              />
            </div>

            {/* Price field */}
            <div className="col-span-1">
              <Input 
                label="Prix de base pour ce module"
                required
                {...register("price", { valueAsNumber: true })} 
                error={!!errors.price} 
                hint={errors.price?.message} 
                type="number" 
                min="0"
                currentAmount={currentAmount}
                isAmount={true}
                currency={session?.data?.userDetails?.organization?.comptaSettings?.currency}                
                placeholder="Entrez le prix" 
              />
              <p className="text-xs text-gray-500 mt-1">Ce prix sera personnalisable par client</p>
            </div>
          </div>

          <div className="flex items-center justify-end w-full gap-3 mt-6">
            <Button 
              type="button" 
              size="sm" 
              variant="outline" 
              onClick={() => { 
                closeModal(); 
                reset(); 
              }}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              size="sm" 
              disabled={isSubmitting || createMutation.isPending}
            >
              {createMutation.isPending ? "En cours..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}