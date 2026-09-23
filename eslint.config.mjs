import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import {fileURLToPath} from "node:url";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "import/no-restricted-paths": [
        "error",
        {
          basePath: fileURLToPath(new URL(".", import.meta.url)),
          zones: [
            {
              target: "./src/shared",
              from: [
                "./src/entities",
                "./src/features",
                "./src/widgets",
                "./src/pages",
                "./src/app",
              ],
            },
            {
              target: "./src/entities",
              from: [
                "./src/features",
                "./src/widgets",
                "./src/pages",
                "./src/app",
              ],
            },
            {
              target: "./src/features",
              from: ["./src/widgets", "./src/pages", "./src/app"],
            },
            {
              target: "./src/widgets",
              from: ["./src/pages", "./src/app"],
            },
            {
              target: "./src/pages",
              from: ["./src/app"],
            },
          ],
        }
      ],
    }
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
