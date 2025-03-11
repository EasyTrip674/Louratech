"use client";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModal } from "@/hooks/useModal";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";

import { Plus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { doCreateClient } from "./step.create.action";
import SuccessModal from "@/components/alerts/SuccessModal";
import ErrorModal from "@/components/alerts/ErrorModal";
import { createStepProcedureSchema } from "./step.create.shema";

// Zod validation schema

// Infer the TypeScript type from the Zod schema
type StepProcedureScheme = z.infer<typeof createStepProcedureSchema>;

export default function CreateClientFormModal() {
  const { isOpen, openModal, closeModal } = useModal();
  const successModal = useModal();
  const errorModal = useModal();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<StepProcedureScheme>({
    resolver: zodResolver(createStepProcedureSchema),
    defaultValues: {
     name: "",
      description: "",
      price: 0,
      isRequired: true,
      procedureId: "",
    },
  });

  // Watch form values in real-time
  // const watchedValues = watch();

  const createMutation = useMutation({
    mutationFn: async (data: StepProcedureScheme) => {
    const result = await doCreateClient(data);
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
      console.log("Client created successfully");
    },
    onError: (error) => {
      console.error("Failed to create client");
    },
    
  });

  const onSubmit = (data: StepProcedureScheme) => {
    console.log("Saving client data:", data);
    // TODO: Save client data to the database
    // INFO: You can use the `data` object to send the form data to the server
    if (data) {
     createMutation.mutate(data);
    }else{
      console.log("No data to save");
    }
  };

  return (
    <>
    <SuccessModal successModal={successModal}
               message="Client created successfully"
               title="" />
    <ErrorModal errorModal={errorModal} onRetry={openModal}
        message="Error during creation user" />
      <Button variant="outline" size="sm" onClick={openModal} className="bg-gray-200">
        <Plus className="w-4 h-4 dark:text-white" />
      </Button>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[584px] p-5 lg:p-10">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">Ajouter un nouveau client</h4>
          
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 border-b border-gray-200 dark:border-gray-800 pb-6">
            {/* firstName */}
            <div className="col-span-1">
              <Label>Nom du module</Label>
              <Input {...register("name")} error={!!errors.name} hint={errors.name?.message}  type="text" placeholder="Enter full name" />
            </div>
            {/* lastName */}
            <div className="col-span-1">
              <Label>Description</Label>
              <Input {...register("description")} error={!!errors.description} hint={errors.description?.message} type="text" placeholder="Enter description" />
            </div>

            {}
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
        {/* Debugging: Display watched values */}
        {/* <pre className="mt-4 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-700 dark:text-gray-300">
          {JSON.stringify(watchedValues, null, 2)}
        </pre> */}
      </Modal>
    </>
  );
}