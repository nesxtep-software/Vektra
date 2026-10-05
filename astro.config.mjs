import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    react(),
  ],
  output: 'static',
  site: import.meta.env.DEV ? 'http://localhost:4321' : 'https://nesxtep-software.github.io/Vektra',
  base: import.meta.env.DEV ? '/' : '/Vektra',
});
