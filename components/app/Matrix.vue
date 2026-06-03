<script lang="ts" setup>
const canvas = ref<HTMLCanvasElement | null>(null)

onMounted(() => {
	const cv = canvas.value
	if (!cv) return
	const ctx = cv.getContext('2d')
	if (!ctx) return

	const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZｦｧｩｫｭｯｱｳｵｷｹｻｽｿﾁﾃﾅﾇﾉ0123456789<>[]|/\\'
	const FS = 13
	const TRAIL = 8
	const SPEED_MIN = 0.35
	const SPEED_MAX = 0.75
	// Very subtle — characters are texture, not dominant
	const MAX_ALPHA = 0.14

	let rafId: number
	let drops: { y: number; speed: number; chars: string[] }[] = []

	function rndChar() {
		return CHARS[Math.floor(Math.random() * CHARS.length)]
	}

	function getColor(): [number, number, number] {
		const hex = getComputedStyle(document.documentElement)
			.getPropertyValue('--primary')
			.trim()
			.replace('#', '')
		return [
			parseInt(hex.slice(0, 2), 16) || 35,
			parseInt(hex.slice(2, 4), 16) || 122,
			parseInt(hex.slice(4, 6), 16) || 253,
		]
	}

	function init() {
		const parent = cv.parentElement
		if (!parent) return
		cv.width = parent.offsetWidth || 300
		cv.height = parent.offsetHeight || 200
		const cols = Math.floor(cv.width / FS)
		drops = Array.from({ length: cols }, () => ({
			// scatter initial y positions so they don't all start at top
			y: Math.random() * cv.height * 1.5,
			speed: SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN),
			chars: Array.from({ length: TRAIL + 1 }, rndChar),
		}))
	}

	function draw() {
		// Fully transparent each frame — cursor glow (AppEffect) shows through
		ctx.clearRect(0, 0, cv.width, cv.height)

		const [r, g, b] = getColor()
		ctx.font = `${FS}px 'Courier New', monospace`

		for (let i = 0; i < drops.length; i++) {
			const drop = drops[i]
			const x = i * FS + 1

			for (let j = 0; j <= TRAIL; j++) {
				const charY = drop.y - j * FS
				if (charY < -FS || charY > cv.height) continue

				const fade = 1 - j / TRAIL

				if (j === 0) {
					// Head: brief white flash
					ctx.fillStyle = `rgba(255,255,255,${(fade * MAX_ALPHA * 2.2).toFixed(3)})`
				} else {
					ctx.fillStyle = `rgba(${r},${g},${b},${(fade * MAX_ALPHA).toFixed(3)})`
				}

				ctx.fillText(drop.chars[j], x, charY)

				// Shimmer: occasionally swap a trail character
				if (j > 0 && Math.random() > 0.97) {
					drop.chars[j] = rndChar()
				}
			}

			drop.y += drop.speed

			// Reset column when it has fully exited the bottom
			if (drop.y - TRAIL * FS > cv.height) {
				drop.y = -TRAIL * FS
				drop.speed = SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN)
				drop.chars = Array.from({ length: TRAIL + 1 }, rndChar)
			}
		}

		rafId = requestAnimationFrame(draw)
	}

	init()
	draw()

	const ro = new ResizeObserver(init)
	if (cv.parentElement) ro.observe(cv.parentElement)

	onUnmounted(() => {
		cancelAnimationFrame(rafId)
		ro.disconnect()
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
