<script lang="ts" setup>
import {Icon} from "~/types/icon";
import {Theme} from "~/types/theme";
import {Lang} from "~/types/lang";

enum Toggle {
	Theme = 'theme',
	Lang = 'lang',
}

const theme = useTheme()
const iconState = ref<Icon>(theme.value === (Theme.Dark as Theme) ? Icon.Moon : Icon.Sun)

const lang = useLang()
const switchState = ref(lang.value !== Lang.Fr)

const toggle = async (event: Event, type: Toggle) => {
	const {currentTarget} = event
	const html = document.querySelector('html')

	if (type === Toggle.Theme) {
		theme.value = theme.value === Theme.Dark ? Theme.Light : Theme.Dark
		iconState.value = theme.value === Theme.Dark ? Icon.Moon : Icon.Sun
		;(currentTarget as HTMLInputElement).blur()
	} else if (type === Toggle.Lang) {
		html?.classList.add('page-leave-to')
		setTimeout(() => {
			lang.value = lang.value === Lang.Fr ? Lang.En : Lang.Fr
			switchState.value = !switchState.value
			;(currentTarget as HTMLInputElement).blur()
			html?.classList.remove('page-leave-to')
		}, 1000)
	}
}
</script>

<template>
	<header>
		<div class="cell">
		</div>
		<div class="cell name">
			<NuxtLink :aria-label="lang === Lang.Fr ? 'Retour à la page d\'accueil' : 'Back to homepage'" to="/">
				<AppIcon icon="logo"/>
        <span>Owen Le Bec</span>
			</NuxtLink>
		</div>
		<div class="cell cell--desktop">
		</div>
		<div class="cell control">
			<button :aria-checked="switchState" class="control__lang" role="switch" type="button"
					@click.stop="toggle($event,Toggle.Lang)">
				<span :class="{current: lang === Lang.Fr}" class="control__lang_side">FR</span>
				<span class="control__lang_switch">
					<span></span>
				</span>
				<span :class="{current: lang === (Lang.En as Lang)}" class="control__lang_side">EN</span>
			</button>
			<button :aria-label="lang === Lang.Fr ? 'Changer le theme de couleurs' : 'Change color theme'"
					class="control__theme" type="button"
					@click.stop="toggle($event,Toggle.Theme)">
				<AppIcon :icon="iconState" aria-hidden="true"/>
			</button>
		</div>
		<div class="cell">
		</div>
	</header>
</template>

<style lang="scss">
header {
	display: contents;

	.cell {
		&.name, &.control {
			display: flex;
			align-items: center;
			font-size: 1.125rem;
			font-weight: 500;
			padding: space(2) var(--main-space);
		}

		&.name {
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
					outline: none;
				}
			}
		}

		&.control {
			justify-content: space-between;

			.control__lang {
				all: unset;
				display: flex;
				align-items: center;
				gap: space(4);
				cursor: pointer;
				padding: space(2) 0;

				&_side {
					@include transition(color);
					font-size: 1rem;
					opacity: 0.35;
					transition: color 0.3s, opacity 0.3s, font-weight 0s;

					&.current {
						color: var(--primary);
						font-weight: 700;
						opacity: 1;
					}
				}

				&_switch {
					display: block;
					width: space(12);
					padding: space(2);
					border-radius: space(4);
					border: 1px solid var(--accent);
					@include transition(border);

					span {
						display: block;
						width: space(3);
						height: space(3);
						border-radius: 50%;
						background: var(--primary);
						@include transition(transform);
					}
				}

				&:where(:hover, :focus, :focus-visible) {
					.control__lang_switch {
						border: 1px solid var(--primary);
					}
				}

				&[aria-checked="true"] {
					.control__lang_switch {
						span {
							transform: translateX(space(4) + 2);
						}
					}
				}
			}

			.control__theme {
				all: unset;
				height: space(6);
				cursor: pointer;
				@include transition(color);

				&:where(:hover, :focus, :focus-visible) {
					color: var(--primary);
					outline: none;
				}
			}
		}
	}
}

@media screen and (min-width: $md) {
	header {
		.cell {
			&.name {
				a span {
					display: block;
				}
			}

			&.control {
				.control__lang_side {
					font-size: 1.125rem;
				}
			}
		}
	}
}
</style>