import TableClientsProcedure from "@/components/Dashboards/OneServiceDahsboard/TableClientsProcedure/TableClientsProcedure"
import { getProcedureDetails } from "@/db/queries/procedures.query"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export default async function TableClientsProcedureLayout({procedureId}:{
    procedureId:string
}) {
    const session  = await auth.api.getSession({
        headers: await headers()
      })

      const procedure = await getProcedureDetails(procedureId)

    return <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
    <div className="overflow-x-auto">
      <div className="min-w-full">
       <TableClientsProcedure procedureDetails={procedure} canEditClientProcedure={session?.userDetails?.authorize?.canEditClientProcedure} />
      </div>
    </div>
  </div>
}