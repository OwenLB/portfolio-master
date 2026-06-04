<script lang="ts" setup>
import {Theme} from "~/types/theme";
import {Lang} from "~/types/lang";

enum Toggle {
	Theme = 'theme',
	Lang = 'lang',
}

const theme = useTheme()
const lang = useLang()
const switchState = ref(lang.value !== Lang.Fr)

const toggle = async (event: Event, type: Toggle) => {
	const {currentTarget} = event
	const html = document.querySelector('html')

	if (type === Toggle.Theme) {
		theme.value = theme.value === Theme.Dark ? Theme.Light : Theme.Dark
		;(currentTarget as HTMLInputElement).blur()
	} else if (type === Toggle.Lang) {
		html?.classList.add('page-leave-to')
		setTimeout(async () => {
			lang.value = lang.value === Lang.Fr ? Lang.En : Lang.Fr
			switchState.value = !switchState.value
			;(currentTarget as HTMLInputElement).blur()
			await nextTick()
			html?.classList.remove('page-leave-to')
		}, 650)
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
			<button
				:aria-label="lang === Lang.Fr ? 'Changer le theme de couleurs' : 'Change color theme'"
				:class="{ 'is-dark': theme === Theme.Dark }"
				class="control__theme"
				type="button"
				@click.stop="toggle($event,Toggle.Theme)"
			>
				<span aria-hidden="true" class="sun-moon">
					<span v-for="n in 8" :key="n" :style="{ '--n': n }" class="sun-moon__ray"/>
				</span>
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
					font-size: 1rem;
					opacity: 0.35;
					transition: color 0.3s, opacity 0.3s;

					&.current {
						color: var(--primary);
						opacity: 1;
					}
				}

				&_switch {
					display: block;
					width: space(12);
					padding: space(2);
					border-radius: space(4);
					border: 1px solid var(--accent);
					transition: border-color var(--theme-t);

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
				cursor: pointer;
				display: flex;
				align-items: center;
				@include transition(color);

				&:where(:hover, :focus, :focus-visible) {
					color: var(--primary);
					outline: none;
				}

				// default = light mode → moon (action: go dark)
				.sun-moon {
					position: relative;
					display: block;
					width: 14px;
					height: 14px;
					border-radius: 50%;
					background: currentColor;
					transform-origin: center;
					transition: transform 0.75s ease-in-out;

					&::after {
						content: '';
						position: absolute;
						width: 12px;
						height: 12px;
						border-radius: 50%;
						background: var(--background);
						left: 6px;
						bottom: 3px;
						transition: transform 0.5s ease, left 0.25s ease, bottom 0.25s ease, background-color var(--theme-t);
					}

					&__ray {
						position: absolute;
						top: 5px;
						left: 5px;
						width: 4px;
						height: 4px;
						border-radius: 50%;
						background: currentColor;
						transform-origin: center;
						transform: rotate(calc((var(--n) - 1) * 45deg)) translateX(0);
						transition: transform 0.5s ease-in-out;
					}
				}

				// .is-dark = dark mode → sun (action: go light)
				&.is-dark .sun-moon {
					transform: scale(0.65);

					&::after {
						left: 12px;
						bottom: 6px;
						transform: scale(0);
					}

					&__ray {
						transform: rotate(calc((var(--n) - 1) * 45deg)) translateX(-13px);
					}
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
