export interface Experience {
	company: string;
	position: string;
	type: string;
	from: string;
	to: string;
	duration: string;
	content: string;
	sub_content: {
		company: string
		position: string
		type: string
		from: string
		to: string
		duration: string
		content: string
	}[];
}