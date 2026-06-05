import type {MarkdownParsedContent} from '@nuxt/content/dist/runtime/types'

export interface Home extends MarkdownParsedContent {
	headline_start: string
	headline_bold: string
	description: string
	listen: string
	about: string
	greetings_text: string
	about_text: string
	social: string
	position: string
	position_title: string
	thales_link: string
	mission: string
	experience: string
	contact: string
	contact_mail: string
	contact_mail_b64: string
	contact_phone: string
	contact_phone_b64: string
}