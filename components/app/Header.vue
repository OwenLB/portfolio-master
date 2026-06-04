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
			<button
				:aria-label="lang === Lang.Fr ? 'Changer le theme de couleurs' : 'Change color theme'"
				:class="{ 'is-dark': theme === Theme.Dark }"
				class="control__theme"
				type="button"
				@click.stop="toggle($event,Toggle.Theme)"
			>
				<svg aria-hidden="true" class="theme-icon" fill="none" height="24" overflow="visible" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
					<defs>
						<mask id="theme-toggle-mask">
							<rect fill="white" height="24" width="24"/>
							<circle class="theme-icon__mask-circle" cx="22" cy="2" fill="black" r="5"/>
						</mask>
					</defs>
					<g class="theme-icon__rays">
						<line x1="12" x2="12" y1="2" y2="4"/>
						<line x1="12" x2="12" y1="20" y2="22"/>
						<line x1="4.22" x2="5.64" y1="4.22" y2="5.64"/>
						<line x1="18.36" x2="19.78" y1="18.36" y2="19.78"/>
						<line x1="2" x2="4" y1="12" y2="12"/>
						<line x1="20" x2="22" y1="12" y2="12"/>
						<line x1="4.22" x2="5.64" y1="19.78" y2="18.36"/>
						<line x1="18.36" x2="19.78" y1="5.64" y2="4.22"/>
					</g>
					<circle class="theme-icon__disc" cx="12" cy="12" mask="url(#theme-toggle-mask)" r="4"/>
				</svg>
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

				.theme-icon {
					display: block;

					&__rays {
						transform-origin: 12px 12px;
						transition: opacity 0.4s ease, transform 0.5s ease;
					}

					&__disc {
						transition: r 0.4s ease;
					}

					&__mask-circle {
						transition: cx 0.5s cubic-bezier(0.4, 0, 0.2, 1), cy 0.5s cubic-bezier(0.4, 0, 0.2, 1);
					}
				}

				&.is-dark .theme-icon {
					&__rays {
						opacity: 0;
						transform: scale(0.5) rotate(30deg);
					}

					&__disc {
						r: 6;
					}

					&__mask-circle {
						cx: 15;
						cy: 9;
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
