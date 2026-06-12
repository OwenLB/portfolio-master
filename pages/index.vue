<script lang="ts" setup>
import {Home} from "~/types/pages/home";
import {About} from "~/types/pages/about";
import {Experiences} from "~/types/pages/experiences";
import {Project} from "~/types/project";
import {Socials} from "~/types/social";
import {Lang} from "~/types/lang";

const props = defineProps<{
	lang: Lang
}>()

const {data: content}: { data: Home } = await useAsyncData(`home-${props.lang}`, () => queryContent().where({
	_path: '/home',
	_locale: props.lang
}).findOne())

const {data: profileContent}: { data: About } = await useAsyncData(`profile-content-${props.lang}`, () => queryContent().where({
	_path: '/profile',
	_locale: props.lang
}).findOne())

const {data: experiencesData}: { data: Experiences } = await useAsyncData(`experiences-${props.lang}`, () => queryContent().where({
	_path: '/experiences',
	_locale: props.lang
}).findOne())

const {data: projects}: {
	data: Project[]
} = await useAsyncData(`projects-${props.lang}`, () => queryContent('projects').where({_locale: props.lang}).only(['title', 'type', '_path']).sort({order: 1}).find())

const {data: socials}: {
	data: Socials
} = await useAsyncData('socials', () => queryContent('/socials').only(['body']).findOne())

// Year of each experience (from its localized start date) — drives the
// giant rolling counter.
const experienceYears = computed(() =>
	((experiencesData.value?.items ?? []) as { from?: string }[]).map((item) => item.from?.match(/\d{4}/)?.[0] ?? ''))

// Scrollytelling: the experience crossing the viewport's middle band drives
// the spotlight (is-current) and the giant year counter.
const activeExp = ref(0)
const activeYear = computed(() => experienceYears.value[activeExp.value] ?? '')
const yearDigits = computed(() => activeYear.value.padStart(4, '0').split('').map(Number))
let expObserver: IntersectionObserver | null = null

onMounted(() => {
	const els = Array.from(document.querySelectorAll('#home__projects .experiences-content > .experience'))
	if (!els.length) return
	expObserver = new IntersectionObserver((entries) => {
		for (const entry of entries) {
			if (entry.isIntersecting) {
				const index = els.indexOf(entry.target)
				if (index !== -1) activeExp.value = index
			}
		}
	}, {rootMargin: '-38% 0px -52% 0px'})
	els.forEach((el) => expObserver!.observe(el))
})

onUnmounted(() => expObserver?.disconnect())

const seoTitle = computed(() => props.lang === Lang.Fr ? 'Owen LE BEC — Ingénieur logiciel Full Stack' : 'Owen LE BEC — Full Stack Software Engineer')

useSeoMeta({
	description: computed(() => content.value?.description),
	ogTitle: seoTitle,
	ogDescription: computed(() => content.value?.description),
	twitterTitle: seoTitle,
	twitterDescription: computed(() => content.value?.description),
})
</script>

