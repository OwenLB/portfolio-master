<script lang="ts" setup>
import {Lang} from "~/types/lang";

const lang = useLang()
const localePath = useLocalePath()

// Only fetch what the footer renders (path + title). Pulling the full doc would
// embed the whole legal body — including the mailto: contact — into every page's
// payload (privacy leak + dead weight).
const {data: legalLink} = await useAsyncData(`legal-link-${lang.value}`, () => queryContent('/').where({
	_path: '/legal',
	_locale: lang.value
}).only(['_path', 'title']).findOne(), {watch: [() => lang.value]})
</script>

<template>
	<footer role="contentinfo">
		<div class="cell">
		</div>
		<div class="cell name">
			<NuxtLink :aria-label="lang === Lang.Fr ? 'Retour à la page d\'accueil' : 'Back to homepage'" :to="localePath('/')">
				<AppIcon icon="logo"/>
				<span>Owen LE BEC</span>
			</NuxtLink>
		</div>
		<div class="cell links">
			<NuxtLink v-if="legalLink" :to="localePath(legalLink._path)">{{ legalLink.title }}</NuxtLink>
		</div>
		<div class="cell date cell--desktop">
			{{ new Date().getFullYear() }}
		</div>
		<div class="cell">
		</div>
	</footer>
</template>

<style lang="scss">
footer {
	display: contents;

	.cell {
		&.name, &.links, &.date {
			align-items: center;
			font-size: 1.125rem;
			font-weight: 500;
			padding: space(2) var(--main-space);

			&:not(.cell--desktop) {
				display: flex;
			}
		}

		&.name {
			justify-content: flex-start;

			a {
				display: flex;
				align-items: center;
				gap: space(4);
				@include transition(color);

				span {
					display: none;
				}

				&:where(:hover, :focus, :focus-visible) {
					color: var(--primary);
				}
			}
		}

		&.links {
			justify-content: space-between;

			a {
				font-size: 0.875rem;
				text-decoration: underline;
				text-underline-offset: 4px;
				text-decoration-thickness: 1px;
				text-decoration-color: transparent;
				@include transition(color, text-decoration-color);

				&:where(:hover, :focus, :focus-visible) {
					color: var(--primary);
					text-decoration-color: var(--primary);
				}
			}
		}

		&.date {
			justify-content: flex-end;
			font-family: var(--font-mono);
			font-size: 1rem;
			font-weight: 400;
		}
	}
}

@media screen and (min-width: $md) {
	footer {
		.cell {
			&.name {
				a span {
					display: block;
				}
			}

			&.links a {
				font-size: 1.125rem;
			}
		}
	}
}
</style>