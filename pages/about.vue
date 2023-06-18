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
          <LinkText :label="content.resume"  link="https://cvws.icloud-content.com/B/ATqtkf26bs4Z6g9KB4hPgzivzGEQAXP3j0uBl89pJQiKOEoH85OhuhWg/CV-FullStack-Owen-LEBEC.pdf?o=AvUXFXwRYX8tbiVpf4m9ieZ1bQIfM6-Fdn0a5e14tvSu&v=1&x=3&a=CAog77qmv63YExSoMkniPM-6UXyLZr49j7FFEEe3q1Ppkd4SbxDqieD4jDEY6ua7-owxIgEAUgSvzGEQWgShuhWgaifhiKq0ZIhNcaj3703BxaJrJgo0bE7PWGzB6-ovWm-g6dSId5FrgYlyJ1k0te105EGhw0DeLfWZGdXi0IIXzEQIRzsNh7BhJHuFtm__NzYrSQ&e=1687105237&fl=&r=556c8e9c-7a68-4388-8ea2-16502d7d02cf-1&k=WJOQJjGBnTiv5JdDeBO-3w&ckc=com.apple.clouddocs&ckz=com.apple.CloudDocs&p=72&s=UCZ87BJqbq0ikflaaLyIan-NSdY&cd=i" external/>
          <LinkText :label="content.photo" link="https://lebecowen.myportfolio.com" external/>
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