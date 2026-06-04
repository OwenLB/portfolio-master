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

const {data: content}: { data: Home } = await useAsyncData('home', () => queryContent().where({
	_path: '/home',
	_locale: props.lang
}).findOne(), {watch: [() => props.lang]})

const {data: profileContent}: { data: About } = await useAsyncData('profile-content', () => queryContent().where({
	_path: '/profile',
	_locale: props.lang
}).findOne(), {watch: [() => props.lang]})

const {data: experiencesData}: { data: Experiences } = await useAsyncData('experiences', () => queryContent().where({
	_path: '/experiences',
	_locale: props.lang
}).findOne(), {watch: [() => props.lang]})

const {data: projects}: {
	data: Project[]
} = await useAsyncData('projects', () => queryContent('projects').where({_locale: props.lang}).only(['title', 'type', '_path']).sort({order: 1}).find(), {watch: [() => props.lang]})

const {data: socials}: {
	data: Socials
} = await useAsyncData('socials', () => queryContent('/socials').only(['body']).findOne())

const seoTitle = computed(() => props.lang === Lang.Fr ? 'Owen Le Bec — Ingénieur logiciel full stack' : 'Owen Le Bec — Full Stack Software Engineer')

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
					<h1>{{ content.headline_start }}<strong>{{ content.headline_bold }}</strong></h1>
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
				<div class="cell cell--double-column about">
					<div>
						<h2>{{ content.about }}</h2> <br/>
						<p>{{ content.greetings_text }}</p>
						<p>{{ content.about_text }}</p>
					</div>
				</div>
				<div class="cell cell--mobile"></div>
				<div class="cell cell--mobile"></div>
				<div class="cell socials">
					<h2>{{ content.social }}</h2>
					<div class="socials-links">
						<LinkText v-for="social in socials.body" :key="social.label" :label="social.label"
								  :link="social.link" external/>
					</div>
				</div>
			</AppSection>

			<AppSection id="home__projects">
				<div class="cell job">
					<h2>{{ content.position }}</h2>
					<div class="job__title">
						<h3>{{ content.position_title }}</h3>
						<LinkText external label="Thales" :link="content.thales_link"/>
					</div>
				</div>
				<div class="cell cell--mobile"></div>
				<div class="cell cell--mobile"></div>
				<div class="cell cell--double-column">
					<h2>{{ content.experience }}</h2>
					<div class="experiences-content">
						<LinkExperience v-for="experience in experiencesData.items" :experience="experience"/>
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
					<div class="me">
						<div class="arc">
							<img alt="Owen Le Bec" class="arc-image" src="/images/owen.webp" width="420" height="420">
						</div>
						<LinkText :label="profileContent.resume" :link="profileContent.resume_link" external/>
						<LinkText :label="profileContent.photo" link="https://photo.owenlebec.fr" external/>
					</div>
					<div class="contact">
						<h2>{{ content.contact }}</h2>
						<LinkText :label="content.contact_mail" :link="content.contact_mail_link" external/>
						<LinkText :label="content.contact_phone" :link="content.contact_phone_link" external/>
					</div>
				</div>
			</AppSection>
		</main>

		<AppFooter/>
	</div>
</template>


<style lang="scss">
#home {
	grid-template-rows: space(20) 300px repeat(7, auto) space(20);

	&__hero_top {
		.cell {
			&.headline {
				font-family: 'PP Formula Condensed', sans-serif;
				justify-content: center;

				h1 {
					position: absolute;
					display: block;
					font-size: 3rem;
					font-weight: 300;
					margin-top: space(6);

					em {
						font-style: italic;
					}

					strong {
						display: block;
						font-weight: bold;
						color: var(--primary);
					}
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

		.socials {
			grid-column: span 2;
			justify-content: space-between;

			.socials-links {
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
				transition: opacity 0.5s cubic-bezier(0.83, 0, 0.17, 1), transform 0.5s cubic-bezier(0.83, 0, 0.17, 1);
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

		.contact {
			display: flex;
			flex-direction: column;
			gap: space(4);
		}
	}

	&__projects {
		.job {
			grid-column: span 2;
			justify-content: flex-start;
			min-height: calc(200px + #{space(16)} + 1.5rem);

			&__title {
				display: flex;
				flex-direction: column;
				gap: space(4);

				h3 {
					font-size: 1rem;
					font-weight: 400;
				}
			}
		}
	}

}

@media screen and (min-width: $md) {
	#home {
		grid-template-rows: space(20) 300px 300px auto auto auto space(20);

		&__hero_bottom .cell.spotify,
		&__projects .cell.job,
		&__about .cell.socials {
			grid-column: initial;
		}

		#about__experiences .cell.right-col {
			grid-column: 4;
		}

		&__hero_top {
			.cell {
				&.headline {
					h1 {
						font-size: 6rem;
					}
				}
			}
		}
	}
}

</style>
