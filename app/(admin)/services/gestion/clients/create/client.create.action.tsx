"use server"

import { adminAction } from "@/lib/safe-action"
import { createClientSchema } from "./client.create.shema"

export const doCreateClient = adminAction
    .schema(createClientSchema)
    .action(async ({ ctx }) => {
    console.log("Creating client with data:", ctx)
    // TODO: Save client data to the database
    return { success: true }
    }
)