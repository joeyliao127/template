import { defineNuxtConfig } from 'nuxt/config';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2025-05-15',
	runtimeConfig: {},

	components: [
		{
			path: '~/components',
			pathPrefix: false,
		},
	],

	css: ['~/assets/css/tailwind.css'],

	typescript: {
		strict: true,
		typeCheck: 'build',
	},

	devtools: { enabled: false },
	modules: ['@nuxtjs/i18n'],

	i18n: {
		defaultLocale: 'zh',
		locales: [
			{ code: 'en', language: 'en-US' },
			{ code: 'zh', language: 'zh-TW' },
		],
	},
});
