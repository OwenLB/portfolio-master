// v-decode — Matrix-style decode of a text element when it scrolls into view.
//
//   <h2 v-decode>CONTACT</h2>
//   <span v-decode="300">…</span>   (300ms start delay)
//
// Client-only (prerendered HTML keeps the real text) and skipped entirely
// under prefers-reduced-motion. The element's accessible name is pinned via
// aria-label before any scrambling, so screen readers never see glyph soup.
// Elements must contain plain text only.
export default defineNuxtPlugin((nuxtApp) => {
	if (import.meta.server) {
		nuxtApp.vueApp.directive('decode', {getSSRProps: () => ({})})
		return
	}

	const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

	let observer: IntersectionObserver | null = null
	const getObserver = () => observer ??= new IntersectionObserver((entries) => {
		for (const entry of entries) {
			if (entry.isIntersecting) {
				const el = entry.target as HTMLElement
				observer!.unobserve(el)
				const delay = Number(el.dataset.decodeDelay) || 0
				setTimeout(() => decodeText(el, {duration: 700}), delay)
			}
		}
	}, {threshold: 0.5})

	nuxtApp.vueApp.directive('decode', {
		mounted(el: HTMLElement, binding) {
			if (reduced) return
			if (!el.getAttribute('aria-label') && !el.closest('[aria-hidden="true"]')) {
				el.setAttribute('aria-label', el.textContent ?? '')
			}
			if (binding.value) {
				el.dataset.decodeDelay = String(binding.value)
			}
			getObserver().observe(el)
		},
		unmounted(el: HTMLElement) {
			observer?.unobserve(el)
		},
	})
})
