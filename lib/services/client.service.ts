import { BaseService } from "./base.service";
import { Role } from "@prisma/client";
import { sendEmail } from "@/lib/nodemailer/email";
import { generateEmailMessageHtml } from "@/lib/nodemailer/message";
import { auth } from "@/lib/auth";

// Types équivalents à ceux de db/queries/clients.query.ts
import type { Prisma } from "@prisma/client";

export type clientsTableOrganizationDB = Prisma.PromiseReturnType<ClientService["getAllClients"]>;
export type clientProfileDB = Prisma.PromiseReturnType<ClientService["getClientById"]>;
export type ClientIdWithNameDB = Prisma.PromiseReturnType<ClientService["getClientsForSelect"]>;

export interface CreateClientData {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  passport?: string;
  address?: string;
  birthDate?: Date;
  fatherLastName?: string;
  fatherFirstName?: string;
  motherLastName?: string;
  motherFirstName?: string;
}

export interface UpdateClientData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  passport?: string;
  address?: string;
  birthDate?: Date;
  fatherLastName?: string;
  fatherFirstName?: string;
  motherLastName?: string;
  motherFirstName?: string;
}

export class ClientService extends BaseService {
  /**
   * Crée un nouveau client
   */
  async createClient(data: CreateClientData) {
    try {
      const organizationId = await this.getOrganizationId();
      
      if (!organizationId) {
        throw new Error("Organisation introuvable");
      }

      // Vérifier les autorisations
      const canCreate = await this.checkPermission("canCreateClient");
      if (!canCreate) {
        throw new Error("Vous n'êtes pas autorisé à créer un client");
      }

      // Vérifier l'existence du client
      const existingClient = await this.prisma.user.findFirst({
        where: {
          email: data.email,
          client: {
            isNot: null
          }
        }
      });

      if (existingClient) {
        throw new Error("Un client avec cet email existe déjà");
      }

      // Utiliser une transaction pour toutes les opérations de base de données
      const result = await this.prisma.$transaction(async (tx) => {
        // Créer le compte utilisateur via l'auth system
        const user = await auth.api.signUpEmail({
          body: {
            email: data.email,
            password: "00000000", // Mot de passe temporaire
            name: `${data.firstName} ${data.lastName}`,
            options: {
              emailVerification: false,
              data: {
                firstName: data.firstName,
                lastName: data.lastName,
              }
            }
          }
        });

        if (!user.user.id) {
          throw new Error("Erreur lors de la création de l'utilisateur");
        }

        // Mettre à jour l'utilisateur avec les informations de l'organisation
        await tx.user.update({
          where: {
            id: user.user.id,
          },
          data: {
            organizationId,
            role: Role.CLIENT,
            lastName: data.lastName,
            firstName: data.firstName,
          },
        });

        // Créer le profil client
        const client = await tx.client.create({
          data: {
            phone: data.phone,
            passport: data.passport,
            address: data.address,
            birthDate: data.birthDate ? new Date(data.birthDate) : null,
            fatherLastName: data.fatherLastName,
            fatherFirstName: data.fatherFirstName,
            motherLastName: data.motherLastName,
            motherFirstName: data.motherFirstName,
            organizationId,
            userId: user.user.id,
          },
          include: {
            user: true,
            organization: true
          }
        });

        return client;
      });

      // Envoyer un email de bienvenue
      try {
        await sendEmail({
          to: data.email,
          subject: "Bienvenue chez LouraTech",
          html: generateEmailMessageHtml({
            subject: "Bienvenue chez LouraTech",
            content: `
              <h1>Bienvenue ${data.firstName} ${data.lastName} !</h1>
              <p>Votre compte client a été créé avec succès.</p>
              <p>Vous pouvez maintenant accéder à votre espace client.</p>
            `
          })
        });
      } catch (emailError) {
        console.error("Erreur lors de l'envoi de l'email:", emailError);
      }

      return result;
    } catch (error) {
      this.handleDatabaseError(error, "createClient");
    }
  }

