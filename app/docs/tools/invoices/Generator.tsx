"use client";

import React, { useState, ChangeEvent } from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import BackButton from '@/layout/BackButton';

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

interface InvoicePDFProps {
  formData: FormData;
}

// Créer les styles dynamiquement avec la couleur choisie
const createStyles = (primaryColor: string) => StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 15,
    fontFamily: 'Helvetica',
    fontSize: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    backgroundColor: '#F8F9FA',
    padding: 10,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  companyInfo: {
    flexDirection: 'column',
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: primaryColor,
    marginBottom: 2,
  },
  companyDetail: {
    fontSize: 8,
    color: '#666',
    marginBottom: 1,
  },
  invoiceSection: {
    alignItems: 'flex-end',
  },
  invoiceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    backgroundColor: primaryColor,
    padding: 8,
    textAlign: 'center',
    marginBottom: 5,
  },
  invoiceInfo: {
    fontSize: 10,
    textAlign: 'right',
    marginBottom: 2,
  },
  clientSection: {
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  clientInfo: {
    width: '48%',
  },
  clientTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    color: primaryColor,
  },
  clientDetail: {
    fontSize: 9,
    marginBottom: 2,
    color: '#333',
  },
  table: {
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: primaryColor,
    color: '#FFF',
    padding: 5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#DDD',
    padding: 4,
  },
  tableCell: {
    fontSize: 9,
    textAlign: 'center',
    paddingHorizontal: 2,
  },
  tableCellLeft: {
    fontSize: 9,
    textAlign: 'left',
    paddingHorizontal: 2,
  },
  tableCellHeader: {
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFF',
    paddingHorizontal: 2,
  },
  totalSection: {
    alignSelf: 'flex-end',
    width: '40%',
    marginBottom: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: '#CCC',
    fontSize: 9,
  },
  totalFinal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    backgroundColor: primaryColor,
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 10,
  },
  summary: {
    marginBottom: 10,
  },
  summaryTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  summaryText: {
    fontSize: 9,
    marginBottom: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#CCC',
  },
  signature: {
    width: '45%',
    textAlign: 'center',
  },
  signatureTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 30,
    textDecoration: 'underline',
  },
  signatureName: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  bankInfo: {
    marginTop: 10,
    padding: 8,
    backgroundColor: '#F8F9FA',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bankTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 3,
    color: primaryColor,
  },
  bankDetail: {
    fontSize: 8,
    marginBottom: 1,
  },
});

