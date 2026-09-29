import { defineNuxtConfig } from 'nuxt/config'
import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-05-15',
    runtimeConfig: {
        // 兩個 BE API Server
        AUTH_API: process.env.AUTH_API_BASE,
        RESOURCE_API: process.env.RESOURCE_API_BASE,
        public: {
            API_URL: process.env.API_URL,
            SESSION_COOKIE: '__PROJECT_NAME___session',
        },
    },

    css: ['~/assets/css/tailwind.css'],

    imports: {
        // 讓 Nuxt scan 所有層級的 composable 都套用 auto import 功能
        dirs: ['~/composables', '~/composables/**'],
    },

    typescript: {
        strict: true,
        typeCheck: 'build',
        // Nuxt 4.4 的 tsconfig include 只涵蓋 rootDir 根目錄的 *.d.ts，
        // 需明確把 types/ 下的 ambient 型別增強（如 #auth SessionData）加回。
        tsConfig: {
            include: ['../types/**/*.d.ts'],
        },
    },

    devtools: { enabled: true },
    devServer: {
        host: '0.0.0.0',
    },
    modules: ['@nuxt/eslint', '@nuxtjs/i18n', '@nuxt/ui', '@nuxt/icon', 'nuxt-lucide-icons', '@sidebase/nuxt-auth'],

    /**
     * Nuxt-Auth local backedn 文件：https://auth.sidebase.io/guide/local/quick-start
     * 1. type 設定 local
     * 2. endpoints 設定對應的 API 路徑，需要在 server/api/auth/ 下實作對應的 API，透過 Nuxt server 呼叫 Spring Boot API
     */
    auth: {
        globalAppMiddleware: {
            isEnabled: true,
        },
        provider: {
            type: 'local',
            endpoints: {
                signIn: { path: '/signIn', method: 'post' },
                signOut: { path: '/signOut', method: 'post' },
                signUp: { path: '/signUp', method: 'post' },
                getSession: { path: '/session', method: 'get' },
            },
            pages: {
                login: '/signIn',
            },
        },
    },
    i18n: {
        defaultLocale: 'en',
        langDir: '../i18n/locales/',
        locales: [
            { code: 'en', language: 'en-US', file: 'en.yaml' },
            { code: 'zh', language: 'zh-TW', file: 'zh.yaml' },
        ],
    },

    vite: {
        plugins: [tailwindcss()],
        server: {
            allowedHosts: ['nuxt', '__PROJECT_NAME__.local.com', 'localhost'],
            hmr: {
                protocol: 'ws',
                host: '__PROJECT_NAME__.local.com',
                clientPort: 443, // 如果你沒用 HTTPS 可改成 80
            },
        },
    },

    ui: {
        theme: {
            colors: ['primary', 'secondary', 'success', 'info', 'warning', 'error'],
        },
    },

    colorMode: {
        preference: 'light',
        fallback: 'light',
    },

    //icon設定
    lucide: {
        namePrefix: 'lucide',
    },

    alias: {},

    nitro: {
        externals: {
            inline: ['next-auth'],
        },
        storage: {},
    },
})
