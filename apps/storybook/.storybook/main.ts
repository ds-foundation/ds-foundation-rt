import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
};

export default config;
