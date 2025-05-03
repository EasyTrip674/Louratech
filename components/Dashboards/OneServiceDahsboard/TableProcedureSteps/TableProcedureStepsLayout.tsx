import { getProcedureWithStepsDb } from "@/db/queries/procedures.query";

import TableProcedureSteps from './CardsStepProcedure';


export default async function TableProcedureStepsLayout(
    {procedureId}:{procedureId:string}
){

    const procedureDataStep = await getProcedureWithStepsDb(procedureId);



    return ( 
    <div className="overflow-x-auto">
        <TableProcedureSteps
        procedureDetails={procedureDataStep}
        />
   </div>)
}