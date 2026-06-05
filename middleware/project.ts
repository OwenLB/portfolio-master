import {Project} from "~/types/project";

export default defineNuxtRouteMiddleware(async (to) => {
	// Projects exist in both locales (parallel fr/en folders), so a locale-free
	// existence check is enough — and it keeps the middleware out of the i18n
	// locale lifecycle (the slug param is identical across /projects and /en/projects).
	try {
		await queryContent<Project>('/projects/' + to.params.slug).findOne()
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
