import type {MarkdownParsedContent} from '@nuxt/content/dist/runtime/types'

export interface Project extends MarkdownParsedContent {
	title: string
	type: string
	description: string
	git: [string, string]
	web?: [string, string]
	stack: string[]
}