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
import {  Pencil } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import SuccessModal from "@/components/alerts/SuccessModal";
import ErrorModal from "@/components/alerts/ErrorModal";
import { editClientSchema } from "./client.edit.shema";
import { doEditClient } from "./client.edit.action";
import { clientProfileDB, clientsTableOrganizationDB } from "@/db/queries/clients.query";
import { useRouter } from "next/navigation";

// Zod validation schema

// Infer the TypeScript type from the Zod schema
type ClientFormData = z.infer<typeof editClientSchema>;

export default function EditClientFormModal({ client , inPageProfile=false }: { client: clientsTableOrganizationDB[0] | clientProfileDB , inPageProfile?: boolean }) {
  const { isOpen, openModal, closeModal } = useModal();
  const router = useRouter();
  const successModal = useModal();
  const errorModal = useModal();
  const [serverError] = React.useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ClientFormData>({
    resolver: zodResolver(editClientSchema),
    defaultValues: {
      id: client?.id,
      lastName: client?.user.lastName  ?? "" ,
      firstName: client?.user.firstName ?? "" ,
      phone: client?.phone ?? "" ,
      passport: client?.passport ?? "" ,
      address: client?.address ?? "" ,
      birthDate: (client?.birthDate) ?? "" ,
      fatherLastName: client?.fatherLastName ?? "" ,
      fatherFirstName: client?.fatherFirstName ?? "" ,
      motherLastName: client?.motherLastName ?? "" ,
      motherFirstName: client?.motherFirstName ?? "" ,
    },
  
  });

  // Watch form values in real-time
  // const watchedValues = watch();

  const EditMutation = useMutation({
    mutationFn: async (data: ClientFormData) => {
    const result = await doEditClient(data);
    if (result?.data?.success) {
      closeModal();
      reset();
      successModal.openModal();
      router.refresh();
    } else {
      closeModal();
      errorModal.openModal();
    }
  },
    onSuccess: () => {
      console.log("Client Editd successfully");
    },
    onError: () => {
      console.error("Failed to Edit client");
    },
    
  });

  const onSubmit = (data: ClientFormData) => {
    console.log("Saving client data:", data);
    // TODO: Save client data to the database
    // INFO: You can use the `data` object to send the form data to the server
    if (data) {
     EditMutation.mutate(data);
    }else{
      console.log("No data to save");
    }
  };

  return (
    <>
    <SuccessModal successModal={successModal}
               message='Client Editd successfully'
               title="" />
    <ErrorModal errorModal={errorModal} onRetry={openModal}
        message={serverError ? serverError:"Erreur"} />
    {inPageProfile ?   <button
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
          Modifier
        </button> : <Button variant="outline" size="sm" onClick={openModal}>
           <Pencil className="w-4 h-4 dark:text-white" />
       </Button> }
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[584px] p-5 lg:p-10">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">Modifier ce client</h4>
          
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 border-b border-gray-200 dark:border-gray-800 pb-6">
            {/* firstName */}
            <div className="col-span-1">
              <Label>Prenom</Label>
              <Input {...register("firstName")} error={!!errors.firstName} hint={errors.firstName?.message}  type="text" placeholder="Enter full name" />
            </div>
            {/* lastName */}
            <div className="col-span-1">
              <Label>Nom</Label>
              <Input {...register("lastName")} error={!!errors.lastName} hint={errors.lastName?.message}  type="text" placeholder="Enter full name" />
            </div>
          

            {/* Phone */}
            <div className="col-span-1">
              <Label>Phone</Label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <PhoneInput selectPosition="start" countries={countriesCode} placeholder="+1 (555) 000-0000" {...field} />
                )}
              />
            </div>

            {/* Passport */}
            <div className="col-span-1">
              <Label>Passport</Label>
              <Input {...register("passport")} type="text" placeholder="Enter passport number" />
            </div>

            {/* Address */}
            <div className="col-span-1 sm:col-span-2">
              <Label>Address</Label>
              <Input {...register("address")} type="text" placeholder="Enter full address" />
            </div>

            {/* Birth Date */}
            <div className="col-span-2">
              <Label>Birth Date</Label>
              <Input {...register("birthDate")} type="date" />
            </div>

            {/* Father's Information */}
            <div className="col-span-1">
              <Label>Prenom du pere</Label>
              <Input {...register("fatherFirstName")} type="text" placeholder="Enter father's first name" />
            </div>
            <div className="col-span-1">
              <Label>Nom du pere</Label>
              <Input {...register("fatherLastName")} type="text" placeholder="Enter father's last name" />
            </div>

            {/* Mother's Information */}
            <div className="col-span-1">
              <Label>Prenom de la mere</Label>
              <Input {...register("motherFirstName")} type="text" placeholder="Enter mother's first name" />
            </div>
            <div className="col-span-1">
              <Label>Nom de la mere</Label>
              <Input {...register("motherLastName")} type="text" placeholder="Enter mother's last name" />
            </div>
          </div>


        
          <div className="flex items-center justify-end w-full gap-3 mt-6">
            <Button type="button" size="sm" variant="outline" onClick={() => { closeModal(); reset(); }}>
              Annuler
            </Button>
            <Button type="submit" size="sm" disabled={EditMutation.isPending}>
              {EditMutation.isPending ? "En cours..." : "Editer"}
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