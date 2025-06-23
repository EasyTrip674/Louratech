// import { InvoiceStatus, PaymentMethod, PrismaClient, ProcedureStatus, StepStatus, TransactionStatus, TransactionType } from '@prisma/client';
// import { faker } from '@faker-js/faker';

// const prisma = new PrismaClient();

// // Configuration Faker en français
// // faker.locale = 'fr';

// const ORG_ID = 'cmc7jbvxa0024g50wsfxn03yz';

// // Fonction utilitaire pour générer un hash de mot de passe
// const generateHashedPassword = () => faker.internet.password({ length: 60, prefix: '$2b$10$' });

// // Fonction utilitaire pour générer une référence
// const generateReference = (prefix: string, year: number = new Date().getFullYear()) => 
//   `${prefix}-${year}-${faker.string.numeric(3).padStart(3, '0')}`;

// async function createFakeData() {
//   try {
//     console.log('🚀 Début de la création des données de test avec Faker...');

//     // 1. Créer des utilisateurs avec Faker
//     console.log('👥 Création des utilisateurs...');
    
//     const admin = await prisma.user.create({
//       data: {
//         email: faker.internet.email({ firstName: 'admin' }),
//         name: faker.person.fullName(),
//         firstName: faker.person.firstName(),
//         lastName: faker.person.lastName(),
//         password: generateHashedPassword(),
//         role: 'ADMIN',
//         organizationId: ORG_ID,
//         emailVerified: faker.datatype.boolean({ probability: 0.8 }),
//         image: faker.image.avatar(),
//       }
//     });

//     const employees = [];
//     for (let i = 0; i < 3; i++) {
//       const firstName = faker.person.firstName();
//       const lastName = faker.person.lastName();
//       const employee = await prisma.user.create({
//         data: {
//           email: faker.internet.email({ firstName, lastName }),
//           name: `${firstName} ${lastName}`,
//           firstName,
//           lastName,
//           password: generateHashedPassword(),
//           role: faker.helpers.arrayElement(['EMPLOYEE', 'USER']),
//           organizationId: ORG_ID,
//           emailVerified: faker.datatype.boolean({ probability: 0.9 }),
//           image: faker.image.avatar(),
//         }
//       });
//       employees.push(employee);
//     }

//     const clients = [];
//     for (let i = 0; i < 5; i++) {
//       const firstName = faker.person.firstName();
//       const lastName = faker.person.lastName();
//       const clientUser = await prisma.user.create({
//         data: {
//           email: faker.internet.email({ firstName, lastName }),
//           name: `${firstName} ${lastName}`,
//           firstName,
//           lastName,
//           password: generateHashedPassword(),
//           role: 'CLIENT',
//           organizationId: ORG_ID,
//           emailVerified: faker.datatype.boolean({ probability: 0.7 }),
//           image: faker.image.avatar(),
//         }
//       });
//       clients.push(clientUser);
//     }

//     // 2. Créer les profils Admin et Client avec Faker
//     console.log('👤 Création des profils étendus...');
    
//     const adminProfile = await prisma.admin.create({
//       data: {
//         userId: admin.id,
//         phone: faker.phone.number(),
//         address: faker.location.streetAddress({ useFullAddress: true }),
//         organizationId: ORG_ID,
//       }
//     });

//     const clientProfiles = [];
//     for (const clientUser of clients) {
//       const clientProfile = await prisma.client.create({
//         data: {
//           userId: clientUser.id,
//           phone: faker.phone.number(),
//           address: faker.location.streetAddress({ useFullAddress: true }),
//           birthDate: faker.date.birthdate({ min: 18, max: 80, mode: 'age' }),
//           passport: faker.string.alphanumeric({ length: 9, casing: 'upper' }),
//           fatherFirstName: faker.person.firstName('male'),
//           fatherLastName: faker.person.lastName(),
//           motherFirstName: faker.person.firstName('female'),
//           motherLastName: faker.person.lastName(),
//           organizationId: ORG_ID,
//         }
//       });
//       clientProfiles.push(clientProfile);
//     }

//     // 3. Créer des membres et équipes avec Faker
//     console.log('👥 Création des membres et équipes...');
    
//     // Membres admin et employés
//     await prisma.member.create({
//       data: {
//         userId: admin.id,
//         organizationId: ORG_ID,
//         role: 'ADMIN',
//       }
//     });

