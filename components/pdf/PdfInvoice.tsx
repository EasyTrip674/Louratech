"use client";

import { getTransactionsDB } from '@/db/queries/finances.query';
import { ClientStepPaymentInfo } from '@/db/queries/procedures.query';
import { formatDate } from '@/lib/utils';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    color: '#000',
    backgroundColor: '#FFF',
    fontSize: 10,
    lineHeight: 1.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    paddingBottom: 15,
    marginBottom: 20,
  },
  invoiceTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  invoiceReference: {
    fontSize: 12,
    marginTop: 6,
    fontWeight: 'bold',
  },
  invoiceDetail: {
    fontSize: 10,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#FAFAFA',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionText: {
    marginBottom: 4,
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  infoBlock: {
    width: '48%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#FFF',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    paddingVertical: 5,
  },
  detailLabel: {
    fontWeight: 'bold',
  },
  totalBlock: {
    alignSelf: 'flex-end',
    width: '40%',
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#F5F5F5',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#000',
    marginTop: 30,
    paddingTop: 10,
    textAlign: 'center',
  },
  footerText: {
    marginBottom: 3,
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

  const formatAmount = (amount?: number) => {
    return (amount ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const getPaymentMethodText = (method?: string) => {
    return method === 'BANK_TRANSFER' ? 'Virement bancaire' :
           method === 'CREDIT_CARD' ? 'Carte de crédit' :
           method === 'CASH' ? 'Espèces' : 'Autre';
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.invoiceTitle}>FACTURE</Text>
            <Text style={styles.invoiceReference}>{`Facture N° ${transaction?.reference || '---'}`}</Text>
            <Text style={styles.statusText}>Statut: {getStatusText(transaction?.status)}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.invoiceDetail}>Émis le: {formatDate(transaction?.date)}</Text>
            <Text style={styles.invoiceDetail}>Approbation: {formatDate(transaction?.approvedAt || "")}</Text>
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
            <Text style={styles.sectionText}>{transaction.organization.name}</Text>
            <Text style={styles.sectionText}>{transaction.organization.description}</Text>
          </View>
          <View style={styles.infoBlock}>
            <Text style={styles.sectionTitle}>Client</Text>
            <Text style={styles.sectionText}>{transaction.clientProcedure?.client.user.lastName} {transaction.clientProcedure?.client.user.firstName}</Text>
            <Text style={styles.sectionText}>{transaction.clientProcedure?.client.user.email}</Text>
            <Text style={styles.sectionText}>Passeport: {transaction.clientProcedure?.client.passport || 'Non spécifié'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Détails</Text>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Description</Text><Text>{transaction?.description || 'Service'}</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Date</Text><Text>{formatDate(transaction?.date)}</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Paiement</Text><Text>{getPaymentMethodText(transaction?.paymentMethod)}</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Référence</Text><Text>{transaction?.reference}</Text></View>
          <View style={styles.detailRow}><Text style={styles.detailLabel}>Montant</Text><Text>{formatAmount(transaction?.amount)} FNG</Text></View>
        </View>

        <View style={styles.totalBlock}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>TOTAL</Text>
            <Text>{formatAmount(transaction?.amount)} FNG</Text>
          </View>
        </View>

        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations supplémentaire</Text>
          <Text style={styles.sectionText}>Tax: {transaction.organization.co}</Text>
          <Text style={styles.sectionText}>BIC: AGRIFRPP</Text>
        </View> */}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Merci pour votre confiance !</Text>
          <Text style={styles.footerText}>Cette facture confirme votre paiement.</Text>
          <Text style={[styles.footerText, { fontWeight: 'bold' }]}>{transaction.organization.name}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
