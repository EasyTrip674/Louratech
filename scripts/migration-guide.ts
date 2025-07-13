#!/usr/bin/env tsx

/**
 * Script de migration pour la nouvelle architecture
 * 
 * Ce script aide à identifier et migrer les anciennes actions vers la nouvelle architecture
 */

import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

interface MigrationItem {
  file: string;
  oldAction: string;
  newAction: string;
  status: 'pending' | 'migrated' | 'skipped';
  notes?: string;
}

class MigrationHelper {
  private migrationItems: MigrationItem[] = [];

  /**
   * Scanne le projet pour identifier les anciennes actions
   */
  async scanProject() {
    console.log('🔍 Scan du projet pour identifier les actions à migrer...');
    
    const actionFiles = await this.findActionFiles();
    
    for (const file of actionFiles) {
      const content = await readFile(file, 'utf-8');
      const actions = this.extractActions(content);
      
      for (const action of actions) {
        this.migrationItems.push({
          file,
          oldAction: action,
          newAction: this.generateNewActionName(action),
          status: 'pending',
          notes: this.analyzeAction(content)
        });
      }
    }
    
    console.log(`📋 Trouvé ${this.migrationItems.length} actions à migrer`);
  }

  /**
   * Trouve tous les fichiers d'actions
   */
  private async findActionFiles(): Promise<string[]> {
    const actionFiles: string[] = [];
    
    const scanDir = async (dir: string) => {
      try {
        const items = await readdir(dir, { withFileTypes: true });
        
        for (const item of items) {
          const fullPath = join(dir, item.name);
          
          if (item.isDirectory()) {
            await scanDir(fullPath);
          } else if (item.name.includes('.action.') && item.name.endsWith('.tsx')) {
            actionFiles.push(fullPath);
          }
        }
             } catch {
         // Ignore les erreurs de lecture de répertoire
       }
    };
    
    await scanDir('./app');
    await scanDir('./components');
    
    return actionFiles;
  }

  /**
   * Extrait les noms d'actions d'un fichier
   */
  private extractActions(content: string): string[] {
    const actionRegex = /export\s+const\s+(\w+)\s*=/g;
    const actions: string[] = [];
    let match;
    
    while ((match = actionRegex.exec(content)) !== null) {
      actions.push(match[1]);
    }
    
    return actions;
  }

  /**
   * Génère un nouveau nom d'action
   */
  private generateNewActionName(oldName: string): string {
    // Règles de transformation
    const transformations: Record<string, string> = {
      'doCreate': 'create',
      'doUpdate': 'update',
      'doEdit': 'update',
      'doDelete': 'delete',
      'doRemove': 'delete',
      'doAdd': 'create',
      'doSave': 'save',
    };
    
    let newName = oldName;
    
    for (const [pattern, replacement] of Object.entries(transformations)) {
      if (newName.startsWith(pattern)) {
        newName = newName.replace(pattern, replacement);
        break;
      }
    }
    
    // Ajouter le suffixe Action
    if (!newName.endsWith('Action')) {
      newName += 'Action';
    }
    
    return newName;
  }

  /**
   * Analyse une action pour déterminer le service à utiliser
   */
  private analyzeAction(content: string): string {
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('client')) {
      return 'Utiliser clientService';
    }
    
    if (lowerContent.includes('employee') || lowerContent.includes('admin')) {
      return 'Utiliser employeeService';
    }
    
    if (lowerContent.includes('transaction') || lowerContent.includes('revenue') || lowerContent.includes('expense')) {
      return 'Utiliser transactionService';
    }
    
    if (lowerContent.includes('procedure') || lowerContent.includes('step')) {
      return 'Utiliser procedureService';
    }
    
    if (lowerContent.includes('authorization') || lowerContent.includes('permission')) {
      return 'Utiliser authorizationService';
    }
    
