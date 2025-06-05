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
import { ChevronLeftIcon, Eye, EyeOff } from "lucide-react";
import { toast } from 'react-toastify';



type OrganizationFormData = z.infer<typeof createOrganizationSchema>;

export default function CreationOrganisationFormulaire() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<OrganizationFormData>({
    resolver: zodResolver(createOrganizationSchema),
    defaultValues: {
      agreesToTerms: false
    }
  });

  // Utiliser uniquement la mutation pour gérer l'état de soumission
  const creationOrganiozationMutation = useMutation({
    mutationFn: async (data: OrganizationFormData) => {
      // Appeler directement l'action serveur
      const result = await doCreateOrganization(data);
      if (result?.data) {
        router.push("/auth/signin");
      }else{
        toast.error(
          "Erreur: veuillez verifier la validité de votre code de confirmation ou changer d'email"
        )
      }
      return result;
    },
    // Gestion des erreurs dans la mutation
    onError: (error) => {
      console.error("Échec de la création de l'organisation:", error);
    }
  });

  // Simplifier la fonction onSubmit
  const onSubmit = (data: OrganizationFormData) => {
    // Appeler la mutation sans try/catch supplémentaire
    creationOrganiozationMutation.mutate(data);
  };

  return (
    <div className="flex flex-col justify-center w-full max-w-md mx-auto p-6">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
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
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-5">
            {/* Détails de l'Organisation */}
            <div>
              <Input
              label="Nom de l'Organisation"
              required
                {...register("organizationName")}
                placeholder="Saisissez le nom de votre organisation"
              />
              {errors.organizationName && (
                <p className="mt-1 text-sm text-error-500">
                  {errors.organizationName.message}
                </p>
              )}
            </div>

            <div>
              <Input
                label="Description de l'Organisation"
                {...register("organizationDescription")}
                placeholder="Décrivez brièvement votre organisation"
              />
            </div>

            {/* Informations de l'Administrateur */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Prénom"
                  required
                  {...register("firstName")}
                  placeholder="Votre prénom"
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-error-500">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <Input
                  label="Nom de Famille"
                  required
                  {...register("lastName")}
                  placeholder="Votre nom de famille"
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-error-500">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Input
                label="Email"
                required
                {...register("email")}
                type="email"
                placeholder="Saisissez votre adresse email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-error-500">
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
                  placeholder="Créez un mot de passe"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {showPassword ? (
                    <Eye className="fill-gray-500 dark:fill-gray-400" />
                  ) : (
                    <EyeOff className="fill-gray-500 dark:fill-gray-400" />
                  )}
                </span>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-error-500">
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
                />
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {showConfirmPassword ? (
                    <Eye className="fill-gray-500 dark:fill-gray-400" />
                  ) : (
                    <EyeOff className="fill-gray-500 dark:fill-gray-400" />
                  )}
                </span>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-error-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

             {/* un champ code */}
             <div>
                <Input
                label="Code d'Invitation"
                {...register("invitationCode")}
                placeholder="Saisissez le code d'invitation"
              />
              {errors.invitationCode && (
                <p className="mt-1 text-sm text-error-500">
                  {errors.invitationCode.message}
                </p>
              )}
            </div>

            {/* Conditions d'utilisation */}
            <div className="flex items-center gap-3">
              <input type="checkbox"
                {...register("agreesToTerms")}
                className="w-5 h-5 text-primary-500 border-gray-300 rounded checked:bg-primary-500 checked:border-transparent"
              />
              <p className="inline-block text-sm text-gray-600 dark:text-gray-400">
                J&apos;accepte les{" "}
                <span className="text-gray-800 dark:text-white">
                  Conditions d&apos;Utilisation
                </span>
              </p>
            </div>
            {errors.agreesToTerms && (
              <p className="mt-1 text-sm text-error-500">
                {errors.agreesToTerms.message}
              </p>
            )}

           

            {/* Bouton de Soumission - Utilisez uniquement l'état de la mutation */}
            <Button
              type="submit" 
              className="w-full"
              disabled={creationOrganiozationMutation.isPending}
            >
              {creationOrganiozationMutation.isPending ? "Création en cours..." : "Créer mon Organisation"}
            </Button>
            
            {/* Afficher les erreurs de mutation */}
            {creationOrganiozationMutation.isError && (
              <p className="mt-2 text-sm text-error-500">
                Une erreur est survenue lors de la création de votre organisation. Veuillez réessayer.
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}