//     for (const employee of employees) {
//       await prisma.member.create({
//         data: {
//           userId: employee.id,
//           organizationId: ORG_ID,
//           role: employee.role,
//         }
//       });
//     }

//     // Créer plusieurs équipes
//     const teams = [];
//     const teamNames = [
//       'Équipe Administrative',
//       'Service Client',
//       'Département Visa',
//       'Support Technique'
//     ];

//     for (const teamName of teamNames) {
//       const team = await prisma.team.create({
//         data: {
//           name: teamName,
//           organizationId: ORG_ID,
//         }
//       });
//       teams.push(team);
//     }

//     // 4. Créer des catégories comptables avec Faker
//     console.log('📂 Création des catégories...');
    
//     const expenseCategories = [];
//     const revenueCategories = [];

//     const expenseCategoryNames = [
//       'Frais de bureau',
//       'Transport et déplacements',
//       'Télécommunications',
//       'Marketing et publicité',
//       'Fournitures'
//     ];

//     const revenueCategoryNames = [
//       'Services clients',
//       'Consultation',
//       'Frais de dossier',
//       'Services premium',
//       'Commissions'
//     ];

//     for (const name of expenseCategoryNames) {
//       const category = await prisma.category.create({
//         data: {
//           name,
//           description: faker.lorem.sentence(),
//           type: 'EXPENSE',
//           organizationId: ORG_ID,
//         }
//       });
//       expenseCategories.push(category);
//     }

//     for (const name of revenueCategoryNames) {
//       const category = await prisma.category.create({
//         data: {
//           name,
//           description: faker.lorem.sentence(),
//           type: 'REVENUE',
//           organizationId: ORG_ID,
//         }
//       });
//       revenueCategories.push(category);
//     }

//     // 5. Créer des procédures avec Faker
//     console.log('📋 Création des procédures...');
    
//     const procedures = [];
//     const procedureData = [
//       {
//         name: 'Demande de passeport',
//         description: 'Procédure complète pour obtenir un nouveau passeport',
//         category: 'Documents officiels',
//         steps: [
//           { name: 'Collecte des documents', description: 'Rassembler tous les documents requis' },
//           { name: 'Vérification et validation', description: 'Contrôle de conformité' },
//           { name: 'Dépôt en préfecture', description: 'Dépôt du dossier complet' },
//           { name: 'Suivi et récupération', description: 'Suivi du dossier et récupération' }
//         ]
//       },
//       {
//         name: 'Visa touristique',
//         description: 'Obtention d\'un visa pour voyage touristique',
//         category: 'Visas',
//         steps: [
//           { name: 'Formulaire de demande', description: 'Remplissage du formulaire officiel' },
//           { name: 'Rendez-vous consulat', description: 'Prise et passage du rendez-vous' },
//           { name: 'Entretien', description: 'Entretien avec l\'agent consulaire' }
//         ]
//       },
//       {
//         name: 'Carte de séjour',
//         description: 'Demande de titre de séjour',
//         category: 'Titres de séjour',
//         steps: [
//           { name: 'Constitution du dossier', description: 'Préparation des pièces justificatives' },
//           { name: 'Dépôt en préfecture', description: 'Dépôt du dossier complet' },
//           { name: 'Instruction du dossier', description: 'Traitement par les services' },
//           { name: 'Convocation et remise', description: 'Récupération du titre' }
//         ]
//       },
//       {
//         name: 'Regroupement familial',
//         description: 'Procédure de regroupement familial',
//         category: 'Famille',
//         steps: [
//           { name: 'Évaluation d\'éligibilité', description: 'Vérification des conditions' },
//           { name: 'Constitution du dossier', description: 'Rassemblement des pièces' },
//           { name: 'Dépôt OFII', description: 'Dépôt auprès de l\'OFII' },
//           { name: 'Instruction et décision', description: 'Traitement et réponse' }
//         ]
//       }
//     ];

//     for (const procData of procedureData) {
//       const procedure = await prisma.procedure.create({
//         data: {
//           name: procData.name,
//           description: procData.description,
//           price: faker.number.float({ min: 100, max: 500, multipleOf: 0.01 }),
//           estimatedDuration: faker.number.int({ min: 7, max: 60 }),
//           category: procData.category,
//           organizationId: ORG_ID,
//           isActive: faker.datatype.boolean({ probability: 0.9 }),
//         }
//       });

