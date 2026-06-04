<script lang="ts" setup>
const svgEl   = ref<SVGSVGElement | null>(null)
const pathEls = ref<SVGPathElement[]>([])
const paths   = ref<string[]>([])
const viewBox = ref('0 0 800 2000')

onMounted(() => {
	if (!import.meta.client) return
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

	const page = svgEl.value?.parentElement as HTMLElement | null
	if (!page) return

	const DELAY    = 650  // ms — curtains finish at ~0.53s
	const DURATION = 700  // ms — all lines animate simultaneously
	const TRAIL    = 150  // px — visible trail length

	function buildLines(): string[] {
		const cr = page.getBoundingClientRect()
		const cells = Array.from(page.querySelectorAll<HTMLElement>('.cell'))
			.map(c => {
				const r = c.getBoundingClientRect()
				return {
					left:   Math.round(r.left   - cr.left),
					top:    Math.round(r.top    - cr.top),
					right:  Math.round(r.right  - cr.left),
					bottom: Math.round(r.bottom - cr.top),
				}
			})
			.filter(r => r.right > r.left && r.bottom > r.top)

		if (!cells.length) return []

		const xs = [...new Set(cells.flatMap(r => [r.left, r.right]))].sort((a, b) => a - b)
		const ys = [...new Set(cells.flatMap(r => [r.top, r.bottom]))].sort((a, b) => a - b)

		if (xs.length < 2 || ys.length < 2) return []

		const lines: string[] = []

		for (const y of ys)
			lines.push(`M${xs[0]} ${y} L${xs[xs.length - 1]} ${y}`)

		for (const x of xs)
			lines.push(`M${x} ${ys[0]} L${x} ${ys[ys.length - 1]}`)

		return lines
	}

	// ── trigger after curtains open ─────────────────────────────
	setTimeout(async () => {
		const W = page.offsetWidth
		const H = page.offsetHeight

		viewBox.value = `0 0 ${W} ${H}`

		paths.value = buildLines()
		if (!paths.value.length) return

		await nextTick()

		const primary = getComputedStyle(document.documentElement)
			.getPropertyValue('--primary').trim()

		if (svgEl.value)
			svgEl.value.style.filter = `drop-shadow(0 0 5px ${primary})`

		const elements = pathEls.value
		const anims: Animation[] = []

		for (const p of elements) {
			const len = p.getTotalLength()
			if (!len) continue

			p.style.stroke           = primary
			p.style.strokeDasharray  = `${TRAIL} ${len + TRAIL}`
			p.style.strokeDashoffset = String(len + TRAIL)
			p.style.strokeOpacity    = '1'

			const anim = p.animate(
				[{ strokeDashoffset: String(len + TRAIL) },
				 { strokeDashoffset: '0' }],
				{ duration: DURATION, easing: 'linear', fill: 'forwards' },
			)
			anims.push(anim)
		}

		anims[0]?.addEventListener('finish', () => {
			for (const p of elements) {
				p.animate(
					[{ opacity: '1' }, { opacity: '0' }],
					{ duration: 400, easing: 'ease-in', fill: 'forwards' },
				)
			}
		})
	}, DELAY)
})
</script>

<template>
	<svg
		ref="svgEl"
		class="grid-pulse"
		:viewBox="viewBox"
		fill="none"
		aria-hidden="true"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			v-for="(d, i) in paths"
			:key="i"
			:ref="(el) => { if (el) pathEls[i] = el as SVGPathElement }"
			:d="d"
			stroke-width="1.5"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	</svg>
</template>

<style lang="scss" scoped>
.grid-pulse {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	pointer-events: none;
	z-index: 5;
	overflow: visible;
}
</style>
