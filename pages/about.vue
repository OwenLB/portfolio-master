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
			<AppSection id="about__experiences">
				<div class="cell cell--double-column content">
					<h2>{{ content.experience }}</h2>
          <div class="experiences-content">
					  <LinkExperience v-for="experience in content.experiences" :experience="experience"/>
          </div>
				</div>
        <div class="cell content">
          <img class="arc" src="../public/images/owen.webp">
          <LinkText :label="content.resume"  link="https://file.notion.so/f/s/2d1b5624-6100-4643-bfa7-8d8990496786/CV-FullStack.pdf?id=5b1f09bc-62dd-4939-8e8c-ca1d4a6f4dfe&table=block&spaceId=3637db4b-78d4-4900-ad63-2197de0b9132&expirationTimestamp=1686252733990&signature=9tde8iXrzVK6ArP2j6TdJtL4JQP5V9QslFE-WuMX_7M&downloadName=CV-FullStack.pdf" external/>
          <LinkText :label="content.photo"/>
        </div>
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
    object-fit: contain;
    padding-top: 4vh;
  }
}
</style>