//       // Créer les étapes pour chaque procédure
//       for (let i = 0; i < procData.steps.length; i++) {
//         const stepData = procData.steps[i];
//         await prisma.stepProcedure.create({
//           data: {
//             name: stepData.name,
//             description: stepData.description,
//             price: faker.number.float({ min: 25, max: 150, multipleOf: 0.01 }),
//             order: i + 1,
//             estimatedDuration: faker.number.int({ min: 2, max: 15 }),
//             required: faker.datatype.boolean({ probability: 0.8 }),
//             procedureId: procedure.id,
//           }
//         });
//       }

//       procedures.push(procedure);
//     }

//     // 6. Créer des procédures clients avec Faker
//     console.log('👨‍💼 Création des procédures clients...');
    
//     const clientProcedures = [];
//     const statuses = ['IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

//     for (let i = 0; i < 15; i++) {
//       const client = faker.helpers.arrayElement(clientProfiles);
//       const procedure = faker.helpers.arrayElement(procedures);
//       const employee = faker.helpers.arrayElement(employees);
//       const status = faker.helpers.arrayElement(statuses);
      
//       const startDate = faker.date.past({ years: 1 });
//       const completionDate = status === 'COMPLETED' ? 
//         faker.date.between({ from: startDate, to: new Date() }) : null;

//       const clientProcedure = await prisma.clientProcedure.create({
//         data: {
//           clientId: client.id,
//           procedureId: procedure.id,
//           status: status as ProcedureStatus ,
//           startDate,
//           completionDate,
//           reference: generateReference(procedure.name.substring(0, 4).toUpperCase()),
//           notes: faker.lorem.sentences({ min: 1, max: 3 }),
//           assignedToId: employee.id,
//           managerId: admin.id,
//           organizationId: ORG_ID,
//           dueDate: faker.date.future({ years: 1, refDate: startDate }),
//         }
//       });
//       clientProcedures.push(clientProcedure);
//     }

//     // 7. Créer des étapes clients avec Faker
//     console.log('📋 Création des étapes clients...');
    
//     for (const clientProcedure of clientProcedures.slice(0, 10)) {
//       // Récupérer les étapes de la procédure
//       const steps = await prisma.stepProcedure.f({
//         where: { procedureId: clientProcedure.procedureId }
//       });

//       for (let i = 0; i < steps.length; i++) {
//         const step = steps[i];
//         const employee = faker.helpers.arrayElement(employees);
//         const stepStatus = faker.helpers.arrayElement(['COMPLETED', 'IN_PROGRESS', 'WAITING', 'SKIPPED']);
        
//         const startDate = faker.date.recent({ days: 30 });
//         const completionDate = stepStatus === 'COMPLETED' ? 
//           faker.date.between({ from: startDate, to: new Date() }) : null;

//         await prisma.clientStep.create({
//           data: {
//             clientProcedureId: clientProcedure.id,
//             stepId: step.id,
//             status: stepStatus,
//             startDate: i === 0 ? startDate : faker.date.recent({ days: 20 }),
//             completionDate,
//             processedById: employee.id,
//             notes: faker.lorem.sentence(),
//             price: faker.number.float({ min: 20, max: 200, multipleOf: 0.01 }),
//           }
//         });
//       }
//     }

//     // 8. Créer des documents clients avec Faker
//     console.log('📄 Création des documents...');
    
//     const documentTypes = ['ID', 'PASSPORT', 'PROOF_ADDRESS', 'BANK_STATEMENT', 'PHOTO', 'BIRTH_CERTIFICATE'];
//     const documentNames = [
//       'Carte d\'identité',
//       'Passeport',
//       'Justificatif de domicile',
//       'Relevé bancaire',
//       'Photo d\'identité',
//       'Acte de naissance'
//     ];

//     for (let i = 0; i < 30; i++) {
//       const clientProcedure = faker.helpers.arrayElement(clientProcedures);
//       const docType = faker.helpers.arrayElement(documentTypes);
//       const docName = faker.helpers.arrayElement(documentNames);
      
//       await prisma.clientDocument.create({
//         data: {
//           name: `${docName} - ${faker.person.lastName()}`,
//           type: docType,
//           fileUrl: `/uploads/documents/${faker.string.uuid()}.pdf`,
//           size: faker.number.int({ min: 500000, max: 5000000 }),
//           metadata: JSON.stringify({
//             uploadedBy: faker.person.fullName(),
//             originalName: `${docName.toLowerCase().replace(/\s+/g, '_')}.pdf`
//           }),
//           isConfidential: faker.datatype.boolean({ probability: 0.3 }),
//           clientProcedureId: clientProcedure.id,
//         }
//       });
//     }

