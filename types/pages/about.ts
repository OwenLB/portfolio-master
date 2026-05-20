import type {MarkdownParsedContent} from '@nuxt/content/dist/runtime/types'

export interface About extends MarkdownParsedContent {
	projects: string
	photo: string
	resume: string
	resume_link: string
}