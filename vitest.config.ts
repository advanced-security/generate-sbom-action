import {defineConfig} from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    clearMocks: true,
    include: ['**/*.test.ts'],
    globals: true,
    mockReset: true
  }
})
