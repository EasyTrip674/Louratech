import { auth } from "@/lib/auth";
import { headers } from "next/headers";


export const getOrgnaizationId = async () => {
    const authUser = await auth.api.getSession({
      headers: await headers(),
    });
    return authUser?.userDetails?.organizationId ?? "";
  }
  