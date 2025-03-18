"use client"
import Input from '@/components/form/input/InputField'
import SelectSearch from '@/components/form/SelectSearch'
import Button from '@/components/ui/button/Button'
import { Modal } from '@/components/ui/modal'
import { ClientIdWithNameDB } from '@/db/queries/clients.query'
import { StepsProcedureDB } from '@/db/queries/procedures.query'
import { useModal } from '@/hooks/useModal'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { addClientToStepSchema } from './client.add.to.step.scheme'
import { useMutation } from '@tanstack/react-query'
import { doAddClientToStep } from './client.add.to.step.action'
import SuccessModal from '@/components/alerts/SuccessModal'
import ErrorModal from '@/components/alerts/ErrorModal'

type Props = {
    procedureId: string,
    clientsDB: ClientIdWithNameDB,
    stepsProcedure: StepsProcedureDB
}



type AddClientToStepSchema = z.infer<typeof addClientToStepSchema>

const AddClientToStepModal = ({ procedureId, clientsDB, stepsProcedure }: Props) => {
    const { openModal, isOpen, closeModal } = useModal()
      const successModal = useModal();
      const errorModal = useModal();
    
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch
    } = useForm<AddClientToStepSchema>({
        resolver: zodResolver(addClientToStepSchema
        ),
        defaultValues: {
            clientId: '',
            procedureId: procedureId,
            stepId: '',
            price: 0
        }
    })
    
    const selectedClientId = watch('clientId')
    const selectedStepId = watch('stepId')
    
    // Transformer les données pour notre composant SelectSearch
    const clientOptions = clientsDB.map(client => ({
        id: client.id,
        label: `${client.user.firstName} ${client.user.lastName}`
    }))
    
    const stepOptions = stepsProcedure?.steps.map(step => ({
        id: step.id ?? "",
        label: step.name ?? "",
        price: step.price ?? 0
    }))
    
    // Effet pour mettre à jour le prix lorsqu'une étape est sélectionnée
    useEffect(() => {
        if (selectedStepId) {
            const selectedStep = stepsProcedure?.steps.find(step => step.id === selectedStepId)
            if (selectedStep) {
                setValue('price', selectedStep.price ?? 0, { shouldValidate: true })
            }
        }
    }, [selectedStepId, stepsProcedure?.steps, setValue])


  const addCLientToStepMutation = useMutation({
    mutationFn: async (data: AddClientToStepSchema) => {
    const result = await doAddClientToStep(data);
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
      console.log("Stepp created successfully");
    },
    onError: () => {
      console.error("Failed to add step in client");
    },
    
  });

    
    const onSubmit = async (data: AddClientToStepSchema) => {
        try {
            console.log(data)
            addCLientToStepMutation.mutate(data);
        } catch (error) {
            console.error("Erreur lors de l'inscription du client:", error)
        }
    }
    
    const handleOpen = () => {
        reset()
        openModal()
    }
    
    const handleSelectClient = (id: string) => {
        setValue('clientId', id, { shouldValidate: true })
    }
    
    const handleSelectStep = (id: string) => {
        setValue('stepId', id, { shouldValidate: true })
    }

    return (
        <>
            <SuccessModal successModal={successModal}
               message="CLient added successfully"
               title="" />
            <ErrorModal errorModal={errorModal} onRetry={openModal}
        message="Error during adding client to module" />
            <Button onClick={handleOpen} size='sm' variant="outline">
                <Plus className="h-5 w-5" />
            </Button>
            <Modal isOpen={isOpen} onClose={closeModal} className='max-w-[584px] p-5 lg:p-10'>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="p-4">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Inscrire un client à un module</h2>
                        
                        {/* Utilisation de notre composant SelectSearch pour les étapes */}
                        <div className="mt-6">
                            <SelectSearch
                                options={stepOptions}
                                label="Étape"
                                placeholder="Rechercher une étape..."
                                value={selectedStepId}
                                onChange={handleSelectStep}
                                emptyMessage="Aucune étape trouvée"
                                error={errors.stepId?.message}
                            />
                            {/* Champ caché pour la validation */}
                            <input type="hidden" {...register('stepId')} />
                        </div>
                        
                        {/* Utilisation de notre composant SelectSearch pour les clients */}
                        <div className="mt-6">
                            <SelectSearch
                                options={clientOptions}
                                label="Client"
                                placeholder="Rechercher un client..."
                                value={selectedClientId}
                                onChange={handleSelectClient}
                                emptyMessage="Aucun client trouvé"
                                error={errors.clientId?.message}
                            />
                            {/* Champ caché pour la validation */}
                            <input type="hidden" {...register('clientId')} />
                        </div>
                        <div className='mt-6'>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                Le prix du module (en FNG) que le client doit payer
                            </label>
                            <Input
                                type="number"
                                id="price"
                                {...register('price', { valueAsNumber: true })}
                            />
                            {errors.price && <p className="mt-2 text-sm text-red-600">{errors.price.message}</p>}
                        </div>
                    </div>
                    
                    <div className="flex justify-end p-4 gap-3">
                        <Button onClick={closeModal} size="sm" variant="outline" type="button">Annuler</Button>
                        <Button disabled={addCLientToStepMutation.isPending} type="submit" size="sm">Inscrire</Button>
                    </div>
                </form>
            </Modal>
        </>
    )
}

export default AddClientToStepModal