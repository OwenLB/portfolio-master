<script lang="ts" setup>
type Point = { x: number; y: number }

const svgEl  = ref<SVGSVGElement   | null>(null)
const pathEl = ref<SVGPathElement  | null>(null)
const pathD  = ref('')
const viewBox = ref('0 0 800 2000')

onMounted(() => {
	if (!import.meta.client) return
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

	const page = svgEl.value?.parentElement as HTMLElement | null
	if (!page) return

	const DELAY    = 650   // ms — curtains finish at ~0.53s
	const DURATION = 2000  // ms — pulse traverses the full path
	const TRAIL    = 200   // px — visible trail length

	// ── build path points ───────────────────────────────────────
	function buildPoints(): Point[] {
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

		const pts: Point[] = []
		const push = (x: number, y: number) => {
			const l = pts[pts.length - 1]
			if (!l || l.x !== x || l.y !== y) pts.push({ x, y })
		}

		// Phase 1 — serpentine through all rows (covers all H-lines + L/R outer edges)
		for (let row = 0; row < ys.length; row++) {
			const lr = row % 2 === 0
			push(lr ? xs[0] : xs[xs.length - 1], ys[row])
			push(lr ? xs[xs.length - 1] : xs[0], ys[row])
			if (row < ys.length - 1) {
				push(lr ? xs[xs.length - 1] : xs[0], ys[row + 1])
			}
		}

		// Phase 2 — inner vertical columns (connected via top/bottom edges)
		for (let col = 1; col < xs.length - 1; col++) {
			const dn   = col % 2 === 1
			const curr = pts[pts.length - 1]
			const sy   = dn ? ys[0] : ys[ys.length - 1]
			const ey   = dn ? ys[ys.length - 1] : ys[0]
			if (curr.y !== sy) push(curr.x, sy)
			push(xs[col], sy)
			push(xs[col], ey)
		}

		return pts
	}

	function toSVGPath(pts: Point[]): string {
		if (!pts.length) return ''
		return pts.map((p, i) => `${i ? 'L' : 'M'}${p.x} ${p.y}`).join(' ')
	}

	// ── trigger after curtains open ─────────────────────────────
	setTimeout(async () => {
		const W = page.offsetWidth
		const H = page.offsetHeight

		viewBox.value = `0 0 ${W} ${H}`

		const pts = buildPoints()
		if (pts.length < 2) return

		pathD.value = toSVGPath(pts)

		await nextTick() // let Vue render the <path d="...">

		const p = pathEl.value
		if (!p) return

		const len = p.getTotalLength()
		if (!len) return

		const primary = getComputedStyle(document.documentElement)
			.getPropertyValue('--primary').trim()

		// Apply the SVG element glow
		if (svgEl.value) {
			svgEl.value.style.filter = `drop-shadow(0 0 5px ${primary})`
		}

		// Stroke: trailing segment of TRAIL px moves along the path
		p.style.stroke          = primary
		p.style.strokeDasharray = `${TRAIL} ${len + TRAIL}`
		p.style.strokeDashoffset = String(len + TRAIL)
		p.style.strokeOpacity    = '1'

		// Web Animations API — follows SVG path exactly, no corner-cutting
		const anim = p.animate(
			[{ strokeDashoffset: String(len + TRAIL) },
			 { strokeDashoffset: '0' }],
			{ duration: DURATION, easing: 'linear', fill: 'forwards' },
		)

		// Fade out the trail once the pulse has finished
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
