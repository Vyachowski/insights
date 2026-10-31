import path from 'path'
import { fileURLToPath } from 'url'

import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import { defineConfig, globalIgnores } from 'eslint/config'
import pluginImport from 'eslint-plugin-import'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import pluginUnusedImports from 'eslint-plugin-unused-imports'
import globals from 'globals'
import tseslint from 'typescript-eslint'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const restrictImports = (files, patterns, ignores = []) => ({
  files,
  ignores: ['**/*.test.{ts,tsx}', ...ignores],
  rules: { '@typescript-eslint/no-restricted-imports': ['error', { patterns }] },
})

export default defineConfig([
  globalIgnores(['build', 'node_modules', '.react-router', 'coverage', 'scripts/gudok-telephony-bookmarklet.js']),
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: {
      import: pluginImport,
      'unused-imports': pluginUnusedImports,
      '@stylistic': stylistic,
    },
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['*.js', '*.mjs', '*.cjs'],
        },
        tsconfigRootDir: __dirname,
      },
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
      '@stylistic/indent': ['error', 2],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/arrow-parens': ['error', 'as-needed'],
      '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      '@stylistic/comma-spacing': ['error', { before: false, after: true }],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/array-bracket-spacing': ['error', 'never'],
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling'],
            'index',
            'object',
            'type',
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports' },
      ],
      '@typescript-eslint/no-non-null-assertion': 'warn',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'max-lines-per-function': ['warn', 25],
      'no-console': ['warn', { allow: ['warn', 'error', 'log'] }],
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',
      'prefer-arrow-callback': 'error',
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
      'eol-last': ['error', 'always'],
      'no-trailing-spaces': 'error',
    },
  },
  {
    // describe() callbacks hold whole test suites, so length says nothing there
    files: ['**/*.tsx', '**/*.test.{js,ts}'],
    rules: {
      'max-lines-per-function': 'off',
    },
  },
  {
    // railpack.json prunes devDependencies, so the production path must not import them
    files: ['app/**', 'server.ts'],
    ignores: ['**/*.test.{ts,tsx}', 'app/server/db/test-migrations.ts', 'app/server/db/test-setup.ts'],
    rules: {
      'import/no-extraneous-dependencies': ['error', { devDependencies: false }],
    },
  },
  // Layer rules: see docs/architecture.md
  restrictImports(['app/server/core/**'], [
    { group: ['@/server/db/*', '@/server/services/*', 'drizzle-orm', 'drizzle-orm/*'], message: 'core stays pure: no database and no services.' },
  ]),
  restrictImports(['app/server/db/**'], [
    { group: ['@/server/core/*', '@/server/services/*'], message: 'db holds no logic: a service joins db and core.' },
  ]),
  restrictImports(['app/server/services/**'], [
    { group: ['@/server/db/client', '@/server/db/schema', 'drizzle-orm', 'drizzle-orm/*'], message: 'Services call db functions, not queries.' },
  ]),
  restrictImports(['app/routes/**'], [
    { group: ['@/server/db/client', '@/server/db/schema', 'drizzle-orm', 'drizzle-orm/*'], message: 'Routes call db functions or services, not queries.' },
  ], ['app/routes/health.tsx']),
  restrictImports(['app/screens/**', 'app/components/**', 'app/hooks/**', 'app/lib/**'], [
    { group: ['@/server/*', 'drizzle-orm', 'drizzle-orm/*'], allowTypeImports: true, message: 'UI sees the server through route data: type imports only.' },
  ]),
  {
    // Route modules legitimately export loaders/actions alongside components
    files: ['app/routes/**', 'app/root.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
