import type {MarkdownParsedContent} from '@nuxt/content/dist/runtime/types'

export interface About extends MarkdownParsedContent {
	title: string
	description: string
	experience: string
	resume: string
	experiences: {
		company: string
		position: string
		type: string
		from: string
		to: string
		duration: string
		content: string
		sub_content: {
			company: string
			position: string
			// type: string
			// from: string
			// to: string
			// duration: string
			// content: string
		}[]
	}[]
}