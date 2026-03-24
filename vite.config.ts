import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { viteConfigAliases } from '@syren-dev-tech/confetti/config'

// https://vite.dev/config/
export default defineConfig({
    base: '/shape-gen/',
    css: {
        lightningcss: {
            errorRecovery: true
        }
    },
    plugins: [
        react(),
        babel({ presets: [reactCompilerPreset()] }),
    ],
    resolve: {
        alias: {
            ...viteConfigAliases()
        }
    },
    server: {
        port: 3000
    }
})
