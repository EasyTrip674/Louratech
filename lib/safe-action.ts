import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from "next-safe-action";
import { cookies } from "next/headers";
import { z } from "zod";

class ActionError extends Error {}

// Base client.
const actionClient = createSafeActionClient({
  handleServerError(e) {
    console.error("Action error:", e.message);

    if (e instanceof ActionError) {
      return e.message;
    }

    return DEFAULT_SERVER_ERROR_MESSAGE;
  },
  defineMetadataSchema() {
    return z.object({
      actionName: z.string(),
    });
  },
  // Define logging middleware.
}).use(async ({ next, clientInput, metadata }) => {
  console.log("LOGGING MIDDLEWARE");

  const startTime = performance.now();

  // Here we await the action execution.
  const result = await next();

  const endTime = performance.now();

  console.log("Result ->", result);
  console.log("Client input ->", clientInput);
  console.log("Metadata ->", metadata);
  console.log("Action execution took", endTime - startTime, "ms");

  // And then return the result of the awaited action.
  return result;
});

// Auth client defined by extending the base one.
// Note that the same initialization options and middleware functions of the base client
// will also be used for this one.
export const authActionClient = actionClient
  // Define authorization middleware.
  .use(async ({ next }) => {

    // Return the next middleware with `userId` value in the context
    return next({ ctx: { userId:null } });
  });


  export const superAdminAction = authActionClient
  // Define authorization middleware.
  .use(async ({ next }) => {



    // Return the next middleware with `userId` value in the context
    return next({ ctx: { userId:null } });
  });


  export const adminAction = authActionClient
  // Define authorization middleware.
  .use(async ({ next }) => {

    // Return the next middleware with `userId` value in the context
    return next({ ctx: { userId:null } });
  });