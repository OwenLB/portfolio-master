<script lang="ts" setup>
import {Icon} from "~/types/icon";

const props = defineProps<{
	icon: string | Icon
}>()
</script>

<template>
	<svg :viewBox="props.icon === 'logo' ?'0 0 466 400' :'0 0 24 24'" fill="none"
		 height="24" stroke="currentColor"
		 stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
		 width="24"
		 xmlns="http://www.w3.org/2000/svg">
		<template v-if="props.icon === 'logo'">
<!--			<path d="M300 0L0 4.82053e-06V100H100V400H200V100H300V0Z" fill="currentColor"/>-->
<!--			<path clip-rule="evenodd"-->
<!--				  d="M388.582 157.403C396.12 139.204 400 119.698 400 100H300C300 106.566 298.707 113.068 296.194 119.134C293.681 125.2 289.998 130.712 285.355 135.355C280.712 139.998 275.2 143.681 269.134 146.194C263.068 148.707 256.566 150 250 150L250 250C269.698 250 289.204 246.12 307.403 238.582C325.601 231.044 342.137 219.995 356.066 206.066C369.995 192.137 381.044 175.601 388.582 157.403Z"-->
<!--				  fill="currentColor" fill-rule="evenodd"/>-->
<!--			<path d="M350 400L300 300H415.5L465.5 400H350Z" fill="currentColor"/>-->
      <svg width="440" height="400" viewBox="0 0 110 96" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M37.2578 96V0.0234375H74.4062C85.1875 0.0234375 93.1953 2.32812 98.4297 6.9375C103.664 11.4688 106.281 17.7578 106.281 25.8047C106.281 30.1016 105.266 33.9297 103.234 37.2891C101.281 40.5703 98.7031 43.1484 95.5 45.0234C99.0938 46.5078 102.336 49.2031 105.227 53.1094C108.117 56.9375 109.562 61.7031 109.562 67.4062C109.562 75.7656 106.867 82.6406 101.477 88.0312C96.0859 93.3438 88.625 96 79.0938 96H37.2578ZM56.7109 79.3594H76.2812C79.7188 79.3594 82.7266 78.3438 85.3047 76.3125C87.9609 74.2812 89.2891 71.3125 89.2891 67.4062C89.2891 63.8125 88.1172 60.8438 85.7734 58.5C83.5078 56.0781 80.1875 54.8672 75.8125 54.8672H56.7109V79.3594ZM56.7109 38.4609H72.8828C76.8672 38.4609 80.0312 37.5234 82.375 35.6484C84.7969 33.7734 86.0078 31 86.0078 27.3281C86.0078 20.2969 81.75 16.7812 73.2344 16.7812H56.7109V38.4609Z" fill="currentColor"/>
        <path d="M0 79H35V96H0V79Z" fill="currentColor"/>
      </svg>

    </template>
		<template v-if="props.icon === 'arrow'">
			<line x1="7" x2="17" y1="17" y2="7"></line>
			<polyline points="7 7 17 7 17 17"></polyline>
		</template>
		<template v-if="props.icon === Icon.Moon">
			<path d="M12 3a6.364 6.364 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
		</template>
		<template v-if="props.icon === Icon.Sun">
			<circle cx="12" cy="12" r="4"></circle>
			<path d="M12 2v2"></path>
			<path d="M12 20v2"></path>
			<path d="m4.93 4.93 1.41 1.41"></path>
			<path d="m17.66 17.66 1.41 1.41"></path>
			<path d="M2 12h2"></path>
			<path d="M20 12h2"></path>
			<path d="m6.34 17.66-1.41 1.41"></path>
			<path d="m19.07 4.93-1.41 1.41"></path>
		</template>
		<template v-else>Wrong icon name</template>
	</svg>
</template>