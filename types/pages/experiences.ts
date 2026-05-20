import type {MarkdownParsedContent} from '@nuxt/content/dist/runtime/types'
import type {Experience} from '~/types/experience'

export interface Experiences extends MarkdownParsedContent {
	items: Experience[]
}
