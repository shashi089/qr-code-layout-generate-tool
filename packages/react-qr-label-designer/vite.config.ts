import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig({
    plugins: [
        react(),
        dts({ insertTypesEntry: true })
    ],
    build: {
        lib: {
            entry: {
                'react-qr-label-designer': path.resolve(__dirname, 'src/index.tsx'),
                'pdf': path.resolve(__dirname, 'src/pdf.ts')
            },
            formats: ['es', 'cjs']
        },
        rollupOptions: {
            external: ['react', 'react-dom', 'qrlayout-core', 'qrlayout-ui', 'qrlayout-core/pdf'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    'qrlayout-core': 'QRLayoutCore',
                    'qrlayout-ui': 'QRLayoutUI'
                }
            }
        }
    },
});
