import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

// eslint-config-next 15 wystawia config tylko w starym formacie. Natywny flat
// config ma dopiero wersja 16, ktora idzie w parze z Next 16 - wtedy znika
// stad FlatCompat razem z @eslint/eslintrc.
const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
});

const eslintConfig = [
  // Flat config nie czyta .gitignore, a `eslint .` wchodzi wszedzie - inaczej
  // niz `next lint`, ktory sam ograniczal sie do katalogow aplikacji. Ten plik
  // tez sie lintuje, stad nazwana stala zamiast anonimowego eksportu.
  {
    ignores: [
      ".next/**",
      "out/**",
      "next-env.d.ts",
      ".pnpm-migration-backup/**",
    ],
  },
  ...compat.extends("next/core-web-vitals"),
];

export default eslintConfig;
