import {Project} from "~/types/project";

export default defineNuxtRouteMiddleware(async (to) => {
	const lang = useLang()
	try {
		await queryContent<Project>('/projects/' + to.params.slug).where({_locale: lang.value}).findOne()
	} catch (error: any) {
		// Only abort when the slug genuinely doesn't exist for this locale.
		// Let any other error (network, content module failure) bubble up so it
		// surfaces as a real error instead of a silent blank navigation.
		if (error?.statusCode === 404 || /document not found|no item found/i.test(error?.message ?? '')) {
			return abortNavigation()
		}
		throw error
	}
})
