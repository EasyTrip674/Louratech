"use client"
import TableProcedureSteps from './CardsStepProcedure';


export default function TableProcedureStepsLayout(
    {procedureId}:{procedureId:string}
){


    return ( 
    <div className="overflow-x-auto">
        <TableProcedureSteps
        procedureId={procedureId}
        />
   </div>)
}