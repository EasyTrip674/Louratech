import { z } from "zod";

export const createExpenseSchema = z.object({
    title: z.string().min(1, "Le titre est requis"),
    description: z.string().optional(),
    amount: z.number().min(1, "Le montant doit être supérieur à 0"),
    paymentMethod: z.enum(['CASH', 'BANK_TRANSFER', 'CREDIT_CARD', 'CHECK', 'MOBILE_PAYMENT']),
    status: z.enum(['PENDING', 'APPROVED']),
    vendor: z.string().optional(),
    invoiceNumber: z.string().optional(),
    invoiceDate: z.date().optional().nullable(),
    dueDate: z.date().optional().nullable(),
  })
  