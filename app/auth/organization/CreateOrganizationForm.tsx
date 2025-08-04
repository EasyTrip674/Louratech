"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Input from "@/components/form/input/InputField"; 
import Button from "@/components/ui/button/Button";
import { createOrganizationSchema } from "./create.organization.shema";
import { doCreateOrganization } from "./organization.create.action";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon, Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { toast } from 'react-toastify';

type OrganizationFormData = z.infer<typeof createOrganizationSchema>;

// Types pour les erreurs spécifiques
type ErrorType = 
  | 'USER_EXISTS' 
  | 'INVALID_CODE' 
  | 'PASSWORD_MISMATCH' 
  | 'TERMS_NOT_ACCEPTED' 
  | 'THROTTLED' 
  | 'NETWORK_ERROR' 
  | 'UNKNOWN_ERROR';

interface FormError {
  type: ErrorType;
  message: string;
  field?: keyof OrganizationFormData;
}

export default function CreationOrganisationFormulaire() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState<FormError | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isValid, dirtyFields },
    setError,
    clearErrors,
    watch
  } = useForm<OrganizationFormData>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      agreesToTerms: false
    },
    mode: "onChange" // Validation en temps réel
  });

  // Observer les mots de passe pour validation en temps réel
  const password = watch("password");
  const confirmPassword = watch("confirmPassword");

  // Fonction pour parser et catégoriser les erreurs
  const parseError = (error: Error): FormError => {
    const message = error.message.toLowerCase();
    
    if (message.includes('user already exist') || message.includes('utilisateur existe déjà')) {
      return {
        type: 'USER_EXISTS',
        message: 'Un compte avec cet email existe déjà. Essayez de vous connecter ou utilisez un autre email.',
        field: 'email'
      };
    }
    
    if (message.includes('code invalide') || message.includes('invalid code')) {
      return {
        type: 'INVALID_CODE',
        message: 'Le code d\'invitation fourni n\'est pas valide. Vérifiez votre code ou contactez votre administrateur.',
        field: 'invitationCode'
      };
    }
    
    if (message.includes('passwords do not match') || message.includes('mots de passe ne correspondent pas')) {
      return {
        type: 'PASSWORD_MISMATCH',
        message: 'Les mots de passe ne correspondent pas.',
        field: 'confirmPassword'
      };
    }
    
    if (message.includes('terms and conditions') || message.includes('conditions d\'utilisation')) {
      return {
        type: 'TERMS_NOT_ACCEPTED',
        message: 'Vous devez accepter les conditions d\'utilisation pour continuer.',
        field: 'agreesToTerms'
      };
    }
    
    if (message.includes('wait before submitting') || message.includes('throttled')) {
      return {
        type: 'THROTTLED',
        message: 'Veuillez patienter quelques secondes avant de soumettre à nouveau le formulaire.'
      };
    }
    
    if (message.includes('network') || message.includes('fetch')) {
      return {
        type: 'NETWORK_ERROR',
        message: 'Erreur de connexion. Vérifiez votre connexion Internet et réessayez.'
      };
    }
    
    return {
      type: 'UNKNOWN_ERROR',
      message: 'Une erreur inattendue s\'est produite. Veuillez réessayer ou contacter le support si le problème persiste.'
    };
  };

  const creationOrganizationMutation = useMutation({
    mutationFn: async (data: OrganizationFormData) => {
      // Réinitialiser les erreurs
      setFormError(null);
      clearErrors();
      
      const result = await doCreateOrganization(data);
      
      if (result?.data) {
        // Succès - afficher un message de succès avec toast
        toast.success("Organisation créée avec succès ! Redirection en cours...", {
          position: "top-right",
          autoClose: 3000,
        });
        
        // Délai pour permettre à l'utilisateur de voir le message
        setTimeout(() => {
          router.push("/auth/signin");
        }, 2000);
      } else {
        throw new Error("Échec de la création de l'organisation");
      }
      
      return result;
    },
    onError: (error: Error) => {
      console.error("Erreur lors de la création de l'organisation:", error);
      
      const parsedError = parseError(error);
      setFormError(parsedError);
      
      // Définir l'erreur sur le champ spécifique si applicable
      if (parsedError.field) {
        setError(parsedError.field, {
          type: 'manual',
          message: parsedError.message
        });
      }
      
      // Toast d'erreur pour une meilleure visibilité
      toast.error(parsedError.message, {
        position: "top-right",
        autoClose: 5000,
      });
    },
    onSuccess: () => {
      setIsSubmitted(true);
    }
  });

  const onSubmit = (data: OrganizationFormData) => {
    // Validation supplémentaire côté client
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
    
    creationOrganizationMutation.mutate(data);
  };

  // Fonction pour obtenir l'icône d'état du champ
  const getFieldIcon = (fieldName: keyof OrganizationFormData) => {
    const hasError = errors[fieldName];
    const isDirty = dirtyFields[fieldName];
    const isLoading = creationOrganizationMutation.isPending;
    
    if (isLoading) return <Loader2 className="w-4 h-4 animate-spin text-gray-400" />;
    if (hasError) return <AlertCircle className="w-4 h-4 text-red-500" />;
    if (isDirty && !hasError) return <CheckCircle className="w-4 h-4 text-green-500" />;
    return null;
  };

  // Composant d'alerte d'erreur
  const ErrorAlert = ({ error }: { error: FormError }) => (
    <div className="flex items-start gap-3 p-4 mb-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800">
      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
      <div>
        <h4 className="text-sm font-medium text-red-800 dark:text-red-200">
          {error.type === 'USER_EXISTS' && 'Compte existant'}
          {error.type === 'INVALID_CODE' && 'Code d\'invitation invalide'}
          {error.type === 'PASSWORD_MISMATCH' && 'Mots de passe différents'}
          {error.type === 'TERMS_NOT_ACCEPTED' && 'Conditions d\'utilisation'}
          {error.type === 'THROTTLED' && 'Trop de tentatives'}
          {error.type === 'NETWORK_ERROR' && 'Erreur de connexion'}
          {error.type === 'UNKNOWN_ERROR' && 'Erreur inconnue'}
        </h4>
        <p className="text-sm text-red-700 dark:text-red-300 mt-1">
          {error.message}
        </p>
      </div>
    </div>
  );

  // Composant de succès
  const SuccessAlert = () => (
    <div className="flex items-start gap-3 p-4 mb-4 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-800">
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
            {/* Détails de l'Organisation */}
            <div>
              <div className="relative">
                <Input
                  label="Nom de l'Organisation"
                  required
                  {...register("organizationName")}
                  placeholder="Saisissez le nom de votre organisation"
                  className={errors.organizationName ? "border-red-500" : ""}
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
              />
            </div>

            {/* Informations de l'Administrateur */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="relative">
                  <Input
                    label="Prénom"
                    required
                    {...register("firstName")}
                    placeholder="Votre prénom"
                    className={errors.firstName ? "border-red-500" : ""}
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

            <div>
              <div className="relative">
                <Input
                  label="Email"
                  required
                  {...register("email")}
                  type="email"
                  placeholder="Saisissez votre adresse email"
                  className={errors.email ? "border-red-500" : ""}
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
            </div>

            {/* Mot de passe */}
            <div>
              <div className="relative">
                <Input
                  label="Mot de Passe"
                  required
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Créez un mot de passe sécurisé"
                  className={errors.password ? "border-red-500" : ""}
                />
                <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                  {getFieldIcon("password")}
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <div className="relative">
                <Input
                  label="Confirmez le Mot de Passe"
                  required
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirmez votre mot de passe"
                  className={errors.confirmPassword ? "border-red-500" : ""}
                />
                <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                  {getFieldIcon("confirmPassword")}
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.confirmPassword.message}
                </p>
              )}
              {/* Validation en temps réel des mots de passe */}
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

            {/* Bouton de Soumission */}
            <Button
              type="submit" 
              className="w-full flex items-center justify-center gap-2"
              disabled={creationOrganizationMutation.isPending || !isValid}
            >
              {creationOrganizationMutation.isPending && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}
              {creationOrganizationMutation.isPending 
                ? "Création en cours..." 
                : "Créer mon Organisation"
              }
            </Button>

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