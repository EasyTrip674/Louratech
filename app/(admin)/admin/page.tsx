"use client";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  CreditCard, 
  FileText, 
  DollarSign, 
  Users, 
  Building2,
  Settings,
  BarChart3,
  Shield
} from "lucide-react";

const adminModules = [
  {
    title: "Facturation",
    description: "Gérer les plans d'abonnement, abonnements et paiements",
    icon: CreditCard,
    href: "/admin/billing",
    color: "bg-blue-500",
    stats: {
      label: "Plans actifs",
      value: "3"
    }
  },
  {
    title: "Procédures",
    description: "Gérer les procédures, étapes et procédures clients",
    icon: FileText,
    href: "/admin/procedures",
    color: "bg-green-500",
    stats: {
      label: "Procédures actives",
      value: "12"
    }
  },
  {
    title: "Finances",
    description: "Gérer les transactions, factures, dépenses et revenus",
    icon: DollarSign,
    href: "/admin/finance",
    color: "bg-purple-500",
    stats: {
      label: "Transactions",
      value: "156"
    }
  },
  {
    title: "Organisations",
    description: "Gérer les organisations et leurs paramètres",
    icon: Building2,
    href: "/admin/organizations",
    color: "bg-orange-500",
    stats: {
      label: "Organisations",
      value: "24"
    }
  },
  {
    title: "Utilisateurs",
    description: "Gérer les utilisateurs et leurs autorisations",
    icon: Users,
    href: "/admin/users",
    color: "bg-red-500",
    stats: {
      label: "Utilisateurs",
      value: "89"
    }
  },
  {
    title: "Analytics",
    description: "Tableaux de bord et rapports de performance",
    icon: BarChart3,
    href: "/admin/analytics",
    color: "bg-indigo-500",
    stats: {
      label: "Vues",
      value: "1.2k"
    }
  },
  {
    title: "Sécurité",
    description: "Paramètres de sécurité et audit des accès",
    icon: Shield,
    href: "/admin/security",
    color: "bg-gray-500",
    stats: {
      label: "Alertes",
      value: "2"
    }
  },
  {
    title: "Configuration",
    description: "Paramètres système et configuration globale",
    icon: Settings,
    href: "/admin/settings",
    color: "bg-teal-500",
    stats: {
      label: "Modules",
      value: "8"
    }
  }
];

export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Tableau de Bord Administrateur</h1>
        <p className="text-muted-foreground">
          Gérez tous les aspects de votre plateforme LouraTech
        </p>
      </div>

      {/* Statistiques globales */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Organisations</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              +12% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              +8% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenus</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,450 FNG</div>
            <p className="text-xs text-muted-foreground">
              +23% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Procédures</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              +15% par rapport au mois dernier
            </p>
          </CardContent>
        </Card>
      </div> */}

      {/* Modules d'administration */}
      {/* <div className="space-y-4">
        <h2 className="text-xl font-semibold">Modules d'Administration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {adminModules.map((module) => (
            <Card key={module.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${module.color}`}>
                    <module.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{module.stats.value}</div>
                    <div className="text-xs text-muted-foreground">{module.stats.label}</div>
                  </div>
                </div>
                <CardTitle className="text-lg">{module.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4">
                  {module.description}
                </p>
                <Button asChild className="w-full">
                  <Link href={module.href}>
                    Accéder
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div> */}

      {/* Actions rapides */}
      {/* <div className="space-y-4">
        <h2 className="text-xl font-semibold">Actions Rapides</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline">
            <Users className="w-4 h-4 mr-2" />
            Créer un utilisateur
          </Button>
          <Button variant="outline">
            <Building2 className="w-4 h-4 mr-2" />
            Ajouter une organisation
          </Button>
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Créer une procédure
          </Button>
          <Button variant="outline">
            <CreditCard className="w-4 h-4 mr-2" />
            Nouveau plan d'abonnement
          </Button>
          <Button variant="outline">
            <DollarSign className="w-4 h-4 mr-2" />
            Nouvelle transaction
          </Button>
        </div>
      </div> */}

      {/* Activité récente */}
      {/* <div className="space-y-4">
        <h2 className="text-xl font-semibold">Activité Récente</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Nouvelle organisation créée</p>
                  <p className="text-xs text-muted-foreground">TechCorp a été créée il y a 2 heures</p>
                </div>
                <span className="text-xs text-muted-foreground">2h</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Paiement reçu</p>
                  <p className="text-xs text-muted-foreground">Paiement de 500 FNG pour TechCorp</p>
                </div>
                <span className="text-xs text-muted-foreground">4h</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Nouvelle procédure</p>
                  <p className="text-xs text-muted-foreground">Procédure "Création d'entreprise" ajoutée</p>
                </div>
                <span className="text-xs text-muted-foreground">6h</span>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Utilisateur connecté</p>
                  <p className="text-xs text-muted-foreground">Marie Martin s'est connectée</p>
                </div>
                <span className="text-xs text-muted-foreground">8h</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div> */}
    </div>
  );
}
