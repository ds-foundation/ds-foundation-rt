import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// createRequire is needed for CJS interop (tailwindcss v3, autoprefixer)
const require = createRequire(import.meta.url);

const root = path.resolve(__dirname, '..', '..', '..');

const config: StorybookConfig = {
  stories: [
    // Spec MDX files render as Storybook docs
    path.join(root, 'packages/registry/components/**/*.mdx'),
    path.join(root, 'packages/registry/foundations/**/*.mdx'),
    // Stories co-located with components
    path.join(root, 'packages/*/src/**/*.stories.@(ts|tsx)'),
  ],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-themes',
    '@chromatic-com/storybook',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (config) => {
    const { mergeConfig } = await import('vite');
    // Root node_modules has tailwindcss v4; packages/react uses v3. Require v3 explicitly.
    const tailwindcss = require(path.join(root, 'packages/react/node_modules/tailwindcss'));
    const autoprefixer = require('autoprefixer');

    return mergeConfig(config, {
      css: {
        postcss: {
          plugins: [
            // Reference the config file so theme extensions stay in one place.
            // Tailwind v3 bundles jiti to parse TypeScript configs.
            tailwindcss(path.join(root, 'packages/react/tailwind.config.ts')),
            autoprefixer(),
          ],
        },
      },
    });
  },
};

export default config;
