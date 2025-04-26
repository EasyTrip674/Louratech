"use server"
import { adminAction } from "@/lib/safe-action"
import prisma from "@/db/prisma";
import { StepStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { ChangeStatusSchema } from "./change.status.clientStep.sheme";

export const doChangeStepStatus = adminAction
  .metadata({ actionName: "change client step status" })
  .schema(ChangeStatusSchema)
  .action(async ({ clientInput: { clientStepId, status } }) => {
    console.log("Changing step status:", { clientStepId, status });
    
    return await prisma.$transaction(async (tx) => {
      const clientStep = await tx.clientStep.findUnique({
        where: {
          id: clientStepId
        }
      });

      if (!clientStep) {
        throw new Error("Client step not found");
      }

      const updatedStep = await tx.clientStep.update({
        where: {
          id: clientStepId
        },
        data: {
          status: status as StepStatus,
          ...(status === 'COMPLETED' ? { completionDate: new Date() } : {}),
          ...(status === 'IN_PROGRESS' && !clientStep.startDate ? { startDate: new Date() } : {})
        }
      });

      // vérifie si tous les steps sont completed
      const notCompletedSteps = await tx.clientStep.findMany({
        where: {
          clientProcedureId: updatedStep.clientProcedureId,
          status: {
            not: 'COMPLETED'
          }
        },
        select: {
          id: true
        }
      });

      const canceledSteps = await tx.clientStep.findMany({
        where: {
          clientProcedureId: updatedStep.clientProcedureId,
          status: "FAILED"
        },
        select: {
          id: true
        }
      });



      if(canceledSteps.length > 0){
        await tx.clientProcedure.update({
          where: {
            id: updatedStep.clientProcedureId
          },
          data: {
            status: 'FAILED',
          }
        });
      }else if (notCompletedSteps.length === 0) {
        await tx.clientProcedure.update({
          where: {
            id: updatedStep.clientProcedureId
          },
          data: {
            status: 'COMPLETED',
            completionDate: new Date()
          }
        });
      } else {
        await tx.clientProcedure.update({
          where: {
            id: updatedStep.clientProcedureId
          },
          data: {
            status: 'IN_PROGRESS'
          }
        });
      }

      revalidatePath("/services/gestion/procedures/");
      return { success: true, step: updatedStep };
    });
  });