//     // 9. Créer des factures avec Faker
//     console.log('💰 Création des factures...');
    
//     const invoiceStatuses = ['DRAFT', 'SENT', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'CANCELLED'];
//     const invoices = [];

//     for (let i = 0; i < 20; i++) {
//       const client = faker.helpers.arrayElement(clientProfiles);
//       const status = faker.helpers.arrayElement(invoiceStatuses);
//       const issuedDate = faker.date.past({ years: 1 });
//       const dueDate = faker.date.future({ years: 1, refDate: issuedDate });
//       const paidDate = status === 'PAID' ? faker.date.between({ from: issuedDate, to: dueDate }) : null;
      
//       const totalAmount = faker.number.float({ min: 100, max: 1000, multipleOf: 0.01 });
//       const tax = totalAmount * 0.2; // TVA 20%

//       const invoice = await prisma.invoice.create({
//         data: {
//           invoiceNumber: generateReference('FACT'),
//           totalAmount,
//           tax,
//           discount: faker.datatype.boolean({ probability: 0.3 }) ? 
//             faker.number.float({ min: 10, max: 50, multipleOf: 0.01 }) : null,
//           notes: faker.lorem.sentences({ min: 1, max: 2 }),
//           status: status  as InvoiceStatus,
//           issuedDate,
//           dueDate,
//           paidDate,
//           clientId: client.id,
//           createdById: admin.id,
//           organizationId: ORG_ID,
//         }
//       });
//       invoices.push(invoice);
//     }

//     // 10. Créer des lignes de factures avec Faker
//     console.log('📊 Création des lignes de factures...');
    
//     for (const invoice of invoices) {
//       const itemCount = faker.number.int({ min: 1, max: 4 });
      
//       for (let i = 0; i < itemCount; i++) {
//         const procedure = faker.helpers.arrayElement(procedures);
//         const quantity = faker.number.int({ min: 1, max: 3 });
//         const unitPrice = faker.number.float({ min: 50, max: 300, multipleOf: 0.01 });
        
//         await prisma.invoiceItem.create({
//           data: {
//             description: `${procedure.name} - ${faker.lorem.words(3)}`,
//             quantity,
//             unitPrice,
//             tax: 20.0,
//             discount: faker.datatype.boolean({ probability: 0.2 }) ? 
//               faker.number.float({ min: 5, max: 15, multipleOf: 0.01 }) : null,
//             invoiceId: invoice.id,
//             procedureId: procedure.id,
//           }
//         });
//       }
//     }

//     // 11. Créer des transactions avec Faker
//     console.log('💳 Création des transactions...');
    
//     const transactionTypes = ['EXPENSE', 'REVENUE', 'TRANSFER'];
//     const paymentMethods = ['CASH', 'BANK_TRANSFER', 'CREDIT_CARD', 'CHECK', 'MOBILE_PAYMENT'];
//     const transactionStatuses = ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'];

//     for (let i = 0; i < 50; i++) {
//       const type = faker.helpers.arrayElement(transactionTypes);
//       const status = faker.helpers.arrayElement(transactionStatuses);
//       const createdBy = faker.helpers.arrayElement([admin, ...employees]);
//       const approvedBy = status === 'APPROVED' ? admin : null;
//       const category = type === 'EXPENSE' ? 
//         faker.helpers.arrayElement(expenseCategories) : 
//         faker.helpers.arrayElement(revenueCategories);

//       const transaction = await prisma.transaction.create({
//         data: {
//           amount: faker.number.float({ min: 50, max: 2000, multipleOf: 0.01 }),
//           description: faker.finance.transactionDescription(),
//           type: type as TransactionType,
//           status: status as TransactionStatus,
//           date: faker.date.past({ years: 1 }),
//           reference: faker.finance.accountNumber(),
//           paymentMethod: faker.helpers.arrayElement(paymentMethods) as PaymentMethod,
//           attachments: faker.datatype.boolean({ probability: 0.4 }) ? 
//             `/uploads/receipts/${faker.string.uuid()}.pdf` : null,
//           createdById: createdBy.id,
//           approvedById: approvedBy?.id,
//           approvedAt: approvedBy ? faker.date.recent({ days: 30 }) : null,
//           organizationId: ORG_ID,
//           categoryId: category.id,
//           clientProcedureId: faker.datatype.boolean({ probability: 0.3 }) ? 
//             faker.helpers.arrayElement(clientProcedures).id : null,
//           procedureId: faker.datatype.boolean({ probability: 0.4 }) ? 
//             faker.helpers.arrayElement(procedures).id : null,
//         }
//       });

