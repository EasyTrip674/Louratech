"use client";
import React from "react";
import { useModal } from "@/hooks/useModal";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { DollarSign} from "lucide-react";


// Types pour les données de facturation liées à un ClientStep


// Interfaces pour les types de données à afficher


export default function PaymentStepModal({
children
}: {children: React.ReactNode}) {
  const { isOpen, openModal, closeModal } = useModal();
  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={openModal}
        className="flex items-center gap-1 hover:bg-primary hover:text-white transition-colors"
      >
        <DollarSign className="w-4 h-4 mr-1 dark:text-white" />
        <span>Paiements</span>
      </Button>
      
      <Modal 
        isOpen={isOpen} 
        onClose={closeModal} 
        className="max-w-[800px] p-5 lg:p-8"
      >
     {children}
      </Modal>
    </>
  );
}