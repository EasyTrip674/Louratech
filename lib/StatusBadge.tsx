import Badge from "@/components/ui/badge/Badge";
import { TransactionStatus } from "@prisma/client";
import { 
   CheckCircle, Info,  
   AlertTriangle,  
  CircleDashed,
  Circle
} from "lucide-react";

type StepStatus = 
  | "COMPLETED" 
  | "IN_PROGRESS"
  | "NOT_STARTED"
  | "ON_HOLD"
  | "SKIPPED"
  | "FAILED"
  | "PENDING"
  | "WAITING"|
  "CANCELLED";

export const getStepStatusBadge = (status: StepStatus | TransactionStatus | string ) => {
    switch (status) {
      case "COMPLETED" :
        return <Badge color="success">Terminée</Badge>;
      case "IN_PROGRESS":
      case "PENDING":
        return <Badge color="info">En cours</Badge>;
      case "NOT_STARTED":
        return <Badge color="primary">Non démarrée</Badge>;
      case "ON_HOLD":
        return <Badge color="warning">En attente</Badge>;
      case "SKIPPED":
        return <Badge color="warning">Annulée</Badge>;
      case "FAILED":
        return <Badge color="error">Échouée</Badge>;
      case "WAITING":
        return <Badge color="warning">En cour</Badge>;
      case "CANCELLED":
        return <Badge color="error">Annulée</Badge>;
      case "APPROVED":
        return <Badge color="success">Approuvée</Badge>;
      case "REJECTED":
        return <Badge color="error">Rejetée</Badge>;
      default:
        return <Badge color="info">Inconnue</Badge>;
    }
  };


export const getStatusIcon = (status: StepStatus | string) => {
  switch (status) {
    case "COMPLETED":
      return <CheckCircle className="w-6 h-6 text-green-500 dark:text-green-400" />;
    case "IN_PROGRESS":
    case "PENDING": 
      return <Circle className="w-6 h-6 text-blue-500 dark:text-blue-400" />;
    case "NOT_STARTED":
      return <CircleDashed className="w-6 h-6 text-gray-400 dark:text-gray-500" />;
    case "ON_HOLD":
      return <AlertTriangle className="w-6 h-6 text-amber-500 dark:text-amber-400" />;
    case "SKIPPED":
      return <CircleDashed className="w-6 h-6 text-gray-400 dark:text-gray-500" />;
    case "FAILED":
      return <AlertTriangle className="w-6 h-6 text-red-500 dark:text-red-400" />;
    default:
      return <Info className="w-6 h-6 text-gray-400 dark:text-gray-500" />;
  }
};