//       // Créer des revenus/dépenses détaillés
//       if (type === 'REVENUE') {
//         await prisma.revenue.create({
//           data: {
//             // source: faker..name(),
//             referenceNumber: faker.finance.accountNumber(),
//             transactionId: transaction.id,
//             createdById: createdBy.id,
//             organizationId: ORG_ID,
//             invoiceId: faker.datatype.boolean({ probability: 0.6 }) ? 
//               faker.helpers.arrayElement(invoices).id : null,
//           }
//         });
//       } else if (type === 'EXPENSE') {
//         await prisma.expense.create({
//           data: {
//             title: faker.commerce.productName(),
//             description: faker.lorem.sentences(2),
//             // vendor: faker..name(),
//             invoiceNumber: generateReference('FOURNISSEUR'),
//             invoiceDate: faker.date.past({ years: 1 }),
//             dueDate: faker.date.future({ years: 1 }),
//             transactionId: transaction.id,
//             createdById: createdBy.id,
//             organizationId: ORG_ID,
//           }
//         });
//       }
//     }

//     // 12. Créer des paramètres comptables avec Faker
//     console.log('⚙️ Création des paramètres comptables...');
    
//     await prisma.comptaSettings.create({
//       data: {
//         fiscalYear: faker.date.past({ years: 1 }),
//         taxIdentification: `FR${faker.string.numeric(11)}`,
//         currency: faker.helpers.arrayElement(['EUR', 'USD', 'GBP']),
//         defaultTaxRate: faker.number.float({ min: 15, max: 25, multipleOf: 0.5 }),
//         invoicePrefix: faker.helpers.arrayElement(['FACT', 'INV', 'FACTURE']),
//         invoiceNumberFormat: '{PREFIX}-{YEAR}-{NUM}',
//         organizationId: ORG_ID,
//       }
//     });

//     // 13. Créer des autorisations avec Faker
//     console.log('🔐 Création des autorisations...');
    
//     // Autorisations complètes pour l'admin
//     await prisma.authorization.create({
//       data: {
//         userId: admin.id,
//         ...Object.fromEntries(
//           Array.from({ length: 50 }, (_, i) => [
//             `can${['Create', 'Read', 'Edit', 'Delete'][i % 4]}${['Organization', 'Step', 'Client', 'Procedure', 'Transaction', 'Admin', 'Invoice', 'Expense', 'Revenue', 'ComptaSettings', 'ClientProcedure', 'ClientStep', 'ClientDocument'][Math.floor(i / 4) % 13]}`,
//             true
//           ])
//         ),
//         canChangeUserAuthorization: true,
//         canChangeUserPassword: true,
//       }
//     });

//     // Autorisations limitées pour les employés
//     for (const employee of employees) {
//       const permissions = {};
//       const entities = ['Client', 'Procedure', 'Transaction', 'ClientProcedure', 'ClientStep', 'ClientDocument'];
//       const actions = ['Create', 'Read', 'Edit'];
      
//       entities.forEach(entity => {
//         actions.forEach(action => {
//           permissions[`can${action}${entity}`] = faker.datatype.boolean({ probability: 0.7 });
//         });
//       });

//       await prisma.authorization.create({
//         data: {
//           userId: employee.id,
//           ...permissions,
//         }
//       });
//     }

//     // 14. Créer des sessions avec Faker
//     console.log('🔑 Création des sessions...');
    
//     const allUsers = [admin, ...employees, ...clients];
//     for (const user of allUsers.slice(0, 10)) {
//       await prisma.session.create({
//         data: {
//           userId: user.id,
//           token: `session_${faker.string.uuid()}`,
//           expiresAt: faker.date.future({ years: 1 }),
//           ipAddress: faker.internet.ip(),
//           activeorganizationId: ORG_ID,
//           userAgent: faker.internet.userAgent(),
//         }
//       });
//     }

