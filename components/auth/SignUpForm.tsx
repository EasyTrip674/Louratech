"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Button from "../ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { ChevronLeftIcon, EyeIcon, EyeCloseIcon } from "@/icons";

// Schéma de validation Zod pour la création d'organisation
const organizationSchema = z.object({
  // Détails de l'organisation
  organizationName: z.string().min(2, { message: "Le nom de l'organisation doit contenir au moins 2 caractères" }),
  organizationDescription: z.string().optional(),

  // Détails de l'administrateur
  firstName: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères" }),
  lastName: z.string().min(2, { message: "Le nom de famille doit contenir au moins 2 caractères" }),
  email: z.string().email({ message: "Veuillez saisir une adresse email valide" }),
  password: z.string()
    .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
      message: "Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial"
    }),
  confirmPassword: z.string(),

  // Conditions d'utilisation
  agreesToTerms: z.boolean().refine(val => val, { 
    message: "Vous devez accepter les conditions d'utilisation" 
  })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"]
});

type OrganizationFormData = z.infer<typeof organizationSchema>;

export default function CreationOrganisationFormulaire() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      agreesToTerms: false
    }
  });

  const onSubmit = async (data: OrganizationFormData) => {
    setIsSubmitting(true);
    try {
      // TODO: Implémenter la logique de création d'organisation et d'administrateur
      console.log("Données de création d'organisation:", {
        organization: {
          name: data.organizationName,
          description: data.organizationDescription
        },
        admin: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email
        }
      });
      
      // Exemple d'appel API potentiel
      // const response = await fetch('/api/organizations', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     organization: {
      //       name: data.organizationName,
      //       description: data.organizationDescription
      //     },
      //     admin: {
      //       firstName: data.firstName,
      //       lastName: data.lastName,
      //       email: data.email,
      //       password: data.password
      //     }
      //   })
      // });

      // if (response.ok) {
      //   // Gérer la création réussie
      // }
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
                className="w-5 h-5"
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