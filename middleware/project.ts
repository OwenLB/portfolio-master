import {Project} from "~/types/project";

const lang = useLang()

export default defineNuxtRouteMiddleware(async (to) => {
	try {
		await queryContent<Project>('/projects/' + to.params.slug).where({_locale: lang.value}).findOne()
	} catch (error) {
		return abortNavigation()
	}
})