    return 'Service à déterminer';
  }

  /**
   * Affiche le rapport de migration
   */
  showMigrationReport() {
    console.log('\n📊 RAPPORT DE MIGRATION');
    console.log('=' .repeat(50));
    
    const pending = this.migrationItems.filter(item => item.status === 'pending');
    const migrated = this.migrationItems.filter(item => item.status === 'migrated');
    const skipped = this.migrationItems.filter(item => item.status === 'skipped');
    
    console.log(`⏳ En attente: ${pending.length}`);
    console.log(`✅ Migrées: ${migrated.length}`);
    console.log(`⏭️  Ignorées: ${skipped.length}`);
    
    console.log('\n📋 DÉTAIL DES ACTIONS À MIGRER:');
    console.log('-' .repeat(50));
    
    for (const item of this.migrationItems) {
      const status = item.status === 'pending' ? '⏳' : 
                    item.status === 'migrated' ? '✅' : '⏭️';
      
      console.log(`${status} ${item.oldAction} → ${item.newAction}`);
      console.log(`   Fichier: ${item.file}`);
      console.log(`   Note: ${item.notes}`);
      console.log('');
    }
  }

  /**
   * Génère un template pour une nouvelle action
   */
  generateActionTemplate(oldAction: string, serviceName: string): string {
    const newActionName = this.generateNewActionName(oldAction);
    const methodName = this.extractMethodName(oldAction);
    
    return `"use server";

import { adminAction } from "@/lib/safe-action";
import { ${serviceName} } from "@/lib/services";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// TODO: Définir le schéma de validation
const ${methodName}Schema = z.object({
  // Ajouter les champs nécessaires
});

export const ${newActionName} = adminAction
  .metadata({ actionName: "${methodName}" })
  .schema(${methodName}Schema)
  .action(async ({ clientInput }) => {
    try {
      // TODO: Implémenter la logique avec le service
      const result = await ${serviceName}.${methodName}(clientInput);
      
      revalidatePath("/path/to/revalidate");
      
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Erreur inconnue" 
      };
    }
  });`;
  }

  /**
   * Extrait le nom de la méthode du nom de l'action
   */
  private extractMethodName(actionName: string): string {
    // Supprimer les préfixes
    let methodName = actionName;
    
    const prefixes = ['doCreate', 'doUpdate', 'doEdit', 'doDelete', 'doRemove', 'doAdd', 'doSave'];
    
    for (const prefix of prefixes) {
      if (methodName.startsWith(prefix)) {
        methodName = methodName.replace(prefix, '');
        break;
      }
    }
    
    // Convertir en camelCase
    return methodName.charAt(0).toLowerCase() + methodName.slice(1);
  }

  /**
   * Génère des exemples de migration
   */
  generateMigrationExamples() {
    console.log('\n📝 EXEMPLES DE MIGRATION');
    console.log('=' .repeat(50));
    
    const examples = [
      {
        oldAction: 'doCreateClient',
        service: 'clientService',
        method: 'createClient'
      },
      {
        oldAction: 'doUpdateEmployee',
        service: 'employeeService',
        method: 'updateEmployee'
      },
      {
        oldAction: 'doDeleteTransaction',
        service: 'transactionService',
        method: 'deleteTransaction'
      }
    ];
    
    for (const example of examples) {
      console.log(`\n🔄 Migration de ${example.oldAction}:`);
      console.log(this.generateActionTemplate(example.oldAction, example.service));
    }
  }
}

// Exécution du script
async function main() {
  const migrationHelper = new MigrationHelper();
  
  console.log('🚀 Démarrage de l\'assistant de migration...\n');
  
  await migrationHelper.scanProject();
  migrationHelper.showMigrationReport();
  migrationHelper.generateMigrationExamples();
  
  console.log('\n✅ Analyse terminée !');
  console.log('\n📚 Prochaines étapes:');
  console.log('1. Migrer les actions une par une');
  console.log('2. Tester chaque migration');
  console.log('3. Mettre à jour les imports dans les composants');
  console.log('4. Supprimer les anciennes actions');
}

if (require.main === module) {
  main().catch(console.error);
}

export { MigrationHelper }; 