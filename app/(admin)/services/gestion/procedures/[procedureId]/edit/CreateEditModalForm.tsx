"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModal } from "@/hooks/useModal";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { Pen } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import SuccessModal from "@/components/alerts/SuccessModal";
import ErrorModal from "@/components/alerts/ErrorModal";
import { editProcedureScheme } from "./procedure.edit.sheme";
import { doEditProcedure } from "./procedure.edit.action";
import { authClient } from "@/lib/auth-client";
import TextArea from "@/components/form/input/TextArea";

// Zod validation schema

// Infer the TypeScript type from the Zod schema
type ProcedureFormData = z.infer<typeof editProcedureScheme>;

export default function EditProcedureFormModal({
  procedure
}:{
  procedure: {
    procedureId: string;
    name: string;
    description: string;
  }
}) {
  const { isOpen, openModal, closeModal } = useModal();
  const successModal = useModal();
  const errorModal = useModal();


  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProcedureFormData>({
    resolver: zodResolver(editProcedureScheme),
    defaultValues: {
     name: procedure.name,
     description: procedure.description,
     procedureId: procedure.procedureId,
    },
  });



  // Watch form values in real-time
  // const watchedValues = watch();

  const editMutation = useMutation({
    mutationFn: async (data: ProcedureFormData) => {
    const result = await doEditProcedure(data);
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
      console.log("Procedure editd successfully");
    },
    onError: () => {
      console.error("Failed to edit Procedure");
    },
    
  });



  const onSubmit = async (data: ProcedureFormData) => {
    console.log("Saving Procedure data:", data);
    // TODO: Save Procedure data to the database
    // INFO: You can use the `data` object to send the form data to the server
     await editMutation.mutateAsync(data);
    
  };

  const session = authClient.useSession();
  if (!session.data?.userDetails?.authorize?.canEditProcedure) return null;


  return (
    <>
    <SuccessModal successModal={successModal}
               message="Service modifiée avec succès"
               title="" />
    <ErrorModal errorModal={errorModal} onRetry={openModal}
        message="Erreur lors de la mise à jour " />
       <Button variant="outline" className="flex items-center gap-2 px-4 py-2 rounded-lg 0 text-sm font-medium" onClick={openModal}>
              <Pen className="h-4 w-4" />
              Modifier
        </Button>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[584px] p-5 lg:p-10">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">Modifier ce service</h4>
          
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 border-b border-gray-200 dark:border-gray-800 pb-6">
            <div className="col-span-2">
              <Label>Nom du service</Label>
              <Input {...register("name")} error={!!errors.name} hint={errors.name?.message}  type="text" placeholder="Entrer nom de la procedure ou service" />
            </div>
            
            <div className="col-span-2">
              <Label>Descripton du service</Label>
              <TextArea
                {...register("description")}
                error={!!errors.description} 
                hint={errors.description?.message} 
                placeholder="Entrez une description détaillée du service (optopnnel)" 
                onChangeValue={()=>register("description").onChange}
              />
              </div>

          </div>

          {/* textarea descriptopn */}



          <div className="flex items-center justify-end w-full gap-3 mt-6">
            <Button type="button" size="sm" variant="outline" onClick={() => { closeModal(); reset(); }}>
              Annuler
            </Button>
            <Button type="submit" size="sm" disabled={editMutation.isPending}>
              {editMutation.isPending ? "En cours..." : "Enregistrer"}
            </Button>
          </div>
        </form>
        
      </Modal>
    </>
  );
}