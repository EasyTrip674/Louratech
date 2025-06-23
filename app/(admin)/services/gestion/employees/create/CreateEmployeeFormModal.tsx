"use client";
import React, { useState } from "react";
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
import { EyeClosedIcon, EyeIcon, Plus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import SuccessModal from "@/components/alerts/SuccessModal";
import ErrorModal from "@/components/alerts/ErrorModal";
import { createEmployeeSheme } from "./employee.create.shema";
import { doCreateEmployee } from "./employee.create.action";


// Infer the TypeScript type from the Zod schema
type EmployeeFormData = z.infer<typeof createEmployeeSheme>;

export default function CreateEmployeeFormModal() {
  const { isOpen, openModal, closeModal } = useModal();
  const successModal = useModal();
  const errorModal = useModal();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(createEmployeeSheme),
    defaultValues: {
      lastName: "",
      firstName: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: EmployeeFormData) => {
      return await doCreateEmployee(data);
    },
    onSuccess: (result) => {
      console.log("result", result);
      if (result?.data?.success) {
        closeModal();
        reset();
        successModal.openModal();
        console.log("Employé créé avec succès");
      } else {
        closeModal();
        errorModal.openModal();
        console.error("Échec de la création de l'employé:", result?.serverError);
      }
    },
    onError: (error) => {
      closeModal();
      errorModal.openModal();
      console.error("Erreur lors de la création de l'employé:", error);
    },
  });

  const onSubmit = (data: EmployeeFormData) => {
     createMutation.mutateAsync(data);
     console.log("sending .........................................");
     
  };

  return (
    <>
    <SuccessModal successModal={successModal}
               message="Employé créé avec succès"
               title="" />
    <ErrorModal errorModal={errorModal} onRetry={openModal}
        message="Erreur lors de la création de l'utilisateur" />
      <Button variant="outline" size="sm" onClick={openModal} className="bg-gray-200">
        <Plus className="w-4 h-4 dark:text-white" /> Ajouter un employé
      </Button>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[584px] p-5 lg:p-10">
        <form onSubmit={handleSubmit((e)=>onSubmit(e))}>
          <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">Ajouter un nouvel employé</h4>
          
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 border-b border-gray-200 dark:border-gray-800 pb-6">
            {/* firstName */}
            <div className="col-span-1">
              <Input 
                label="Prénom"
                required
                {...register("firstName")} 
                error={!!errors.firstName} 
                hint={errors.firstName?.message} 
                type="text" 
                placeholder="Entrez le prénom" 
              />
            </div>
            {/* lastName */}
            <div className="col-span-1">
              <Input 
                label="Nom"
                required
                {...register("lastName")} 
                error={!!errors.lastName} 
                hint={errors.lastName?.message} 
                type="text" 
                placeholder="Entrez le nom" 
              />
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
              <Input 
                label="Adresse"
                {...register("address")} 
                error={!!errors.address} 
                hint={errors.address?.message} 
                type="text" 
                placeholder="Entrez l'adresse complète" 
              />
            </div>

          </div>


          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 mt-6">
              {/* Email */} 
            <div className="col-span-2">
              <Input 
                label="Email"
                required
                {...register("email")} 
                error={!!errors.email} 
                hint={errors.email?.message} 
                type="email" 
                placeholder="Entrez l'adresse email" 
              />
            </div>
             {/* Password */}
            <div className="col-span-1">
              <div className="relative">
                <Input
                  label="Mot de passe"
                  required
                  {...register("password")}
                  error={!!errors.password}
                  hint={errors.password?.message}
                  type={showPassword ? "text" : "password"}
                  placeholder="Entrez le mot de passe"
                />
                <span 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                  ) : (
                    <EyeClosedIcon className="fill-gray-500 dark:fill-gray-400" />
                  )}
                </span>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="col-span-1">
              <div className="relative">
                <Input
                  label="Confirmer le mot de passe"
                  required
                  {...register("confirmPassword")}
                  error={!!errors.confirmPassword}
                  hint={errors.confirmPassword?.message}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirmez le mot de passe"
                />
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {showConfirmPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                  ) : (
                    <EyeClosedIcon className="fill-gray-500 dark:fill-gray-400" />
                  )}
                </span>
              </div>
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