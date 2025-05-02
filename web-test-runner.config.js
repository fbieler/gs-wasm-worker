import { esbuildPlugin } from '@web/dev-server-esbuild';

export default {
  files: ['test/test.js'],
  nodeResolve: true,
  puppeteer: true,
};