// Composant PDF
const InvoicePDF: React.FC<InvoicePDFProps> = ({ formData }) => {
  const styles = createStyles(formData.primaryColor);
  
  const calculateTotal = (): number => {
    return formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const calculateTVA = (total: number): number => {
    return total * (formData.tvaRate / 100);
  };

  const total = calculateTotal();
  const tva = calculateTVA(total);
  const totalTTC = total + tva;

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 0 }).format(num);
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* En-tête */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            {formData.logoBase64 && (
              <Image style={styles.logo} src={formData.logoBase64} />
            )}
            <View style={styles.companyInfo}>
              <Text style={styles.companyName}>{formData.supplierName}</Text>
              {formData.supplierAddress && <Text style={styles.companyDetail}>{formData.supplierAddress}</Text>}
              {formData.supplierPhone1 && <Text style={styles.companyDetail}>{formData.supplierPhone1}</Text>}
              {formData.supplierEmail && <Text style={styles.companyDetail}>{formData.supplierEmail}</Text>}
            </View>
          </View>
          <View style={styles.invoiceSection}>
            <Text style={styles.invoiceTitle}>FACTURE</Text>
            <Text style={styles.invoiceInfo}>NIF : {formData.supplierNIF}</Text>
            <Text style={styles.invoiceInfo}>N° {formData.invoiceNumber}</Text>
            <Text style={styles.invoiceInfo}>{formData.city}, le {formData.date}</Text>
          </View>
        </View>

        {/* Informations client */}
        <View style={styles.clientSection}>
          <View style={styles.clientInfo}>
            <Text style={styles.clientTitle}>FACTURER À :</Text>
            <Text style={[styles.clientDetail, { fontWeight: 'bold' }]}>{formData.clientName}</Text>
            {formData.clientNIF && <Text style={styles.clientDetail}>NIF: {formData.clientNIF}</Text>}
            {formData.clientAddress && <Text style={styles.clientDetail}>{formData.clientAddress}</Text>}
            {formData.clientPhone && <Text style={styles.clientDetail}>Tél: {formData.clientPhone}</Text>}
            {formData.clientTVA && <Text style={styles.clientDetail}>TVA: {formData.clientTVA}</Text>}
          </View>
        </View>

        {/* Tableau des articles */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableCellHeader, { width: '8%' }]}>N°</Text>
            <Text style={[styles.tableCellHeader, { width: '42%' }]}>Description</Text>
            <Text style={[styles.tableCellHeader, { width: '12%' }]}>Qté</Text>
            <Text style={[styles.tableCellHeader, { width: '19%' }]}>P.U (FNG)</Text>
            <Text style={[styles.tableCellHeader, { width: '19%' }]}>Total (FNG)</Text>
          </View>
          
          {formData.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '8%' }]}>{index + 1}</Text>
              <Text style={[styles.tableCellLeft, { width: '42%' }]}>{item.description}</Text>
              <Text style={[styles.tableCell, { width: '12%' }]}>{item.quantity}</Text>
              <Text style={[styles.tableCell, { width: '19%' }]}>{formatNumber(item.unitPrice)}</Text>
              <Text style={[styles.tableCell, { width: '19%' }]}>{formatNumber(item.quantity * item.unitPrice)}</Text>
            </View>
          ))}
        </View>

        {/* Section totaux */}
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text>TOTAL HT :</Text>
            <Text>{formatNumber(total)} FNG</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>TVA ({formData.tvaRate}%) :</Text>
            <Text>{formatNumber(tva)} FNG</Text>
          </View>
          <View style={styles.totalFinal}>
            <Text>TOTAL TTC :</Text>
            <Text>{formatNumber(totalTTC)} FNG</Text>
          </View>
        </View>

        {/* Signatures */}
        <View style={styles.footer}>
          <View style={styles.signature}>
            <Text style={styles.signatureTitle}>Le Client</Text>
            <Text style={styles.signatureName}>{formData.clientName}</Text>
          </View>
          <View style={styles.signature}>
            <Text style={styles.signatureTitle}>Le Fournisseur</Text>
            <Text style={styles.signatureName}>{formData.supplierName}</Text>
          </View>
        </View>

        {/* Informations bancaires */}
        {(formData.bankName || formData.accountNumber) && (
          <View style={styles.bankInfo}>
            <View style={{ width: '60%' }}>
              <Text style={styles.bankTitle}>INFORMATIONS BANCAIRES</Text>
              {formData.bankName && <Text style={styles.bankDetail}>Banque: {formData.bankName}</Text>}
              {formData.accountName && <Text style={styles.bankDetail}>Titulaire: {formData.accountName}</Text>}
              {formData.accountNumber && <Text style={styles.bankDetail}>N° Compte: {formData.accountNumber}</Text>}
              {formData.swiftCode && <Text style={styles.bankDetail}>Code Swift: {formData.swiftCode}</Text>}
            </View>
            <View style={{ width: '35%' }}>
              <Text style={styles.bankTitle}>CONTACT</Text>
              {formData.supplierPhone2 && <Text style={styles.bankDetail}>{formData.supplierPhone2}</Text>}
              {formData.supplierEmail && <Text style={styles.bankDetail}>{formData.supplierEmail}</Text>}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
};

// Composant principal
const InvoiceGenerator: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    // Logo
    logoBase64: '',
    
    // Informations fournisseur
    supplierName: '',
    supplierNIF: '',
    supplierAddress: '',
    supplierPhone1: '',
    supplierPhone2: '',
    supplierEmail: '',
    
    // Informations client
    clientName: '',
    clientNIF: '',
    clientPhone: '',
    clientAddress: '',
    clientTVA: '',
    
    // Informations facture
    invoiceNumber: '',
    date: new Date().toISOString().split('T')[0],
    city: '',
    
    // Articles
    items: [
      { description: '', quantity: 0, unitPrice: 0 }
    ],
    
    // TVA
    tvaRate: 0,
    
    // Informations bancaires
    bankName: '',
    swiftCode: '',
    accountName: '',
    accountNumber: '',
    
    // Couleur principale
    primaryColor: '#FF6B35'
  });

  const handleInputChange = (field: keyof FormData, value: string | number): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: string | number): void => {
    const newItems = [...formData.items];
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index] = {
        ...newItems[index],
        [field]: typeof value === 'string' ? parseFloat(value) || 0 : value
      };
    } else {
      newItems[index] = {
        ...newItems[index],
        [field]: value as string
      };
    }
    setFormData(prev => ({
      ...prev,
      items: newItems
    }));
  };

  const addItem = (): void => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 0, unitPrice: 0 }]
    }));
  };

  const removeItem = (index: number): void => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        items: newItems
      }));
    }
  };

  const handleStringInputChange = (field: keyof FormData) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleInputChange(field, e.target.value);
  };

  const handleNumberInputChange = (field: keyof FormData) => (e: ChangeEvent<HTMLInputElement>) => {
    handleInputChange(field, parseFloat(e.target.value) || 0);
  };

  const handleItemStringChange = (index: number, field: keyof InvoiceItem) => (e: ChangeEvent<HTMLInputElement>) => {
    handleItemChange(index, field, e.target.value);
  };

  const handleItemNumberChange = (index: number, field: keyof InvoiceItem) => (e: ChangeEvent<HTMLInputElement>) => {
    handleItemChange(index, field, e.target.value);
  };

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFormData(prev => ({
          ...prev,
          logoBase64: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const predefinedColors = [
    '#FF6B35', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
    '#8B5CF6', '#06B6D4', '#84CC16', '#F97316', '#EC4899'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <BackButton />
        <h1 className="text-3xl font-bold text-center mb-8" style={{ color: formData.primaryColor }}>
          Générateur de Facture Professionnel
        </h1>

        <form className="space-y-6">
          {/* Configuration générale */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Logo de l&apos;entreprise
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {formData.logoBase64 && (
                  <img src={formData.logoBase64} alt="Logo" className="mt-2 h-16 w-16 object-contain border rounded" />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Couleur principale
                </label>
                <div className="flex gap-2 mb-2">
                  {predefinedColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleInputChange('primaryColor', color)}
                      className={`w-8 h-8 rounded-full border-2 ${formData.primaryColor === color ? 'border-gray-800' : 'border-gray-300'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={formData.primaryColor}
                  onChange={handleStringInputChange('primaryColor')}
                  className="w-full h-10 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Informations Fournisseur */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Informations Fournisseur</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l&apos;entreprise *
                </label>
                <input
                  type="text"
                  value={formData.supplierName}
                  onChange={handleStringInputChange('supplierName')}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NIF *
                </label>
                <input
                  type="text"
                  value={formData.supplierNIF}
                  onChange={handleStringInputChange('supplierNIF')}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse
                </label>
                <textarea
                  value={formData.supplierAddress}
                  onChange={handleStringInputChange('supplierAddress')}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone 1
                </label>
                <input
                  type="text"
                  value={formData.supplierPhone1}
                  onChange={handleStringInputChange('supplierPhone1')}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone 2
                </label>
                <input
                  type="text"
                  value={formData.supplierPhone2}
                  onChange={handleStringInputChange('supplierPhone2')}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.supplierEmail}
                  onChange={handleStringInputChange('supplierEmail')}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Informations Client */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Informations Client</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du Client *
                </label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={handleStringInputChange('clientName')}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NIF Client
                </label>
                <input
                  type="text"
                  value={formData.clientNIF}
                  onChange={handleStringInputChange('clientNIF')}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <input
                  type="text"
                  value={formData.clientPhone}
                  onChange={handleStringInputChange('clientPhone')}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  TVA Client
                </label>
                <input
                  type="text"
                  value={formData.clientTVA}
                  onChange={handleStringInputChange('clientTVA')}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse Client
                </label>
                <textarea
                  value={formData.clientAddress}
                  onChange={handleStringInputChange('clientAddress')}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Informations Facture */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Informations Facture</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Numéro de Facture *
                </label>
                <input
                  type="text"
                  value={formData.invoiceNumber}
                  onChange={handleStringInputChange('invoiceNumber')}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={handleStringInputChange('date')}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ville
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={handleStringInputChange('city')}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Taux TVA (%)
                </label>
                <input
                  type="number"
                  value={formData.tvaRate}
                  onChange={handleNumberInputChange('tvaRate')}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {/* Articles */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Articles</h2>
              <button
                type="button"
                onClick={addItem}
                className="px-4 py-2 rounded-md text-white hover:opacity-90 transition-colors"
                style={{ backgroundColor: formData.primaryColor }}
              >
                + Ajouter Article
              </button>
            </div>
            
            {formData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 bg-white rounded-md border">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={handleItemStringChange(index, 'description')}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantité *
                  </label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={handleItemNumberChange(index, 'quantity')}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    step="1"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prix Unitaire (FNG) *
                    </label>
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={handleItemNumberChange(index, 'unitPrice')}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="mt-6 bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Informations Bancaires */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Informations Bancaires (Optionnel)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de la Banque
                </label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={handleStringInputChange('bankName')}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code Swift
                </label>
                <input
                  type="text"
                  value={formData.swiftCode}
                  onChange={handleStringInputChange('swiftCode')}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du Titulaire du Compte
                </label>
                <input
                  type="text"
                  value={formData.accountName}
                  onChange={handleStringInputChange('accountName')}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Numéro de Compte
                </label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={handleStringInputChange('accountNumber')}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Aperçu des totaux */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Aperçu des Totaux</h2>
            <div className="bg-white p-4 rounded-md border max-w-md ml-auto">
              <div className="flex justify-between py-2 border-b">
                <span>Total HT:</span>
                <span>{new Intl.NumberFormat('fr-FR').format(formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0))} FNG</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span>TVA ({formData.tvaRate}%):</span>
                <span>{new Intl.NumberFormat('fr-FR').format(formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0) * (formData.tvaRate / 100))} FNG</span>
              </div>
              <div className="flex justify-between py-2 font-bold text-lg" style={{ color: formData.primaryColor }}>
                <span>Total TTC:</span>
                <span>{new Intl.NumberFormat('fr-FR').format(formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0) * (1 + formData.tvaRate / 100))} FNG</span>
              </div>
            </div>
          </div>

          {/* Bouton de génération */}
          <div className="text-center pt-6">
            <PDFDownloadLink
              document={<InvoicePDF formData={formData} />}
              fileName={`Facture_${formData.invoiceNumber || 'nouvelle'}_${formData.clientName.replace(/\s+/g, '_') || 'client'}.pdf`}
              className="inline-block px-8 py-4 rounded-lg font-semibold text-lg text-white hover:opacity-90 transition-colors shadow-lg"
              style={{ backgroundColor: formData.primaryColor }}
            >
              {({ loading }) =>
                loading ? 'Génération en cours...' : '📄 Générer la Facture PDF'
              }
            </PDFDownloadLink>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 p-4 rounded-lg mt-6">
            <h3 className="font-semibold text-blue-800 mb-2">Instructions:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Les champs marqués d&apos;un * sont obligatoires</li>
              <li>• Vous pouvez uploader un logo en format JPG, PNG ou SVG</li>
              <li>• La couleur principale peut être choisie parmi les couleurs prédéfinies ou personnalisée</li>
              <li>• Les informations bancaires sont optionnelles</li>
              <li>• La facture est optimisée pour tenir sur une page A4</li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceGenerator;