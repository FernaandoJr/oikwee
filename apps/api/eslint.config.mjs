import { config } from '@repo/eslint-config/base';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  ...config,
  globalIgnores(['dist/**']),
  {
    rules: {
      'no-console': 'off',
    },
  },
]);
