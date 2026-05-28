export default defineNuxtConfig({
	compatibilityDate: '2026-05-28',
	ssr: false,
	app: {
		pageTransition: {name: 'page', mode: 'out-in', appear: true},
		head: {
			link: [
				{ rel: 'preload', href: '/fonts/PPFormulaCondensed-Bold.woff2', as: 'font', type: 'font/woff2', crossorigin: '' },
				{ rel: 'preload', href: '/fonts/PPFormulaCondensed-Light.woff2', as: 'font', type: 'font/woff2', crossorigin: '' },
				{ rel: 'preload', href: '/fonts/Strawford-Regular.woff2', as: 'font', type: 'font/woff2', crossorigin: '' },
				{ rel: 'preload', href: '/fonts/Strawford-Medium.woff2', as: 'font', type: 'font/woff2', crossorigin: '' },
			]
		}
	},
	runtimeConfig: {
		spotifyClientId: process.env.SPOTIFY_CLIENT_ID,
		spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET,
		spotifyRefreshToken: process.env.SPOTIFY_REFRESH_TOKEN
	},
	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					additionalData: '@use "@/assets/scss/style.scss" as *;'
				}
			}
		},
		build: {
			minify: 'terser',
			terserOptions: {
				compress: {
					drop_console: true,
					drop_debugger: true,
				}
			}
		}
	},
	modules: [
		'@nuxt/content', '@nuxt/image'
	],
	content: {
		navigation: {
			fields: ['title', 'slug', 'type']
		},
		locales: ['fr', 'en'],
		defaultLocale: 'fr',
		highlight: false,
	},
	image: {
		provider: 'netlify',
	}
})
