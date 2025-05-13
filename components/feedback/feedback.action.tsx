"use server";

import prisma from "@/db/prisma";
import { action } from "@/lib/safe-action";
import { z } from "zod";

export const doAddFeedback = action
        .metadata({ actionName: "feedback" }) // ✅ Ajout des métadonnées obligatoires.
        .schema(
            z.object({
                message: z.string().min(1, "Message is required"),
                type: z.enum(["BUG", "SUGGESTION", "QUESTION", "OTHER"]),
                name: z.string().optional(),
                email: z.string().optional(),
                isAnonymous: z.boolean(),
            })
        )
        .action(async ({ clientInput }) => {
            console.log("Submitting feedback with data:", clientInput);  
            
            const feedback = await prisma.feedback.create({
                data: {
                    message: clientInput.message,
                    type: clientInput.type,
                    name: clientInput.isAnonymous ? undefined : clientInput.name,
                    email: clientInput.isAnonymous ? undefined : clientInput.email,
                    isAnonymous: clientInput.isAnonymous,
                },
            });
            return { success: true, feedback };
});