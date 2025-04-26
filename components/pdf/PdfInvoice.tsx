"use client";

import { ClientStepPaymentInfo } from '@/db/queries/procedures.query';
import { formatDate } from '@/lib/utils';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// PDF Styles simplifiés
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    color: '#000000',
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
  },
  invoiceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  invoiceDetail: {
    fontSize: 10,
    marginBottom: 3,
  },
  invoiceReference: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  section: {
    marginBottom: 15,
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  infoSection: {
    width: '48%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#000000',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  sectionText: {
    fontSize: 10,
    marginBottom: 3,
  },
  sectionTextBold: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  // Section d'introduction simplifiée
  introSection: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#000000',
  },
  introText: {
    fontSize: 11,
    lineHeight: 1.3,
  },
  // Détails de la transaction - remplace le tableau
  transactionDetails: {
    marginTop: 15,
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#000000',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#DDDDDD',
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  detailValue: {
    fontSize: 10,
    textAlign: 'right',
  },
  // Total simplifié
  totalSection: {
    alignSelf: 'flex-end',
    width: '40%',
    marginTop: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#000000',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#000000',
    paddingTop: 10,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 10,
    marginBottom: 2,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 3,
  },
});

// PDF Document Component
const InvoicePDF = ({ transaction }: {
  transaction: ClientStepPaymentInfo["transactions"][0]
}) => {
  // Statut en français
  const getStatusText = (status?:  ClientStepPaymentInfo["transactions"][0]['status']) => {
    if (!status) return '-';
    return status === 'PENDING' ? 'En attente' :
           status === 'APPROVED' ? 'Approuvé' :
           status === 'REJECTED' ? 'Rejeté' : "Inconnu";
  };
  
  // Formatter le montant avec séparateur de milliers
  const formatAmount = (amount?: number) => {
    if (!amount && amount !== 0) return '0';
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  
  // Moyen de paiement en français
  const getPaymentMethodText = (method?: string) => {
    if (!method) return 'Non spécifié';
    return method === 'BANK_TRANSFER' ? 'Virement bancaire' : 
           method === 'CREDIT_CARD' ? 'Carte de crédit' : 
           method === 'CASH' ? 'Espèces' : 'Autre';
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* En-tête */}
        <View style={styles.header}>
          <View>
            <Text style={styles.invoiceTitle}>FACTURE</Text>
            <Text style={styles.invoiceReference}>{`Facture N° ${transaction?.reference || '---'}`}</Text>
            <Text style={styles.statusText}>Statut: {getStatusText(transaction?.status)}</Text>
          </View>
          
          <View style={{alignItems: 'flex-end'}}>
            <Text style={styles.invoiceDetail}>{`Date d'émission: ${formatDate(transaction?.date)}`}</Text>
            <Text style={styles.invoiceDetail}>{`Date d'approbation: ${formatDate(transaction?.approvedAt || "")}`}</Text>
          </View>
        </View>

        {/* Section d'introduction */}
        <View style={styles.introSection}>
          <Text style={styles.sectionTitle}>RÉCAPITULATIF</Text>
          <Text style={styles.introText}>
            Cette facture confirme le paiement de {formatAmount(transaction?.amount || 0)} FNG pour le service fournis par {transaction?.organization.name || 'notre entreprise'}.
            {/* {transaction?.status === 'PENDING' ? " En attente d'approbation." : ""}  */}
            {transaction?.approvedBy ? ` Approuvé par ${transaction.approvedBy.firstName} ${transaction.approvedBy.lastName}` : " "} le {formatDate(transaction?.approvedAt|| "")}.
          </Text>
        </View>

        {/* Informations entreprise et client */}
        <View style={styles.flexRow}>
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>NOTRE ENTREPRISE</Text>
            <Text style={styles.sectionTextBold}>{transaction.organization.name}</Text>
            <Text style={styles.sectionText}>{transaction.organization.description}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>FACTURÉ À</Text>
            <Text style={styles.sectionTextBold}>
              {transaction.clientProcedure?.client.user.lastName} {transaction?.clientProcedure?.client.user.firstName}
            </Text>
            <Text style={styles.sectionText}>{transaction.clientProcedure?.client.user.email}</Text>
            <Text style={styles.sectionText}>Passeport: {transaction.clientProcedure?.client.passport || 'Non spécifié'}</Text>
          </View>
        </View>

        {/* Détails de la transaction (remplace le tableau) */}
        <View style={styles.transactionDetails}>
          <Text style={styles.sectionTitle}>DÉTAILS DE LA TRANSACTION</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Description</Text>
            <Text style={styles.detailValue}>{transaction?.description || 'Service fourni'}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>{formatDate(transaction?.date)}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Moyen de paiement</Text>
            <Text style={styles.detailValue}>{getPaymentMethodText(transaction?.paymentMethod)}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Référence</Text>
            <Text style={styles.detailValue}>{transaction?.reference || 'N/A'}</Text>
          </View>
          
          <View style={[styles.detailRow, {borderBottomWidth: 0}]}>
            <Text style={styles.detailLabel}>Montant</Text>
            <Text style={[styles.detailValue, {fontWeight: 'bold'}]}>{formatAmount(transaction?.amount || 0)} FNG</Text>
          </View>
        </View>

        {/* Total simplifié */}
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TOTAL</Text>
            <Text style={styles.totalValue}>{formatAmount(transaction?.amount || 0)} FNG</Text>
          </View>
        </View>

        {/* Pied de page */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Merci pour votre confiance!</Text>
          <Text style={styles.footerText}>Cette facture atteste de votre paiement effectif au sein de notre agence.</Text>
          <Text style={[styles.footerText, {fontWeight: 'bold', marginTop: 5}]}>{transaction.organization.name}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;