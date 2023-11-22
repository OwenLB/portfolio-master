<script lang="ts" setup>
import {About} from "~/types/pages/about";

const {path} = useRoute()
const lang = useLang()

useHead({
	link: [{
		rel: 'canonical',
		href: 'https://owenlebec.fr' + path
	}]
})

const {data: content}: { data: About } = await useAsyncData('about', () => queryContent().where({
	_path: path,
	_locale: lang.value
}).findOne(), {watch: [() => lang.value]})

useSeoMeta({
	title: content.value.title,
	description: content.value.description,
})
</script>

<template>
	<div id="about" class="page">
		<AppEffect/>
		<AppHeader/>

		<main>
			<AppSection id="about__description">
				<div class="cell cell--triple-column content">
					<h2>{{ content.title }}</h2>
					<ContentRenderer :value="content" class="content"/>
				</div>
			</AppSection>
			<AppSection id="about__experiences" desktop>
				<div class="cell cell--double-column content">
					<h2>{{ content.experience }}</h2>
          <div class="experiences-content">
					  <LinkExperience v-for="experience in content.experiences" :experience="experience"/>
          </div>
				</div>
        <div class="cell cell--mobile"></div>
        <div class="cell cell--mobile"></div>
        <div class="cell me content">
          <div class="arc">
            <img class="arc-image" src="../public/images/owen.webp">
          </div>
          <LinkText :label="content.resume" link="/CV.pdf" external/>
          <LinkText :label="content.photo" link="https://lebecowen.myportfolio.com" external/>
        </div>
        <div class="cell cell--mobile"></div>
      </AppSection>

		</main>

		<AppFooter/>
	</div>
</template>

<style lang="scss">
#about {
	grid-template-rows: space(20) repeat(2, auto) space(20);

  &__description {
		H2 {
			text-transform: uppercase;
		}

		.content {
			display: flex;
			flex-direction: column;
			gap: 24px;
		}
	}

  .experiences-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  .arc {
    width: 100%;
    height: auto;
    margin: 0 auto;
    border-radius: 50% 50% 0 0;
    background-color: #89d6ff;
    padding-top: 6vh;
    padding-right: 2.5vw;
  }

  .arc-image {
    width:100%;
    margin-right: 20px;
    margin-bottom: -5px;
    height:auto;
    object-fit: contain;
  }
}


@media screen and (max-width: $md) {
  #about {
    grid-template-rows: space(20) repeat(3, auto) space(20);
    &__experiences .cell.me {
      grid-column: span 2;
    }
  }
}
</style>