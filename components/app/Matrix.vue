<script lang="ts" setup>
const canvas = ref<HTMLCanvasElement | null>(null)
const cursor = { x: -9999, y: -9999 }

onMounted(() => {
	const cv = canvas.value
	if (!cv) return
	const ctx = cv.getContext('2d')
	if (!ctx) return

	const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZｦｧｩｫｭｯｱｳｵｷｹｻｽｿﾁﾃﾅﾇﾉ0123456789<>[]|/\\'
	const FS       = 11    // px — smaller = more columns = more density
	const TRAIL    = 10    // characters in each drop's tail
	const SPEED_MIN = 0.35
	const SPEED_MAX = 0.75
	const HOLE_MAX  = 0.82 // how transparent the character "windows" are

	let rafId: number
	let drops: { col: number; y: number; speed: number; chars: string[] }[] = []

	// Offscreen canvases (created once)
	let maskCv: HTMLCanvasElement
	let glowCv: HTMLCanvasElement
	let maskCtx: CanvasRenderingContext2D
	let glowCtx: CanvasRenderingContext2D

	function rndChar() {
		return CHARS[Math.floor(Math.random() * CHARS.length)]
	}

	function getPrimary(): [number, number, number] {
		const hex = getComputedStyle(document.documentElement)
			.getPropertyValue('--primary').trim().replace('#', '')
		return [
			parseInt(hex.slice(0, 2), 16) || 35,
			parseInt(hex.slice(2, 4), 16) || 122,
			parseInt(hex.slice(4, 6), 16) || 253,
		]
	}

	function getAccent(): string {
		return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()
	}

	function init() {
		const parent = cv.parentElement
		if (!parent) return
		const w = parent.offsetWidth  || 300
		const h = parent.offsetHeight || 200
		cv.width = w; cv.height = h

		if (!maskCv) {
			maskCv = document.createElement('canvas')
			glowCv = document.createElement('canvas')
			maskCtx = maskCv.getContext('2d')!
			glowCtx = glowCv.getContext('2d')!
		}
		maskCv.width = w; maskCv.height = h
		glowCv.width = w; glowCv.height = h

		const cols = Math.floor(w / FS)
		// 2 drops per column offset in time → denser vertical coverage
		drops = Array.from({ length: cols * 2 }, (_, i) => ({
			col:   i % cols,
			y:     Math.random() * h * 1.5,
			speed: SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN),
			chars: Array.from({ length: TRAIL + 1 }, rndChar),
		}))
	}

	function draw() {
		const w = cv.width
		const h = cv.height
		const [r, g, b] = getPrimary()

		// ── 1. Glow layer (radial gradient at cursor position) ────
		glowCtx.clearRect(0, 0, w, h)
		const rect = cv.getBoundingClientRect()
		const lx = cursor.x - rect.left
		const ly = cursor.y - rect.top
		const grad = glowCtx.createRadialGradient(lx, ly, 0, lx, ly, 220)
		grad.addColorStop(0,    `rgba(${r},${g},${b},1)`)
		grad.addColorStop(0.35, `rgba(${r},${g},${b},0.5)`)
		grad.addColorStop(1,    `rgba(${r},${g},${b},0)`)
		glowCtx.fillStyle = grad
		glowCtx.fillRect(0, 0, w, h)

		// ── 2. Mask layer: solid accent background + char holes ───
		// Solid fill blocks glow everywhere by default
		maskCtx.clearRect(0, 0, w, h)
		maskCtx.globalCompositeOperation = 'source-over'
		maskCtx.globalAlpha = 1
		maskCtx.fillStyle = getAccent()
		maskCtx.fillRect(0, 0, w, h)

		// destination-out "carves" transparent holes shaped like characters
		// → glow layer shows through only at those positions
		maskCtx.globalCompositeOperation = 'destination-out'
		maskCtx.font = `${FS}px 'Courier New', monospace`

		for (const drop of drops) {
			const x = drop.col * FS + 1
			for (let j = 0; j <= TRAIL; j++) {
				const charY = drop.y - j * FS
				if (charY < -FS || charY > h) continue

				const fade = 1 - j / TRAIL
				maskCtx.globalAlpha = fade * HOLE_MAX
				maskCtx.fillText(drop.chars[j], x, charY)

				// Occasional shimmer on trail characters
				if (j > 0 && Math.random() > 0.97) drop.chars[j] = rndChar()
			}

			drop.y += drop.speed
			if (drop.y - TRAIL * FS > h) {
				drop.y = -TRAIL * FS
				drop.speed = SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN)
				drop.chars = Array.from({ length: TRAIL + 1 }, rndChar)
			}
		}
		maskCtx.globalCompositeOperation = 'source-over'
		maskCtx.globalAlpha = 1

		// ── 3. Composite onto visible canvas ─────────────────────
		// glow behind, mask on top → glow only escapes through char holes
		ctx.clearRect(0, 0, w, h)
		ctx.drawImage(glowCv, 0, 0)
		ctx.drawImage(maskCv, 0, 0)

		rafId = requestAnimationFrame(draw)
	}

	function onMove(e: MouseEvent) {
		cursor.x = e.clientX
		cursor.y = e.clientY
	}
	window.addEventListener('mousemove', onMove)

	init()
	draw()

	const ro = new ResizeObserver(init)
	if (cv.parentElement) ro.observe(cv.parentElement)

	onUnmounted(() => {
		cancelAnimationFrame(rafId)
		ro.disconnect()
		window.removeEventListener('mousemove', onMove)
	})
})
</script>

<template>
	<canvas ref="canvas" class="matrix"/>
</template>

<style lang="scss" scoped>
.matrix {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	display: block;
}
</style>
