"use client";
import React, {  } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useModal } from "@/hooks/useModal";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import PhoneInput from "@/components/form/group-input/PhoneInput";
// import {  EyeIcon, EyeCloseIcon } from "@/icons";
import { countriesCode } from "@/lib/countries";
import { Plus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { createClientSchema } from "./client.create.shema";
import { doCreateClient } from "./client.create.action";
import SuccessModal from "@/components/alerts/SuccessModal";
import ErrorModal from "@/components/alerts/ErrorModal";
import Label from "@/components/form/Label";

// Infer le type TypeScript du schéma Zod
type ClientFormData = z.infer<typeof createClientSchema>;

export default function CreateClientFormModal() {
  const { isOpen, openModal, closeModal } = useModal();
  const successModal = useModal();
  const errorModal = useModal();
  // const [showPassword, setShowPassword] = useState(false);
  // const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ClientFormData>({
    resolver: zodResolver(createClientSchema),
    defaultValues: {
      lastName: "",
      firstName: "",
      email: "",
      phone: "",
      passport: "",
      address: "",
      fatherLastName: "",
      fatherFirstName: "",
      motherLastName: "",
      motherFirstName: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: ClientFormData) => {
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
      console.log("Client créé avec succès");
    },
    onError: () => {
      console.error("Échec de création du client");
    },
  });

  const onSubmit = (data: ClientFormData) => {
    console.log("Enregistrement des données client:", data);
    if (data) {
      createMutation.mutate(data);
    } else {
      console.log("Aucune donnée à enregistrer");
    }
  };

  return (
    <>
      <SuccessModal 
        successModal={successModal}
        message="Client créé avec succès"
        title="" 
      />
      <ErrorModal 
        errorModal={errorModal} 
        onRetry={openModal}
        message="Erreur lors de la création du client : l'émail existe déjà" 
      />
      <Button variant="outline" size="sm" onClick={openModal} className="bg-gray-200">
        <Plus className="w-4 h-4 dark:text-white" /> Creer un client
      </Button>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[584px] p-5 lg:p-10">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">Ajouter un nouveau client</h4>
          
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 border-b border-gray-200 dark:border-gray-800 pb-6">
            {/* Prénom */}
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
            {/* Nom */}
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
          
            {/* Téléphone */}
            <div className="col-span-1">
              <Label>Téléphone</Label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <PhoneInput selectPosition="start" countries={countriesCode} placeholder="+33 (0) 600-0000" {...field} />
                )}
              />
            </div>

            {/* Passeport */}
            <div className="col-span-1">
              <Input 
                label="Passeport"
                {...register("passport")} 
                error={!!errors.passport} 
                hint={errors.passport?.message} 
                type="text" 
                placeholder="Entrez le numéro de passeport" 
              />
            </div>

            {/* Adresse */}
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

            {/* Date de naissance */}
            <div className="col-span-2">
              <Input 
                label="Date de naissance"
                {...register("birthDate")} 
                error={!!errors.birthDate} 
                hint={errors.birthDate?.message} 
                type="date" 
              />
            </div>

            {/* Informations du père */}
            <div className="col-span-1">
              <Input 
                label="Prénom du père"
                {...register("fatherFirstName")} 
                error={!!errors.fatherFirstName} 
                hint={errors.fatherFirstName?.message} 
                type="text" 
                placeholder="Entrez le prénom du père" 
              />
            </div>
            <div className="col-span-1">
                <Input 
                label="Nom du père"
                {...register("fatherLastName")} 
                error={!!errors.fatherLastName} 
                hint={errors.fatherLastName?.message} 
                type="text" 
                placeholder="Entrez le nom du père" 
              />
            </div>

            {/* Informations de la mère */}
            <div className="col-span-1">
              <Input 
                label="Prénom de la mère"
                {...register("motherFirstName")} 
                error={!!errors.motherFirstName} 
                hint={errors.motherFirstName?.message} 
                type="text" 
                placeholder="Entrez le prénom de la mère" 
              />
            </div>
            <div className="col-span-1">
              <Input 
                label="Nom de la mère"
                {...register("motherLastName")} 
                error={!!errors.motherLastName} 
                hint={errors.motherLastName?.message} 
                type="text" 
                placeholder="Entrez le nom de la mère" 
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
            
            {/* Mot de passe */}
            {/* <div className="col-span-1">
              <Input 
                label="Mot de passe"
                {...register("password")} 
                error={!!errors.password} 
                hint={errors.password?.message} 
                type={showPassword ? "text" : "password"} 
                placeholder="Entrez le mot de passe" 
              />
            </div>
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
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                  )}
                </span>
              </div>
            </div> */}

            {/* Confirmer le mot de passe */}
            {/* <div className="col-span-1">
              <Label>Confirmer le mot de passe</Label>
              <div className="relative">
                <Input 
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
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                  )}
                </span>
              </div>
            </div> */}
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