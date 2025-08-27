// eslint.config.js
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Désactiver la règle sur les dépendances des hooks
      "react-hooks/exhaustive-deps": "off",
      // Ne plus bloquer le build pour variables non utilisées
      "@typescript-eslint/no-unused-vars": "warn",
      // Warnings Next.js pour les <img> peuvent rester en warning
      "@next/next/no-img-element": "warn",
      "jsx-a11y/alt-text": "warn",
    },
  },
];