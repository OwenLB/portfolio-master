import type {MarkdownParsedContent} from '@nuxt/content/dist/runtime/types'

export interface Project extends MarkdownParsedContent {
	title: string
	type: string
	description: string
	git?: [string, string]
	// true when the public repo isn't up yet — renders a "coming soon" pill
	// instead of a (dead) link to a private repo.
	git_soon?: boolean
	web?: [string, string]
	stack: string[]
}