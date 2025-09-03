"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModal } from "@/hooks/useModal";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { Edit } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import SuccessModal from "@/components/alerts/SuccessModal";
import ErrorModal from "@/components/alerts/ErrorModal";
import type { z } from "zod";
import TextArea from "@/components/form/input/TextArea";
import { doEditStep } from "./step.edit.action";
import { editStepProcedureSchema } from "./step.edit.shema";
import { api } from "@/lib/BackendConfig/api";

// Infer the TypeScript type from the Zod schema
type StepProcedureScheme = z.infer<typeof editStepProcedureSchema>;

interface EditStepFormModalProps {
  procedureId: string;
  stepId: string;
  name: string;
  description?: string;
  price: number | null;
  estimatedDuration?: number | null;
  order: number;
  isRequired?: boolean;
}

export default function EditStepFormModal({
  procedureId,
  stepId,
  name,
  description,
  price,
  estimatedDuration,
  order,
  isRequired,
}: EditStepFormModalProps) {
  const { isOpen, openModal, closeModal } = useModal();
  const successModal = useModal();
  const errorModal = useModal();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<StepProcedureScheme>({
    resolver: zodResolver(editStepProcedureSchema),
    defaultValues: {
      name,
      description,
      price: price ?? 0,
      estimatedDuration: estimatedDuration ?? 0,
      order,
      isRequired,
      procedureId,
      stepId,
    }
  });

  const editMutation = useMutation({
    mutationFn: async (data: StepProcedureScheme) => {
      const result = await api.patch(`api/procedures/steps/${stepId}`, {
        ...data
      });
      
      if (result?.data?.success) {
        closeModal();
        reset();
        successModal.openModal();
        return result;
      } 
      
      errorModal.openModal();
      throw new Error("Failed to edit step");
    }
  });

  const onSubmit = (data: StepProcedureScheme) => {
    editMutation.mutate(data);
  };

  const handleCancel = () => {
    closeModal();
    reset();
  };

  return (
    <>
      <SuccessModal 
        successModal={successModal}
        message="Module modifié avec succès"
        title="Modification réussie" 
      />
      
      <ErrorModal 
        errorModal={errorModal} 
        onRetry={openModal}
        message="Erreur lors de la modification du module" 
      />
      
      <Button variant="outline" size="sm" onClick={openModal}>
        <Edit className="w-4 h-4 dark:text-white" />
      </Button>
      
      <Modal 
        key={stepId}
        isOpen={isOpen} 
        onClose={handleCancel} 
        className="max-w-[584px] p-5 lg:p-10"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
            Modifier le module
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
              <Label>Description (Optionnel)</Label>
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
                placeholder="Entrez le prix" 
              />
              <p className="text-xs text-gray-500 mt-1">Ce prix sera personnalisable par client</p>
            </div>
            {/* Order field */}
            <div className="col-span-1">
              <Input
                label="Ordre du module"
                {...register("order", { valueAsNumber: true })}
                error={!!errors.order}
                hint={errors.order?.message}
                type="number"
                min="1"
                placeholder="Ordre dans la procédure"
              />
            </div>
            {/* Estimated Duration field */}
            <div className="col-span-1">
              <Input
                label="Durée estimée (jours)"
                {...register("estimatedDuration", { valueAsNumber: true })}
                error={!!errors.estimatedDuration}
                hint={errors.estimatedDuration?.message}
                type="number"
                min="0"
                placeholder="Durée estimée en jours"
              />
            </div>
            {/* Required field */}
            <div className="col-span-1 flex items-center gap-2">
            <input
              id="isRequired"
              type="checkbox"
              {...register("isRequired")}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />

              <Label htmlFor="isRequired">Obligatoire</Label>
              {errors.isRequired && (
                <span className="text-xs text-red-500 ml-2">{errors.isRequired.message as string}</span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end w-full gap-3 mt-6">
            <Button 
              type="button" 
              size="sm" 
              variant="outline" 
              onClick={handleCancel}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              size="sm" 
              disabled={isSubmitting || editMutation.isPending}
            >
              {editMutation.isPending ? "En cours..." : "Modifier"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}