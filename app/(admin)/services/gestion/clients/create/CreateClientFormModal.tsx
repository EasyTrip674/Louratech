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
import { PlusIcon } from "@/icons";
import { countriesCode } from "@/lib/countries";
import { Plus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import {  createClientSchema } from "./client.create.shema";
import { doCreateClient } from "./client.create.action";

// Zod validation schema

// Infer the TypeScript type from the Zod schema
type ClientFormData = z.infer<typeof createClientSchema>;

export default function CreateClientFormModal() {
  const { isOpen, openModal, closeModal } = useModal();

  

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ClientFormData>({
    resolver: zodResolver(createClientSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      passport: "",
      address: "",
      birthDate: "",
      fatherLastName: "",
      fatherFirstName: "",
      motherLastName: "",
      motherFirstName: "",
    },
  });

  // Watch form values in real-time
  // const watchedValues = watch();

  const createMutation = useMutation({
    mutationFn: async (data: ClientFormData) => {
    await doCreateClient(data);
  },
    onSuccess: () => {
      closeModal();
      reset();
    },
  });

  const onSubmit = (data: ClientFormData) => {
    console.log("Saving client data:", data);
    // TODO: Save client data to the database
    // INFO: You can use the `data` object to send the form data to the server
    

    // INFO: Close the modal and reset the form
    // closeModal();
    // reset(); // Reset form after submission
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={openModal} className="bg-gray-200">
        <Plus className="w-4 h-4 dark:text-white" />
      </Button>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[584px] p-5 lg:p-10">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">Ajouter un nouveau client</h4>
          
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            {/* Name */}
            <div className="col-span-1">
              <Label>Full Name</Label>
              <Input {...register("name")} error={!!errors.name} hint={errors.name?.message}  type="text" placeholder="Enter full name" />
            </div>

            {/* Email */}
            <div className="col-span-1">
              <Label>Email</Label>
              <Input {...register("email")} error={!!errors.email} hint={errors.email?.message} type="email" placeholder="Enter email address" />
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
            <div className="col-span-1">
              <Label>Birth Date</Label>
              <Input {...register("birthDate")} type="date" />
            </div>

            {/* Father's Information */}
            <div className="col-span-1">
              <Label>Father's First Name</Label>
              <Input {...register("fatherFirstName")} type="text" placeholder="Enter father's first name" />
            </div>
            <div className="col-span-1">
              <Label>Father's Last Name</Label>
              <Input {...register("fatherLastName")} type="text" placeholder="Enter father's last name" />
            </div>

            {/* Mother's Information */}
            <div className="col-span-1">
              <Label>Mother's First Name</Label>
              <Input {...register("motherFirstName")} type="text" placeholder="Enter mother's first name" />
            </div>
            <div className="col-span-1">
              <Label>Mother's Last Name</Label>
              <Input {...register("motherLastName")} type="text" placeholder="Enter mother's last name" />
            </div>
          </div>

          <div className="flex items-center justify-end w-full gap-3 mt-6">
            <Button type="button" size="sm" variant="outline" onClick={() => { closeModal(); reset(); }}>
              Annuler
            </Button>
            <Button type="submit" size="sm">Creer</Button>
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