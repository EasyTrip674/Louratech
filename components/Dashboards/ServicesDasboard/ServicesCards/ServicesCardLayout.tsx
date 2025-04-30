import { getProcedureWithStats } from "@/db/queries/procedures.query";
import { notFound } from "next/navigation";
import ServicesCard from "./ServicesCard";

export default async function ServicesCardLayout(
) {

const procedureData = await getProcedureWithStats();
    if (!procedureData) {
      return notFound()
    }
  
  return (
   <>
   <ServicesCard procedureData={procedureData} />
   </>
  );
}