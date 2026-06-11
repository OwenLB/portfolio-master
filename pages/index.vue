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


const projectsContainer = ref<HTMLElement | null>(null)
const projectsVisibility = ref(false)

onMounted(() => {
	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				projectsVisibility.value = true
			}
		})
	}, {
		threshold: 0.15
	})

	if (projectsContainer.value) {
		observer.observe(projectsContainer.value as HTMLElement)
	}
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
						<h1>{{ content.headline_start }}<strong>{{ content.headline_bold }}</strong></h1>
						<p class="tagline">{{ content.tagline }}</p>
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
					<h2>{{ content.contact }}</h2>
					<div class="contact-links">
						<LinkText :label="content.contact_mail" :obfuscated="content.contact_mail_b64"/>
						<LinkText :label="content.contact_phone" :obfuscated="content.contact_phone_b64"/>
					</div>
				</div>
				<div class="cell cell--mobile"></div>
				<div class="cell cell--mobile"></div>
				<div class="cell cell--double-column about">
					<div>
						<h2>{{ content.about }}</h2> <br/>
						<p>{{ content.greetings_text }}</p>
						<p>{{ content.about_text }}</p>
					</div>
				</div>
			</AppSection>

			<AppSection id="about__experiences">
				<div class="cell cell--double-column content">
					<h2>{{ profileContent.projects }}</h2>
					<div ref="projectsContainer" :class="{visible: projectsVisibility}" class="projects">
						<LinkProject v-for="(project, index) in projects" :key="project._path"
									 :index="index"
									 :label="(project.title as string)"
									 :path="(project._path as string)"
									 :type="project.type"/>
					</div>
				</div>
				<div class="cell cell--mobile"></div>
				<div class="cell cell--mobile"></div>
				<div class="cell right-col cell--double-column content">
					<div class="socials">
						<h2>{{ content.social }}</h2>
						<div class="socials-links">
							<LinkText v-for="social in socials.body" :key="social.label" :label="social.label"
									  :link="social.link" external/>
						</div>
					</div>
					<div class="me">
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
					<h2>{{ content.experience }}</h2>
					<div class="experiences-content">
						<LinkExperience v-for="experience in experiencesData.items" :experience="experience"/>
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

					em {
						font-style: italic;
					}

					strong {
						display: block;
						font-weight: bold;
						color: var(--primary);
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

		@media (prefers-reduced-motion: no-preference) {
			a {
				opacity: 0;
				// translate3d + backface-visibility keep the link on a stable GPU
				// layer so it isn't re-rasterized when the transition ends — avoids
				// the one-frame white flash on mobile (layer demotion).
				transform: translate3d(0, space(16), 0);
				backface-visibility: hidden;
				transition: opacity 0.5s var(--ease-expo), transform 0.5s var(--ease-expo);
			}

			&.visible a {
				opacity: 1;
				transform: translate3d(0, 0, 0);
			}
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
