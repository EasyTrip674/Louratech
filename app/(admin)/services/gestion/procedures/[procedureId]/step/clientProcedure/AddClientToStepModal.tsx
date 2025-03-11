"use client"
import Button from '@/components/ui/button/Button'
import { Modal } from '@/components/ui/modal'
import { ClientIdWithNameDB } from '@/db/queries/clients.query'
import { useModal } from '@/hooks/useModal'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type Props = {
    procedureId: string,
    clientsDB: ClientIdWithNameDB
}

const addClientToProcedureSchema = z.object({
    clientId: z.string(),
    procedureId: z.string()
})
type addClientToProcedureSchema = z.infer<typeof addClientToProcedureSchema>

const AddClientToProcedureModal = ({procedureId, clientsDB}: Props) => {
    const {openModal,isOpen,closeModal,toggleModal} = useModal()
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<addClientToProcedureSchema>({
        resolver: zodResolver(addClientToProcedureSchema),
        defaultValues: {
            clientId: '',
            procedureId: procedureId
        }
    })

    const onSubmit = (data: addClientToProcedureSchema) => {
        console.log(data)
    }

    return (
        <>
        <Button onClick={openModal} size='sm' variant={"outline"}>
            <Plus className="h-5 w-5" />
        </Button>
        <Modal   isOpen={isOpen} onClose={closeModal} className='max-w-[584px] p-5 lg:p-10'>
            <form {...handleSubmit(onSubmit)} className="space-y-4">
                <div className="p-4">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Ajouter un client à la procédure</h2>
                    <div className="mt-4">
                        <label htmlFor="client" className="text-sm font-medium text-gray-700 dark:text-gray-300">Client</label>
                        <select 
                        {...register('clientId')}
                         className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm
                        dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                            {clientsDB.map(client => <option key={client.id} value={client.id}>{client.user.firstName} {client.user.lastName}</option>)}
                        </select>
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.clientId?.message}</p>
                    </div>
                </div>
                <div className="flex justify-end p-4 gap-3">
                    <Button onClick={closeModal} size="sm" variant="outline">Annuler</Button>
                    <Button type="submit" size="sm">Ajouter</Button>
                </div>
            </form>
        </Modal>
     </>
  )
}

export default AddClientToProcedureModal