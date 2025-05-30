<script lang="ts" setup>
import {Home} from "~/types/pages/home";
import {Project} from "~/types/project";
import {Socials} from "~/types/social";
import {Lang} from "~/types/lang";
import {useRuntimeConfig} from "#app/nuxt";

const props = defineProps<{
	lang: Lang
}>()

useHead({
	link: [{
		rel: 'canonical',
		href: 'https://owenlebec.fr/'
	}]
})

const {data: content}: { data: Home } = await useAsyncData('home', () => queryContent().where({
	_path: '/home',
	_locale: props.lang
}).findOne(), {watch: [() => props.lang]})

useSeoMeta({
	description: content.value.description,
})

const {data: socials}: {
	data: Socials
} = await useAsyncData('socials', () => queryContent('/socials').only(['body']).findOne())

</script>

<template>
	<div id="home" class="page">
		<AppEffect/>
		<AppHeader/>

		<main>
			<AppSection id="home__hero_top" desktop>
				<div class="cell cell--double-column headline">
					<h1 v-html="content.title"></h1>
				</div>
				<div class="cell responsive topographic">
					<div class="topographic__svg">
						<AppTopographic/>
					</div>
				</div>
			</AppSection>

			<AppSection id="home__hero_bottom">
				<div class="cell cell--double-column cell--desktop topographic">
					<div class="topographic__svg">
						<AppTopographic/>
					</div>
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
					<LinkText :label="content.about_button" link="/about"/>
				</div>
				<div class="cell cell--mobile">
				</div>
				<div class="cell cell--mobile">
				</div>
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
						<LinkText external label="Thales" link="https://www.thalesgroup.com/fr"/>
            <p>{{ content.mission }}</p>
          </div>
				</div>
				<div class="cell cell--mobile"></div>
				<div class="cell cell--mobile"></div>
				<div class="cell cell--double-column cell--double-row">
          <h2>{{ content.experience }}</h2>
          <div class="experiences-content">
            <LinkExperience v-for="experience in content.experiences" :experience="experience"/>
          </div>
				</div>
			</AppSection>
			<AppSection id="home__services">
				<div class="cell services">
					<h2>{{ content.contact }}</h2>
					<LinkText :label="content.contact_mail" external link="mailto:lebec.owen@yahoo.fr"/>
					<LinkText :label="content.contact_phone" external link="tel:+33652063822"/>
        </div>
			</AppSection>
		</main>

		<AppFooter/>
	</div>
</template>


<style lang="scss">
#home {
	grid-template-rows: space(20) 300px repeat(6, auto) space(20);

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

					strong {
						display: block;
						font-weight: bold;
					}
				}
			}

			&.topographic {
				padding: 0;
				background: rgba(var(--accent-rgb), 0.6);

				.topographic__svg {
					overflow: hidden;
					height: 100%;
					width: 100%;
					display: flex;
					justify-content: flex-end;

					svg {
						height: 200%;
					}
				}
			}
		}
	}

	&__hero_bottom {
		.cell {

			&.topographic {
				padding: 0;
				background: rgba(var(--accent-rgb), 0.6);

				.topographic__svg {
					overflow: hidden;
					height: 100%;
					width: 100%;
					display: flex;
					align-items: flex-end;

					svg {
						height: 200%;
					}
				}
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

	&__projects {
		.job {
			grid-column: span 2;
			justify-content: space-between;

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

	&__services {
		.services {
			grid-column: span 2;
		}
	}
}

@media screen and (min-width: $md) {
	#home {
		grid-template-rows: space(20) 300px 300px auto calc(200px + #{space(16)} + 1.5rem) auto space(20);

		&__hero_bottom .cell.spotify, &__projects .cell.job, &__about .cell.socials {
			grid-column: initial;
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

		&__services {
			.services {
				grid-column: initial;
			}
		}
	}
}
</style>