<template>
	<div id="home" class="page">
		<AppEffect/>
		<AppHeader/>

		<main id="main-content">
			<AppSection id="home__hero_top" desktop>
				<div class="cell cell--double-column headline">
					<div class="headline-content">
						<h1 :aria-label="`${content.headline_start} ${content.headline_bold}`">
							<span aria-hidden="true" class="line"><span v-decode="350" class="line__inner">{{ content.headline_start }}</span></span>
							<strong aria-hidden="true" class="line"><span v-decode="500" class="line__inner">{{ content.headline_bold }}</span></strong>
						</h1>
						<p class="tagline">{{ content.tagline }}</p>
					</div>
					<div aria-hidden="true" class="scroll-hint">
						<span class="scroll-hint__label">scroll</span>
						<span class="scroll-hint__line"></span>
					</div>
				</div>
				<div class="cell responsive matrix">
					<ClientOnly><AppMatrix/></ClientOnly>
				</div>
			</AppSection>

			<AppSection id="home__hero_bottom">
				<div class="cell cell--double-column cell--desktop matrix">
					<ClientOnly><AppMatrix/></ClientOnly>
				</div>
				<div class="cell spotify">
					<h2 v-decode>{{ content.listen }}</h2>
					<SpotifyCurrentTrack/>
				</div>
			</AppSection>

			<AppSection id="home__about">
				<div class="cell contact">
					<h2 v-decode v-reveal>{{ content.contact }}</h2>
					<div v-reveal="120" class="contact-links">
						<LinkText :label="content.contact_mail" :obfuscated="content.contact_mail_b64"/>
						<LinkText :label="content.contact_phone" :obfuscated="content.contact_phone_b64"/>
					</div>
				</div>
				<div class="cell cell--mobile"></div>
				<div class="cell cell--mobile"></div>
				<div class="cell cell--double-column about">
					<div v-reveal>
						<h2 v-decode>{{ content.about }}</h2> <br/>
						<p>{{ content.greetings_text }}</p>
						<p>{{ content.about_text }}</p>
					</div>
				</div>
			</AppSection>

			<AppSection id="about__experiences">
				<div class="cell cell--double-column content">
					<h2 v-decode v-reveal>{{ profileContent.projects }}</h2>
					<div class="projects">
						<LinkProject v-for="(project, index) in projects" :key="project._path"
									 v-reveal="index * 120"
									 :index="index"
									 :label="(project.title as string)"
									 :path="(project._path as string)"
									 :type="project.type"
									 shared/>
					</div>
				</div>
				<div class="cell cell--mobile"></div>
				<div class="cell cell--mobile"></div>
				<div class="cell right-col cell--double-column content">
					<div v-reveal class="socials">
						<h2 v-decode>{{ content.social }}</h2>
						<div class="socials-links">
							<LinkText v-for="social in socials.body" :key="social.label" :label="social.label"
									  :link="social.link" external/>
						</div>
					</div>
					<div v-reveal="120" class="me">
						<div class="arc">
							<img alt="Owen LE BEC" class="arc-image" src="/images/owen.webp" width="420" height="420">
						</div>
						<LinkText :label="profileContent.resume" :link="profileContent.resume_link" external/>
						<LinkText :label="profileContent.photo" link="https://photo.owenlebec.fr" external/>
					</div>
				</div>
			</AppSection>

			<AppSection id="home__projects">
				<div class="cell cell--triple-column">
					<h2 v-decode v-reveal>{{ content.experience }}</h2>
					<div class="experiences-layout">
						<div class="experiences-content">
							<LinkExperience v-for="(experience, index) in experiencesData.items" :key="experience.position"
											v-reveal
											:class="{'is-current': activeExp === index}"
											:experience="experience"/>
						</div>
						<div v-if="activeYear" aria-hidden="true" class="experiences-year">
							<div class="experiences-year__inner">
								<span v-for="(digit, i) in yearDigits" :key="i" class="experiences-year__digit">
									<span :style="{transform: `translateY(${-digit}em)`}" class="experiences-year__reel">
										<span v-for="n in 10" :key="n">{{ n - 1 }}</span>
									</span>
								</span>
							</div>
						</div>
					</div>
				</div>
			</AppSection>
		</main>

		<AppFooter/>
	</div>
</template>


