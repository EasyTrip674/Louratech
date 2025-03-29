import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins"
import { customSessionClient } from "better-auth/client/plugins";
import type { auth } from "@/lib/auth"; // Import the auth instance as a type
 
export const authClient = createAuthClient({
    /** the base url of the server (optional if you're using the same domain) */
    baseURL: "http://localhost:3000",
    plugins: [
        // add your plugins here
        organizationClient(),
        customSessionClient<typeof auth>()
    ],
})