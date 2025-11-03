/**
 * Script pour créer les autorisations manquantes pour les utilisateurs existants
 *
 * Ce script:
 * 1. Trouve tous les utilisateurs sans autorisations
 * 2. Crée des autorisations par défaut basées sur leur rôle
 *
 * Usage: npx tsx scripts/fix-missing-authorizations.ts
 */

import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

interface AuthorizationData {
  canChangeUserAuthorization: boolean;
  canChangeUserPassword: boolean;
  canCreateOrganization: boolean;
  canCreateStep: boolean;
  canCreateClient: boolean;
  canCreateProcedure: boolean;
  canCreateTransaction: boolean;
  canCreateAdmin: boolean;
  canCreateInvoice: boolean;
  canCreateExpense: boolean;
  canCreateRevenue: boolean;
  canCreateComptaSettings: boolean;
  canCreateClientProcedure: boolean;
  canCreateClientStep: boolean;
  canCreateClientDocument: boolean;
  canReadOrganization: boolean;
  canReadStep: boolean;
  canReadClient: boolean;
  canReadProcedure: boolean;
  canReadTransaction: boolean;
  canReadInvoice: boolean;
  canReadExpense: boolean;
  canReadRevenue: boolean;
  canReadComptaSettings: boolean;
  canReadAdmin: boolean;
  canReadClientProcedure: boolean;
  canReadClientStep: boolean;
  canReadClientDocument: boolean;
  canEditOrganization: boolean;
  canEditStep: boolean;
  canEditClient: boolean;
  canEditProcedure: boolean;
  canEditTransaction: boolean;
  canEditInvoice: boolean;
  canEditExpense: boolean;
  canEditRevenue: boolean;
  canEditComptaSettings: boolean;
  canEditAdmin: boolean;
  canEditClientProcedure: boolean;
  canEditClientStep: boolean;
  canEditClientDocument: boolean;
  canDeleteOrganization: boolean;
  canDeleteStep: boolean;
  canDeleteClient: boolean;
  canDeleteProcedure: boolean;
  canDeleteTransaction: boolean;
  canDeleteInvoice: boolean;
  canDeleteExpense: boolean;
  canDeleteRevenue: boolean;
  canDeleteComptaSettings: boolean;
  canDeleteAdmin: boolean;
  canDeleteClientProcedure: boolean;
  canDeleteClientStep: boolean;
  canDeleteClientDocument: boolean;
}

function getDefaultPermissionsByRole(role: Role): AuthorizationData {
  const basePermissions: AuthorizationData = {
    canChangeUserAuthorization: false,
    canChangeUserPassword: false,
    canCreateOrganization: false,
    canCreateStep: false,
    canCreateClient: false,
    canCreateProcedure: false,
    canCreateTransaction: false,
    canCreateAdmin: false,
    canCreateInvoice: false,
    canCreateExpense: false,
    canCreateRevenue: false,
    canCreateComptaSettings: false,
    canCreateClientProcedure: false,
    canCreateClientStep: false,
    canCreateClientDocument: false,
    canReadOrganization: false,
    canReadStep: false,
    canReadClient: false,
    canReadProcedure: false,
    canReadTransaction: false,
    canReadInvoice: false,
    canReadExpense: false,
    canReadRevenue: false,
    canReadComptaSettings: false,
    canReadAdmin: false,
    canReadClientProcedure: false,
    canReadClientStep: false,
    canReadClientDocument: false,
    canEditOrganization: false,
    canEditStep: false,
    canEditClient: false,
    canEditProcedure: false,
    canEditTransaction: false,
    canEditInvoice: false,
    canEditExpense: false,
    canEditRevenue: false,
    canEditComptaSettings: false,
    canEditAdmin: false,
    canEditClientProcedure: false,
    canEditClientStep: false,
    canEditClientDocument: false,
    canDeleteOrganization: false,
    canDeleteStep: false,
    canDeleteClient: false,
    canDeleteProcedure: false,
    canDeleteTransaction: false,
    canDeleteInvoice: false,
    canDeleteExpense: false,
    canDeleteRevenue: false,
    canDeleteComptaSettings: false,
    canDeleteAdmin: false,
    canDeleteClientProcedure: false,
    canDeleteClientStep: false,
    canDeleteClientDocument: false,
  };

  switch (role) {
    case "ADMIN":
      // Admin a toutes les permissions
      return Object.keys(basePermissions).reduce((acc, key) => {
        acc[key as keyof AuthorizationData] = true;
        return acc;
      }, {} as AuthorizationData);

    case "USER":
      return {
        ...basePermissions,
        canReadOrganization: true,
        canReadClient: true,
        canReadProcedure: true,
        canReadStep: true,
        canReadClientProcedure: true,
        canReadClientStep: true,
        canReadClientDocument: true,
        canCreateClient: true,
        canEditClient: true,
        canCreateClientProcedure: true,
        canEditClientProcedure: true,
        canCreateClientStep: true,
        canEditClientStep: true,
        canCreateClientDocument: true,
      };

    case "EMPLOYEE":
      return {
        ...basePermissions,
        canReadProcedure: true,
        canReadStep: true,
        canReadClientProcedure: true,
        canReadClientStep: true,
        canReadClientDocument: true,
        canEditClientStep: true,
        canCreateClientDocument: true,
      };

    case "CLIENT":
      return {
        ...basePermissions,
        canReadClientProcedure: true,
        canReadClientStep: true,
        canReadClientDocument: true,
      };

    default:
      return basePermissions;
  }
}

async function fixMissingAuthorizations() {
  console.log("🔍 Recherche des utilisateurs sans autorisations...\n");

  try {
    // Trouver tous les utilisateurs sans autorisations
    const usersWithoutAuth = await prisma.user.findMany({
      where: {
        authorize: null,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    if (usersWithoutAuth.length === 0) {
      console.log("✅ Tous les utilisateurs ont déjà des autorisations!");
      return;
    }

    console.log(`📋 ${usersWithoutAuth.length} utilisateur(s) trouvé(s) sans autorisations:\n`);

    for (const user of usersWithoutAuth) {
      console.log(`  - ${user.firstName} ${user.lastName} (${user.email}) - Rôle: ${user.role}`);
    }

    console.log("\n🔧 Création des autorisations par défaut...\n");

    let createdCount = 0;
    let errorCount = 0;

    for (const user of usersWithoutAuth) {
      try {
        const permissions = getDefaultPermissionsByRole(user.role);

        await prisma.authorization.create({
          data: {
            userId: user.id,
            ...permissions,
          },
        });

        console.log(`  ✅ Autorisations créées pour: ${user.firstName} ${user.lastName} (${user.role})`);
        createdCount++;
      } catch (error) {
        console.error(`  ❌ Erreur pour ${user.email}:`, error);
        errorCount++;
      }
    }

    console.log(`\n📊 Résumé:`);
    console.log(`  ✅ Autorisations créées: ${createdCount}`);
    if (errorCount > 0) {
      console.log(`  ❌ Erreurs: ${errorCount}`);
    }
    console.log(`\n✨ Terminé!`);

  } catch (error) {
    console.error("❌ Erreur lors de l'exécution du script:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script
fixMissingAuthorizations()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