  /**
   * Met à jour un client existant
   */
  async updateClient(data: UpdateClientData) {
    try {
      const organizationId = await this.getOrganizationId();
      
      // Vérifier les autorisations
      const canEdit = await this.checkPermission("canEditClient");
      if (!canEdit) {
        throw new Error("Vous n'êtes pas autorisé à modifier ce client");
      }

      // Vérifier que le client appartient à l'organisation
      const existingClient = await this.prisma.client.findUnique({
        where: { id: data.id },
        include: { organization: true }
      });

      if (!existingClient || existingClient.organizationId !== organizationId) {
        throw new Error("Client introuvable ou accès non autorisé");
      }

      // Mettre à jour le client
      const updatedClient = await this.prisma.client.update({
        where: { id: data.id },
        data: {
          phone: data.phone,
          passport: data.passport,
          address: data.address,
          birthDate: data.birthDate ? new Date(data.birthDate) : null,
          fatherLastName: data.fatherLastName,
          fatherFirstName: data.fatherFirstName,
          motherLastName: data.motherLastName,
          motherFirstName: data.motherFirstName,
          user: {
            update: {
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email
            }
          }
        },
        include: {
          user: true,
          organization: true
        }
      });

      return updatedClient;
    } catch (error) {
      this.handleDatabaseError(error, "updateClient");
    }
  }

  /**
   * Supprime un client
   */
  async deleteClient(clientId: string) {
    try {
      const organizationId = await this.getOrganizationId();
      
      // Vérifier les autorisations
      const canDelete = await this.checkPermission("canDeleteClient");
      if (!canDelete) {
        throw new Error("Vous n'êtes pas autorisé à supprimer ce client");
      }

      // Récupérer le client avec ses relations
      const client = await this.prisma.client.findUnique({
        where: { id: clientId },
        include: { 
          user: true,
          clientProcedures: {
            include: {
              steps: true,
              documents: true
            }
          }
        }
      });

      if (!client || client.organizationId !== organizationId) {
        throw new Error("Client introuvable ou accès non autorisé");
      }

      // Supprimer les relations dans l'ordre
      await this.prisma.$transaction(async (tx) => {
        // Supprimer les documents
        await tx.clientDocument.deleteMany({
          where: { 
            clientProcedure: { 
              clientId 
            } 
          }
        });

        // Supprimer les étapes
        await tx.clientStep.deleteMany({
          where: { 
            clientProcedure: { 
              clientId 
            } 
          }
        });

        // Supprimer les procédures client
        await tx.clientProcedure.deleteMany({
          where: { clientId }
        });

        // Supprimer le client
        await tx.client.delete({
          where: { id: clientId }
        });

        // Supprimer l'utilisateur
        await tx.user.delete({
          where: { id: client.userId }
        });
      });

      return { success: true };
    } catch (error) {
      this.handleDatabaseError(error, "deleteClient");
    }
  }

  /**
   * Récupère tous les clients de l'organisation
   */
  async getAllClients() {
    try {
      const organizationId = await this.getOrganizationId();
      
      return await this.prisma.client.findMany({
        where: { organizationId },
        select: {
          id: true,
          address: true,
          phone: true,
          passport: true,
          birthDate: true,
          fatherLastName: true,
          fatherFirstName: true,
          motherLastName: true,
          motherFirstName: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              active: true,
            }
          }
        }
      });
    } catch (error) {
      this.handleDatabaseError(error, "getAllClients");
    }
  }

  /**
   * Récupère un client par son ID
   */
  async getClientById(clientId: string) {
    try {
      const organizationId = await this.getOrganizationId();
      
      return await this.prisma.client.findUnique({
        where: {
          id: clientId,
          organizationId
        },
        select: {
          id: true,
          address: true,
          phone: true,
          passport: true,
          birthDate: true,
          fatherLastName: true,
          fatherFirstName: true,
          motherLastName: true,
          motherFirstName: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              active: true,
            }
          }
        }
      });
    } catch (error) {
      this.handleDatabaseError(error, "getClientById");
    }
  }

  /**
   * Récupère les clients avec leurs noms pour les listes déroulantes
   */
  async getClientsForSelect() {
    try {
      const organizationId = await this.getOrganizationId();
      
      return await this.prisma.client.findMany({
        where: { organizationId },
        select: {
          id: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
            }
          }
        }
      });
    } catch (error) {
      this.handleDatabaseError(error, "getClientsForSelect");
    }
  }

  /**
   * Récupère les procédures d'un client
   */
  async getClientProcedures(clientId: string) {
    try {
      const organizationId = await this.getOrganizationId();
      
      return await this.prisma.clientProcedure.findMany({
        where: {
          clientId,
          client: {
            organizationId
          }
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
    } catch (error) {
      this.handleDatabaseError(error, "getClientProcedures");
    }
  }
} 