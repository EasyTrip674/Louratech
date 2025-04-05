"use client"

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { doCreateTransaction } from './step.transaction.action'
import { createTransactionSchema } from './transaction.schema'
import Button from '@/components/ui/button/Button'
import { z } from 'zod'
import { useModal } from '@/hooks/useModal'
import { Modal } from '@/components/ui/modal'
import { Plus, AlertCircle, CreditCard, RefreshCw, X } from 'lucide-react'
import Select from '@/components/form/Select'
import Input from '@/components/form/input/InputField'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import SuccessModal from '@/components/alerts/SuccessModal'
import ErrorModal from '@/components/alerts/ErrorModal'
import { useEffect } from 'react'
import { formatCurrency } from '@/lib/utils'

type Props = {
  clientStepId: string,
  haveToPay?: number,
  className?: string,
}

type CreateTransactionSchema = z.infer<typeof createTransactionSchema>

const PAYMENT_METHODS = [
  { value: 'CASH', label: 'Espèces', icon: <CreditCard className="h-4 w-4" /> },
  { value: 'BANK_TRANSFER', label: 'Virement bancaire', icon: <CreditCard className="h-4 w-4" /> },
  { value: 'CREDIT_CARD', label: 'Carte bancaire', icon: <CreditCard className="h-4 w-4" /> },
  { value: 'CHECK', label: 'Chèque', icon: <CreditCard className="h-4 w-4" /> },
  { value: 'MOBILE_PAYMENT', label: 'Paiement mobile', icon: <CreditCard className="h-4 w-4" /> },
]

const PAYMENT_STATUSES = [
  { value: 'PENDING', label: 'En attente' },
  { value: 'APPROVED', label: 'Reçu' },
]

const CreateTransactionModalStep = ({
  clientStepId,
  haveToPay = 0,
  className = "",
}: Props) => {  
  const { isOpen, closeModal, openModal } = useModal()
  const successModal = useModal()
  const errorModal = useModal()
  const queryClient = useQueryClient()

  const { 
    control,
    register, 
    handleSubmit, 
    formState: { errors,  isDirty }, 
    reset, 
    setValue,
    watch 
  } = useForm<CreateTransactionSchema>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      clientStepId: clientStepId,
      amount: 0,
      paymentMethod: 'CASH',
      status: 'PENDING',
    }
  })

  const currentAmount = watch('amount')

  // Reset form when modal opens with fresh values
  useEffect(() => {
    if (isOpen) {
      reset({
        clientStepId: clientStepId,
        amount: 0,
        paymentMethod: 'CASH',
        status: 'PENDING',
      })
    }
  }, [isOpen, clientStepId, reset])

  // Handle escape key to close modal
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        closeModal()
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => {
      window.removeEventListener('keydown', handleEsc)
    }
  }, [isOpen, closeModal])

  const createTransactionMutation = useMutation({
    mutationFn: async (data: CreateTransactionSchema) => {
      const result = await doCreateTransaction(data)
      if (result?.data?.success) {
        closeModal()
        reset()
        successModal.openModal()
        // Invalidate related queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['transactions', clientStepId] })
        queryClient.invalidateQueries({ queryKey: ['clientSteps'] })
        return result.data
      } else {
        throw new Error(result?.serverError || "Failed to create transaction")
      }
    },
    onError: (error: Error) => {
      console.error("Failed to create transaction:", error)
      closeModal()
      errorModal.openModal()
    },
  })
  
  const onSubmit = async (data: CreateTransactionSchema) => {
    try {
      await createTransactionMutation.mutate(data)
    } catch (error) {
      console.error("Error creating transaction:", error)
    }
  }

  const handleSetMaxAmount = () => {
    if (haveToPay > 0) {
      setValue('amount', haveToPay, { shouldDirty: true, shouldValidate: true })
    }
  }
  
  return (
    <>
      <SuccessModal 
        successModal={successModal}
        message="Le paiement a été créé avec succès"
        title="Paiement créé" 
      />
      
      <ErrorModal 
        errorModal={errorModal} 
        onRetry={openModal}
        message="Une erreur est survenue lors de la création du paiement" 
      />

      <Button
        variant="primary"
        onClick={openModal}
        className={`flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200 ${className}`}
        aria-label="Ajouter un nouveau paiement"
      >
        <Plus className="h-4 w-4" />
        Ajouter un paiement
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[800px] p-5 lg:p-8 bg-white dark:bg-gray-900 rounded-xl shadow-xl"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Nouveau paiement
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Veuillez remplir les informations du paiement ci-dessous
            </p>
          </div>
          <button 
            onClick={closeModal}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Fermer"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {haveToPay > 0 && (
          <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
            <p className="text-sm flex items-center text-blue-800 dark:text-blue-300">
              <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
              Montant restant à payer: <span className="font-medium ml-1">{formatCurrency(haveToPay)}</span>
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {Object.keys(errors).length > 0 && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
              <p className="text-sm font-medium text-red-800 dark:text-red-300 mb-2">
                Veuillez corriger les erreurs suivantes:
              </p>
              <ul className="list-disc list-inside text-sm text-red-600 dark:text-red-400">
                {Object.entries(errors).map(([field, error]) => (
                  <div key={field}>
                    <li className="mb-1">{field}</li>
                    <li >{error.message}</li>
                  </div>
                ))}
              </ul>
            </div>
          )}
          
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Montant
            </label>
            <div className="relative">
              <Input
                type="number"
                step="100"
                id="amount"
                placeholder="Entrez le montant"
                aria-invalid={errors.amount ? "true" : "false"}
                aria-describedby={errors.amount ? "amount-error" : undefined}
                {...register('amount', { 
                  valueAsNumber: true,
                  min: { value: 1, message: "Le montant doit être supérieur à 0" } 
                })}
              />
              {haveToPay > 0 && (
                <button
                  type="button"
                  onClick={handleSetMaxAmount}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
                >
                  Montant total
                </button>
              )}
            </div>
            {errors.amount && (
              <p id="amount-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.amount.message}</p>
            )}
            {currentAmount > 0 && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {formatCurrency(currentAmount)}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Méthode de paiement
            </label>
            <Controller
              name="paymentMethod"
              control={control}
              render={({ field }) => (
                <Select
                  id="paymentMethod"
                  value={field.value}
                  onChange={field.onChange}
                  options={PAYMENT_METHODS}
                  aria-invalid={errors.paymentMethod ? "true" : "false"}
                  aria-describedby={errors.paymentMethod ? "payment-method-error" : undefined}
                />
              )}
            />
            {errors.paymentMethod && (
              <p id="payment-method-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.paymentMethod.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Statut
            </label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  id="status"
                  value={field.value}
                  onChange={field.onChange}
                  options={PAYMENT_STATUSES}
                  aria-invalid={errors.status ? "true" : "false"}
                  aria-describedby={errors.status ? "status-error" : undefined}
                />
              )}
            />
            {errors.status && (
              <p id="status-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.status.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={closeModal}
              disabled={createTransactionMutation.isPending}
              className="px-4"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={createTransactionMutation.isPending || !isDirty}
              className="px-4"
            >
              {createTransactionMutation.isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Création...
                </>
              ) : (
                'Créer le paiement'
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}

export default CreateTransactionModalStep