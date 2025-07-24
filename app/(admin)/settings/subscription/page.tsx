// import { getOrgnaizationId } from "@/db/queries/utils.query";
// import SubscriptionDashboard from "./SubscriptionDasboard";

import { notFound } from "next/navigation";


export default async function page(){

  // const organisationId = await getOrgnaizationId();

  // if (!organisationId) {
  //   return null
  // }


  return notFound() 

  // return<>
   {/* <SubscriptionDashboard organizationId={organisationId} /> */}
  // </>
}

