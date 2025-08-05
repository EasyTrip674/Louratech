"use client";
import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Input from "@/components/form/input/InputField"; 
import Button from "@/components/ui/button/Button";
import { createOrganizationSchema } from "./create.organization.shema";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon, Eye, EyeOff, CheckCircle, AlertCircle, Loader2, Shield } from "lucide-react";
import { toast } from 'react-toastify';
import { debounce } from 'lodash';

type OrganizationFormData = z.infer<typeof createOrganizationSchema>;

type ErrorType = 
  | 'USER_EXISTS' 
  | 'INVALID_CODE' 
  | 'PASSWORD_MISMATCH' 
  | 'TERMS_NOT_ACCEPTED' 
  | 'THROTTLED' 
  | 'NETWORK_ERROR' 
  | 'VALIDATION_ERROR'
  | 'UNKNOWN_ERROR';

interface FormError {
  type: ErrorType;
  message: string;
  field?: keyof OrganizationFormData;
}

interface ApiErrorResponse {
  error: string;
}

interface ApiSuccessResponse {
  success: boolean;
  data: {
    organization: {
      id: string;
      name: string;
      slug: string;
      description: string;
    };
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
    };
  };
}

// Action corrigée pour utiliser l'API /api/organizations
const doCreateOrganization = async (data: OrganizationFormData): Promise<ApiSuccessResponse> => {
  const response = await fetch('/api/organizations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });


  console.log(response);
  

  const result = await response.json();

  if (!response.ok) {
    const errorMessage = (result as ApiErrorResponse).error || 'Erreur lors de la création';
    throw new Error(errorMessage);
  }

  return result as ApiSuccessResponse;
};

export default function CreationOrganisationFormulaire() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState<FormError | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const router = useRouter();

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isValid, dirtyFields },
    setError,
    clearErrors,
    watch,
  } = useForm<OrganizationFormData>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      agreesToTerms: false
    },
    mode: "onChange"
  });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const email = watch("email");

  // Fonction de vérification d'email débounced
  const debouncedEmailCheck = useCallback(
    debounce(async (emailValue: string) => {
      if (!emailValue || !emailValue.includes('@')) return;
      
      setCheckingEmail(true);
      try {
        // Vérification via l'API check-email
        const response = await fetch('/api/check-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailValue })
        });
        
        const data = await response.json();
        setEmailAvailable(!data.exists);
        
        if (data.exists) {
          setError('email', {
            type: 'manual',
            message: 'Cet email est déjà utilisé'
          });
        } else {
          clearErrors('email');
        }
      } catch (error) {
        console.error('Erreur vérification email:', error);
        // En cas d'erreur, on ne bloque pas l'utilisateur
        setEmailAvailable(null);
      } finally {
        setCheckingEmail(false);
      }
    }, 500),
    [setError, clearErrors]
  );

  // Vérification email en temps réel
  useEffect(() => {
    if (email && dirtyFields.email) {
      debouncedEmailCheck(email);
    }
  }, [email, debouncedEmailCheck, dirtyFields.email]);

  const parseError = (error: Error): FormError => {
    const message = error.message.toLowerCase();
    
    // Gestion des erreurs spécifiques de l'API
    if (message.includes('utilisateur avec cet email existe déjà') || 
        message.includes('user already exist')) {
      return {
        type: 'USER_EXISTS',
        message: 'Un compte avec cet email existe déjà. Essayez de vous connecter ou utilisez un autre email.',
        field: 'email'
      };
    }
    
    if (message.includes('code d\'invitation invalide') || 
        message.includes('invalid invitation')) {
      return {
        type: 'INVALID_CODE',
        message: 'Le code d\'invitation fourni n\'est pas valide. Vérifiez votre code ou contactez votre administrateur.',
        field: 'invitationCode'
      };
    }
    
    if (message.includes('trop de tentatives') || 
        message.includes('rate limit') || 
        message.includes('attendre')) {
      return {
        type: 'THROTTLED',
        message: 'Trop de tentatives. Veuillez patienter 5 minutes avant de réessayer.'
      };
    }
    
    if (message.includes('données invalides') || 
        message.includes('validation')) {
      return {
        type: 'VALIDATION_ERROR',
        message: 'Les données saisies ne sont pas valides. Vérifiez tous les champs.'
      };
    }
    
    if (message.includes('network') || 
        message.includes('fetch') || 
        message.includes('connexion')) {
      return {
        type: 'NETWORK_ERROR',
        message: 'Erreur de connexion. Vérifiez votre connexion Internet et réessayez.'
      };
    }
    
    return {
      type: 'UNKNOWN_ERROR',
      message: error.message || 'Une erreur inattendue s\'est produite. Veuillez réessayer ou contacter le support.'
    };
  };

  const creationOrganizationMutation = useMutation({
    mutationFn: async (data: OrganizationFormData) => {
      // Protection contre les soumissions multiples
      if (isSubmitting) {
        throw new Error('Soumission déjà en cours');
      }
      
      setIsSubmitting(true);
      setFormError(null);
      clearErrors();
      
      try {
        const result = await doCreateOrganization(data);
        
        if (result?.success && result?.data) {
          toast.success("Organisation créée avec succès ! Redirection en cours...", {
            position: "top-right",
            autoClose: 3000,
          });
          
          setIsSubmitted(true);
          
          // Redirection après délai
          setTimeout(() => {
            router.push("/auth/signin");
          }, 2000);
          
          return result;
        } else {
          throw new Error("Échec de la création de l'organisation");
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    onError: (error: Error) => {
      console.error("Erreur lors de la création de l'organisation:", error);
      
      const parsedError = parseError(error);
      setFormError(parsedError);
      
      // Application de l'erreur au champ spécifique si défini
      if (parsedError.field) {
        setError(parsedError.field, {
          type: 'manual',
          message: parsedError.message
        });
      }
      
      toast.error(parsedError.message, {
        position: "top-right",
        autoClose: 5000,
      });
      
      setIsSubmitting(false);
    }
  });

  const onSubmit = useCallback(async (data: OrganizationFormData) => {
    // Validation finale côté client
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', {
        type: 'manual',
        message: 'Les mots de passe ne correspondent pas'
      });
      return;
    }
    
    if (!data.agreesToTerms) {
      setError('agreesToTerms', {
        type: 'manual',
        message: 'Vous devez accepter les conditions d\'utilisation'
      });
      return;
    }

    // Vérification finale de l'email (si la vérification a été faite)
    if (emailAvailable === false) {
      setError('email', {
        type: 'manual',
        message: 'Cet email est déjà utilisé'
      });
      return;
    }
    
    creationOrganizationMutation.mutate(data);
  }, [creationOrganizationMutation, setError, emailAvailable]);

  // Fonction pour obtenir l'icône d'état du champ
  const getFieldIcon = (fieldName: keyof OrganizationFormData) => {
    const hasError = errors[fieldName];
    const isDirty = dirtyFields[fieldName];
    
    // Cas spécial pour l'email
    if (fieldName === 'email') {
      if (checkingEmail) return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      if (hasError) return <AlertCircle className="w-4 h-4 text-red-500" />;
      if (emailAvailable === true && isDirty) return <CheckCircle className="w-4 h-4 text-green-500" />;
      if (emailAvailable === false) return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
    
    if (isSubmitting) return <Loader2 className="w-4 h-4 animate-spin text-gray-400" />;
    if (hasError) return <AlertCircle className="w-4 h-4 text-red-500" />;
    if (isDirty && !hasError) return <CheckCircle className="w-4 h-4 text-green-500" />;
    return null;
  };

  // Indicateur de force du mot de passe
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    const levels = [
      { label: 'Très faible', color: 'bg-red-500' },
      { label: 'Faible', color: 'bg-orange-500' },
      { label: 'Moyen', color: 'bg-yellow-500' },
      { label: 'Fort', color: 'bg-blue-500' },
      { label: 'Très fort', color: 'bg-green-500' }
    ];
    
    return { strength, ...levels[strength - 1] || levels[0] };
  };

  const passwordStrength = getPasswordStrength(password || '');

  // Composant d'alerte d'erreur amélioré
  const ErrorAlert = ({ error }: { error: FormError }) => (
    <div className="flex items-start gap-3 p-4 mb-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800 animate-in slide-in-from-top-2">
      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
      <div>
        <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
          {error.type === 'USER_EXISTS' && 'Compte existant'}
          {error.type === 'INVALID_CODE' && 'Code d\'invitation invalide'}
          {error.type === 'PASSWORD_MISMATCH' && 'Mots de passe différents'}
          {error.type === 'TERMS_NOT_ACCEPTED' && 'Conditions d\'utilisation'}
          {error.type === 'THROTTLED' && 'Trop de tentatives'}
          {error.type === 'NETWORK_ERROR' && 'Erreur de connexion'}
          {error.type === 'VALIDATION_ERROR' && 'Données invalides'}
          {error.type === 'UNKNOWN_ERROR' && 'Erreur inconnue'}
        </h4>
        <p className="text-sm text-red-700 dark:text-red-300 mt-1">
          {error.message}
        </p>
      </div>
    </div>
  );

  // Composant de succès amélioré
  const SuccessAlert = () => (
    <div className="flex items-start gap-3 p-4 mb-4 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-800 animate-in slide-in-from-top-2">
      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
      <div>
        <h4 className="text-sm font-medium text-green-800 dark:text-green-200">
          Organisation créée avec succès !
        </h4>
        <p className="text-sm text-green-700 dark:text-green-300 mt-1">
          Redirection vers la page de connexion en cours...
        </p>
      </div>
    </div>
  );

  // Vérifier si le formulaire peut être soumis
  const canSubmit = isValid && !isSubmitting && !checkingEmail && emailAvailable !== false;

  return (
    <div className="flex flex-col justify-center w-full max-w-md mx-auto p-6">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="w-4 h-4 mr-1" />
          Retour 
        </Link>
      </div>

      <div>
        <div className="mb-6">
          <h1 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white">
            Créer votre Organisation
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Commencez en créant votre organisation et votre compte administrateur
          </p>
        </div>

        {/* Alertes d'état */}
        {isSubmitted && creationOrganizationMutation.isSuccess && <SuccessAlert />}
        {formError && <ErrorAlert error={formError} />}
        
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-5">
            {/* Organisation */}
            <div>
              <div className="relative">
                <Input
                  label="Nom de l'Organisation"
                  required
                  {...register("organizationName")}
                  placeholder="Saisissez le nom de votre organisation"
                  className={errors.organizationName ? "border-red-500" : ""}
                  disabled={isSubmitting}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {getFieldIcon("organizationName")}
                </div>
              </div>
              {errors.organizationName && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.organizationName.message}
                </p>
              )}
            </div>

            <div>
              <Input
                label="Description de l'Organisation"
                {...register("organizationDescription")}
                placeholder="Décrivez brièvement votre organisation (optionnel)"
                disabled={isSubmitting}
              />
            </div>

            {/* Utilisateur */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="relative">
                  <Input
                    label="Prénom"
                    required
                    {...register("firstName")}
                    placeholder="Votre prénom"
                    className={errors.firstName ? "border-red-500" : ""}
                    disabled={isSubmitting}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {getFieldIcon("firstName")}
                  </div>
                </div>
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <div className="relative">
                  <Input
                    label="Nom de Famille"
                    required
                    {...register("lastName")}
                    placeholder="Votre nom de famille"
                    className={errors.lastName ? "border-red-500" : ""}
                    disabled={isSubmitting}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {getFieldIcon("lastName")}
                  </div>
                </div>
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email avec vérification temps réel */}
            <div>
              <div className="relative">
                <Input
                  label="Email"
                  required
                  {...register("email")}
                  type="email"
                  placeholder="Saisissez votre adresse email"
                  className={`${errors.email ? "border-red-500" : ""} ${
                    emailAvailable === true ? "border-green-500" : ""
                  }`}
                  disabled={isSubmitting}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {getFieldIcon("email")}
                </div>
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email.message}
                </p>
              )}
              {emailAvailable === true && dirtyFields.email && !errors.email && (
                <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Email disponible
                </p>
              )}
            </div>

            {/* Mot de passe avec indicateur de force */}
            <div>
              <div className="relative">
                <Input
                  label="Mot de Passe"
                  required
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Créez un mot de passe sécurisé"
                  className={errors.password ? "border-red-500" : ""}
                  disabled={isSubmitting}
                />
                <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                  {getFieldIcon("password")}
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              {/* Indicateur de force du mot de passe */}
              {password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600">{passwordStrength.label}</span>
                  </div>
                </div>
              )}
              
              {errors.password && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirmation mot de passe */}
            <div>
              <div className="relative">
                <Input
                  label="Confirmez le Mot de Passe"
                  required
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirmez votre mot de passe"
                  className={errors.confirmPassword ? "border-red-500" : ""}
                  disabled={isSubmitting}
                />
                <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                  {getFieldIcon("confirmPassword")}
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={isSubmitting}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.confirmPassword.message}
                </p>
              )}
              
              {password && confirmPassword && password !== confirmPassword && (
                <p className="mt-1 text-sm text-amber-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Les mots de passe ne correspondent pas
                </p>
              )}
            </div>

            {/* Code d'invitation */}
            <div>
              <div className="relative">
                <Input
                  label="Code d'Invitation"
                  required
                  {...register("invitationCode")}
                  placeholder="Saisissez le code d'invitation"
                  className={errors.invitationCode ? "border-red-500" : ""}
                  disabled={isSubmitting}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {getFieldIcon("invitationCode")}
                </div>
              </div>
              {errors.invitationCode && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.invitationCode.message}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Contactez votre administrateur si vous n&apos;avez pas de code d&apos;invitation
              </p>
            </div>

            {/* Conditions d'utilisation */}
            <div>
              <div className="flex items-start gap-3">
                <input 
                  type="checkbox"
                  {...register("agreesToTerms")}
                  className={`w-5 h-5 mt-0.5 text-primary-500 border-gray-300 rounded focus:ring-primary-500 ${
                    errors.agreesToTerms ? "border-red-500" : ""
                  }`}
                  disabled={isSubmitting}
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    J&apos;accepte les{" "}
                    <Link 
                      href="/terms" 
                      className="text-primary-600 hover:text-primary-700 underline"
                      target="_blank"
                    >
                      Conditions d&apos;Utilisation
                    </Link>
                    {" "}et la{" "}
                    <Link 
                      href="/privacy" 
                      className="text-primary-600 hover:text-primary-700 underline"
                      target="_blank"
                    >
                      Politique de Confidentialité
                    </Link>
                  </p>
                  {errors.agreesToTerms && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.agreesToTerms.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Bouton de Soumission amélioré */}
            <Button
              type="submit" 
              className="w-full flex items-center justify-center gap-2 relative"
              disabled={!canSubmit}
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {!isSubmitting && <Shield className="w-4 h-4" />}
              {isSubmitting ? "Création en cours..." : "Créer mon Organisation"}
            </Button>

            {/* Message d'aide */}
            {!canSubmit && !isSubmitting && (
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  {checkingEmail && "Vérification de l'email en cours..."}
                  {!isValid && !checkingEmail && "Veuillez remplir tous les champs requis"}
                  {emailAvailable === false && "L'email est déjà utilisé"}
                </p>
              </div>
            )}

            {/* Lien de connexion */}
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Vous avez déjà un compte ?{" "}
                <Link 
                  href="/auth/signin" 
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}