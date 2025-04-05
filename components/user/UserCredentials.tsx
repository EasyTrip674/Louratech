"use client";

import { useModal } from "@/hooks/useModal";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { PasswordFormData, passwordSchema } from "./user.password.shema";
import { useMutation } from "@tanstack/react-query";
import { doChangePassword } from "./user.password.change.action";
import { useRouter } from "next/navigation";
import SuccessModal from "../alerts/SuccessModal";
import ErrorModal from "../alerts/ErrorModal";
import { Role } from "@prisma/client";


interface UserCredentialsManageProps {
  userId: string;
  email: string;
  active?: boolean;
  role: Role;
}

export default function UserCredentialsManage({ userId, email, active = true ,role=Role.CLIENT }: UserCredentialsManageProps) {
  const { isOpen, openModal, closeModal } = useModal();
    const successModal = useModal();
    const errorModal = useModal();
      const router = useRouter();
    
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      userId,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const changePasswordMutation = useMutation({  
      mutationFn: async (data: PasswordFormData) => {
        const result = await doChangePassword(data);
       if (result?.data?.success) {
      closeModal();
      reset();
      successModal.openModal();
      router.refresh();
    } else {
      console.log("error", result?.serverError);
      
      closeModal();
      errorModal.openModal();
    }
      },
      onSuccess: () => {
        closeModal();
      },
   
  });

  const onSubmit: SubmitHandler<PasswordFormData> = (data) => {
    changePasswordMutation.mutate(data);
  };

  return (
    <>
      <SuccessModal successModal={successModal}
               message="Utilisateur modifié avec succès"
               title="" />
          <ErrorModal errorModal={errorModal} onRetry={openModal}
        message="Le mot de passe n'est pas correct !" />
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Paramètres de connexion
            </h4>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Email</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">{email}</p>
              </div>
              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Dernier changement de mot de passe</p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">5 mars 2024</p>
              </div>
              <div>
                <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">Statut du compte</p>
                <p className={`text-sm font-medium ${active ? "text-green-600" : "text-red-600"}`}>
                  {active ? "Actif" : "Inactif"}
                </p>
              </div>
            </div>
          </div>
          <button
          onClick={openModal}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
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
         Changer le mot de passe
        </button> 
        </div>
      </div>

      <Modal className="max-w-[584px] p-5 lg:p-10" isOpen={isOpen} onClose={closeModal}>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">Changer le mot de passe</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Mot de passe actuel</Label>
              <Input type="password" {...register("currentPassword")} placeholder="Entrez votre mot de passe actuel" />
              {errors.currentPassword && <p className="text-red-500 text-sm">{errors.currentPassword.message}</p>}
            </div>
            <div>
              <Label>Nouveau mot de passe</Label>
              <Input type="password" {...register("newPassword")} placeholder="Entrez votre nouveau mot de passe" />
              {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword.message}</p>}
            </div>
            <div>
              <Label>Confirmer le nouveau mot de passe</Label>
              <Input type="password" {...register("confirmPassword")} placeholder="Confirmez votre nouveau mot de passe" />
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
            </div>
            <div className="flex justify-end mt-6 space-x-2">
              <Button variant="outline" onClick={closeModal} type="button">Annuler</Button>
              <Button type="submit">Changer le mot de passe</Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
