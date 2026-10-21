import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Generated shadcn primitives are not hand-edited (regenerate with the CLI);
  // the registry's carousel syncs Embla state inside an effect, which the React
  // Compiler rule rejects in application code.
  {
    files: ["src/components/ui/**"],
    rules: { "react-hooks/set-state-in-effect": "off" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Local reference checkouts of sister projects (git-ignored).
    "inspo*/**",
  ]),
]);

export default eslintConfig;
