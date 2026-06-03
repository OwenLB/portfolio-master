<script lang="ts" setup>
const canvas = ref<HTMLCanvasElement | null>(null)
const cursor = { x: -9999, y: -9999 }

onMounted(() => {
	const cv = canvas.value
	if (!cv) return
	const ctx = cv.getContext('2d')
	if (!ctx) return

	const CHARS      = 'ABCDEFGHIJKLMNOPQRSTUVWXYZｦｧｩｫｭｯｱｳｵｷｹｻｽｿﾁﾃﾅﾇﾉ0123456789<>[]|/\\'
	const FS         = 9     // column width in px
	const TRAIL      = 12
	const SPEED_MIN  = 0.28
	const SPEED_MAX  = 0.60
	const BASE_ALPHA = 0.18  // always-visible opacity
	const GLOW_EXTRA = 0.55  // bonus opacity near cursor
	const GLOW_R     = 180   // glow radius in px

	let rafId: number
	let drops: { col: number; y: number; speed: number; chars: string[] }[] = []

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

	function getBg(): string {
		return getComputedStyle(document.documentElement).getPropertyValue('--background').trim()
	}

	function init() {
		const parent = cv.parentElement
		if (!parent) return
		cv.width  = parent.offsetWidth  || 300
		cv.height = parent.offsetHeight || 200

		const cols = Math.floor(cv.width / FS)
		drops = Array.from({ length: cols * 3 }, (_, i) => ({
			col:   i % cols,
			y:     Math.random() * cv.height * 1.5,
			speed: SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN),
			chars: Array.from({ length: TRAIL + 1 }, rndChar),
		}))
	}

	function draw() {
		const w = cv.width
		const h = cv.height
		const [r, g, b] = getPrimary()

		// Background matches page background
		ctx.fillStyle = getBg()
		ctx.fillRect(0, 0, w, h)

		ctx.font = `${FS}px 'Courier New', monospace`

		// Cursor in canvas-local coordinates
		const rect = cv.getBoundingClientRect()
		const lx = cursor.x - rect.left
		const ly = cursor.y - rect.top

		for (const drop of drops) {
			const x = drop.col * FS + 1

			for (let j = 0; j <= TRAIL; j++) {
				const charY = drop.y - j * FS
				if (charY < -FS || charY > h) continue

				const fade = 1 - j / TRAIL

				// Base visibility (always on, fades along trail)
				const base = fade * BASE_ALPHA

				// Proximity bonus: characters near cursor glow extra
				const dx   = x   - lx
				const dy   = charY - ly
				const dist = Math.sqrt(dx * dx + dy * dy)
				const glow = Math.max(0, 1 - dist / GLOW_R) * GLOW_EXTRA

				const alpha = base + glow

				if (j === 0) {
					// Head: white flash
					ctx.fillStyle = `rgba(255,255,255,${Math.min(alpha * 1.6, 0.75).toFixed(3)})`
				} else {
					ctx.fillStyle = `rgba(${r},${g},${b},${alpha.toFixed(3)})`
				}

				ctx.fillText(drop.chars[j], x, charY)

				if (j > 0 && Math.random() > 0.97) drop.chars[j] = rndChar()
			}

			drop.y += drop.speed
			if (drop.y - TRAIL * FS > h) {
				drop.y = -TRAIL * FS
				drop.speed = SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN)
				drop.chars = Array.from({ length: TRAIL + 1 }, rndChar)
			}
		}

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
