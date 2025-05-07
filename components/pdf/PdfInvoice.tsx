"use client";

import { getTransactionsDB } from '@/db/queries/finances.query';
import { ClientStepPaymentInfo } from '@/db/queries/procedures.query';
import { formatDate } from '@/lib/utils';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    color: '#333',
    backgroundColor: '#FFF',
    fontSize: 10,
    lineHeight: 1.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#555',
    paddingBottom: 10,
    marginBottom: 10,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  invoiceTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#1a365d',
  },
  invoiceReference: {
    fontSize: 12,
    marginTop: 6,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  invoiceDetail: {
    fontSize: 10,
    color: '#4a5568',
    marginTop: 4,
  },
  statusContainer: {
    marginTop: 10,
    padding: 6,
    borderRadius: 4,
    width: 'auto',
    alignSelf: 'flex-start',
  },
  statusApproved: {
    backgroundColor: '#e6f4ea',
    borderWidth: 1,
    borderColor: '#34a853',
  },
  statusPending: {
    backgroundColor: '#fff8e1',
    borderWidth: 1,
    borderColor: '#ffa000',
  },
  statusRejected: {
    backgroundColor: '#fce8e6',
    borderWidth: 1,
    borderColor: '#ea4335',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusApprovedText: {
    color: '#34a853',
  },
  statusPendingText: {
    color: '#ffa000',
  },
  statusRejectedText: {
    color: '#ea4335',
  },
  section: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1a365d',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 5,
  },
  sectionText: {
    marginBottom: 5,
    color: '#4a5568',
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    marginBottom: 15,
  },
  infoBlock: {
    width: '48%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#FFF',
    borderRadius: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    paddingVertical: 8,
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#4a5568',
  },
  totalBlock: {
    alignSelf: 'flex-end',
    width: '40%',
    marginTop: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#1a365d',
    backgroundColor: '#f7fafc',
    borderRadius: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  totalLabel: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#1a365d',
  },
  totalAmount: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#1a365d',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    marginTop: 20,
    paddingTop: 15,
    textAlign: 'center',
  },
  footerText: {
    marginBottom: 4,
    color: '#4a5568',
  },
  footerCompany: {
    fontWeight: 'bold',
    color: '#1a365d',
    fontSize: 12,
    marginTop: 5,
  },
  watermark: {
    position: 'absolute',
    top: 300,
    left: 150,
    opacity: 0.06,
    transform: 'rotate(-45deg)',
    fontSize: 90,
    color: '#1a365d',
  },
  paymentMethodBadge: {
    backgroundColor: '#ebf8ff',
    borderWidth: 1,
    borderColor: '#63b3ed',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
    alignSelf: 'flex-start',
    marginTop: 3,
  },
  paymentMethodText: {
    color: '#2b6cb0',
    fontSize: 9,
    fontWeight: 'bold',
  },
});

const InvoicePDF = ({ transaction }: {
  transaction: ClientStepPaymentInfo["transactions"][0] | getTransactionsDB[0]
}) => {
  const getStatusText = (status?: ClientStepPaymentInfo["transactions"][0]['status']) => {
    return status === 'PENDING' ? 'En attente' :
           status === 'APPROVED' ? 'Approuvé' :
           status === 'REJECTED' ? 'Rejeté' : 'Inconnu';
  };

  const getStatusStyles = (status?: ClientStepPaymentInfo["transactions"][0]['status']) => {
    if (status === 'APPROVED') return { container: styles.statusApproved, text: styles.statusApprovedText };
    if (status === 'PENDING') return { container: styles.statusPending, text: styles.statusPendingText };
    if (status === 'REJECTED') return { container: styles.statusRejected, text: styles.statusRejectedText };
    return { container: styles.statusPending, text: styles.statusPendingText };
  };

  const formatAmount = (amount?: number) => {
    return (amount ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const getPaymentMethodText = (method?: string) => {
    return method === 'BANK_TRANSFER' ? 'Virement bancaire' :
           method === 'CREDIT_CARD' ? 'Carte de crédit' :
           method === 'CASH' ? 'Espèces' : 'Autre';
  };

  // Get the status styles
  const statusStyle = getStatusStyles(transaction?.status);

  // Placeholder for company logo URL - replace with actual logo URL
  // const companyLogoUrl = `/api/placeholder/240/100`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Watermark */}
        {transaction?.status === 'APPROVED' && (
          <Text style={styles.watermark}>PAYÉ</Text>
        )}
        
        <View style={styles.header}>
          <View>
            <Text style={styles.invoiceTitle}>FACTURE</Text>
            <Text style={styles.invoiceReference}>{`Facture N° ${transaction?.reference || '---'}`}</Text>
            <View style={[styles.statusContainer, statusStyle.container]}>
              <Text style={[styles.statusText, statusStyle.text]}>
                {getStatusText(transaction?.status)}
              </Text>
            </View>
          </View>
          <Image src={transaction.organization.logo ?? ""} style={styles.logo} />
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.invoiceDetail}>Émis le: {formatDate(transaction?.date)}</Text>
            <Text style={styles.invoiceDetail}>Approbation: {formatDate(transaction?.approvedAt || "")}</Text>
            <View style={styles.paymentMethodBadge}>
              <Text style={styles.paymentMethodText}>
                {getPaymentMethodText(transaction?.paymentMethod)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Résumé</Text>
          <Text style={styles.sectionText}>
            Paiement de {formatAmount(transaction?.amount)} FNG effectué à {transaction?.organization.name}.
            {transaction?.approvedBy && ` Approuvé par ${transaction.approvedBy.firstName} ${transaction.approvedBy.lastName} le ${formatDate(transaction?.approvedAt || "")}.`}
          </Text>
        </View>

        <View style={styles.flexRow}>
          <View style={styles.infoBlock}>
            <Text style={styles.sectionTitle}>Entreprise</Text>
            <Text style={[styles.sectionText, { fontWeight: 'bold' }]}>{transaction.organization.name}</Text>
            <Text style={styles.sectionText}>{transaction.organization.description}</Text>
          </View>
          <View style={styles.infoBlock}>
            <Text style={styles.sectionTitle}>Client</Text>
            <Text style={[styles.sectionText, { fontWeight: 'bold' }]}>
              {transaction.clientProcedure?.client.user.lastName} {transaction.clientProcedure?.client.user.firstName}
            </Text>
            <Text style={styles.sectionText}>{transaction.clientProcedure?.client.user.email}</Text>
            <Text style={styles.sectionText}>Passeport: {transaction.clientProcedure?.client.passport || 'Non spécifié'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Détails du paiement</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Description</Text>
            <Text>{transaction?.description || 'Service'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text>{formatDate(transaction?.date)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Méthode de paiement</Text>
            <Text>{getPaymentMethodText(transaction?.paymentMethod)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Référence</Text>
            <Text>{transaction?.reference}</Text>
          </View>
          <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.detailLabel}>Montant</Text>
            <Text>{formatAmount(transaction?.amount)} FNG</Text>
          </View>
        </View>

        <View style={styles.totalBlock}>
          <View style={[styles.totalRow, { borderBottomWidth: 1, borderBottomColor: '#CBD5E0' }]}>
            <Text style={styles.totalLabel}>TOTAL</Text>
            <Text style={styles.totalAmount}>{formatAmount(transaction?.amount)} FNG</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Merci pour votre confiance !</Text>
          <Text style={styles.footerText}>Cette facture confirme votre paiement.</Text>
          <Text style={styles.footerCompany}>{transaction.organization.name}</Text>
          <Text style={styles.footerText}>
            Pour toute question concernant cette facture, veuillez nous contacter.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;