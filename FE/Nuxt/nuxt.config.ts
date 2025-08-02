import { defineNuxtConfig } from "nuxt/config";
import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2025-05-15",
    runtimeConfig: {},

    components: [
        {
            path: "~/components",
            pathPrefix: false,
        },
    ],

    css: ["~/assets/css/tailwind.css"],

    typescript: {
        strict: true,
        typeCheck: "build",
    },

    devtools: { enabled: false },
    modules: ["@nuxtjs/i18n", "@nuxt/ui-pro"],

    i18n: {
        defaultLocale: "zh",
        locales: [
            { code: "en", language: "en-US" },
            { code: "zh", language: "zh-TW" },
        ],
        bundle: {
            optimizeTranslationDirective: false,
        },
    },

    vite: {
        plugins: [tailwindcss()],
        server: {
            // TODO: Domain 改為 project name
            allowedHosts: ["nuxt", "template.local.com"],
        },
    },

    ui: {
        theme: {
            // tailwind 原本就支援 primary, secondary，若要套用 color 到 UButton，可以在此設定
            colors: ["accent"],
        },
    },
});
