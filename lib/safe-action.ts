import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";


class ActionError extends Error {}


// ✅ Définition du client de base avec un schéma de métadonnées valide

export const action = createSafeActionClient({
  handleServerError(e) {
    console.error("Action error:", e.message);

    if (e instanceof ActionError) {
      return e.message;
    }

    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
  defineMetadataSchema: () => 
    z.object({
      actionName: z.string(),
    }),
})

export const actionClient = action
// ✅ Middleware de logging
.use(async ({ next, clientInput, metadata }) => {
  console.log("LOGGING MIDDLEWARE");

  const startTime = performance.now();
  const result = await next();
  const endTime = performance.now();

  console.log("Result ->", result);
  console.log("Client input ->", clientInput);
  console.log("Metadata ->", metadata);
  console.log("Action execution took", endTime - startTime, "ms");

  return next({ ...result });
});

// ✅ Client d'authentification basé sur `actionClient`
export const authActionClient = actionClient
  .use(async ({ next,metadata }) => {

    if (!metadata?.actionName) {
      throw new ActionError("l'action n'as pas de nom");
    }

    const user = await auth.api.getSession({
      headers: await headers() //some endpoint might require headers
    })
    if (!user) {
      throw new ActionError("Vous n'êtes pas connecté");
    }


    return next({ ctx: { user } });
  });

// ✅ Client pour les super-admins
export const superAdminAction = authActionClient
  .use(async ({ next }) => {

    return next({ ctx: { user: null } });
  });

// ✅ Client pour les admins avec validation de `metadata`
export const adminAction = authActionClient
  .use(async ({ next,ctx}) => {
    // Vérification que `metadata` est bien défini avant d'exécuter l'action
    return next({ ctx, });
  });
