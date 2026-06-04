<script lang="ts" setup>
const svgEl  = ref<SVGSVGElement  | null>(null)
const pathEl = ref<SVGPathElement | null>(null)
const pathD  = ref('')
const viewBox = ref('0 0 800 2000')

onMounted(() => {
	if (!import.meta.client) return
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

	const page = svgEl.value?.parentElement as HTMLElement | null
	if (!page) return

	const DELAY    = 650   // ms — curtains finish at ~0.53s
	const DURATION = 2500  // ms — maze traversal top-left → bottom-right
	const TRAIL    = 120   // px — visible trail length

	// ── build maze path (column serpentine, top-left → bottom-right) ──
	function buildPath(): string {
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

		if (!cells.length) return ''

		const xs = [...new Set(cells.flatMap(r => [r.left, r.right]))].sort((a, b) => a - b)
		const ys = [...new Set(cells.flatMap(r => [r.top, r.bottom]))].sort((a, b) => a - b)

		if (xs.length < 2 || ys.length < 2) return ''

		const yTop = ys[0]
		const yBot = ys[ys.length - 1]
		const pts: [number, number][] = [[xs[0], yTop]]

		// Serpentine column by column — even cols go down, odd go up
		for (let i = 0; i < xs.length; i++) {
			const x    = xs[i]
			const down = i % 2 === 0
			pts.push([x, down ? yBot : yTop])
			if (i < xs.length - 1)
				pts.push([xs[i + 1], down ? yBot : yTop])
		}

		// Guarantee end at bottom-right
		const last = pts[pts.length - 1]
		if (last[0] !== xs[xs.length - 1] || last[1] !== yBot)
			pts.push([xs[xs.length - 1], yBot])

		return pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x} ${y}`).join(' ')
	}

	// ── trigger after curtains open ─────────────────────────────
	setTimeout(async () => {
		const W = page.offsetWidth
		const H = page.offsetHeight

		viewBox.value = `0 0 ${W} ${H}`
		pathD.value   = buildPath()

		await nextTick()

		const p = pathEl.value
		if (!p) return
		const len = p.getTotalLength()
		if (!len) return

		const primary = getComputedStyle(document.documentElement)
			.getPropertyValue('--primary').trim()

		if (svgEl.value)
			svgEl.value.style.filter = `drop-shadow(0 0 5px ${primary})`

		p.style.stroke           = primary
		p.style.strokeDasharray  = `${TRAIL} ${len + TRAIL}`
		p.style.strokeDashoffset = String(len + TRAIL)
		p.style.strokeOpacity    = '1'

		const anim = p.animate(
			[{ strokeDashoffset: String(len + TRAIL) },
			 { strokeDashoffset: '0' }],
			{ duration: DURATION, easing: 'linear', fill: 'forwards' },
		)

		anim.addEventListener('finish', () => {
			p.animate(
				[{ opacity: '1' }, { opacity: '0' }],
				{ duration: 400, easing: 'ease-in', fill: 'forwards' },
			)
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
			ref="pathEl"
			:d="pathD"
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
