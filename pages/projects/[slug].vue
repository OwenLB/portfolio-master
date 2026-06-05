<script lang="ts" setup>
import {Project} from "~/types/project";
import {Lang} from "~/types/lang";

const route = useRoute()

definePageMeta({middleware: 'project'})

const props = defineProps<{
	lang: Lang
}>()

// @nuxt/content paths carry no locale prefix (/projects/finixa), so derive the
// content path + image path from the slug rather than route.path — the latter
// gains a /en prefix in the English locale and would miss both the document and
// the image. route.path is still used for canonical/JSON-LD (the localized URL).
const contentPath = computed(() => `/projects/${route.params.slug}`)
const imageUrl = computed(() => `https://owenlebec.fr/images/projects/${route.params.slug}.webp`)

const {data: content}: { data: Project } = await useAsyncData(
	() => `project-${contentPath.value}-${props.lang}`,
	() => queryContent().where({_path: contentPath.value, _locale: props.lang}).findOne()
)

useSeoMeta({
	title: computed(() => content.value?.title),
	description: computed(() => content.value?.description),
	ogTitle: computed(() => content.value?.title),
	ogDescription: computed(() => content.value?.description),
	ogImage: imageUrl,
	twitterCard: 'summary_large_image',
	twitterTitle: computed(() => content.value?.title),
	twitterDescription: computed(() => content.value?.description),
	twitterImage: imageUrl,
})

useHead(() => ({
	script: content.value ? [{
		type: 'application/ld+json',
		innerHTML: JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'CreativeWork',
			name: content.value.title,
			abstract: content.value.description,
			url: 'https://owenlebec.fr' + route.path,
			image: imageUrl.value,
			author: {'@type': 'Person', name: 'Owen LE BEC', url: 'https://owenlebec.fr'},
			keywords: content.value.stack,
			...(content.value.git ? {codeRepository: content.value.git[1]} : {}),
		}),
	}] : [],
}))

const {data: related, execute}: { data: Project[] } = await useAsyncData(
	() => `related-${contentPath.value}-${props.lang}`,
	() => queryContent('projects').where({_locale: props.lang}).only(['title', 'type', '_path']).findSurround(contentPath.value, {before: 3, after: 3}),
	{
		immediate: false,
		transform: (projects) => projects.filter((project) => project !== null),
	}
)

// Lazy-load the "related projects" query when its section scrolls into view,
// instead of after an arbitrary 1s delay.
const relatedRef = ref<HTMLElement | null>(null)

onMounted(() => {
	if (!relatedRef.value) {
		execute()
		return
	}
	const observer = new IntersectionObserver((entries, obs) => {
		if (entries.some((entry) => entry.isIntersecting)) {
			execute()
			obs.disconnect()
		}
	}, {rootMargin: '200px'})
	observer.observe(relatedRef.value)
})
</script>

<template>
	<div id="project" class="page">
		<AppEffect/>
		<AppHeader/>

		<main id="main-content">
			<AppSection id="project__hero" desktop>
				<div class="cell cell--triple-column">
					<div class="overlay"></div>
					<nuxt-img :alt="content.title" :src="`/images/projects/${route.params.slug}.webp`" preload sizes="xs:640 md:100vw"/>
					<h1>{{ content.title }}</h1>
					<template v-if="content['type']">
						<span class="project-type">{{ content.type }}</span>
					</template>
				</div>
			</AppSection>

			<AppSection id="project__details" desktop>
				<div class="cell cell--mobile">
				</div>
				<div class="cell cell--double-column details">
					<h2>DETAILS</h2>
					<p>{{ content.description }}</p>
					<LinkText v-if="content.git" :label="content.git[0]" :link="content.git[1]" external/>
					<span v-else-if="content.git_soon" class="repo-soon">{{ props.lang === Lang.Fr ? 'Répertoire Git — bientôt public' : 'Git repository — coming soon' }}</span>
					<LinkText v-if="content.web" :label="content.web[0]" :link="content.web[1]" external/>
				</div>
				<div class="cell stack">
					<h2>STACK</h2>
					<ul>
						<li v-for="tech in content.stack">
							{{ tech }}
						</li>
					</ul>
				</div>
			</AppSection>

			<AppSection id="project__description">
				<div class="cell cell--triple-column">
					<ContentRenderer :value="content" class="content"/>
				</div>
			</AppSection>

			<AppSection id="project__related">
				<div ref="relatedRef" class="cell cell--triple-column content">
					<h2>{{ props.lang === Lang.Fr ? 'AUTRES PROJETS' : 'OTHER PROJECTS' }}</h2>
					<div class="projects">
						<LinkProject v-for="project in related" :key="project._path" :label="project.title"
									 :path="project._path" :type="project.type"/>
					</div>
				</div>
			</AppSection>
		</main>

		<AppFooter/>
	</div>
</template>

<style lang="scss">
@use "sass:color";

