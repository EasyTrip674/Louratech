import { BaseService } from "./base.service";

// Types équivalents à ceux de db/queries/clients.query.ts
import type { Prisma } from "@prisma/client";

export type clientsTableOrganizationDB = Prisma.PromiseReturnType<ClientService["getAllClients"]>;
export type clientProfileDB = Prisma.PromiseReturnType<ClientService["getClientById"]>;
export type ClientIdWithNameDB = Prisma.PromiseReturnType<ClientService["getClientsForSelect"]>;

export interface CreateClientData {
  email?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  passport?: string;
  address?: string;
  birthDate?: string | Date;
  fatherLastName?: string;
  fatherFirstName?: string;
  motherLastName?: string;
  motherFirstName?: string;
}

export interface UpdateClientData {
  id: string;
  email?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  passport?: string;
  address?: string;
  birthDate?: string;
  fatherLastName?: string;
  fatherFirstName?: string;
  motherLastName?: string;
  motherFirstName?: string;
}

export class ClientService extends BaseService {
  /**
   * Crée un nouveau client
   */

  private clientCreationLocks = new Map<string, Promise<string>>();

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
      const existingClient = await this.prisma.client.findFirst({
        where: {
          ...data,
          birthDate: data?.birthDate ? new Date(data.birthDate) : null
        }
      });

      if (existingClient) {
        return;
      }


      // Utiliser une transaction pour toutes les opérations de base de données
      const result = await this.prisma.$transaction(async (tx) => {
        // Créer le compte utilisateur via l'auth system

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
            lastName: data.lastName,
            firstName: data.firstName,
            email: data.email
          },
          include: {
            organization: true
          }
        });

        return client;
      });

 

      return result;
    } catch (error) {
      this.handleDatabaseError(error, "createClient");
    } finally {
      // Toujours nettoyer le lock après la création
      // this.clientCreationLocks.delete(lockKey);
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
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email
        },
        include: {
          organization:true
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
          firstName: true,
          lastName: true,
          email: true,
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
          email:true,
          firstName:true,
          lastName:true,
        
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
          firstName: true,
          lastName: true,
         
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