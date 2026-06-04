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
		'@nuxt/content', '@nuxt/image'
	],
	content: {
		navigation: {
			fields: ['title', 'slug', 'type']
		},
		locales: ['fr', 'en'],
		defaultLocale: 'fr'
	},
	image: {
		provider: 'netlify',
	},
	nitro: {
		prerender: {
			crawlLinks: true,
			routes: ['/', '/legal'],
		},
	}
})
