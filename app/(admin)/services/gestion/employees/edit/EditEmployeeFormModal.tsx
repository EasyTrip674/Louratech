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
import PhoneInput from "@/components/form/group-input/PhoneInput";
import { countriesCode } from "@/lib/countries";
import { Pencil } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import SuccessModal from "@/components/alerts/SuccessModal";
import ErrorModal from "@/components/alerts/ErrorModal";

import { useRouter } from "next/navigation";
import { doEditEmployee } from "./employee.edit.action";
import { editEmployeeSheme } from "./employee.edit.shema";
import { employeeProfileDB, employeesTableOrganizationDB } from "@/db/queries/employees.query";

// Infer the TypeScript type from the Zod schema
type EmployeeFormData = z.infer<typeof editEmployeeSheme>;

export default function EditEmployeeFormModal({ admin, inPageProfile = false }: { admin: employeesTableOrganizationDB[0] | employeeProfileDB, inPageProfile?: boolean }) {
  const { isOpen, openModal, closeModal } = useModal();
  const router = useRouter();
  const successModal = useModal();
  const errorModal = useModal();
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(editEmployeeSheme),
    defaultValues: {
      id: admin?.id,
      lastName: admin?.user?.lastName ?? "",
      firstName: admin?.user?.firstName ?? "",
      phone: admin?.phone ?? "",
      address: admin?.address ?? "",
    },
  });

  const editMutation = useMutation({
    mutationFn: async (data: EmployeeFormData) => {
      try {
        const result = await doEditEmployee(data);
        return result;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (result) => {
      if (result?.data?.success) {
        closeModal();
        reset();
        successModal.openModal();
        router.refresh();
      } else {
        setServerError(result?.serverError || "Une erreur est survenue");
        errorModal.openModal();
      }
    },
    onError: (error) => {
      console.error("Failed to Edit Employee", error);
      setServerError(error?.message || "Une erreur est survenue");
      errorModal.openModal();
    },
  });

  const onSubmit = (data: EmployeeFormData) => {
    console.log("Saving Employee data:", data);
    editMutation.mutate(data);
  };

  return (
    <>
      <SuccessModal 
        successModal={successModal}
        message='Employé modifié avec succès'
        title="" 
      />
      
      <ErrorModal 
        errorModal={errorModal} 
        onRetry={openModal}
        message={serverError || "Erreur lors de la modification"} 
      />
      
      {inPageProfile ? (
        <button
          onClick={openModal}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          type="button"
        >
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
              fill=""
            />
          </svg>
          Modifier
        </button>
      ) : (
        <Button variant="outline" size="sm" onClick={openModal} type="button">
          <Pencil className="w-4 h-4 dark:text-white" />
        </Button>
      )}
      
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[584px] p-5 lg:p-10">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">Modifier cet employé</h4>
          
          {errors.firstName && (
            <div className="mb-4 text-sm text-red-600 dark:text-red-400">
              {errors.firstName.message}
            </div>
          )}

          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 border-b border-gray-200 dark:border-gray-800 pb-6">
            {/* firstName */}
            <div className="col-span-1">
              <Label>Prénom</Label>
              <Input {...register("firstName")} error={!!errors.firstName} hint={errors.firstName?.message} type="text" placeholder="Entrer le prénom" />
            </div>
            
            {/* lastName */}
            <div className="col-span-1">
              <Label>Nom</Label>
              <Input {...register("lastName")} error={!!errors.lastName} hint={errors.lastName?.message} type="text" placeholder="Entrer le nom" />
            </div>

            {/* Phone */}
            <div className="col-span-1">
              <Label>Téléphone</Label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <PhoneInput selectPosition="start" countries={countriesCode} placeholder="+1 (555) 000-0000" {...field} />
                )}
              />
            </div>

            {/* Address */}
            <div className="col-span-1 sm:col-span-2">
              <Label>Adresse</Label>
              <Input {...register("address")} type="text" placeholder="Entrer l'adresse complète" />
            </div>
          </div>

          <div className="flex items-center justify-end w-full gap-3 mt-6">
            <Button type="button" size="sm" variant="outline" onClick={() => { closeModal(); reset(); }}>
              Annuler
            </Button>
            <Button type="submit" size="sm" disabled={editMutation.isPending}>
              {editMutation.isPending ? "En cours..." : "Modifier"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}