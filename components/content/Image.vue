<script lang="ts" setup>
const props = defineProps<{
	src: string
	alt: string
	caption?: string
}>()

const isSvg = props.src?.endsWith('.svg') ?? false
const svgContent = ref<string | null>(null)

if (isSvg) {
	const { data } = await useFetch<string>(props.src, {
		key: `svg-${props.src}`,
		responseType: 'text'
	})
	svgContent.value = data.value
}
</script>

<template>
	<figure role="group">
		<div v-if="isSvg && svgContent" v-html="svgContent" class="svg-wrapper" :aria-label="alt" role="img"/>
		<nuxt-img v-else :alt="props.alt" :src="props.src" sizes="xs:640 md:100vw"/>
		<figcaption>{{ props.caption ? props.caption : props.alt }}</figcaption>
	</figure>
</template>

<style lang="scss" scoped>
figure {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: space(4);

	figcaption {
		color: var(--text-accent);
		font-size: 0.875rem;
	}

	.svg-wrapper {
		width: 100%;
		overflow-x: auto;

		svg {
			width: 100%;
			height: auto;
		}
	}
}
</style>
