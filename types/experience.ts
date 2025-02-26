export interface Experience {
	company: string;
	position: string;
	type: string;
	from: string;
	to: string;
	duration: string;
	content: string;
	stack: {
		name: string
	}[]
	sub_content: {
		company: string
		position: string
		type: string
		from: string
		to: string
		duration: string
		content: string
		stack: {
			name: string
			icon: string
		}[]
	}[];
}