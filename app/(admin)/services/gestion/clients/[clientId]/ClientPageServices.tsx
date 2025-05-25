import prisma from '@/db/prisma';
import { getStatusIcon } from '@/lib/StatusBadge';
import { formatAmount, formatDate } from '@/lib/utils';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  FileText,
  User,
  TrendingUp,
  Eye,
  Activity,
  Target,
} from 'lucide-react';
import Link from 'next/link';

// Types pour les données
interface ClientProcedureWithDetails {
  id: string;
  status: string;
  startDate: Date;
  completionDate: Date | null;
  dueDate: Date | null;
  reference: string | null;
  notes: string | null;
  procedure: {
    id: string;
    name: string;
    description: string;
    category: string | null;
    estimatedDuration: number | null;
  };
  assignedTo: {
    id: string;
    name: string;
  } | null;
  manager: {
    id: string;
    name: string;
  } | null;
  steps: {
    id: string;
    status: string;
    startDate: Date | null;
    completionDate: Date | null;
    step: {
      id: string;
      name: string;
      order: number;
    };
  }[];
  _count: {
    steps: number;
  };
}

interface ClientStats {
  totalProcedures: number;
  completedProcedures: number;
  inProgressProcedures: number;
  cancelledProcedures: number;
  totalSteps: number;
  totalPrices: number;
  completedSteps: number;
  averageCompletionTime: number | null;
}

// Fonction pour récupérer les données du client
async function getClientData(clientId: string) {
  const clientProcedures = await prisma.clientProcedure.findMany({
    where: {
      clientId: clientId
    },
    include: {
      procedure: {
        select: {
          id: true,
          name: true,
          description: true,
          category: true,
          estimatedDuration: true
        }
      },
      assignedTo: {
        select: {
          id: true,
          name: true
        }
      },
      manager: {
        select: {
          id: true,
          name: true
        }
      },
      steps: {
        include: {
          step: {
            select: {
              id: true,
              name: true,
              order: true,
            },
          }
          
        },
        orderBy: {
          step: {
            order: 'asc'
          }
        }
      },
      _count: {
        select: {
          steps: true
        }
      }
    },
    orderBy: {
      startDate: 'desc'
    }
  });


  // Calcul des statistiques
  const totalSteps = clientProcedures.reduce((acc, p) => acc + p._count.steps, 0);
  const completedSteps = clientProcedures.reduce((acc, p) => acc + p.steps.filter(s => s.status === 'COMPLETED').length, 0);
  const completedProcedures = clientProcedures.filter(p => p.status === 'COMPLETED').length;
  const totalPrices = clientProcedures.reduce((acc, p)=> acc + (p.steps.reduce( (accs,step)=>accs + (step?.price ?? 0), 0)) , 0)
  
  const stats: ClientStats = {
    totalProcedures: clientProcedures.length,
    completedProcedures,
    inProgressProcedures: clientProcedures.filter(p => p.status === 'IN_PROGRESS').length,
    cancelledProcedures: clientProcedures.filter(p => p.status === 'CANCELLED').length,
    totalSteps,
    completedSteps,
    totalPrices,
    averageCompletionTime: null,
  };

  return { clientProcedures, stats };
}

// Fonction utilitaire pour calculer le pourcentage d'avancement
function calculateProgress(steps: ClientProcedureWithDetails['steps']): number {
  if (steps.length === 0) return 0;
  const completedSteps = steps.filter(step => step.status === 'COMPLETED').length;
  return Math.round((completedSteps / steps.length) * 100);
}




