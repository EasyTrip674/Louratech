"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModal } from "@/hooks/useModal";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import { Pen } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import SuccessModal from "@/components/alerts/SuccessModal";
import ErrorModal from "@/components/alerts/ErrorModal";
import { editProcedureScheme } from "./procedure.edit.sheme";
import { authClient } from "@/lib/auth-client";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import { api } from "@/lib/BackendConfig/api";
import useAuth from "@/lib/BackendConfig/useAuth";

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
    watch,
    setValue,
    setError,
  } = useForm<ProcedureFormData>({
    resolver: zodResolver(editProcedureScheme),
    defaultValues: {
      name: procedure.name,
      description: procedure.description,
      procedureId: procedure.procedureId,
    },
  });

  const editMutation = useMutation({
    mutationFn: async (data: ProcedureFormData) => {
      const result = await api.patch(`api/procedures/procedures/${procedure.procedureId}/`, {
        name: data.name,
        description: data.description
      });
      
      return result; // Retourner le résultat pour que React Query puisse le gérer
    },
    onSuccess: (result) => {
      // Gérer le succès ici
      if (result?.status === 200) {
        closeModal();
        reset();
        successModal.openModal();
      } else {
        // Si le status n'est pas 200, traiter comme une erreur
        closeModal();
        errorModal.openModal();
      }
    },
    onError: (error: any) => {
      closeModal(); // Fermer le modal en cas d'erreur
      
      if (error?.response?.data?.errors) {
        const backendErrors = error.response.data.errors;
        Object.entries(backendErrors).forEach(([field, message]) => {
          setError(field as keyof ProcedureFormData, { 
            type: "server", 
            message: String(message) 
          });
        });
        // Rouvrir le modal pour afficher les erreurs de validation
        openModal();
      } else {
        errorModal.openModal();
      }
    },
  });

  const onSubmit = async (data: ProcedureFormData) => {
    // Exécuter la mutation
    await editMutation.mutateAsync(data);
  };

  const session = useAuth();

  if (!session?.user?.authorization?.can_edit_procedure) return null;

  // Collect all error messages
  const allErrorMessages = Object.values(errors)
    .map(e => (typeof e?.message === "string" ? e.message : null))
    .filter(Boolean);

  return (
    <>
      <SuccessModal 
        successModal={successModal}
        message="Service modifiée avec succès"
        title="" 
      />
      <ErrorModal 
        errorModal={errorModal} 
        onRetry={openModal}
        message="Erreur lors de la mise à jour " 
      />
      <Button 
        variant="outline" 
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium" 
        onClick={openModal}
      >
        <Pen className="h-4 w-4" />
        Modifier
      </Button>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[584px] p-5 lg:p-10">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
            Modifier ce service
          </h4>
          {allErrorMessages.length > 0 && (
            <div className="mb-4">
              <ul className="bg-red-50 border border-red-200 text-red-700 text-sm rounded p-3 space-y-1">
                {allErrorMessages.map((msg, idx) => (
                  <li key={idx}>{msg}</li>
                ))}
              </ul>
            </div>
          )}
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
            <div className="col-span-2">
              <Label>Description du service</Label>
              <TextArea
                value={watch("description") ?? ""}
                onChangeValue={v => setValue("description", v, { shouldValidate: true })}
                error={!!errors.description}
                hint={errors.description?.message}
                placeholder="Entrez une description détaillée du service (optionnel)"
              />
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
              disabled={editMutation.isPending}
            >
              {editMutation.isPending ? "En cours..." : "Enregistrer"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}