"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { ChevronLeftIcon, EyeIcon, EyeCloseIcon } from "@/icons";
import Button from "@/components/ui/button/Button";
import { createOrganizationSchema } from "./create.organization.shema";
import { doCreateOrganization } from "./organization.create.action";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";


type OrganizationFormData = z.infer<typeof createOrganizationSchema>;

export default function CreationOrganisationFormulaire() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const creationOrganiozationMutation = useMutation({
    mutationFn: async (data: OrganizationFormData) => {
      const result = await doCreateOrganization(data);
      if (result?.data?.success) {
        router.push("/auth/signin");
      } else {
      }
    },
  });

  const onSubmit = async (data: OrganizationFormData) => {
    setIsSubmitting(true);
    try {
      // TODO: Implémenter la logique de création d'organisation et d'administrateur
      
      
    await creationOrganiozationMutation.mutate(data);
    } catch (error) {
      console.error("Échec de la création de l'organisation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col justify-center w-full max-w-md mx-auto p-6">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Retour au tableau de bord
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
              <Label>
                Nom de l'Organisation<span className="text-error-500">*</span>
              </Label>
              <Input
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
              <Label>Description de l'Organisation (Optionnel)</Label>
              <Input
                {...register("organizationDescription")}
                placeholder="Décrivez brièvement votre organisation"
              />
            </div>

            {/* Informations de l'Administrateur */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>
                  Prénom<span className="text-error-500">*</span>
                </Label>
                <Input
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
                <Label>
                  Nom de Famille<span className="text-error-500">*</span>
                </Label>
                <Input
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
              <Label>
                Email<span className="text-error-500">*</span>
              </Label>
              <Input
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
              <Label>
                Mot de Passe<span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Créez un mot de passe"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {showPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
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
              <Label>
                Confirmez le Mot de Passe<span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  {...register("confirmPassword")}
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirmez votre mot de passe"
                />
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                >
                  {showConfirmPassword ? (
                    <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                  ) : (
                    <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                  )}
                </span>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-error-500">
                  {errors.confirmPassword.message}
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
                J'accepte les{" "}
                <span className="text-gray-800 dark:text-white">
                  Conditions d'Utilisation
                </span>
              </p>
            </div>
            {errors.agreesToTerms && (
              <p className="mt-1 text-sm text-error-500">
                {errors.agreesToTerms.message}
              </p>
            )}

            {/* Bouton de Soumission */}
            <Button
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Création en cours..." : "Créer mon Organisation"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}