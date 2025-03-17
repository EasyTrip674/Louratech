"use server"

import { adminAction } from "@/lib/safe-action"
import prisma from "@/db/prisma";
import { StepStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { ChangeStatusSchema } from "./change.status.clientStep.sheme";



export const doChangeStepStatus = adminAction
  .metadata({ actionName: "change client step status" })
  .schema(ChangeStatusSchema)
  .action(async ({ clientInput:{clientStepId, status }}) => {
    console.log("Changing step status:", { clientStepId, status });

    const clientStep = await prisma.clientStep.findUnique({
      where: {
        id: clientStepId
      }
    });

    if (!clientStep) {
      throw new Error("Client step not found");
    }

    const updatedStep = await prisma.clientStep.update({
      where: {
        id: clientStepId
      },
      data: {
        status: status as StepStatus,
        ...(status === 'COMPLETED' ? { completionDate: new Date() } : {}),
        ...(status === 'IN_PROGRESS' && !clientStep.startDate ? { startDate: new Date() } : {})
      }
    });

    revalidatePath("/services/gestion/procedures/");

    return { success: true, step: updatedStep };
  });
