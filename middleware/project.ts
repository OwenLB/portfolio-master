import {Project} from "~/types/project";

export default defineNuxtRouteMiddleware(async (to) => {
	const lang = useLang()
	try {
		await queryContent<Project>('/projects/' + to.params.slug).where({_locale: lang.value}).findOne()
	} catch (error) {
		return abortNavigation()
	}
})
