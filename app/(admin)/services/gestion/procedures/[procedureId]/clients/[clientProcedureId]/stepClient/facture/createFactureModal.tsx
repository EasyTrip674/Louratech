"use client";
import React from "react";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { useModal } from "@/hooks/useModal";
import { Banknote } from "lucide-react";

export default function CreateFactureModal({
    clientStepId,
}: {
  clientStepId: string;
}) {
  const { isOpen, openModal, closeModal } = useModal();

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle invoice creation logic here
    closeModal();
  };

  return (
    <>
      <Button variant="outline" size="sm" className="flex items-center" onClick={openModal}>
        <Banknote className="w-4 h-4 mr-1" />
        Créer une facture
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[584px] p-5 lg:p-10"
      >
        <form onSubmit={handleCreateInvoice}>
          <h4 className="mb-6 text-lg font-medium text-gray-800 dark:text-white/90">
            Créer une nouvelle facture
          </h4>

          <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            <div className="col-span-1">
              <Label>Numéro de facture</Label>
              <Input type="text" placeholder="FAC-2024-001" />
            </div>

            <div className="col-span-1">
              <Label>Date de facturation</Label>
              <Input type="date" />
            </div>

            <div className="col-span-1">
              <Label>Date d'échéance</Label>
              <Input type="date" />
            </div>

            <div className="col-span-1">
              <Label>Taux de TVA (%)</Label>
              <Input type="number" placeholder="20" />
            </div>

            <div className="col-span-2">
              <Label>Description</Label>
              <Input type="text" placeholder="Description de la prestation" />
            </div>

            <div className="col-span-1">
              <Label>Quantité</Label>
              <Input type="number" placeholder="1" min="1" />
            </div>

            <div className="col-span-1">
              <Label>Prix unitaire HT</Label>
              <Input type="number" placeholder="0.00" step="0.01" min="0" />
            </div>

            <div className="col-span-2">
              <Label>Notes additionnelles</Label>
              <Input type="text" placeholder="Notes ou commentaires sur la facture" />
            </div>
          </div>

          <div className="flex items-center justify-end w-full gap-3 mt-6">
            <Button size="sm" variant="outline" onClick={closeModal} type="button">
              Annuler
            </Button>
            <Button size="sm" type="submit">
              Créer la facture
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
