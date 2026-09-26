import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  // Flat config nie czyta .gitignore, a `eslint .` wchodzi wszedzie - inaczej
  // niz `next lint`, ktory sam ograniczal sie do katalogow aplikacji. Ten plik
  // tez sie lintuje, stad nazwana stala zamiast anonimowego eksportu.
  globalIgnores([
    ".next/**",
    "out/**",
    "next-env.d.ts",
    ".pnpm-migration-backup/**",
  ]),
  ...nextVitals,
]);

export default eslintConfig;