// Composant barre de progression amélioré
function ProgressBar({ value, size = 'md', showLabel = true }: { 
  value: number; 
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}) {
  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  };

  const getColor = (val: number) => {
    if (val >= 80) return 'bg-emerald-500';
    if (val >= 60) return 'bg-blue-500';
    if (val >= 40) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  return (
    <div className="space-y-1">
      {showLabel && (
        <div className="flex justify-between items-center">
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {value}%
          </span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full dark:bg-gray-700 ${sizeClasses[size]}`}>
        <div 
          className={`${sizeClasses[size]} rounded-full transition-all duration-500 ease-out ${getColor(value)}`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}

// Composant carte de statistique
function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  color = 'blue',
  subtitle
}: { 
  title: string; 
  value: string | number; 
  icon: React.ComponentType<{ className?: string }>;
  color?: 'blue' | 'green' | 'orange' | 'purple';
  subtitle?: string;
}) {
  const colorClasses = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    green: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

// Composant pour afficher les détails d'une procédure
function ProcedureCard({ procedure }: { procedure: ClientProcedureWithDetails }) {
  const progress = calculateProgress(procedure.steps);
  const isOverdue = procedure.dueDate && new Date() > procedure.dueDate && procedure.status !== 'COMPLETED';

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
            {procedure.procedure.name}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {procedure.procedure.description}
          </p>
          {procedure.procedure.category && (
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
              {procedure.procedure.category}
            </span>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          {getStatusIcon(procedure.status)}
          {isOverdue && (
            <span className="text-xs text-red-600 dark:text-red-400 font-medium">
              En retard
            </span>
          )}
        </div>
      </div>

      {/* Barre de progression */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Progression
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {procedure.steps.filter(s => s.status === 'COMPLETED').length}/{procedure.steps.length} étapes
          </span>
        </div>
        <ProgressBar value={progress} showLabel={false} />
      </div>

      {/* Informations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Calendar className="h-4 w-4" />
            <span>Début: {formatDate(procedure.startDate)}</span>
          </div>
          {procedure.dueDate && (
            <div className={`flex items-center gap-2 ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
              <Clock className="h-4 w-4" />
              <span>Échéance: {formatDate(procedure.dueDate)}</span>
            </div>
          )}
          {procedure.completionDate && (
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="h-4 w-4" />
              <span>Terminé: {formatDate(procedure.completionDate)}</span>
            </div>
          )}
        </div>
        <div className="space-y-2">
          {procedure.assignedTo && (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <User className="h-4 w-4" />
              <span>{procedure.assignedTo.name}</span>
            </div>
          )}
          {procedure.reference && (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <FileText className="h-4 w-4" />
              <span>Réf: {procedure.reference}</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end mt-4">
        <Link href={`/services/gestion/procedures/${procedure.procedure.id}/clients/${procedure.id}`}  className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
          <Eye className="h-4 w-4" />
          Voir détails
        </Link>
      </div>
    </div>
  );
}

export default async function ClientPageServices({ clientId }: { clientId: string }) {
  const { clientProcedures, stats } = await getClientData(clientId);

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
          <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Services du client
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Suivi et gestion des Services en cours
          </p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Services"
          value={stats.totalProcedures}
          icon={FileText}
          color="blue"
        />
        <StatCard
          title="Terminées"
          value={stats.completedProcedures}
          icon={CheckCircle}
          color="green"
          subtitle={`${stats.totalProcedures > 0 ? Math.round((stats.completedProcedures / stats.totalProcedures) * 100) : 0}% du total`}
        />
        <StatCard
          title="En cours"
          value={stats.inProgressProcedures}
          icon={Activity}
          color="orange"
        />
        <StatCard
          title="Chiffre d'Affaire"
          value={formatAmount(stats.totalPrices, "REVENUE")}
          icon={Target}
          color="purple"
          subtitle={`ce que ce client vous a rapporté`}
        />
      </div>

      {/* Liste des Services */}
      {clientProcedures.length === 0 ? (
        <div className="text-center py-16">
          <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <FileText className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Aucune procédure
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto">
            Aucune procédure n&apos;a été trouvée pour ce client. Les nouvelles Services apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {clientProcedures.map((procedure) => (
            <ProcedureCard key={procedure.id} procedure={procedure} />
          ))}
        </div>
      )}
    </div>
  );
}