//     // 15. Créer des invitations avec Faker
//     console.log('📨 Création des invitations...');
    
//     for (let i = 0; i < 5; i++) {
//       await prisma.invitation.create({
//         data: {
//           email: faker.internet.email(),
//           inviterId: admin.id,
//           organizationId: ORG_ID,
//           role: faker.helpers.arrayElement(['EMPLOYEE', 'USER']),
//           status: faker.helpers.arrayElement(['PENDING', 'ACCEPTED', 'EXPIRED']),
//           expiresAt: faker.date.future({ years: 1 }),
//         }
//       });
//     }

//     // 16. Créer du feedback avec Faker
//     console.log('💬 Création du feedback...');
    
//     const feedbackTypes = ['BUG', 'SUGGESTION', 'QUESTION', 'OTHER'];
//     const feedbackStatuses = ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];
//     const satisfactionLevels = ['POSITIVE', 'NEUTRAL', 'NEGATIVE'];
//     const impactLevels = ['CRITICAL', 'MAJOR', 'MINOR'];

//     for (let i = 0; i < 15; i++) {
//       const type = faker.helpers.arrayElement(feedbackTypes);
//       const isAnonymous = faker.datatype.boolean({ probability: 0.4 });
//       const user = isAnonymous ? null : faker.helpers.arrayElement(allUsers);

//       await prisma.feedback.create({
//         data: {
//           userId: user?.id,
//           type: type,
//           email: isAnonymous ? faker.internet.email() : user?.email,
//           name: isAnonymous ? faker.person.fullName() : user?.name,
//           isAnonymous,
//           subtype: faker.lorem.word(),
//           message: faker.lorem.paragraphs({ min: 1, max: 3 }),
//           rating: type === 'SUGGESTION' ? faker.number.int({ min: 1, max: 5 }) : null,
//           satisfaction: faker.helpers.arrayElement(satisfactionLevels),
//           impact: type === 'BUG' ? faker.helpers.arrayElement(impactLevels) : null,
//           pageUrl: faker.internet.url(),
//           browser: faker.internet.userAgent(),
//           device: faker.helpers.arrayElement(['Desktop', 'Mobile', 'Tablet']),
//           status: faker.helpers.arrayElement(feedbackStatuses),
//           assignedTo: faker.datatype.boolean({ probability: 0.6 }) ? admin.id : null,
//           response: faker.datatype.boolean({ probability: 0.4 }) ? faker.lorem.sentences(2) : null,
//           responseAt: faker.datatype.boolean({ probability: 0.4 }) ? faker.date.recent({ days: 10 }) : null,
//         }
//       });
//     }

//     console.log('✅ Données de test créées avec succès avec Faker !');
//     console.log(`📊 Résumé des données créées :`);
//     console.log(`- ${1 + employees.length + clients.length} utilisateurs`);
//     console.log(`- ${procedures.length} procédures avec étapes`);
//     console.log(`- ${clientProcedures.length} procédures clients`);
//     console.log(`- ${invoices.length} factures`);
//     console.log(`- 50+ transactions`);
//     console.log(`- 30 documents`);
//     console.log(`- ${teams.length} équipes`);
//     console.log(`- ${expenseCategories.length + revenueCategories.length} catégories`);
//     console.log(`- 15 feedbacks`);
//     console.log(`- Sessions, invitations, autorisations, etc.`);

//     return {
//       success: true,
//       message: 'Données de test créées avec succès avec Faker',
//       data: {
//         users: 1 + employees.length + clients.length,
//         procedures: procedures.length,
//         clientProcedures: clientProcedures.length,
//         invoices: invoices.length,
//         transactions: 50,
//         documents: 30,
//         teams: teams.length,
//         categories: expenseCategories.length + revenueCategories.length,
//         feedback: 15
//       }
//     };

//   } catch (error) {
//     console.error('❌ Erreur lors de la création des données de test:', error);
//     throw error;
//   } finally {
//     await prisma.$disconnect();
//   }
// }



// // Export des fonctions
// export { createFakeData };

// // Exécution si le script est appelé directement
// if (require.main === module) {
//   createFakeData()
//     .then(() => {
//       console.log('🎉 Script terminé avec succès !');
//       process.exit(0);
//     })
//     .catch((error) => {
//       console.error('💥 Erreur fatale:', error);
//       process.exit(1);
//     });
// }