import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  js.configs.recommended,
  // Node.js environment for backend, scripts, tasks, etc.
  {
    files: [
        "packages/my-app-backend/**/*.ts",
        "packages/my-app-discord-bot/**/*.ts",
        "packages/my-app-express/**/*.ts",
        "packages/my-app-tasks/**/*.ts",
        "packages/my-app-tools/**/*.ts"
      ],
      languageOptions: {
        parser: tsParser,
        parserOptions: {
          projectService: true,
          tsconfigRootDir: import.meta.dirname,
        },
        globals: {
          process: "readonly",
          console: "readonly",
          setInterval: "readonly",
          clearInterval: "readonly",
          Buffer: "readonly"
        }
      },
      plugins: {
        "@typescript-eslint": tsPlugin,
      },
      rules: {
        ...tsPlugin.configs["recommended"].rules,
        "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
        "@typescript-eslint/explicit-function-return-type": "warn",
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/consistent-type-imports": "error",
      },
    },
  // Browser environment for React web and React Native
  {
    files: [
      "packages/my-app-react/**/*.ts",
      "packages/my-app-react/**/*.tsx",
      "packages/my-app-react-web/**/*.ts",
      "packages/my-app-react-web/**/*.tsx",
      "packages/my-app-react-native/**/*.ts",
      "packages/my-app-react-native/**/*.tsx"
    ],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        window: "readonly",
        document: "readonly",
        fetch: "readonly",
        console: "readonly",
        process: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly"
      }
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
    },
    rules: {
      ...tsPlugin.configs["recommended"].rules,
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": "error",
    },
  },
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/*.tsbuildinfo",
      "**/.next/**",
    ],
  },
];
