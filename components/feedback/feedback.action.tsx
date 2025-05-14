"use server";

import prisma from "@/db/prisma";
import { action } from "@/lib/safe-action";
import { feedbackSchema } from "./feedback.shema";

export const doAddFeedback = action
        .metadata({ actionName: "feedback" }) // ✅ Ajout des métadonnées obligatoires.
        .schema(
           feedbackSchema
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
                    subtype: clientInput.subtype,
                    rating: clientInput.rating,
                    satisfaction: clientInput.satisfaction,
                    impact: clientInput.impact,
                },
            });
            return { success: true , feedback };
});




