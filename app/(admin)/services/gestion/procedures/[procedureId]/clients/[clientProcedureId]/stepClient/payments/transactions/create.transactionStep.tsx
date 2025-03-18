"use server";

import { adminAction } from "@/lib/safe-action"

import prisma from "@/db/prisma";

import { revalidatePath } from "next/cache";
import { createTransactionSchema } from "./transaction.schema";

export const doCreateTransaction = adminAction
    .metadata({actionName:"create Procedure"}) // ✅ Ajout des métadonnées obligatoires
    .schema(createTransactionSchema)
    .action(async ({ clientInput }) => {
        console.log("Creating Procedure with data:", clientInput);

       
        revalidatePath("/app/(admin)/services/gestion/Procedures");
        
        return { success: true };
    });