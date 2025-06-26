import React from 'react';
import {  Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

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

// Créer les styles pour occuper toute la page A4
const createStyles = (primaryColor: string) => StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 20,
    fontFamily: 'Helvetica',
    fontSize: 10,
    height: '100%',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 8,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  companyInfo: {
    flexDirection: 'column',
    flex: 1,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: primaryColor,
    marginBottom: 3,
  },
  companyDetail: {
    fontSize: 9,
    color: '#666',
    marginBottom: 2,
  },
  invoiceSection: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    backgroundColor: primaryColor,
    padding: 12,
    textAlign: 'center',
    marginBottom: 8,
    borderRadius: 6,
    minWidth: 120,
  },
  invoiceInfo: {
    fontSize: 10,
    textAlign: 'right',
    marginBottom: 3,
    color: '#333',
  },
  clientSection: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  clientInfo: {
    width: '48%',
    backgroundColor: '#FAFAFA',
    padding: 12,
    borderRadius: 6,
  },
  clientTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 8,
    color: primaryColor,
    borderBottom: `2px solid ${primaryColor}`,
    paddingBottom: 3,
  },
  clientDetail: {
    fontSize: 10,
    marginBottom: 3,
    color: '#333',
  },
  table: {
    marginBottom: 20,
    flex: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: primaryColor,
    color: '#FFF',
    padding: 8,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    padding: 6,
    backgroundColor: '#FEFEFE',
  },
  tableRowAlt: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    padding: 6,
    backgroundColor: '#F9FAFB',
  },
  tableCell: {
    fontSize: 9,
    textAlign: 'center',
    paddingHorizontal: 4,
    alignSelf: 'center',
  },
  tableCellLeft: {
    fontSize: 9,
    textAlign: 'left',
    paddingHorizontal: 4,
    alignSelf: 'center',
  },
  tableCellHeader: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFF',
    paddingHorizontal: 4,
  },
  totalSection: {
    alignSelf: 'flex-end',
    width: '45%',
    marginBottom: 20,
    borderRadius: 6,
    overflow: 'hidden',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    fontSize: 10,
    backgroundColor: '#F9FAFB',
  },
  totalFinal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: primaryColor,
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 2,
    borderTopColor: primaryColor,
  },
  signature: {
    width: '45%',
    textAlign: 'center',
    backgroundColor: '#F8F9FA',
    padding: 15,
    borderRadius: 6,
  },
  signatureTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 35,
    textDecoration: 'underline',
    color: primaryColor,
  },
  signatureName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  bankInfo: {
    marginTop: 15,
    padding: 12,
    backgroundColor: '#F0F9FF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E0F2FE',
  },
  bankTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 5,
    color: primaryColor,
  },
  bankDetail: {
    fontSize: 9,
    marginBottom: 2,
    color: '#374151',
  },
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(-45deg)',
    fontSize: 60,
    color: '#F3F4F6',
    opacity: 0.1,
    zIndex: -1,
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

  const formatNumber =  (amount?: number) => {
    return (amount ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Filigrane */}
        <Text style={styles.watermark}>FACTURE</Text>
        
        <View style={styles.content}>
          {/* En-tête */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              {formData.logoBase64 && (
                <Image style={styles.logo} src={formData.logoBase64} />
              )}
              <View style={styles.companyInfo}>
                <Text style={styles.companyName}>{formData.supplierName}</Text>
                {formData.supplierNIF && <Text style={styles.companyDetail}>NIF: {formData.supplierNIF}</Text>}
                {formData.supplierAddress && <Text style={styles.companyDetail}>{formData.supplierAddress}</Text>}
                {formData.supplierPhone1 && <Text style={styles.companyDetail}>Tél: {formData.supplierPhone1}</Text>}
                {formData.supplierEmail && <Text style={styles.companyDetail}>Email: {formData.supplierEmail}</Text>}
              </View>
            </View>
            <View style={styles.invoiceSection}>
              <Text style={styles.invoiceTitle}>FACTURE</Text>
              <Text style={styles.invoiceInfo}>N° {formData.invoiceNumber}</Text>
              <Text style={styles.invoiceInfo}>{formData.city}, le {formData.date}</Text>
            </View>
          </View>

          {/* Informations client */}
          <View style={styles.clientSection}>
            <View style={styles.clientInfo}>
              <Text style={styles.clientTitle}>FACTURER À</Text>
              <Text style={[styles.clientDetail, { fontWeight: 'bold', fontSize: 11 }]}>{formData.clientName}</Text>
              {formData.clientNIF && <Text style={styles.clientDetail}>NIF: {formData.clientNIF}</Text>}
              {formData.clientAddress && <Text style={styles.clientDetail}>{formData.clientAddress}</Text>}
              {formData.clientPhone && <Text style={styles.clientDetail}>Tél: {formData.clientPhone}</Text>}
              {formData.clientTVA && <Text style={styles.clientDetail}>N° TVA: {formData.clientTVA}</Text>}
            </View>
            <View style={styles.clientInfo}>
              <Text style={styles.clientTitle}>INFORMATIONS</Text>
              <Text style={styles.clientDetail}>Date d&apos;émission: {formData.date}</Text>
              <Text style={styles.clientDetail}>Lieu: {formData.city}</Text>
              <Text style={styles.clientDetail}>Devise: Franc Guinéen (FNG)</Text>
              <Text style={styles.clientDetail}>Taux TVA: {formData.tvaRate}%</Text>
            </View>
          </View>

          {/* Tableau des articles */}
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCellHeader, { width: '8%' }]}>N°</Text>
              <Text style={[styles.tableCellHeader, { width: '45%' }]}>DESCRIPTION</Text>
              <Text style={[styles.tableCellHeader, { width: '12%' }]}>QTÉ</Text>
              <Text style={[styles.tableCellHeader, { width: '17%' }]}>P.U (FNG)</Text>
              <Text style={[styles.tableCellHeader, { width: '18%' }]}>TOTAL (FNG)</Text>
            </View>
            
            {formData.items.map((item, index) => (
              <View key={index} style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                <Text style={[styles.tableCell, { width: '8%' }]}>{index + 1}</Text>
                <Text style={[styles.tableCellLeft, { width: '45%' }]}>{item.description}</Text>
                <Text style={[styles.tableCell, { width: '12%' }]}>{item.quantity}</Text>
                <Text style={[styles.tableCell, { width: '17%' }]}>{formatNumber(item.unitPrice)}</Text>
                <Text style={[styles.tableCell, { width: '18%' }]}>{formatNumber(item.quantity * item.unitPrice)}</Text>
              </View>
            ))}
          </View>

          {/* Section totaux */}
          <View style={styles.totalSection}>
            <View style={styles.totalRow}>
              <Text>SOUS-TOTAL HT :</Text>
              <Text>{formatNumber(total)} FNG</Text>
            </View>
            <View style={styles.totalRow}>
              <Text>TVA ({formData.tvaRate}%) :</Text>
              <Text>{formatNumber(tva)} FNG</Text>
            </View>
            <View style={styles.totalFinal}>
              <Text>TOTAL À PAYER :</Text>
              <Text>{formatNumber(totalTTC)} FNG</Text>
            </View>
          </View>
        </View>

        {/* Signatures */}
        <View style={styles.footer}>
          <View style={styles.signature}>
            <Text style={styles.signatureTitle}>SIGNATURE DU CLIENT</Text>
            <Text style={styles.signatureName}>{formData.clientName}</Text>
          </View>
          <View style={styles.signature}>
            <Text style={styles.signatureTitle}>SIGNATURE DU FOURNISSEUR</Text>
            <Text style={styles.signatureName}>{formData.supplierName}</Text>
          </View>
        </View>

        {/* Informations bancaires */}
        {(formData.bankName || formData.accountNumber) && (
          <View style={styles.bankInfo}>
            <View style={{ width: '55%' }}>
              <Text style={styles.bankTitle}>COORDONNÉES BANCAIRES</Text>
              {formData.bankName && <Text style={styles.bankDetail}>Banque: {formData.bankName}</Text>}
              {formData.accountName && <Text style={styles.bankDetail}>Titulaire: {formData.accountName}</Text>}
              {formData.accountNumber && <Text style={styles.bankDetail}>N° Compte: {formData.accountNumber}</Text>}
              {formData.swiftCode && <Text style={styles.bankDetail}>Code Swift: {formData.swiftCode}</Text>}
            </View>
            <View style={{ width: '40%' }}>
              <Text style={styles.bankTitle}>CONTACT SUPPORT</Text>
              {formData.supplierPhone2 && <Text style={styles.bankDetail}>Tél Support: {formData.supplierPhone2}</Text>}
              {formData.supplierEmail && <Text style={styles.bankDetail}>Email: {formData.supplierEmail}</Text>}
              <Text style={styles.bankDetail}>Merci pour votre confiance!</Text>
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
};


export default InvoicePDF;