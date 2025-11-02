"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { AlertTriangle, Trash } from "lucide-react";

export interface DeleteConfirmationModalProps {
  /** Modal ouvert/fermé */
  isOpen: boolean;
  /** Fonction pour fermer le modal */
  onClose: () => void;
  /** Fonction appelée lors de la confirmation */
  onConfirm: () => void | Promise<void>;
  /** Nom de l'entité (ex: "client", "employé", "procédure") */
  entityType: string;
  /** Nom de l'item à supprimer (pour la confirmation) */
  itemName: string;
  /** Message d'avertissement principal */
  warningMessage?: ReactNode;
  /** Message d'avertissement secondaire */
  warningSubMessage?: ReactNode;
  /** Titre du modal */
  title?: string;
  /** Texte du bouton de confirmation */
  confirmButtonText?: string;
  /** État de chargement */
  isLoading?: boolean;
  /** Afficher la confirmation par saisie du nom */
  requireNameConfirmation?: boolean;
  /** Contenu additionnel à afficher après la confirmation du nom */
  children?: ReactNode;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  entityType,
  itemName,
  warningMessage,
  warningSubMessage,
  title,
  confirmButtonText = "Confirmer la suppression",
  isLoading = false,
  requireNameConfirmation = true,
  children,
}: DeleteConfirmationModalProps) {
  const [nameInput, setNameInput] = useState("");
  const [nameMatch, setNameMatch] = useState(false);

  const defaultTitle = `Supprimer ${entityType}`;
  const modalTitle = title || defaultTitle;

  useEffect(() => {
    if (requireNameConfirmation) {
      setNameMatch(nameInput.trim().toLowerCase() === itemName.trim().toLowerCase());
    } else {
      setNameMatch(true);
    }
  }, [nameInput, itemName, requireNameConfirmation]);

  useEffect(() => {
    if (!isOpen) {
      setNameInput("");
      setNameMatch(false);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    if (!nameMatch) return;
    await onConfirm();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[584px] p-5 lg:p-10">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <h4 className="text-lg font-medium text-red-700 dark:text-red-400">
            {modalTitle}
          </h4>
        </div>

        <div className="p-4 mb-6 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/10 dark:border-red-900/30">
          {warningMessage ? (
            <div className="text-sm text-red-700 dark:text-red-300">
              {warningMessage}
            </div>
          ) : (
            <p className="text-sm text-red-700 dark:text-red-300">
              <strong>Attention :</strong> Vous êtes sur le point de supprimer définitivement {entityType} <span className="font-medium">{itemName}</span>.
            </p>
          )}
          {warningSubMessage && (
            <div className="mt-2 text-sm text-red-700 dark:text-red-300">
              {warningSubMessage}
            </div>
          )}
        </div>

        {requireNameConfirmation && (
          <div className="border-b border-gray-200 dark:border-gray-800 pb-6">
            <Label className="block mb-2">
              Pour confirmer la suppression, veuillez saisir le nom{" "}
              <span className="font-medium text-amber-600 dark:text-amber-300">
                {itemName}
              </span>
            </Label>
            <Input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              type="text"
              placeholder={`Saisir "${itemName}"`}
              className={`${nameMatch && nameInput ? "border-green-500 dark:border-green-500" : ""}`}
            />

            {nameMatch && nameInput && (
              <div className="flex items-center gap-2 mt-2 text-green-600 dark:text-green-400">
                <div className="flex-shrink-0">
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-xs font-medium">Le nom correspond</p>
              </div>
            )}
          </div>
        )}

        {/* Additional custom content */}
        {children}

        <div className="flex items-center justify-end w-full gap-3 mt-6">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={isLoading || !nameMatch}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-600"
            onClick={handleConfirm}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Suppression...
              </>
            ) : (
              <>
                <Trash className="w-4 h-4 mr-2" />
                {confirmButtonText}
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
