"use client"
import Input from '@/components/form/input/InputField'
import SelectSearch from '@/components/form/SelectSearch'
import Button from '@/components/ui/button/Button'
import { Modal } from '@/components/ui/modal'
import { ClientIdWithNameDB } from '@/lib/services/client.service'  
type stepsProcedureDB = {
  steps: { id: string; name: string; price?: number }[]
};
import { useModal } from '@/hooks/useModal'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { addClientToStepSchema } from './client.add.to.step.scheme'
import { useMutation } from '@tanstack/react-query'
import { doAddClientToStep } from './client.add.to.step.action'
import SuccessModal from '@/components/alerts/SuccessModal'
import ErrorModal from '@/components/alerts/ErrorModal'
import { authClient } from '@/lib/auth-client'

type Props = {
    procedureId: string,
    clientsDB?: ClientIdWithNameDB,
    stepsProcedure?: stepsProcedureDB,
    baseClientId?: string,
    basesStepId?: string,
    stepBasePrice?: number,
    title?:string
}



type AddClientToStepSchema = z.infer<typeof addClientToStepSchema>

const AddClientToStepModal = ({ procedureId, clientsDB, stepsProcedure, baseClientId, basesStepId, stepBasePrice,title="Inscrire un nouveau client" }: Props) => {
    const { openModal, isOpen, closeModal } = useModal()
      const successModal = useModal();
      const errorModal = useModal();
    const session = authClient.useSession();
    
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
            clientId: baseClientId || '',
            procedureId: procedureId,
            stepId: basesStepId || '',
            price: stepBasePrice ?? 0
        }
    })
    
    const selectedClientId = watch('clientId')
    const selectedStepId = watch('stepId')
    
    // Transformer les données pour notre composant SelectSearch
    const clientOptions = clientsDB?.map(client => ({
        id: client.id,
        label: `${client.firstName} ${client.lastName}`
    })) ?? []
    
    const currentAmount = watch("price");

    const stepOptions = stepsProcedure?.steps.map((step: { id: string; name: string; price?: number }) => ({
        id: step.id ?? "",
        label: step.name ?? "",
        price: step.price ?? 0
    })) ?? []
    
    // Effet pour synchroniser les valeurs si props changent
    React.useEffect(() => {
        if (baseClientId) setValue('clientId', baseClientId, { shouldValidate: true })
        if (basesStepId) setValue('stepId', basesStepId, { shouldValidate: true })
        if (typeof stepBasePrice === 'number') setValue('price', stepBasePrice, { shouldValidate: true })
    }, [baseClientId, basesStepId, stepBasePrice, setValue])

    // Effet pour mettre à jour dynamiquement le prix lors du changement d'étape sélectionnée (si pas de stepBasePrice)
    React.useEffect(() => {
        if (!stepBasePrice && selectedStepId && stepsProcedure?.steps) {
            const selectedStep = stepsProcedure.steps.find(step => step.id === selectedStepId);
            if (selectedStep) {
                setValue('price', typeof selectedStep.price === 'number' ? selectedStep.price : 0, { shouldValidate: true });
            }
        }
    }, [selectedStepId, stepsProcedure, setValue, stepBasePrice]);


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

    // Vérification exclusive des props (dev only)
    if (process.env.NODE_ENV !== 'production') {
        if (baseClientId && clientsDB) {
            console.warn('AddClientToStepModal: Vous avez passé à la fois baseClientId et clientsDB. baseClientId sera prioritaire.');
        }
        if (basesStepId && stepsProcedure) {
            console.warn('AddClientToStepModal: Vous avez passé à la fois basesStepId et stepsProcedure. basesStepId sera prioritaire.');
        }
    }

    // Pour le select client/step, n'affiche que si l'id n'est pas fourni
    const showClientSelect = !baseClientId && clientsDB;
    const showStepSelect = !basesStepId && stepsProcedure;

    return (
        <>
            <SuccessModal successModal={successModal}
               message="Le client a été ajouté avec succès"
               title="" />
            <ErrorModal errorModal={errorModal} onRetry={openModal}
        message="Erreur lors de l'ajout du client" />
            <Button onClick={handleOpen} size='sm' variant="outline">
               {title} <Plus className="h-5 w-5" />
            </Button>
            <Modal isOpen={isOpen} onClose={closeModal} className='max-w-[584px] p-5 lg:p-10'>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="p-4">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Inscrire un client à un module</h2>
                        
                        {/* Étape */}
                        <div className="mt-6">
                            {basesStepId ? (
                                <input type="hidden" value={basesStepId} {...register('stepId')} />
                            ) : showStepSelect ? (
                                <SelectSearch
                                    options={stepOptions}
                                    label="Étape"
                                    required={true}
                                    placeholder="Rechercher une étape..."
                                    value={selectedStepId}
                                    onChange={handleSelectStep}
                                    emptyMessage="Aucune étape trouvée"
                                    error={errors.stepId?.message}
                                />
                            ) : null}
                            {/* Champ caché pour la validation */}
                            {!basesStepId && showStepSelect && <input type="hidden" {...register('stepId')} />}
                        </div>
                        
                        {/* Client */}
                        <div className="mt-6">
                            {baseClientId ? (
                                <input type="hidden" value={baseClientId} {...register('clientId')} />
                            ) : showClientSelect ? (
                                <SelectSearch
                                    options={clientOptions}
                                    label="Client"
                                    placeholder="Rechercher un client..."
                                    value={selectedClientId}
                                    onChange={handleSelectClient}
                                    emptyMessage="Aucun client trouvé"
                                    error={errors.clientId?.message}
                                    required={true}
                                />
                            ) : null}
                            {/* Champ caché pour la validation */}
                            {!baseClientId && showClientSelect && <input type="hidden" {...register('clientId')} />}
                        </div>
                        <div className='mt-6'>
                            
                            <Input
                                label="Le prix du module (en FNG) que le client doit payer"
                                required={true}
                                type="number"
                                id="price"
                                currentAmount={currentAmount}
                                isAmount={true}
                                currency={session?.data?.userDetails?.organization?.comptaSettings?.currency}                
                                {...register('price', { valueAsNumber: true })}
                                readOnly={typeof stepBasePrice === 'number'}
                            />
                            {errors.price && <p className="mt-2 text-sm text-red-600">{errors.price.message}</p>}
                        </div>
                    </div>
                    <div className="flex justify-end p-4 gap-3">
                        <Button onClick={closeModal} size="sm" variant="outline" type="button">Annuler</Button>
                        <Button disabled={addCLientToStepMutation.isPending} type="submit" size="sm" variant="primary">Inscrire</Button>
                    </div>
                </form>
            </Modal>
        </>
    )
}

export default AddClientToStepModal