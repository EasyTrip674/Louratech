import React from "react";
import { getClientProcedureWithSteps } from "@/db/queries/procedures.query";
import { 
  Clock, CheckCircle, FileText, AlertCircle, FileClock, 
  CalendarClock, User, Users, Clipboard, Tag, Banknote, 
  ChevronRight, Calendar, FileCheck, Info, CheckSquare, 
  XCircle, AlertTriangle, Clock3
} from "lucide-react";
import Badge from "@/components/ui/badge/Badge";
import { formatCurrency } from "@/lib/utils";

export default async function ClientProcedurePage(
  params: {
    procedureId: string;
    clientId: string;
  }
) {
  const procedureId = params.procedureId as string;
  const clientId = params.clientId as string;

  const clientProcedure = await getClientProcedureWithSteps(clientId, procedureId);

  if (!clientProcedure) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-6">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-semibold mb-2">Procédure client non trouvée</h1>
        <p className="text-gray-500">La procédure demandée n'existe pas ou a été supprimée.</p>
      </div>
    );
  }



  return (
    <div></div>
    );
}
            