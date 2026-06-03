<script lang="ts" setup>
type Point = { x: number; y: number }

const canvas = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
	const cv = canvas.value
	if (!cv) return
	const ctx = cv.getContext('2d')
	if (!ctx) return

	const page = cv.parentElement as HTMLElement
	if (!page) return

	if (!import.meta.client) return
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

	const DELAY    = 1500  // ms — curtains finish at 1.4s
	const DURATION = 2800  // ms — total traversal
	const TRAIL    = 180   // px of visible trail
	const STEPS    = 90    // draw segments for trail

	let rafId: number
	let startTime: number | null = null
	let path: Point[] = []
	let totalLen = 0

	// ── helpers ──────────────────────────────────────────────
	function getPrimary(): [number, number, number] {
		const hex = getComputedStyle(document.documentElement)
			.getPropertyValue('--primary').trim().replace('#', '')
		return [
			parseInt(hex.slice(0, 2), 16) || 35,
			parseInt(hex.slice(2, 4), 16) || 122,
			parseInt(hex.slice(4, 6), 16) || 253,
		]
	}

	function segLen(a: Point, b: Point) {
		const dx = b.x - a.x, dy = b.y - a.y
		return Math.sqrt(dx * dx + dy * dy)
	}

	function pointAt(pts: Point[], dist: number): Point {
		if (dist <= 0) return pts[0]
		let rem = dist
		for (let i = 0; i < pts.length - 1; i++) {
			const d = segLen(pts[i], pts[i + 1])
			if (rem <= d) {
				const t = rem / d
				return { x: pts[i].x + (pts[i + 1].x - pts[i].x) * t,
				         y: pts[i].y + (pts[i + 1].y - pts[i].y) * t }
			}
			rem -= d
		}
		return pts[pts.length - 1]
	}

	// ── path building ─────────────────────────────────────────
	// Builds a continuous path visiting every grid line at least once.
	// Strategy:
	//   Phase 0 — outer boundary (clockwise)
	//   Phase 1 — inner horizontals (serpentine via left/right edges)
	//   Phase 2 — inner verticals   (serpentine via top/bottom edges)
	function buildPath(): Point[] {
		const containerRect = page.getBoundingClientRect()
		const cells = Array.from(page.querySelectorAll<HTMLElement>('.cell'))
		if (!cells.length) return []

		// Cell positions relative to the page container
		const rects = cells
			.map(c => {
				const r = c.getBoundingClientRect()
				return {
					left:   Math.round(r.left   - containerRect.left),
					top:    Math.round(r.top    - containerRect.top  + window.scrollY),
					right:  Math.round(r.right  - containerRect.left),
					bottom: Math.round(r.bottom - containerRect.top  + window.scrollY),
				}
			})
			.filter(r => r.right - r.left > 0 && r.bottom - r.top > 0)

		if (!rects.length) return []

		const xs = [...new Set(rects.flatMap(r => [r.left, r.right]))].sort((a, b) => a - b)
		const ys = [...new Set(rects.flatMap(r => [r.top, r.bottom]))].sort((a, b) => a - b)

		if (xs.length < 2 || ys.length < 2) return []

		const X0 = xs[0], XN = xs[xs.length - 1]
		const Y0 = ys[0], YN = ys[ys.length - 1]

		const pts: Point[] = []
		const add = (x: number, y: number) => {
			const last = pts[pts.length - 1]
			if (!last || last.x !== x || last.y !== y) pts.push({ x, y })
		}

		// Phase 0: outer boundary clockwise
		add(X0, Y0); add(XN, Y0); add(XN, YN); add(X0, YN); add(X0, Y0)

		// Phase 1: inner horizontal lines
		for (let i = 1; i < ys.length - 1; i++) {
			const goRight   = i % 2 === 1
			const startX    = goRight ? X0 : XN
			const endX      = goRight ? XN : X0

			// Navigate to startX via whichever vertical edge is closer
			const last = pts[pts.length - 1]
			add(startX, last.y)   // horizontal move to left/right edge
			add(startX, ys[i])    // slide down/up the edge to this row
			add(endX,   ys[i])    // traverse the horizontal line
		}

		// Phase 2: inner vertical lines
		for (let j = 1; j < xs.length - 1; j++) {
			const goDown = j % 2 === 1
			const startY = goDown ? Y0 : YN
			const endY   = goDown ? YN : Y0

			const last = pts[pts.length - 1]
			add(last.x, startY)  // move to top/bottom edge
			add(xs[j],  startY)  // slide along edge to this column
			add(xs[j],  endY)    // traverse the vertical line
		}

		return pts
	}

	// ── init ─────────────────────────────────────────────────
	function init() {
		cv.width  = page.offsetWidth  || 800
		cv.height = page.scrollHeight || page.offsetHeight || 2000

		path     = buildPath()
		totalLen = 0
		for (let i = 0; i < path.length - 1; i++) totalLen += segLen(path[i], path[i + 1])
	}

	// ── draw ─────────────────────────────────────────────────
	function draw() {
		ctx.clearRect(0, 0, cv.width, cv.height)

		if (startTime !== null) {
			const elapsed  = performance.now() - startTime
			const progress = elapsed / DURATION        // 0 → 1
			const headDist = progress * totalLen

			if (headDist <= totalLen + TRAIL) {
				const [r, g, b] = getPrimary()

				// Trail: draw STEPS small segments from tail → head
				for (let i = 0; i < STEPS; i++) {
					const t1 = i / STEPS
					const t2 = (i + 1) / STEPS
					const d1 = headDist - t1 * TRAIL
					const d2 = headDist - t2 * TRAIL
					if (d1 < 0) break

					const p1 = pointAt(path, d1)
					const p2 = pointAt(path, Math.max(0, d2))

					const alpha = (1 - t1) * 0.9
					const width = (1 - t1) * 2.5 + 0.5

					ctx.beginPath()
					ctx.strokeStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`
					ctx.lineWidth   = width
					ctx.lineCap     = 'round'
					ctx.moveTo(p1.x, p1.y)
					ctx.lineTo(p2.x, p2.y)
					ctx.stroke()
				}

				// Head: bright glowing dot
				if (headDist <= totalLen) {
					const head = pointAt(path, headDist)
					ctx.save()
					ctx.shadowColor = `rgba(${r},${g},${b},1)`
					ctx.shadowBlur  = 14
					ctx.beginPath()
					ctx.arc(head.x, head.y, 2.5, 0, Math.PI * 2)
					ctx.fillStyle = '#ffffff'
					ctx.fill()
					ctx.restore()
				}
			}
		}

		rafId = requestAnimationFrame(draw)
	}

	// ── start ─────────────────────────────────────────────────
	setTimeout(() => {
		init()  // re-measure when curtains are fully open
		startTime = performance.now()
	}, DELAY)

	// Initial canvas sizing (no path needed yet)
	cv.width  = page.offsetWidth  || 800
	cv.height = page.scrollHeight || page.offsetHeight || 2000

	draw()

	const ro = new ResizeObserver(() => {
		if (!startTime) {
			cv.width  = page.offsetWidth  || 800
			cv.height = page.scrollHeight || page.offsetHeight || 2000
		}
	})
	ro.observe(page)

	onUnmounted(() => {
		cancelAnimationFrame(rafId)
		ro.disconnect()
	})
})
</script>

<template>
	<canvas ref="canvas" class="grid-pulse"/>
</template>

<style lang="scss" scoped>
.grid-pulse {
	position: absolute;
	inset: 0;
	pointer-events: none;
	z-index: 5;
}
</style>
