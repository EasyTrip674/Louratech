import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Migre les emails des utilisateurs vers les clients et supprime les utilisateurs qui ont une relation client
 * Cette fonction utilise une transaction pour assurer l'intégrité des données
 */
async function migrateClientEmailsAndDeleteUsers() {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Étape 1: Récupérer tous les utilisateurs qui ont une relation client
      const usersWithClients = await tx.user.findMany({
        where: {
          OR:[
            {
              client: {
                isNot: null
              }
            },
            {
              role:"CLIENT"
            }
          ]
        },
        include: {
          client: true
        }
      });

      console.log(`Trouvé ${usersWithClients.length} utilisateurs avec des clients associés`);

      // Étape 2: Mettre à jour l'email de chaque client avec l'email de son utilisateur
      const updatePromises = usersWithClients.map(async (user) => {
        if (user.client && user.email) {
          return tx.client.update({
            where: { id: user.client.id },
            data: {
              email: user.email,
              // Optionnel: mettre à jour aussi firstName et lastName si pas déjà définis
              firstName: user.client.firstName || user.firstName,
              lastName: user.client.lastName || user.lastName,
              image: user.client.image || user.image
            }
          });
        }
        return null;
      });

      const updatedClients = await Promise.all(updatePromises);
      const successfulUpdates = updatedClients.filter(client => client !== null);

      console.log(`Mis à jour ${successfulUpdates.length} clients avec les emails de leurs utilisateurs`);

    //   // Étape 3: Supprimer toutes les relations entre clients et utilisateurs
    await tx.client.updateMany({
      where: {
        userId: {
          not: null
        }
      },
      data: {
        userId: null,
      }
    });

      console.log('Relations client-utilisateur supprimées');

      // Étape 4: Récupérer les IDs des utilisateurs qui étaient liés à des clients
      const userIdsToDelete = usersWithClients.map(user => user.id);

      // Étape 5: Supprimer les enregistrements liés dans les tables de relations
      
      // Supprimer les sessions
      await tx.session.deleteMany({
        where: {
          userId: {
            in: userIdsToDelete
          }
        }
      });


      // Supprimer les comptes
      await tx.account.deleteMany({
        where: {
          userId: {
            in: userIdsToDelete
          }
        }
      });

      // Supprimer les autorisations
      await tx.authorization.deleteMany({
        where: {
          userId: {
            in: userIdsToDelete
          }
        }
      });

      // Mettre à jour les transactions créées par ces utilisateurs (les garder mais retirer la référence)
      await tx.transaction.updateMany({
        where: {
          createdById: {
            in: userIdsToDelete
          }
        },
        data: {
          createdById: 'SYSTEM' // Ou un ID d'utilisateur système par défaut
        }
      });

      // Mettre à jour les transactions approuvées par ces utilisateurs
      await tx.transaction.updateMany({
        where: {
          approvedById: {
            in: userIdsToDelete
          }
        },
        data: {
          approvedById: null
        }
      });

      // Mettre à jour les autres références dans les tables liées
      await tx.expense.updateMany({
        where: {
          createdById: {
            in: userIdsToDelete
          }
        },
        data: {
          createdById: 'SYSTEM'
        }
      });

      await tx.revenue.updateMany({
        where: {
          createdById: {
            in: userIdsToDelete
          }
        },
        data: {
          createdById: null
        }
      });

      await tx.invoice.updateMany({
        where: {
          createdById: {
            in: userIdsToDelete
          }
        },
        data: {
          createdById: 'SYSTEM'
        }
      });

      // Mettre à jour les ClientProcedure
      await tx.clientProcedure.updateMany({
        where: {
          assignedToId: {
            in: userIdsToDelete
          }
        },
        data: {
          assignedToId: null
        }
      });

      await tx.clientProcedure.updateMany({
        where: {
          managerId: {
            in: userIdsToDelete
          }
        },
        data: {
          managerId: null
        }
      });

      await tx.clientStep.updateMany({
        where: {
          processedById: {
            in: userIdsToDelete
          }
        },
        data: {
          processedById: null
        }
      });

      await tx.transaction.updateMany({
        where: {
          userId: {
            in: userIdsToDelete
          }
        },
        data: {
          userId: null
        }
      });

      console.log('Références aux utilisateurs nettoyées dans les tables liées');

      // Étape 6: Supprimer les utilisateurs
      const deletedUsers = await tx.user.deleteMany({
        where: {
          id: {
            in: userIdsToDelete
          }
        }
      });

      // await await tx.user.deleteMany({
      //   where:{
      //     role:"CLIENT"
      //   }
      // })
      

      console.log(`Supprimé ${deletedUsers.count} utilisateurs`);

      return {
        clientsUpdated: successfulUpdates.length,
        usersDeleted: deletedUsers.count,
        userIdsDeleted: userIdsToDelete
      };
    });

    // console.log('Migration terminée avec succès:', result);
    return result;

  } catch (error) {
    console.error('Erreur lors de la migration:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Fonction de rollback en cas de problème (à utiliser avec précaution)
 * Cette fonction n'est pas recommandée car elle ne peut pas restaurer les utilisateurs supprimés
 */
async function rollbackMigration() {
  console.warn('ATTENTION: Cette fonction de rollback ne peut pas restaurer les utilisateurs supprimés!');
  console.warn('Elle peut seulement vider les champs email des clients.');
  
  try {
    await prisma.client.updateMany({
      data: {
        email: null
      }
    });
    console.log('Emails des clients vidés');
  } catch (error) {
    console.error('Erreur lors du rollback:', error);
    throw error;
  }
}

// Fonction utilitaire pour vérifier les données avant migration
async function checkDataBeforeMigration() {
  try {
    const usersWithClients = await prisma.user.findMany({
      where: {
        client: {
          isNot: null
        }
      },
      include: {
        client: true
      }
    });

    const clientsWithEmails = await prisma.client.findMany({
      where: {
        email: {
          not: null
        }
      }
    });

    console.log(`Utilisateurs avec clients associés: ${usersWithClients.length}`);
    console.log(`Clients avec emails déjà renseignés: ${clientsWithEmails.length}`);

    // Vérifier les conflits potentiels
    const conflicts = usersWithClients.filter(user => 
      user.client && user.client.email && user.email && user.client.email !== user.email
    );

    if (conflicts.length > 0) {
      console.warn(`ATTENTION: ${conflicts.length} utilisateurs ont des emails différents de leurs clients associés`);
      conflicts.forEach(user => {
        console.warn(`Utilisateur ${user.id}: email utilisateur="${user.email}" vs email client="${user.client?.email}"`);
      });
    }

    return {
      usersWithClients: usersWithClients.length,
      clientsWithEmails: clientsWithEmails.length,
      conflicts: conflicts.length
    };

  } catch (error) {
    console.error('Erreur lors de la vérification:', error);
    throw error;
  }
}

// Export des fonctions
export {
  migrateClientEmailsAndDeleteUsers,
  rollbackMigration,
  checkDataBeforeMigration
};

// Utilisation exemple:
/*
// Vérifier les données avant migration
await checkDataBeforeMigration();

// Exécuter la migration
await migrateClientEmailsAndDeleteUsers();
*/