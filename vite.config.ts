import { reactRouter } from '@react-router/dev/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { configDefaults } from 'vitest/config'

export default defineConfig({
  plugins: [reactRouter(), tsconfigPaths()],
  test: {
    // Worktrees live under .claude and hold their own copy of every test
    exclude: [...configDefaults.exclude, '.claude/**'],
    setupFiles: ['app/server/db/test-setup.ts'],
  },
})
