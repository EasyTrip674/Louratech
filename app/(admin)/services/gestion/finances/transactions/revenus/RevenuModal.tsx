"use client"

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Button from '@/components/ui/button/Button'
import { z } from 'zod'
import { useModal } from '@/hooks/useModal'
import { Modal } from '@/components/ui/modal'
import { CreditCard, RefreshCw, X, ArrowUpCircle } from 'lucide-react'
import Select from '@/components/form/Select'
import Input from '@/components/form/input/InputField'
import { useMutation } from '@tanstack/react-query'
import SuccessModal from '@/components/alerts/SuccessModal'
import ErrorModal from '@/components/alerts/ErrorModal'
import { formatCurrency } from '@/lib/utils'
import { createRevenuSchema } from './revenu.shema'
import { doCreateRevenu } from './revenu.create.action'
import { authClient } from '@/lib/auth-client'


type CreateRevenuSchema = z.infer<typeof createRevenuSchema>

type Props = {
  className?: string,
}

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

const CreateRevenuModal = ({}: Props) => {  
  const { isOpen, closeModal, openModal } = useModal()
  const successModal = useModal()
  const errorModal = useModal()

  const session = authClient.useSession()


  const { 
    control,
    register, 
    handleSubmit, 
    formState: { errors, isDirty }, 
    reset,
    watch 
  } = useForm<CreateRevenuSchema>({
    resolver: zodResolver(createRevenuSchema),
    defaultValues: {
      title: '',
      description: '',
      amount: 0,
      paymentMethod: 'CASH',
      status: "APPROVED",
      invoiceNumber: '',
      invoiceDate: null,
      source: '',

    }
  })

  const currentAmount = watch('amount')

 

  const createRevenuMutation = useMutation({
    mutationFn: doCreateRevenu,
    onSuccess: () => {
      closeModal()
      reset()
      successModal.openModal()
    },
    onError: (error: Error) => {
      console.error("Failed to create Revenu:", error)
      closeModal()
      errorModal.openModal()
    },
  })
  
  const onSubmit = async (data: CreateRevenuSchema) => {
    try {
      await createRevenuMutation.mutateAsync(data)
    } catch (error) {
      console.error("Error creating Revenu:", error)
    }
  }

  if (!session.data?.userDetails?.authorize?.canCreateRevenue) {
    return null
  }


  return (
    <>
      <SuccessModal 
        successModal={successModal}
        message="Le revenue a été créée avec succès"
        title="revenue créé" 
      />
      
      <ErrorModal 
        errorModal={errorModal} 
        onRetry={openModal}
        message="Une erreur est survenue lors de la création de la revenue" 
      />

      <button
        onClick={openModal}
       className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 transition-colors dark:bg-green-700 dark:hover:bg-green-800">
        <ArrowUpCircle className="w-4 h-4 mr-2" />
        Créer un revenu
      </button>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[800px] p-5 lg:p-8 bg-white dark:bg-gray-900 rounded-xl shadow-xl"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Nouvelle revenue
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Veuillez remplir les informations de la revenue ci-dessous
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {Object.keys(errors).length > 0 && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
              <p className="text-sm font-medium text-red-800 dark:text-red-300 mb-2">
                Veuillez corriger les erreurs suivantes:
              </p>
              <ul className="list-disc list-inside text-sm text-red-600 dark:text-red-400">
                {Object.entries(errors).map(([field, error]) => (
                  <li key={field}>{error.message}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Titre */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Titre
            </label>
            <Input
              type="text"
              id="title"
              placeholder="Ex: Revente d'un produit X"
              aria-invalid={errors.title ? "true" : "false"}
              aria-describedby={errors.title ? "title-error" : undefined}
              {...register('title')}
            />
            {errors.title && (
              <p id="title-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title.message}</p>
            )}
          </div>

          {/* Description avec textarea */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description (optionnel)
            </label>
            <textarea
              id="description"
              placeholder="Entrez la description"
              aria-invalid={errors.description ? "true" : "false"}
              aria-describedby={errors.description ? "description-error" : undefined}
              {...register('description')}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
            {errors.description && (
              <p id="description-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
            )}
          </div>

          {/* Montant */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Montant
            </label>
            <div className="relative">
              <Input
                type="number"
                id="amount"
                placeholder="Entrez le montant"
                aria-invalid={errors.amount ? "true" : "false"}
                aria-describedby={errors.amount ? "amount-error" : undefined}
                {...register('amount', { 
                  valueAsNumber: true,
                  min: { value: 1, message: "Le montant doit être supérieur à 0" } 
                })}
              />
            </div>
            {errors.amount && (
              <p id="amount-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.amount.message}</p>
            )}
            {currentAmount > 0 && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {formatCurrency(currentAmount,session.data?.userDetails?.organization?.comptaSettings?.currency)}
              </p>
            )}
          </div>

          {/* Destination */}
          {/* met pour dire que les infos de destination sont iptionelle */}
          <p>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Informations sur la source (optionnel)
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 block">
              (ex: vente de tel ou tel service ..., etc.)
            </span>
          </p>
          <div>
            <label htmlFor="source" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Source (optionnel)
            </label>
            <Input
              type="text"
              id="source"
              placeholder="Ex : Client X"
              {...register('source')}
            />
          </div>

          {/* Numéro de facture */}
          <div>
            <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Numéro de facture
            </label>
            <Input
              type="text"
              id="invoiceNumber"
              placeholder="Numéro de facture Destination"
              {...register('invoiceNumber')}
            />
          </div>

          {/* Méthode de paiement */}
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

          {/* Statut */}
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
              disabled={createRevenuMutation.isPending}
              className="px-4"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={createRevenuMutation.isPending || !isDirty}
              className="px-4"
            >
              {createRevenuMutation.isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Création...
                </>
              ) : (
                'Créer la revenue'
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}

export default CreateRevenuModal