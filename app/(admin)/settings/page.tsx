'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Input from '@/components/form/input/InputField';
import TextArea from '@/components/form/input/TextArea';
import { useRouter } from 'next/navigation';

// Types based on the Prisma schema
type Organization = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  metadata: string;
};

type ComptaSettings = {
  id: string;
  fiscalYear: Date;
  taxIdentification: string | null;
  currency: string;
  defaultTaxRate: number | null;
  invoicePrefix: string | null;
  invoiceNumberFormat: string | null;
  organizationId: string;
};

const OrganizationSettings = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  
  // Organization state
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [orgName, setOrgName] = useState('');
  const [orgDescription, setOrgDescription] = useState('');
  const [orgLogo, setOrgLogo] = useState<File | null>(null);
  const [orgLogoPreview, setOrgLogoPreview] = useState<string | null>(null);
  
  // Accounting settings state
  const [comptaSettings, setComptaSettings] = useState<ComptaSettings | null>(null);
  const [fiscalYearStart, setFiscalYearStart] = useState('');
  const [taxId, setTaxId] = useState('');
  const [currency, setCurrency] = useState('FNG');
  const [defaultTaxRate, setDefaultTaxRate] = useState('');
  const [invoicePrefix, setInvoicePrefix] = useState('');
  const [invoiceFormat, setInvoiceFormat] = useState('');

  // Fetch organization data
  useEffect(() => {
    const fetchOrganizationData = async () => {
      try {
        // In a real application, you would fetch from your API
        const response = await fetch('/api/organization/current');
        if (!response.ok) throw new Error('Failed to fetch organization data');
        
        const data = await response.json();
        setOrganization(data.organization);
        setOrgName(data.organization.name || '');
        setOrgDescription(data.organization.description || '');
        if (data.organization.logo) {
          setOrgLogoPreview(data.organization.logo);
        }
        
        // Set accounting settings if available
        if (data.comptaSettings) {
          setComptaSettings(data.comptaSettings);
          setFiscalYearStart(new Date(data.comptaSettings.fiscalYear).toISOString().split('T')[0]);
          setTaxId(data.comptaSettings.taxIdentification || '');
          setCurrency(data.comptaSettings.currency || 'FNG');
          setDefaultTaxRate(data.comptaSettings.defaultTaxRate?.toString() ?? '0');
          setInvoicePrefix(data.comptaSettings.invoicePrefix || "TRX-");
          setInvoiceFormat(data.comptaSettings.invoiceNumberFormat || "{YEAR}-{MONTH}-{NUM}");
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching organization data:', error);
        // toast.error('Une erreur est survenue lors du chargement des données');
        setLoading(false);
      }
    };

    fetchOrganizationData();
  }, []);

  // Handle logo file selection
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOrgLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setOrgLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save general settings
  const saveGeneralSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const formData = new FormData();
      formData.append('name', orgName);
      formData.append('description', orgDescription || '');
      if (orgLogo) {
        formData.append('logo', orgLogo);
      }
      
      // In a real application, you would post to your API
      const response = await fetch(`/api/organization/${organization?.id}`, {
        method: 'PUT',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Failed to update organization');
      
    //   toast.success('Paramètres généraux mis à jour');
    } catch (error) {
      console.error('Error saving general settings:', error);
    //   toast.error('Une erreur est survenue lors de la mise à jour');
    } finally {
      setSaving(false);
      router.refresh();
      window.location.reload();
    }
  };

  // Save accounting settings
  const saveAccountingSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const comptaData = {
        fiscalYear: fiscalYearStart,
        taxIdentification: taxId,
        currency,
        defaultTaxRate: defaultTaxRate ? parseFloat(defaultTaxRate) : null,
        invoicePrefix,
        invoiceNumberFormat: invoiceFormat,
        organizationId: organization?.id,
      };
      
      // In a real application, you would post to your API
      const response = await fetch(`/api/organization/${organization?.id}/compta-settings`, {
        method: comptaSettings ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(comptaData),
      });
      
      if (!response.ok) throw new Error('Failed to update accounting settings');
      
    //   toast.success('Paramètres comptables mis à jour');
    } catch (error) {
      console.error('Error saving accounting settings:', error);
    //   toast.error('Une erreur est survenue lors de la mise à jour');
    } finally {
      setSaving(false);
      router.refresh();
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Paramètres de l&apos;Organisation</h1>
      
      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'general' ? 'text-brand-600 border-b-2 border-brand-600' : 'text-gray-500 hover:'}`}
          onClick={() => setActiveTab('general')}
        >
          Général
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'accounting' ? 'text-brand-600 border-b-2 border-brand-600' : 'text-gray-500 hover:'}`}
          onClick={() => setActiveTab('accounting')}
        >
          Comptabilité
        </button>
        {/* <button
          className={`px-4 py-2 font-medium ${activeTab === 'users' ? 'text-brand-600 border-b-2 border-brand-600' : 'text-gray-500 hover:'}`}
          onClick={() => setActiveTab('users')}
        >
          Utilisateurs
        </button> */}
        {/* <button
          className={`px-4 py-2 font-medium ${activeTab === 'teams' ? 'text-brand-600 border-b-2 border-brand-600' : 'text-gray-500 hover:'}`}
          onClick={() => setActiveTab('teams')}
        >
          Équipes
        </button> */}
      </div>
      
      {/* General Settings Tab */}
      {activeTab === 'general' && (
        <div className="rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Informations Générales</h2>
          <form onSubmit={saveGeneralSettings}>
            <div className="mb-4">
              <label htmlFor="orgName" className="block text-sm font-medium ">
                Nom de l&apos;organisation
              </label>
              <Input
                type="text"
                id="orgName"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="orgDescription" className="block text-sm font-medium ">
                Description
              </label>
              <TextArea
                id="orgDescription"
                value={orgDescription}
                onChangeValue={(e) => setOrgDescription(String(e))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium ">Logo</label>
              <div className="mt-1 flex items-center">
                {orgLogoPreview && (
                  <div className="relative h-24 w-24 mr-4 border rounded-md overflow-hidden">
                    <Image
                      src={orgLogoPreview}
                      alt="Logo preview"
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                <label
                  htmlFor="logo-upload"
                  className="cursor-pointer py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium  hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                >
                  Changer le logo
                  <Input
                    id="logo-upload"
                    name="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="sr-only"
                  />
                </label>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50"
              >
                {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Accounting Settings Tab */}
      {activeTab === 'accounting' && (
        <div className="rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Paramètres Comptables</h2>
          <form onSubmit={saveAccountingSettings}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="mb-4">
                <label htmlFor="fiscalYear" className="block text-sm font-medium ">
                  Début de l&apos;année fiscale
                </label>
                <Input
                  type="date"
                  id="fiscalYear"
                  value={fiscalYearStart}
                  onChange={(e) => setFiscalYearStart(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="taxId" className="block text-sm font-medium ">
                  Numéro d&apos;identification fiscale
                </label>
                <Input
                  type="text"
                  id="taxId"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="currency" className="block text-sm font-medium ">
                  Devise
                </label>
                <select
                  id="currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                >
                  <option value="FNG">FNG</option>
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="XAF">XAF</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="defaultTaxRate" className="block text-sm font-medium ">
                  Taux de TVA par défaut (%)
                </label>
                <Input
                  type="number"
                  id="defaultTaxRate"
                  value={defaultTaxRate}
                  onChange={(e) => setDefaultTaxRate(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                  min="0"
                  max="100"
                  step="0.1"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="invoicePrefix" className="block text-sm font-medium ">
                  Préfixe des factures
                </label>
                <Input
                  type="text"
                  id="invoicePrefix"
                  value={invoicePrefix}
                  onChange={(e) => setInvoicePrefix(e.target.value)}
                  placeholder="Ex: FACT-"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="invoiceFormat" className="block text-sm font-medium ">
                  Format des numéros de facture
                </label>
                <Input
                  type="text"
                  id="invoiceFormat"
                  value={invoiceFormat}
                  onChange={(e) => setInvoiceFormat(e.target.value)}
                  placeholder="Ex: {YEAR}-{NUM}"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Utilisez {'{YEAR}'} pour l&apos;année, {'{MONTH}'} pour le mois, {'{DAY}'} pour le jour et {'{NUM}'} pour un nombre séquentiel
                </p>
              </div>
            </div>
            
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50"
              >
                {saving ? 'Enregistrement...' : 'Enregistrer les paramètres'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Users Tab */}
      {/* {activeTab === 'users' && (
        // <div className="rounded-lg shadow p-6">
        //   <div className="flex justify-between items-center mb-4">
        //     <h2 className="text-xl font-semibold">Gestion des Utilisateurs</h2>
        //     <button
        //       onClick={() => router.push('/organization/users/invite')}
        //       className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
        //     >
        //       Inviter un utilisateur
        //     </button>
        //   </div>
          
        //   <p className="text-gray-500 mb-4">
        //     Gérez les utilisateurs et leurs rôles au sein de votre organisation.
        //   </p>
          
        //   <div className="border-t border-gray-200 pt-4">
        //     <p className="text-center text-gray-500">
        //       Pour gérer les utilisateurs, allez à la page 
        //       <button 
        //         onClick={() => router.push('/organization/users')}
        //         className="text-brand-600 hover:text-brand-800 ml-1"
        //       >
        //         Gestion des utilisateurs
        //       </button>
        //     </p>
        //   </div>
        // </div>
      )} */}
      
      {/* Teams Tab */}
      {/* {activeTab === 'teams' && (
        <div className="rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Gestion des Équipes</h2>
            <button
              onClick={() => router.push('/organization/teams/create')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
            >
              Créer une équipe
            </button>
          </div>
          
          <p className="text-gray-500 mb-4">
            Créez et gérez des équipes pour organiser vos collaborateurs par fonction ou projet.
          </p>
          
          <div className="border-t border-gray-200 pt-4">
            <p className="text-center text-gray-500">
              Pour gérer les équipes, allez à la page 
              <button 
                onClick={() => router.push('/organization/teams')}
                className="text-brand-600 hover:text-brand-800 ml-1"
              >
                Gestion des équipes
              </button>
            </p>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default OrganizationSettings;