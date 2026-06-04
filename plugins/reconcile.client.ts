import {Lang} from '~/types/lang'
import {Theme} from '~/types/theme'

// Under SSR the prerendered pages carry no cookie, so the global lang/theme
// state hydrates from the (default) build-time payload. After the app mounts,
// re-apply the visitor's persisted cookies so their saved language and theme
// take effect (triggering the content refetch / theme switch reactively).
// Runs client-side only and post-hydration, so it does not cause a mismatch.
export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.hook('app:mounted', () => {
		const langCookie = useCookie<Lang>('lang')
		const lang = useState<Lang>('lang')
		if (langCookie.value && langCookie.value !== lang.value) {
			lang.value = langCookie.value
		}

		const themeCookie = useCookie<Theme>('theme')
		const theme = useState<Theme>('theme')
		if (themeCookie.value && themeCookie.value !== theme.value) {
			theme.value = themeCookie.value
		}
	})
})
