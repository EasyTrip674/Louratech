"use client"

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { doCreateTransaction } from './create.transactionStep'
import { createTransactionSchema } from './transaction.schema'
import Button from '@/components/ui/button/Button'
import { z } from 'zod'
import { useModal } from '@/hooks/useModal'
import { Modal } from '@/components/ui/modal'


type Props = {
  clientStepId: string,
  procedureId: string,
}

type CreateTransactionSchema = z.infer<typeof createTransactionSchema>

const CreateTransactionModalStep = ({
  clientStepId
}: Props) => {  
  const { isOpen, closeModal,openModal } = useModal()
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateTransactionSchema>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      amount: 0,
      paymentMethod: 'CASH',
      status: 'PAID',
    }
  })
  
  const onSubmit = async (data: CreateTransactionSchema) => {
    try {
      const result = await doCreateTransaction(data)
      if (result?.data?.success) {
        reset()
        closeModal()
      }
    } catch (error) {
      console.error(error)
    }
  }
  
  return (
  <>
  <Button
    variant="primary"
    onClick={openModal}
  >
    Ajouter un paiement
  </Button>
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
        className="max-w-[800px] p-5 lg:p-8"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Montant</label>
            <input
              type="number"
              id="amount"
              {...register('amount')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
              dark:bg-gray-800 dark:text-white"
            />
            {errors.amount && <span className="text-red-500 text-sm">{errors.amount.message}</span>}
          </div>
          <div>
            <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Méthode de paiement</label>
            <select
              id="paymentMethod"
              {...register('paymentMethod')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
              dark:bg-gray-800 dark:text-white"
            >
              <option value="CASH">Espèces</option>
              <option value="BANK_TRANSFER">Virement bancaire</option>
              <option value="CREDIT_CARD">Carte bancaire</option>
              <option value="CHECK">Chèque</option>
              <option value="MOBILE_PAYMENT">Paiement mobile</option>
            </select>
            {errors.paymentMethod && <span className="text-red-500 text-sm">{errors.paymentMethod.message}</span>}
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Statut</label>
            <select
              id="status"
              {...register('status')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
              dark:bg-gray-800 dark:text-white"
            >
              <option value="PENDING">En attente</option>
              <option value="APPROVED">Approuvé</option>
              <option value="REJECTED">Rejeté</option>
            </select>
            {errors.status && <span className="text-red-500 text-sm">{errors.status.message}</span>}
          </div>

       

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={closeModal}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
            >
              Créer le paiement
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  </>
    )
}

export default CreateTransactionModalStep