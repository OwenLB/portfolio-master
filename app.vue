<script lang="ts" setup>
import {Lang} from "~/types/lang";

const theme = useTheme()
const lang = useLang()

// hreflang alternates + canonical + og:locale, derived from i18n.baseUrl.
const i18nHead = useLocaleHead()
useHead(() => ({
	htmlAttrs: {lang: i18nHead.value.htmlAttrs!.lang, dir: i18nHead.value.htmlAttrs!.dir},
	link: i18nHead.value.link,
	meta: i18nHead.value.meta,
}))

useHead({
	titleTemplate(chunk) {
		const title = lang.value === Lang.Fr ? 'Owen LE BEC — Ingénieur logiciel Full Stack' : 'Owen LE BEC — Full Stack Software Engineer'
		return chunk ? `${chunk} - ${title}` : title
	},
	htmlAttrs: {
		'data-theme': () => theme.value
	},
	link: [
		{
			rel: 'icon',
			href: '/favicon.svg',
			type: 'image/svg+xml',
		}
	],
	meta: [
		{
			name: 'google-site-verification',
			content: '9enTEnn4TDcfVaSIV1jMyTsCIZJhQEYHnzRlQhtEWDY'
		},
		{ property: 'og:site_name', content: 'Owen LE BEC' },
		{ property: 'og:type', content: 'website' },
		{ property: 'og:image', content: 'https://owenlebec.fr/images/owen.webp' },
		{ property: 'og:image:width', content: '420' },
		{ property: 'og:image:height', content: '420' },
		{ property: 'og:image:alt', content: 'Owen LE BEC' },
		{ name: 'twitter:card', content: 'summary' },
		{ name: 'twitter:image', content: 'https://owenlebec.fr/images/owen.webp' },
	],
	script: [
		{
			src: 'https://analytics.umami.is/script.js',
			'data-website-id': '12b2ec53-e4c6-44e9-b7ee-19a339dc0ea2',
			async: true
		},
		{
			type: 'application/ld+json',
			innerHTML: JSON.stringify({
				'@context': 'https://schema.org',
				'@type': 'Person',
				name: 'Owen LE BEC',
				jobTitle: 'Full Stack Software Engineer',
				url: 'https://owenlebec.fr',
				image: 'https://owenlebec.fr/images/owen.webp',
				sameAs: [
					'https://github.com/OwenLB',
					'https://www.linkedin.com/in/OwenLB/'
				]
			})
		},
		{
			type: 'application/ld+json',
			innerHTML: JSON.stringify({
				'@context': 'https://schema.org',
				'@type': 'WebSite',
				name: 'Owen LE BEC',
				url: 'https://owenlebec.fr'
			})
		},
		{
			type: 'application/ld+json',
			innerHTML: JSON.stringify({
				'@context': 'https://schema.org',
				'@type': 'ItemList',
				itemListElement: [
					{
						'@type': 'SiteNavigationElement',
						position: 1,
						name: 'Accueil',
						url: 'https://owenlebec.fr/'
					},
					{
						'@type': 'SiteNavigationElement',
						position: 2,
						name: 'Projets',
						url: 'https://owenlebec.fr/#about__experiences'
					},
					{
						'@type': 'SiteNavigationElement',
						position: 3,
						name: 'À propos',
						url: 'https://owenlebec.fr/about'
					}
				]
			})
		}
	]
})</script>

<template>
	<a class="skip-to-main" href="#main-content">
		{{ lang === Lang.Fr ? 'Aller au contenu principal' : 'Skip to main content' }}
	</a>
	<NuxtPage :key="lang" :lang="lang"/>
</template>

<style lang="scss">
.skip-to-main {
	position: absolute;
	left: -9999px;
	top: space(2);
	z-index: 999;
	padding: space(2) space(4);
	background: var(--primary);
	color: $dark;
	font-weight: 600;
	border-radius: 4px;

	&:focus {
		left: space(2);
	}
}

:root {
	--main-space: #{space(6)};
	--theme-t: 0.3s ease-in-out;
}

::-moz-selection {
	color: $dark;
	background: var(--primary);
}

::selection {
	color: $dark;
	background: var(--primary);
}

* {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
}

:focus-visible {
	outline: 2px solid var(--primary);
	outline-offset: 2px;
	border-radius: 2px;
}

html {
	font-size: 100%;
	font-family: 'Strawford', sans-serif;
	color: var(--text);
	background: var(--background);
	transition: background-color var(--theme-t), color var(--theme-t);
}

body {
	background: var(--background);
	transition: background-color var(--theme-t);
}

.page {
	position: relative;
	display: grid;
	grid-template-columns: minmax(space(6), calc((100% - 1200px) / 2)) repeat(2, minmax(auto, 400px)) minmax(space(6), calc((100% - 1200px) / 2));
	gap: 1px;
	background: var(--accent);
	overflow: hidden;
	min-height: 100vh;
	transition: background-color var(--theme-t);

	main {
		display: contents;
	}
}

a {
	color: var(--text);
	text-decoration: none;
}

p {
	line-height: 1.75rem;
}

ul {
	list-style-type: none;
	display: flex;
	flex-direction: column;
	gap: space(4);

	li {
		display: flex;
		align-items: center;
		gap: space(4);

		&:before {
			content: '';
			width: space(4);
			height: 1px;
			background: var(--text);
		}
	}
}

h2 {
	font-family: 'PP Formula Condensed', sans-serif;
	font-weight: bold;
	font-size: 1.125rem;
	letter-spacing: 1px;
	color: var(--primary);
	line-height: 1;

	a {
		color: var(--primary);
		text-decoration: underline;
		text-underline-offset: 8px;
		text-decoration-thickness: 1px;
		text-decoration-color: var(--background);
		transition: text-decoration-color 0.2s ease-in-out;

		&:where(:hover, :focus, :focus-visible) {
			text-decoration-color: var(--primary);
		}
	}
}

[data-content-id] {
	h2:not(:first-child) {
		margin-top: space(10);
	}
}

.cell, section .cell {
	position: relative;
	background: var(--background);
	z-index: 2;
	transition: background-color var(--theme-t);

	&--desktop {
		display: none;
	}

	&--mobile {
		display: block;
		padding: 0;
	}

	&:before {
		content: '';
		position: absolute;
		inset: -1px calc(100% + 1px) -1px -1px;
		background: $primary;
		z-index: 2;
		transition: all 0.6s cubic-bezier(0.83, 0, 0.17, 1);
	}
}

@media screen and (min-width: $md) {
	:root {
		--main-space: #{space(10)};
	}

	.page {
		grid-template-columns: minmax(space(10), calc((100% - 1200px) / 2))  repeat(3, minmax(auto, 400px)) minmax(space(10), calc((100% - 1200px) / 2));
	}

	.cell {
		&--desktop {
			display: flex;
		}

		&--mobile {
			display: none;
		}
	}

	h2 {
		font-size: 1.5rem;
	}
}

@media screen and (max-width: $md) {
	.cell {
		&.responsive {
			padding: 0;
		}
	}
}

@media (prefers-reduced-motion: no-preference) {
	.page-enter-active,
	.page-leave-active {
		transition: 0.45s inset 0.08s cubic-bezier(0.83, 0, 0.17, 1);
	}

	.page-enter-from,
	.page-leave-to {
		.cell:before {
			inset: -1px -1px -1px -1px;
		}
	}
}
</style>