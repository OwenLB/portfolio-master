<script lang="ts" setup>
// Holographic portrait: the photo gains internal parallax driven by a depth
// map (shader offsets UVs by depth × cursor). Uses /images/owen-depth.webp
// when present, else a procedural radial depth (decent on a centered bust).
// The plain <img> stays for SSR/mobile/reduced-motion and whenever anything
// fails — the canvas only fades in over it once the first frame is ready.
const wrap = ref<HTMLElement | null>(null)

onMounted(async () => {
	const host = wrap.value
	if (!host) return
	if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
	await new Promise((r) => 'requestIdleCallback' in window ? requestIdleCallback(() => r(null)) : setTimeout(r, 1200))
	if (!host.isConnected) return

	const THREE = await import('three')
	const loader = new THREE.TextureLoader()
	const load = (src: string) => new Promise<InstanceType<typeof THREE.Texture> | null>((resolve) =>
		loader.load(src, (t) => resolve(t), undefined, () => resolve(null)))

	const map = await load('/images/owen.webp')
	if (!map || !host.isConnected) return

	let depth = await load('/images/owen-depth.webp')
	if (!depth) {
		const c = document.createElement('canvas')
		c.width = c.height = 256
		const x = c.getContext('2d')!
		const g = x.createRadialGradient(128, 118, 20, 128, 128, 150)
		g.addColorStop(0, '#fff')
		g.addColorStop(1, '#000')
		x.fillStyle = g
		x.fillRect(0, 0, 256, 256)
		depth = new THREE.CanvasTexture(c)
	}

	const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true})
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
	renderer.setSize(host.clientWidth, host.clientHeight)
	const scene = new THREE.Scene()
	const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
	const uniforms = {
		uMap: {value: map},
		uDepth: {value: depth},
		uMouse: {value: new THREE.Vector2(0, 0)},
	}
	scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({
		transparent: true,
		uniforms,
		vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position, 1.0); }',
		fragmentShader: `
			uniform sampler2D uMap; uniform sampler2D uDepth; uniform vec2 uMouse;
			varying vec2 vUv;
			void main() {
				float d = texture2D(uDepth, vUv).r - 0.5;
				gl_FragColor = texture2D(uMap, vUv + d * uMouse * 0.045);
			}`,
	})))

	const target = new THREE.Vector2(0, 0)
	const onMove = (e: MouseEvent) => {
		const r = host.getBoundingClientRect()
		target.set(
			Math.max(-1, Math.min(1, (e.clientX - r.left - r.width / 2) / r.width)),
			Math.max(-1, Math.min(1, (e.clientY - r.top - r.height / 2) / r.height)),
		)
	}
	window.addEventListener('mousemove', onMove, {passive: true})

	let raf = 0
	let running = false
	let t = 0
	const loop = () => {
		t += 0.008
		// Cursor parallax + a slow idle sway so the hologram never feels dead.
		uniforms.uMouse.value.x += (target.x + Math.sin(t) * 0.12 - uniforms.uMouse.value.x) * 0.06
		uniforms.uMouse.value.y += (target.y + Math.cos(t * 0.8) * 0.08 - uniforms.uMouse.value.y) * 0.06
		renderer.render(scene, camera)
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

	renderer.render(scene, camera)
	host.appendChild(renderer.domElement)
	host.classList.add('is-3d')

	const ro = new ResizeObserver(() => renderer.setSize(host.clientWidth, host.clientHeight))
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
		window.removeEventListener('mousemove', onMove)
		renderer.dispose()
		map.dispose()
		depth!.dispose()
	})
})
</script>

<template>
	<div ref="wrap" class="app-portrait">
		<img alt="Owen LE BEC" class="arc-image" src="/images/owen.webp" width="420" height="420">
	</div>
</template>

<style lang="scss" scoped>
.app-portrait {
	position: relative;

	:deep(canvas) {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	&.is-3d img {
		visibility: hidden;
	}
}
</style>
