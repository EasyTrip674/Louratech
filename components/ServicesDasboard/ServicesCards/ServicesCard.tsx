import { ProcedureCard } from "@/components/procedures/ProcedureCard";
import { gProcedureWithStat } from "@/db/queries/procedures.query";

export default function ServicesCard(
    {procedureData} : {procedureData: gProcedureWithStat }
){

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-2">
        {procedureData.map((procedure, index) => (
          <ProcedureCard
            procedureId={procedure.id}
            key={index}
            title={procedure.title}
            totalClients={procedure.totalClients}
            inProgress={procedure.inProgress}
            completed={procedure.completed}
            failed={procedure.failed}
          />
        ))}
      </div>
    )
}
