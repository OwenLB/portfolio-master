<script lang="ts" setup>
const props = defineProps<{
	label: string,
	type?: string,
	path: string,
	// Position in the list — rendered as the editorial "01" index (desktop).
	index?: number,
	// Marks this entry as the shared element morphing into the project hero
	// (View Transitions). Only the home list opts in: naming the "related
	// projects" cards too would make every card fly across the page on each
	// navigation. Names must be unique per page, hence the slug suffix.
	shared?: boolean,
}>()

const localePath = useLocalePath()
const cover = computed(() => `url("/images${props.path}.webp") no-repeat center / cover`)
const slug = computed(() => props.path.split('/').pop())
const vtCover = computed(() => props.shared ? `project-cover-${slug.value}` : 'none')
const vtTitle = computed(() => props.shared ? `project-title-${slug.value}` : 'none')
const number = computed(() => props.index !== undefined ? String(props.index + 1).padStart(2, '0') : '')

// Desktop hover: the project image floats next to the cursor (the row itself
// is text-only there). The wrapper is a fixed 0×0 point moved per mousemove;
// the CSS transition on its transform makes it chase the cursor with a lag.
const preview = ref<HTMLElement | null>(null)
const hoverLabel = ref<HTMLElement | null>(null)
const previewActive = ref(false)
let fine = false
let placed = false
let cancelDecode: (() => void) | null = null

onMounted(() => {
	fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
		&& !window.matchMedia('(prefers-reduced-motion: reduce)').matches
})

function place(event: MouseEvent) {
	preview.value?.style.setProperty('transform', `translate3d(${event.clientX}px, ${event.clientY}px, 0)`)
}

function onEnter(event: MouseEvent) {
	if (!fine) return
	if (!placed && preview.value) {
		// First hover: teleport to the cursor instead of gliding in from 0,0.
		preview.value.style.transition = 'none'
		place(event)
		void preview.value.offsetWidth
		preview.value.style.transition = ''
		placed = true
	} else {
		place(event)
	}
	previewActive.value = true
	cancelDecode?.()
	if (hoverLabel.value) cancelDecode = decodeText(hoverLabel.value, {duration: 350})
}

function onMove(event: MouseEvent) {
	if (fine && previewActive.value) place(event)
}

function onLeave() {
	previewActive.value = false
	cancelDecode?.()
	cancelDecode = null
}
</script>

<template>
	<NuxtLink :to="localePath(props.path)" class="project-link"
			  @mouseenter="onEnter" @mouseleave="onLeave" @mousemove="onMove">
		<div class="project-link__overlay"></div>
		<span v-if="number" aria-hidden="true" class="project-link__index">{{ number }}</span>
		<div class="project-link__title">
			<span class="project-link__title_default">{{ props.label }}</span>
			<span ref="hoverLabel" aria-hidden="true" class="project-link__title_hover">{{ props.label }}</span>
		</div>
		<template v-if="props.type">
			<span class="project-link__type">{{ props.type }}</span>
		</template>
		<span aria-hidden="true" class="project-link__arrow">
			<AppIcon icon="arrow"/>
		</span>
		<div ref="preview" aria-hidden="true" class="project-link__preview">
			<div :class="{'is-active': previewActive}" class="project-link__preview_inner"></div>
		</div>
	</NuxtLink>
</template>

<style lang="scss" scoped>
@use "sass:color";

// Mobile: image card (the editorial row + floating preview is desktop-only).
.project-link {
	position: relative;
	height: 100px;
	display: flex;
	align-items: center;
	padding: space(8) var(--main-space) var(--main-space);
	background: v-bind(cover);
	view-transition-name: v-bind(vtCover);

	&__overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(to right, color.adjust($dark, $alpha: -0.2), color.adjust($dark, $alpha: -1));
	}

	&__index {
		display: none;
	}

	&__title {
		// One line-box high — the hover effect slides the two stacked labels
		// by -100%, so the window must match the span's line height exactly.
		max-height: calc(var(--text-card) * 1.35);
		overflow: hidden;
		z-index: 1;
		display: flex;
		flex-direction: column;
		view-transition-name: v-bind(vtTitle);

		span {
			font-family: var(--font-display);
			font-size: var(--text-card);
			color: $light;
			text-transform: uppercase;
			line-height: 1.35;
			transition: transform 0.4s var(--ease-expo), color var(--dur-fast) ease-in-out;
		}

		&_default {
			font-weight: bold;
		}

		&_hover {
			font-weight: 300;
		}
	}

	&__type {
		display: none;
		position: absolute;
		top: space(6);
		right: space(6);
		color: $light;
		padding: space(2) space(4);
		background: color.adjust($dark, $alpha: -0.5);
		border-radius: space(10);
		backdrop-filter: blur(space(2));
		font-family: var(--font-mono);
		font-size: 0.8rem;
	}

	&__arrow {
		display: none;
	}

	&__preview {
		display: none;
	}

	&:where(:hover,:focus, :focus-visible) {
		.project-link__title {
			&_default, &_hover {
				transform: translateY(-100%);
			}
		}
	}

	&:where(:focus, :focus-visible) {
		.project-link__title {
			span {
				color: var(--primary);
			}
		}
	}
}

// Desktop: editorial index row — number / title / type / arrow, 1px rules.
@media screen and (min-width: $md) {
	.project-link {
		height: auto;
		padding: space(6) 0;
		background: none;
		border-top: 1px solid var(--accent);
		gap: var(--main-space);
		view-transition-name: none;

		&:last-child {
			border-bottom: 1px solid var(--accent);
		}

		&__overlay {
			display: none;
		}

		&__index {
			display: block;
			font-family: var(--font-mono);
			font-size: 0.8rem;
			color: var(--text-accent);
			transition: color var(--dur-fast) ease-in-out;
		}

		&__title {
			flex: 1;

			span {
				color: var(--text);
			}

			&_hover {
				color: var(--primary);
			}
		}

		&__type {
			display: block;
			position: static;
			padding: 0;
			background: none;
			backdrop-filter: none;
			color: var(--text-accent);
			transition: color var(--dur-fast) ease-in-out;
		}

		&__arrow {
			display: flex;
			align-items: center;
			color: var(--primary);
			opacity: 0;
			transform: translateX(space(-2));
			transition: opacity var(--dur-fast) ease-in-out, transform 0.3s var(--ease-out);
		}

		// Floating image preview — a fixed 0×0 anchor moved to the cursor on
		// every mousemove; the transform transition makes it trail behind.
		&__preview {
			display: block;
			position: fixed;
			top: 0;
			left: 0;
			z-index: 10;
			pointer-events: none;
			transition: transform 0.4s var(--ease-out);

			&_inner {
				width: min(340px, 32vw);
				aspect-ratio: 16 / 10;
				border-radius: 6px;
				background: v-bind(cover);
				box-shadow: 0 24px 64px -24px rgba(6, 20, 35, 0.6);
				opacity: 0;
				transform: translate(-50%, -115%) scale(0.85);
				transition: opacity 0.25s var(--ease-out), transform 0.35s var(--ease-out);
				view-transition-name: none;

				&.is-active {
					opacity: 1;
					transform: translate(-50%, -115%) scale(1);
					view-transition-name: v-bind(vtCover);
				}
			}
		}

		&:where(:hover, :focus, :focus-visible) {
			.project-link__index {
				color: var(--primary);
			}

			.project-link__arrow {
				opacity: 1;
				transform: translateX(0);
			}
		}
	}
}
</style>