<style lang="scss">
#home {
	grid-template-rows: space(20) minmax(300px, auto) repeat(7, auto) space(20);

	&__hero_top {
		.cell {
			&.headline {
				font-family: var(--font-display);
				justify-content: center;

				// Normal flow + vertically centered in the cell. The hero_top
				// grid row is minmax(300px, auto) so it grows to fit the headline
				// + tagline + CTA instead of clipping them (the old absolute
				// layout let the CTA overflow under the next row's cell).
				.headline-content {
					display: flex;
					flex-direction: column;
					gap: space(4);
				}

				h1 {
					display: block;
					font-size: var(--text-hero);
					font-weight: 300;
					line-height: 1.05;

					em {
						font-style: italic;
					}

					// Each headline line sits in an overflow mask so it can be
					// revealed by sliding up from below its own line box. The top
					// padding (cancelled by the margin) lets cap accents (É) paint
					// inside the clip window instead of being cropped.
					.line {
						display: block;
						overflow: hidden;
						padding-top: 0.2em;
						margin-top: -0.2em;
					}

					.line__inner {
						display: block;
					}

					strong {
						font-weight: bold;
						color: var(--primary);
					}
				}

				// In normal flow (below the headline) — absolute positioning made
				// it overlap the headline on short cells.
				.scroll-hint {
					margin-top: space(2);
					display: flex;
					align-items: center;
					gap: space(3);
					font-family: var(--font-mono);
					font-size: 0.7rem;
					letter-spacing: 0.16em;
					text-transform: uppercase;
					color: var(--text-accent);

					&__line {
						position: relative;
						width: space(11);
						height: 1px;
						background: var(--accent);
						overflow: hidden;

						&::after {
							content: '';
							position: absolute;
							inset: 0;
							background: var(--primary);
							transform: translateX(-101%);
						}
					}
				}

				.tagline {
					font-family: var(--font-mono);
					font-size: 0.85rem;
					line-height: 1.55;
					color: var(--text-accent);
					max-width: 42ch;
				}
			}

			&.matrix {
				padding: 0;
				position: relative;
				overflow: hidden;
				background: var(--background);
			}
		}

		// Entrance choreography — sequenced after the page curtain (0.45s):
		// headline lines slide out of their masks, then the tagline fades up,
		// then the scroll hint appears; the Matrix wave fires at 650ms.
		@media (prefers-reduced-motion: no-preference) {
			.cell.headline {
				h1 .line__inner {
					transform: translateY(110%);
					animation: hero-line 0.9s var(--ease-out) 0.25s forwards;
				}

				h1 .line:nth-child(2) .line__inner {
					animation-delay: 0.39s;
				}

				.tagline {
					opacity: 0;
					transform: translateY(space(3));
					animation: hero-fade 0.7s var(--ease-out) 0.65s forwards;
				}

				.scroll-hint {
					opacity: 0;
					animation: hero-fade 0.7s var(--ease-out) 1.05s forwards;

					&__line::after {
						animation: scroll-sweep 2.4s var(--ease-expo) 1.8s infinite;
					}
				}
			}
		}
	}

	&__hero_bottom {
		.cell {
			&.matrix {
				padding: 0;
				position: relative;
				overflow: hidden;
				background: var(--background);
			}

			&.spotify {
				overflow: hidden;
				grid-column: span 2;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
			}
		}
	}

	&__about {
		.about {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
		}

		.contact {
			grid-column: span 2;
			justify-content: space-between;

			.contact-links {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				gap: space(4);
			}
		}
	}

	.projects {
		display: flex;
		flex-direction: column;
		gap: var(--main-space);

		// Desktop rows draw their own 1px rules — no gap between them; the list
		// stretches to the cell height (set by the taller right column) and the
		// rows share it equally (vertical space-between).
		@media screen and (min-width: $md) {
			gap: 0;
			flex: 1;
		}
	}

	.arc {
		width: 100%;
		height: auto;
		margin: 0 auto;
		border-radius: 50% 50% 0 0;
		background-color: var(--arc);
		padding-top: 3vh;
		padding-right: 2.5vw;
	}

	.arc-image {
		width: 100%;
		margin-right: 20px;
		margin-bottom: -5px;
		height: auto;
		object-fit: contain;
	}

	@keyframes hero-line {
		to {
			transform: translateY(0);
		}
	}

	@keyframes hero-fade {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@keyframes scroll-sweep {
		0% {
			transform: translateX(-101%);
		}

		55% {
			transform: translateX(0);
		}

		100% {
			transform: translateX(101%);
		}
	}

	// Experiences as a vertical timeline: a 1px rail in the grid's voice, one
	// node per experience, a pulsing "live" dot on the current position. The
	// rail draws itself on scroll where scroll-driven animations exist.
	#home__projects {
		// Timeline column + sticky giant year (desktop) side by side.
		.experiences-layout {
			display: grid;
			grid-template-columns: 1fr;

			@media screen and (min-width: $md) {
				grid-template-columns: 1fr auto;
				gap: var(--main-space);
			}
		}

		// Giant rolling year — editorial watermark pinned while the timeline
		// scrolls; each digit is an odometer reel driven by the active
		// experience.
		.experiences-year {
			display: none;

			@media screen and (min-width: $md) {
				display: block;
			}

			&__inner {
				position: sticky;
				top: 32vh;
				display: flex;
				font-family: var(--font-display);
				font-weight: bold;
				font-size: clamp(5rem, 9vw, 8.5rem);
				line-height: 1;
				color: var(--accent);
				user-select: none;
				transition: color var(--theme-t);
			}

			&__digit {
				display: block;
				overflow: hidden;
				// Shorter than the 1em reel step: digit ink stops at ~0.74em but
				// the next digit's ink overshoots ~0.1em above its box (line
				// box taller than 1em) — 0.88em hides that sliver.
				height: 0.88em;
			}

			&__reel {
				display: flex;
				flex-direction: column;

				span {
					display: block;
					height: 1em;
					text-align: center;
				}
			}

			@media (prefers-reduced-motion: no-preference) {
				&__reel {
					transition: transform 0.8s var(--ease-expo);
				}
			}
		}

		// Spotlight: the experience in the viewport's middle band lights up —
		// node filled, position title accented.
		.experiences-content > .experience {
			h3 {
				transition: color var(--dur-fast) ease-in-out;
			}

			&.is-current {
				&::before {
					background: var(--primary);
					box-shadow: 0 0 10px 1px color-mix(in srgb, var(--primary) 45%, transparent);
				}

				> .experience__header h3 {
					color: var(--primary);
				}
			}
		}

		.experiences-content {
			position: relative;
			padding-left: space(8);

			// Rail
			&::before {
				content: '';
				position: absolute;
				left: 3px;
				top: space(3);
				bottom: space(8);
				width: 1px;
				background: var(--accent);
				transform-origin: top;
			}

			> .experience {
				position: relative;

				// Node — aligned with the position title
				&::before {
					content: '';
					position: absolute;
					left: calc(space(-8) + 3.5px);
					top: space(4);
					width: 7px;
					height: 7px;
					border-radius: 50%;
					transform: translateX(-50%);
					background: var(--background);
					border: 1px solid var(--primary);
					transition: background-color var(--dur-fast) ease-in-out, box-shadow var(--dur-fast) ease-in-out;
				}

				// Current position: filled dot + live pulse
				&:first-child::before {
					background: var(--primary);
				}

				&:first-child::after {
					content: '';
					position: absolute;
					left: calc(space(-8) + 3.5px);
					top: calc(space(4) + 3.5px);
					width: 7px;
					height: 7px;
					border-radius: 50%;
					translate: -50% -50%;
					border: 1px solid var(--primary);
				}
			}
		}

		@media (prefers-reduced-motion: no-preference) {
			.experiences-content > .experience:first-child::after {
				animation: timeline-ping 2.6s var(--ease-out) infinite;
			}

			// Progressive enhancement: the rail grows as the section scrolls in.
			@supports (animation-timeline: view()) {
				.experiences-content::before {
					animation: timeline-draw linear both;
					animation-timeline: view();
					animation-range: entry 0% cover 80%;
				}
			}
		}
	}

	@keyframes timeline-ping {
		0% {
			scale: 1;
			opacity: 0.9;
		}

		70%, 100% {
			scale: 3.2;
			opacity: 0;
		}
	}

	@keyframes timeline-draw {
		from {
			transform: scaleY(0);
		}

		to {
			transform: scaleY(1);
		}
	}

	#about__experiences {
		.right-col {
			justify-content: space-between;
		}

		.me {
			display: flex;
			flex-direction: column;
			gap: space(4);
		}

		.socials {
			display: flex;
			flex-direction: column;
			gap: space(4);

			.socials-links {
				display: flex;
				flex-direction: column;
				gap: space(4);
			}
		}
	}

}

@media screen and (min-width: $md) {
	#home {
		grid-template-rows: space(20) minmax(300px, auto) 300px auto auto auto space(20);

		&__hero_bottom .cell.spotify,
		&__about .cell.contact {
			grid-column: initial;
		}

		// Section Projets : vignettes à gauche (col 2-3, auto), colonne
		// Social + photo/CV épinglée à droite (col 4).
		#about__experiences .cell.right-col {
			grid-column: 4;
		}

	}
}

</style>
