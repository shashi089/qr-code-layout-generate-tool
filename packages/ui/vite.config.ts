import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    resolve: {
        alias: {
            '@qrlayout/core': path.resolve(__dirname, '../core/src/index.ts')
        }
    },
    server: {
        fs: {
            // Allow serving files from one level up to the project root
            allow: ['..']
        }
    }
});
