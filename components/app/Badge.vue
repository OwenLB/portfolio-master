<script lang="ts" setup>
// 3D access badge on a physical strap (Verlet rope) — grab it, pull it, let
// it swing. Desktop fine-pointer only; three.js is dynamically imported
// after idle so it never touches the critical path; simulation pauses
// off-screen and in hidden tabs; skipped under prefers-reduced-motion.
const wrap = ref<HTMLElement | null>(null)

onMounted(async () => {
	const host = wrap.value
	if (!host) return
	if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
	await new Promise((r) => 'requestIdleCallback' in window ? requestIdleCallback(() => r(null)) : setTimeout(r, 1200))
	if (!host.isConnected) return

	const THREE = await import('three')
	const css = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim()

	// --- Badge face drawn once into a canvas texture, in the site's voice.
	const makeTexture = () => {
		const c = document.createElement('canvas')
		c.width = 460
		c.height = 640
		const x = c.getContext('2d')!
		x.fillStyle = '#09223B'
		x.beginPath()
		x.roundRect(0, 0, 460, 640, 28)
		x.fill()
		x.strokeStyle = 'rgba(246,249,252,0.18)'
		x.lineWidth = 3
		x.stroke()
		// Clip slot
		x.fillStyle = '#061423'
		x.beginPath()
		x.roundRect(170, 36, 120, 18, 9)
		x.fill()
		x.fillStyle = css('--primary') || '#569dff'
		x.font = 'bold 64px "PP Formula Condensed", sans-serif'
		x.fillText('OWEN', 40, 330)
		x.fillText('LE BEC', 40, 396)
		x.fillStyle = '#F6F9FC'
		x.font = '24px "JetBrains Mono", monospace'
		x.fillText('FULL STACK', 40, 460)
		x.fillText('ENGINEER', 40, 492)
		x.fillStyle = 'rgba(246,249,252,0.55)'
		x.font = '18px "JetBrains Mono", monospace'
		x.fillText('ID 1996-BZH // ACCESS: ALL', 40, 576)
		// Fake barcode
		let bx = 40
		while (bx < 250) {
			const w = 2 + Math.random() * 6
			x.fillRect(bx, 120, w, 90)
			bx += w + 3 + Math.random() * 5
		}
		const texture = new THREE.CanvasTexture(c)
		texture.anisotropy = 4
		return texture
	}

	// --- Scene mapped 1:1 to the host's pixel space (orthographic).
	let W = host.clientWidth
	let H = host.clientHeight
	const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true})
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
	renderer.setSize(W, H)
	host.appendChild(renderer.domElement)
	const scene = new THREE.Scene()
	const camera = new THREE.OrthographicCamera(0, W, 0, -H, -100, 100)

	const CARD_W = 150
	const CARD_H = 208
	const card = new THREE.Mesh(
		new THREE.PlaneGeometry(CARD_W, CARD_H),
		new THREE.MeshBasicMaterial({map: makeTexture(), transparent: true}),
	)
	scene.add(card)

	// Strap ribbon: one quad per rope segment, rebuilt each frame.
	const N = 7
	const SEG = 26
	const strapGeo = new THREE.BufferGeometry()
	const strapPos = new Float32Array(N * 2 * 3)
	strapGeo.setAttribute('position', new THREE.BufferAttribute(strapPos, 3))
	const strapIdx: number[] = []
	for (let i = 0; i < N - 1; i++) {
		const a = i * 2
		strapIdx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2)
	}
	strapGeo.setIndex(strapIdx)
	const strap = new THREE.Mesh(strapGeo, new THREE.MeshBasicMaterial({color: new THREE.Color(css('--primary') || '#237afd'), side: THREE.DoubleSide}))
	scene.add(strap)

	// --- Verlet rope pinned at the top center; the card hangs at the tail.
	const pts = Array.from({length: N}, (_, i) => ({x: W / 2, y: i * SEG + 8, px: W / 2 + (i ? 14 : 0), py: i * SEG + 8}))
	let dragging = false
	const mouse = {x: 0, y: 0}

	const step = () => {
		for (let i = 1; i < N; i++) {
			const p = pts[i]
			const vx = (p.x - p.px) * 0.985
			const vy = (p.y - p.py) * 0.985
			p.px = p.x
			p.py = p.y
			p.x += vx
			p.y += vy + 0.9
		}
		if (dragging) {
			const t = pts[N - 1]
			t.x += (mouse.x - t.x) * 0.55
			t.y += (mouse.y - t.y) * 0.55
		}
		for (let k = 0; k < 4; k++) {
			for (let i = 0; i < N - 1; i++) {
				const a = pts[i]
				const b = pts[i + 1]
				const dx = b.x - a.x
				const dy = b.y - a.y
				const d = Math.hypot(dx, dy) || 1
				const diff = (d - SEG) / d / 2
				if (i > 0) {
					a.x += dx * diff
					a.y += dy * diff
				}
				b.x -= dx * diff * (i > 0 ? 1 : 2)
				b.y -= dy * diff * (i > 0 ? 1 : 2)
			}
		}
	}

	const draw = () => {
		for (let i = 0; i < N; i++) {
			const dir = i < N - 1
				? {x: pts[i + 1].x - pts[i].x, y: pts[i + 1].y - pts[i].y}
				: {x: pts[i].x - pts[i - 1].x, y: pts[i].y - pts[i - 1].y}
			const len = Math.hypot(dir.x, dir.y) || 1
			const nx = (-dir.y / len) * 5
			const ny = (dir.x / len) * 5
			strapPos.set([pts[i].x - nx, -(pts[i].y - ny), 0, pts[i].x + nx, -(pts[i].y + ny), 0], i * 6)
		}
		strapGeo.attributes.position.needsUpdate = true
		const tail = pts[N - 1]
		const prev = pts[N - 2]
		card.position.set(tail.x, -(tail.y + CARD_H / 2 - 24), 0)
		card.rotation.z = Math.atan2(tail.x - prev.x, tail.y - prev.y) * -0.9
		renderer.render(scene, camera)
	}

	let raf = 0
	let running = false
	const loop = () => {
		step()
		draw()
		raf = requestAnimationFrame(loop)
	}
	const start = () => {
		if (!running) {
			running = true
			raf = requestAnimationFrame(loop)
		}
	}
	const stop = () => {
		running = false
		cancelAnimationFrame(raf)
	}

	const toLocal = (e: MouseEvent) => {
		const r = host.getBoundingClientRect()
		mouse.x = e.clientX - r.left
		mouse.y = e.clientY - r.top
	}
	const overCard = () => {
		const tail = pts[N - 1]
		return Math.abs(mouse.x - tail.x) < CARD_W / 2 && Math.abs(mouse.y - (tail.y + CARD_H / 2)) < CARD_H / 2
	}
	const onMove = (e: MouseEvent) => {
		toLocal(e)
		host.style.cursor = dragging ? 'grabbing' : overCard() ? 'grab' : ''
	}
	const onDown = (e: MouseEvent) => {
		toLocal(e)
		if (overCard()) dragging = true
	}
	const onUp = () => {
		dragging = false
		host.style.cursor = ''
	}
	host.addEventListener('mousemove', onMove, {passive: true})
	host.addEventListener('mousedown', onDown)
	window.addEventListener('mouseup', onUp, {passive: true})

	const ro = new ResizeObserver(() => {
		W = host.clientWidth
		H = host.clientHeight
		renderer.setSize(W, H)
		camera.right = W
		camera.bottom = -H
		camera.updateProjectionMatrix()
		pts[0].x = W / 2
		pts[0].px = W / 2
	})
	ro.observe(host)

	let onScreen = true
	const sync = () => (onScreen && !document.hidden ? start() : stop())
	const io = new IntersectionObserver((entries) => {
		onScreen = entries.some((entry) => entry.isIntersecting)
		sync()
	})
	io.observe(host)
	document.addEventListener('visibilitychange', sync)
	start()

	onUnmounted(() => {
		stop()
		ro.disconnect()
		io.disconnect()
		document.removeEventListener('visibilitychange', sync)
		window.removeEventListener('mouseup', onUp)
		renderer.dispose()
		strapGeo.dispose()
		;(card.material as InstanceType<typeof THREE.MeshBasicMaterial>).map?.dispose()
	})
})
</script>

<template>
	<div ref="wrap" aria-hidden="true" class="app-badge"></div>
</template>

<style lang="scss" scoped>
.app-badge {
	display: none;
	position: relative;
	height: 380px;

	// Desktop only — the simulation is pointer-driven.
	@media (hover: hover) and (pointer: fine) and (min-width: $md) {
		display: block;
	}

	:deep(canvas) {
		position: absolute;
		inset: 0;
	}
}
</style>
