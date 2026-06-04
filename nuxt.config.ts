export default defineNuxtConfig({
	compatibilityDate: '2026-05-28',
	ssr: true,
	app: {
		pageTransition: {name: 'page', mode: 'out-in', appear: true},
		head: {
			script: [
				{
					// Set the theme before first paint to avoid a light flash for
					// dark-mode users in SPA mode (data-theme is otherwise only applied on hydration).
					innerHTML: `(function(){try{var m=document.cookie.match(/(?:^|; )theme=([^;]+)/);var t=m?decodeURIComponent(m[1]):(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
					tagPosition: 'head',
				},
			],
		},
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
		}
	},
	modules: [
		'@nuxt/content', '@nuxt/image', '@nuxtjs/i18n'
	],
	content: {
		navigation: {
			fields: ['title', 'slug', 'type']
		},
		locales: ['fr', 'en'],
		defaultLocale: 'fr'
	},
	i18n: {
		locales: [
			{code: 'fr', language: 'fr-FR', name: 'Français'},
			{code: 'en', language: 'en-US', name: 'English'},
		],
		defaultLocale: 'fr',
		// FR stays at "/", EN is served under "/en/…" so each language has its
		// own crawlable URL (cookie still drives the visitor's preference).
		strategy: 'prefix_except_default',
		baseUrl: 'https://owenlebec.fr',
		detectBrowserLanguage: {
			useCookie: true,
			cookieKey: 'lang',
			redirectOn: 'root',
		},
	},
	image: {
		provider: 'netlify',
	},
	nitro: {
		prerender: {
			crawlLinks: true,
			// Seed both locale roots; localized in-page links let the crawler
			// reach /en/projects/… and /en/legal on its own.
			routes: ['/', '/en', '/legal', '/en/legal'],
			// @nuxt/image (Netlify provider) emits <link rel="preload"> to
			// /.netlify/images?... which only exists at runtime on Netlify's CDN.
			// Don't let the crawler try to prerender it (would 404 and fail the build).
			ignore: ['/.netlify'],
		},
	}
})