#project {
	grid-template-rows: space(20) 300px repeat(3, auto) space(20);

	&__hero {
		.cell--triple-column {
			position: relative;
			background: var(--background);
			font-family: 'PP Formula Condensed', sans-serif;
			justify-content: center;

			.overlay {
				position: absolute;
				inset: 0;
				z-index: 1;
				background: linear-gradient(to right, color.adjust($dark, $alpha: -0.2), color.adjust($dark, $alpha: -1));
			}

			img {
				position: absolute;
				inset: 0;
				object-fit: cover;
				width: 100%;
				height: 100%;
			}

			h1 {
				z-index: 1;
				display: block;
				font-size: 3rem;
				font-weight: bold;
				color: $light;
			}

			.project-type {
				position: absolute;
				z-index: 1;
				top: space(6);
				right: space(6);
				color: $light;
				padding: space(2) space(4);
				background: color.adjust($dark, $alpha: -0.5);
				border-radius: space(10);
				backdrop-filter: blur(space(2));
				font-size: 0.875rem;
				font-family: 'Strawford', sans-serif;
			}
		}


	}

	&__details {
		.details {
			p {
				flex-grow: 1;
			}

			// Muted, non-clickable counterpart to the .text-link pill, shown
			// when the public repo isn't up yet (git_soon) instead of a dead link.
			.repo-soon {
				display: flex;
				align-items: center;
				padding: 0 space(6);
				height: 56px;
				border: 1px dashed var(--accent);
				border-radius: 32px;
				font-size: 1rem;
				color: var(--text-accent);
				cursor: default;

				@media screen and (min-width: $md) {
					font-size: 1.125rem;
				}
			}
		}

		.stack {
			justify-content: space-between;
		}
	}

	&__description {
		.content {
			display: flex;
			flex-direction: column;
			gap: space(6);

			img {
				max-width: 100%;
				object-fit: cover;
			}

			code {
				font-family: 'Courier New', monospace;
				font-size: 0.85em;
				background: var(--accent);
				color: var(--text);
				padding: 1px space(2);
				border-radius: 3px;
				word-break: break-word;
			}

			ul li {
				display: block;

				&:before {
					display: inline-block;
					vertical-align: middle;
					margin-right: space(4);
				}
			}

			figure {
				border-radius: 8px;
				overflow: hidden;
				border: 1px solid var(--accent);
			}

			figure img {
				display: block;
			}

		}
	}

	&__related {
		.projects {
			display: flex;
			flex-direction: column;
			gap: var(--main-space);

			.project-link {
				flex-grow: 1;
			}
		}
	}
}

html[data-theme="dark"] #project__description .content .svg-wrapper svg {
	// Flowchart nodes
	.node rect, .node circle, .node ellipse, .node polygon, .node path {
		fill: var(--accent) !important;
		stroke: var(--primary) !important;
	}

	// Subgraphs / clusters
	.cluster rect {
		fill: var(--accent) !important;
		stroke: var(--primary) !important;
	}

	// All SVG text
	text, tspan {
		fill: var(--text) !important;
	}

	// HTML inside foreignObject (flowchart node labels + edge labels)
	foreignObject div, foreignObject span, foreignObject p {
		color: var(--text) !important;
		background-color: transparent !important;
	}

	// Edge label backgrounds
	.edgeLabel, .edgeLabel p,
	.labelBkg {
		background-color: var(--background) !important;
	}

	.edgeLabel rect {
		fill: var(--background) !important;
		opacity: 1 !important;
	}

	// Flowchart edges
	.flowchart-link, .edgePath .path {
		stroke: rgba(246, 249, 252, 0.4) !important;
	}

	// Arrows
	.marker, .arrowheadPath, [id$="-arrowhead"] path,
	[id$="-crosshead"] path, [id$="-filled-head"] path {
		fill: var(--text) !important;
		stroke: var(--text) !important;
	}

	// Sequence: actor boxes + label boxes + activation boxes
	.actor, .labelBox,
	.activation0, .activation1, .activation2 {
		fill: var(--accent) !important;
		stroke: var(--primary) !important;
	}

	// Sequence: lifelines
	.actor-line {
		stroke: rgba(246, 249, 252, 0.2) !important;
	}

	// Sequence: message arrows
	.messageLine0, .messageLine1 {
		stroke: rgba(246, 249, 252, 0.5) !important;
	}

	// Sequence: notes
	rect.note {
		fill: color.adjust($dark-accent, $lightness: +6%) !important;
		stroke: var(--primary) !important;
	}
}

@media screen and (min-width: $md) {
	#project {
		grid-template-rows: space(20) 300px minmax(300px, auto) repeat(2, auto) space(20);

		&__hero {
			.cell--triple-column {
				h1 {
					font-size: 6rem;
				}

				.project-type {
					font-size: 1.125rem;
				}
			}
		}

		&__related {
			.projects {
				flex-direction: row;
			}
		}
	}
}
</style>