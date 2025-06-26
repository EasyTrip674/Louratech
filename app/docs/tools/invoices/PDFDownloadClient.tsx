'use client';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from './InvoicePDF'; // tu peux aussi passer ça en props
import React from 'react';

// Types TypeScript
interface InvoiceItem {
    description: string;
    quantity: number;
    unitPrice: number;
  }

interface FormData {
    // Logo
    logoBase64: string;
    
    // Informations fournisseur
    supplierName: string;
    supplierNIF: string;
    supplierAddress: string;
    supplierPhone1: string;
    supplierPhone2: string;
    supplierEmail: string;
    
    // Informations client
    clientName: string;
    clientNIF: string;
    clientPhone: string;
    clientAddress: string;
    clientTVA: string;
    
    // Informations facture
    invoiceNumber: string;
    date: string;
    city: string;
    
    // Articles
    items: InvoiceItem[];
    
    // TVA
    tvaRate: number;
    
    // Informations bancaires
    bankName: string;
    swiftCode: string;
    accountName: string;
    accountNumber: string;
    
    // Couleur principale
    primaryColor: string;
  }

interface Props {
  formData: FormData; // mets ton vrai type ici si besoin
  primaryColor: string;
}

const PDFDownloadClient: React.FC<Props> = ({ formData, primaryColor }) => {
  return (
    <PDFDownloadLink
      document={<InvoicePDF formData={formData} />}
      fileName={`Facture_${formData.invoiceNumber || 'nouvelle'}_${formData.clientName.replace(/\s+/g, '_') || 'client'}.pdf`}
      className="inline-block px-8 py-4 rounded-lg font-semibold text-lg text-white hover:opacity-90 transition-colors shadow-lg"
      style={{ backgroundColor: primaryColor }}
    >
      {({ loading }) => (loading ? 'Génération en cours...' : '📄 Générer la Facture PDF')}
    </PDFDownloadLink>
  );
};

export default PDFDownloadClient;
