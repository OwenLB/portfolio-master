// When the browser supports the View Transitions API, navigation is animated
// by Nuxt's view-transition plugin (experimental.viewTransition) — running the
// Vue curtain pageTransition on top of it would double the animation. Disable
// the Vue transition there; browsers without support keep the curtain.
export default defineNuxtPlugin(() => {
	if (!document.startViewTransition) return

	useRouter().beforeEach((to) => {
		to.meta.pageTransition = false
	})
})
