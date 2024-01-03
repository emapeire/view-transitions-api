const checkIsSupported = () => {
	return Boolean(document.startViewTransition)
}

const fetchPage = async (url) => {
	const response = await fetch(url)
	const html = await response.text()
	const data = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)[1]
	return data
}

export const viewTransitions = () => {
	if (!checkIsSupported()) return
	window.navigation.addEventListener('navigate', (event) => {
		const toUrl = new URL(event.destination.url)

		if (location.origin !== toUrl.origin) return

		event.intercept({
			async handler() {
				const data = await fetchPage(toUrl.pathname)

				document.startViewTransition(() => {
					document.body.innerHTML = data
					document.documentElement.scrollTop = 0
				})
			}
		})
	})
}
