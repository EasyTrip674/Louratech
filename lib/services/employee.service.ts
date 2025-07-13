import { BaseService } from "./base.service";
import { Role } from "@prisma/client";
import { sendEmail } from "@/lib/nodemailer/email";
import { generateEmailMessageHtml } from "@/lib/nodemailer/message";

export interface CreateEmployeeData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phone?: string;
  address?: string;
}

export interface UpdateEmployeeData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
}

export class EmployeeService extends BaseService {
  /**
   * Crée un nouvel employé
   */
  async createEmployee(data: CreateEmployeeData) {
    try {
      const organizationId = await this.getOrganizationId();
      
      if (!organizationId) {
        throw new Error("Organisation introuvable");
      }

      // Vérifier les autorisations
      const canCreate = await this.checkPermission("canCreateAdmin");
      if (!canCreate) {
        throw new Error("Vous n'êtes pas autorisé à créer un employé");
      }

      // Vérifier l'existence de l'employé
      const existingEmployee = await this.prisma.user.findFirst({
        where: {
          email: data.email,
          admin: {
            isNot: null
          }
        }
      });

      if (existingEmployee) {
        throw new Error("Un employé avec cet email existe déjà");
      }

      // Créer l'utilisateur d'abord
      const user = await this.prisma.user.create({
        data: {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          role: Role.ADMIN,
          organizationId,
        }
      });

      // Créer l'employé
      const employee = await this.prisma.admin.create({
        data: {
          phone: data.phone,
          address: data.address,
          organizationId,
          userId: user.id,
        },
        include: {
          user: true,
          organization: true
        }
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
              <p>Votre compte employé a été créé avec succès.</p>
              <p>Vous pouvez maintenant accéder à votre espace de travail.</p>
            `
          })
        });
      } catch (emailError) {
        console.error("Erreur lors de l'envoi de l'email:", emailError);
      }

      return employee;
    } catch (error) {
      this.handleDatabaseError(error, "createEmployee");
    }
  }

  /**
   * Met à jour un employé existant
   */
  async updateEmployee(data: UpdateEmployeeData) {
    try {
      const organizationId = await this.getOrganizationId();
      
      // Vérifier les autorisations
      const canEdit = await this.checkPermission("canEditAdmin");
      if (!canEdit) {
        throw new Error("Vous n'êtes pas autorisé à modifier cet employé");
      }

      // Vérifier que l'employé appartient à l'organisation
      const existingEmployee = await this.prisma.admin.findUnique({
        where: { id: data.id },
        include: { organization: true }
      });

      if (!existingEmployee || existingEmployee.organizationId !== organizationId) {
        throw new Error("Employé introuvable ou accès non autorisé");
      }

      // Mettre à jour l'employé
      const updatedEmployee = await this.prisma.admin.update({
        where: { id: data.id },
        data: {
          phone: data.phone,
          address: data.address,
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

      return updatedEmployee;
    } catch (error) {
      this.handleDatabaseError(error, "updateEmployee");
    }
  }

  /**
   * Supprime un employé
   */
  async deleteEmployee(employeeId: string) {
    try {
      const organizationId = await this.getOrganizationId();
      
      // Vérifier les autorisations
      const canDelete = await this.checkPermission("canDeleteAdmin");
      if (!canDelete) {
        throw new Error("Vous n'êtes pas autorisé à supprimer cet employé");
      }

      // Récupérer l'employé avec ses relations
      const employee = await this.prisma.admin.findUnique({
        where: { id: employeeId },
        include: { 
          user: true,
          organization: true
        }
      });

      if (!employee || employee.organizationId !== organizationId) {
        throw new Error("Employé introuvable ou accès non autorisé");
      }

      // Supprimer les relations dans l'ordre
      await this.prisma.$transaction(async (tx) => {
        // Déconnecter l'utilisateur de toutes les sessions
        await tx.session.deleteMany({
          where: { userId: employee.userId }
        });

        // Supprimer les comptes de l'utilisateur
        await tx.account.deleteMany({
          where: { userId: employee.userId }
        });

        // Vérifier si l'utilisateur a des procédures client assignées
        const hasAssignedProcedures = await tx.clientProcedure.count({
          where: {
            OR: [
              { assignedToId: employee.userId },
              { managerId: employee.userId }
            ]
          }
        });

        if (hasAssignedProcedures > 0) {
          throw new Error("Impossible de supprimer cet employé car il a des procédures client assignées");
        }

        // Supprimer l'employé
        await tx.admin.delete({
          where: { id: employeeId }
        });

        // Supprimer l'utilisateur
        await tx.user.delete({
          where: { id: employee.userId }
        });
      });

      return { success: true };
    } catch (error) {
      this.handleDatabaseError(error, "deleteEmployee");
    }
  }

  /**
   * Récupère tous les employés de l'organisation
   */
  async getAllEmployees() {
    try {
      const organizationId = await this.getOrganizationId();
      
      return await this.prisma.admin.findMany({
        where: { organizationId },
        select: {
          id: true,
          address: true,
          phone: true,
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
      this.handleDatabaseError(error, "getAllEmployees");
    }
  }

  /**
   * Récupère un employé par son ID
   */
  async getEmployeeById(employeeId: string) {
    try {
      const organizationId = await this.getOrganizationId();
      
      return await this.prisma.admin.findUnique({
        where: {
          id: employeeId,
          organizationId
        },
        select: {
          id: true,
          address: true,
          phone: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              active: true,
              authorize: true,
            }
          }
        }
      });
    } catch (error) {
      this.handleDatabaseError(error, "getEmployeeById");
    }
  }
} 