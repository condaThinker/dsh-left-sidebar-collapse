/**
 * Vitest config: inline the npm-published `@deepseek-ai/*` packages whose
 * BUILT lib bundles css side-effect imports (e.g. `dsh-client-ui-primitives`
 * imports css at the top of its `lib/index.js`). Installed from the npm
 * registry these live under `node_modules/.pnpm` and are externalized by
 * vitest — Node then chokes on the `.css` import. Inlining routes them through
 * Vite's transform, which stubs css imports (the default `css: false`).
 */
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    server: {
      deps: {
        inline: [/@deepseek-ai\/dsh-client-ui-primitives/],
      },
    },
  },
})
