"use client";

import { ClientStepPaymentInfo } from '@/db/queries/procedures.query';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// PDF Styles avec design moderne et compatible avec les limitations de react-pdf
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    color: '#1E293B',
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 40,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    borderBottomStyle: 'solid',
  },
  logo: {
    width: 120,
    height: 60,
  },
  invoiceInfo: {
    alignItems: 'flex-end',
  },
  invoiceTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 10,
  },
  invoiceDetail: {
    fontSize: 10,
    color: '#64748B',
    marginBottom: 4,
  },
  invoiceReference: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  section: {
    marginBottom: 25,
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  companyInfoSection: {
    width: '48%',
    padding: 15,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
  },
  clientInfoSection: {
    width: '48%',
    padding: 15,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2563EB',
  },
  sectionText: {
    fontSize: 10,
    marginBottom: 3,
    color: '#1E293B',
  },
  sectionTextBold: {
    fontSize: 10,
    marginBottom: 3,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  table: {
    marginVertical: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#2563EB',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    padding: 10,
  },
  tableHeaderCell: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    borderBottomStyle: 'solid',
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  tableRowEven: {
    backgroundColor: '#EFF6FF',
  },
  tableCell: {
    fontSize: 10,
    color: '#1E293B',
  },
  col1: { width: '40%' },
  col2: { width: '15%' },
  col3: { width: '15%' },
  col4: { width: '15%' },
  col5: { width: '15%', textAlign: 'right' },
  
  totals: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '40%',
    marginBottom: 5,
    padding: 5,
  },
  totalLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  totalValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  grandTotalContainer: {
    backgroundColor: '#2563EB',
    padding: 10,
    borderRadius: 4,
    width: '40%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  grandTotalLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  grandTotalValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  notesSection: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#DBEAFE',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
    borderLeftStyle: 'solid',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    borderTopStyle: 'solid',
    paddingTop: 20,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 10,
    color: '#64748B',
    marginBottom: 2,
  },
  footerHighlight: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2563EB',
    marginTop: 5,
  },
  paymentInfoBox: {
    marginTop: 30,
    padding: 15,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
  },
  paymentInfoTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2563EB',
    marginBottom: 10,
  },
  paymentInfoRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  paymentInfoLabel: {
    fontSize: 9,
    width: '30%',
    fontWeight: 'bold',
    color: '#64748B',
  },
  paymentInfoValue: {
    fontSize: 9,
    width: '70%',
    color: '#1E293B',
  },
});

// PDF Document Component
const InvoicePDF = ({ transaction }: {
  transaction: ClientStepPaymentInfo["transactions"][0]
}) => {
  // Format la date

  // Statut avec texte
  const getStatusText = (status?: string) => {
    if (!status) return '-';
    return status;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* En-tête */}
        <View style={styles.header}>
          <View>
            <Text style={styles.invoiceTitle}>FACTURE</Text>
            <Text style={styles.invoiceReference}>{`Facture N° ${transaction?.reference || '---'}`}</Text>
          </View>
          
          <View style={styles.invoiceInfo}>
            <Image style={styles.logo} src="/assets/logo.svg" />
            <Text style={styles.invoiceDetail}>{`Date d'émission: ${formatDate(transaction?.date)}`}</Text>
            <Text style={styles.invoiceDetail}>{`Date d'échéance: ${formatDate(transaction?.approvedAt || "")}`}</Text>
            <Text style={styles.invoiceDetail}>{`Statut: ${getStatusText(transaction?.status)}`}</Text>
          </View>
        </View>

        {/* Informations entreprise et client */}
        <View style={styles.flexRow}>
          <View style={styles.companyInfoSection}>
            <Text style={styles.sectionTitle}>NOTRE ENTREPRISE</Text>
            <Text style={styles.sectionText}>Your Company Name</Text>
            <Text style={styles.sectionText}>123 Business Street</Text>
            <Text style={styles.sectionText}>Business City, 12345</Text>
            <Text style={styles.sectionText}>N° TVA: FR123456789</Text>
            <Text style={styles.sectionText}>Tél: +123 456 7890</Text>
            <Text style={styles.sectionText}>Email: contact@yourcompany.com</Text>
          </View>

          <View style={styles.clientInfoSection}>
            <Text style={styles.sectionTitle}>FACTURÉ À</Text>
            <Text style={styles.sectionTextBold}>{transaction?.approvedBy?.name || 'Client'}</Text>
            <Text style={styles.sectionText}>{transaction?.approvedBy?.email || 'email@client.com'}</Text>
          </View>
        </View>

        {/* Tableau détaillé */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.col1]}>Description</Text>
            <Text style={[styles.tableHeaderCell, styles.col2]}>Date</Text>
            <Text style={[styles.tableHeaderCell, styles.col3]}>Catégorie</Text>
            <Text style={[styles.tableHeaderCell, styles.col4]}>Référence</Text>
            <Text style={[styles.tableHeaderCell, styles.col5]}>Montant</Text>
          </View>
          
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.col1]}>{transaction?.description || 'Service fourni'}</Text>
            <Text style={[styles.tableCell, styles.col2]}>{formatDate(transaction?.date)}</Text>
            <Text style={[styles.tableCell, styles.col3]}>{getStatusText(transaction?.status)}</Text>
            <Text style={[styles.tableCell, styles.col4]}>{transaction?.reference || '-'}</Text>
            <Text style={[styles.tableCell, styles.col5]}>{formatCurrency(transaction?.amount || 0)}</Text>
          </View>
        </View>

        {/* Totaux */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Sous-total</Text>
            <Text style={styles.totalValue}>{formatCurrency(transaction?.amount || 0)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TVA (0%)</Text>
            <Text style={styles.totalValue}>{formatCurrency(0)}</Text>
          </View>
          <View style={styles.grandTotalContainer}>
            <Text style={styles.grandTotalLabel}>TOTAL</Text>
            <Text style={styles.grandTotalValue}>{formatCurrency(transaction?.amount || 0)}</Text>
          </View>
        </View>

        {/* Notes */}
        {transaction?.description && (
          <View style={styles.notesSection}>
            <Text style={styles.sectionTitle}>NOTES</Text>
            <Text style={styles.sectionText}>{transaction?.description}</Text>
          </View>
        )}

        {/* Informations de paiement */}
        <View style={styles.paymentInfoBox}>
          <Text style={styles.paymentInfoTitle}>INFORMATIONS DE PAIEMENT</Text>
          <View style={styles.paymentInfoRow}>
            <Text style={styles.paymentInfoLabel}>Banque:</Text>
            <Text style={styles.paymentInfoValue}>International Bank</Text>
          </View>
          <View style={styles.paymentInfoRow}>
            <Text style={styles.paymentInfoLabel}>IBAN:</Text>
            <Text style={styles.paymentInfoValue}>FR76 1234 5678 9012 3456 7890 123</Text>
          </View>
          <View style={styles.paymentInfoRow}>
            <Text style={styles.paymentInfoLabel}>BIC/SWIFT:</Text>
            <Text style={styles.paymentInfoValue}>INBNK123</Text>
          </View>
          <View style={styles.paymentInfoRow}>
            <Text style={styles.paymentInfoLabel}>Référence:</Text>
            <Text style={styles.paymentInfoValue}>{transaction?.reference || 'N/A'}</Text>
          </View>
        </View>

        {/* Pied de page */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Merci pour votre confiance!</Text>
          <Text style={styles.footerText}>Le paiement est dû dans les 30 jours suivant l&apos;émission de cette facture.</Text>
          <Text style={styles.footerHighlight}>Your Company Name - www.yourcompany.com</Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;