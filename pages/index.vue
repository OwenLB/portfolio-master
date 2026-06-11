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
}).findOne(), {watch: [() => props.lang]})

const {data: profileContent}: { data: About } = await useAsyncData(`profile-content-${props.lang}`, () => queryContent().where({
	_path: '/profile',
	_locale: props.lang
}).findOne(), {watch: [() => props.lang]})

const {data: experiencesData}: { data: Experiences } = await useAsyncData(`experiences-${props.lang}`, () => queryContent().where({
	_path: '/experiences',
	_locale: props.lang
}).findOne(), {watch: [() => props.lang]})

const {data: projects}: {
	data: Project[]
} = await useAsyncData(`projects-${props.lang}`, () => queryContent('projects').where({_locale: props.lang}).only(['title', 'type', '_path']).sort({order: 1}).find(), {watch: [() => props.lang]})

const {data: socials}: {
	data: Socials
} = await useAsyncData('socials', () => queryContent('/socials').only(['body']).findOne())

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
						<h1>
							<span class="line"><span class="line__inner">{{ content.headline_start }}</span></span>
							<strong class="line"><span class="line__inner">{{ content.headline_bold }}</span></strong>
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
					<h2>{{ content.listen }}</h2>
					<SpotifyCurrentTrack/>
				</div>
			</AppSection>

			<AppSection id="home__about">
				<div class="cell contact">
					<h2 v-reveal>{{ content.contact }}</h2>
					<div v-reveal="120" class="contact-links">
						<LinkText :label="content.contact_mail" :obfuscated="content.contact_mail_b64"/>
						<LinkText :label="content.contact_phone" :obfuscated="content.contact_phone_b64"/>
					</div>
				</div>
				<div class="cell cell--mobile"></div>
				<div class="cell cell--mobile"></div>
				<div class="cell cell--double-column about">
					<div v-reveal>
						<h2>{{ content.about }}</h2> <br/>
						<p>{{ content.greetings_text }}</p>
						<p>{{ content.about_text }}</p>
					</div>
				</div>
			</AppSection>

			<AppSection id="about__experiences">
				<div class="cell cell--double-column content">
					<h2 v-reveal>{{ profileContent.projects }}</h2>
					<div class="projects">
						<LinkProject v-for="(project, index) in projects" :key="project._path"
									 v-reveal="index * 120"
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
						<h2>{{ content.social }}</h2>
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
					<h2 v-reveal>{{ content.experience }}</h2>
					<div class="experiences-content">
						<LinkExperience v-for="experience in experiencesData.items" :key="experience.position"
										v-reveal
										:experience="experience"/>
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
					// revealed by sliding up from below its own line box.
					.line {
						display: block;
						overflow: hidden;
					}

					.line__inner {
						display: block;
					}

					strong {
						font-weight: bold;
						color: var(--primary);
					}
				}

				.scroll-hint {
					position: absolute;
					bottom: var(--main-space);
					left: var(--main-space);
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
