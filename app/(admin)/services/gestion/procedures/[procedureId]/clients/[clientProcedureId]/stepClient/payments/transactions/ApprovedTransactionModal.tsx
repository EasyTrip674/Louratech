"use client";
import React, { useState } from "react";
import { useModal } from "@/hooks/useModal";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { DollarSign, CheckCircle, AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { doApproveTransaction } from "./create.step.transaction.action";

interface ApprovedTransactionModalProps {
  transactionId: string;
  amount: number;
  paymentMethod: string;
  date: string;
  status: "APPROVED" | "PENDING" | "REJECTED";
}

export default function ApprovedTransactionModal({
  amount,
  paymentMethod,
  date,
  status,
  transactionId,
}: ApprovedTransactionModalProps) {
  const mainModal = useModal();
  const confirmModal = useModal();
  const [isApproved, setIsApproved] = useState(status === "APPROVED");

  const approvedMutate = useMutation({
    mutationFn: async () => {
      const result = await doApproveTransaction({ transactionId });
      if (result?.data?.success) {
        setIsApproved(true);
        mainModal.closeModal();
        confirmModal.closeModal();
      }
      return result;
    },
    onError: (error) => {
      console.error("Approval failed:", error);
      // Optionally show error toast or notification
    },
  });

  const handleApproveClick = () => {
    mainModal.closeModal();
    confirmModal.openModal();
  };

  const handleConfirmApproval = () => {
    approvedMutate.mutate();
  };

  return (
    <>
      <button
        onClick={handleApproveClick}
        className={`flex items-center gap-2 transition-colors duration-300 my-2 ${
          isApproved 
            ? "text-green-600 cursor-default" 
            : "hover:text-primary hover:underline"
        }`}
        disabled={isApproved}
      >
        {isApproved ? "" : "Approuver ?"}
      </button>

      {/* Main Transaction Details Modal */}
      <Modal
        isOpen={mainModal.isOpen}
        onClose={mainModal.closeModal}
        className="max-w-[500px] rounded-lg shadow-xl"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <CheckCircle className="text-green-500" />
              Détails de la Transaction
            </h3>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-4 mb-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Montant:</p>
                <p className="text-lg font-bold text-green-600">
                  {formatCurrency(amount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  Méthode de paiement:
                </p>
                <p className="text-sm text-gray-800 dark:text-gray-200">
                  {paymentMethod}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Date:</p>
                <p className="text-sm text-gray-800 dark:text-gray-200">{date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  Statut:
                </p>
                <p 
                  className={`text-sm font-medium ${
                    isApproved 
                      ? "text-green-600" 
                      : "text-yellow-600"
                  }`}
                >
                  {isApproved ? "Approuvé" : "En attente"}
                </p>
              </div>
            </div>
          </div>

          {!isApproved && (
            <Button
              variant="primary"
              size="md"
              className="w-full"
              onClick={handleApproveClick}
            >
              Procéder à l'approbation
            </Button>
          )}
        </div>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmModal.isOpen}
        onClose={confirmModal.closeModal}
        className="max-w-[400px] rounded-lg shadow-xl"
      >
        <div className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="text-yellow-500 w-16 h-16" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
            Confirmer l'approbation
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Êtes-vous sûr de vouloir approuver cette transaction de{" "}
            <span className="font-bold text-green-600">
              {formatCurrency(amount)}
            </span> ?
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              size="md"
              onClick={confirmModal.closeModal}
            >
              Annuler
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleConfirmApproval}
              disabled={approvedMutate.isPending}
            >
              {approvedMutate.isPending ? "Chargement..." : "Confirmer"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}