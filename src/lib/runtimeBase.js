export function getAppBasePath() {
  const configuredBase = import.meta.env.BASE_URL || '/'

  if (configuredBase !== '/' && configuredBase !== './') {
    return configuredBase.endsWith('/') ? configuredBase : `${configuredBase}/`
  }

  if (typeof window === 'undefined') {
    return '/'
  }

  const moduleScript = document.querySelector('script[type="module"][src]')

  if (moduleScript) {
    const scriptUrl = new URL(moduleScript.getAttribute('src'), window.location.href)
    const pathMatch = scriptUrl.pathname.match(/^(.*?)(?:assets\/|src\/main\.jsx$)/)

    if (pathMatch?.[1]) {
      return pathMatch[1].endsWith('/') ? pathMatch[1] : `${pathMatch[1]}/`
    }
  }

  const { hostname, pathname } = window.location

  if (hostname.endsWith('github.io')) {
    const segments = pathname.split('/').filter(Boolean)

    if (segments.length > 0) {
      return `/${segments[0]}/`
    }
  }

  return '/'
}

export function getAssetUrl(path) {
  const normalizedPath = String(path || '').replace(/^\/+/, '')
  return `${getAppBasePath()}${normalizedPath}`
}

export function getAppUrl(path = '/') {
  const normalizedPath = String(path || '/').replace(/^\/+/, '')
  return new URL(normalizedPath, `${window.location.origin}${getAppBasePath()}`).toString()
}

export function restoreGithubPagesPath() {
  if (typeof window === 'undefined') {
    return
  }

  const url = new URL(window.location.href)
  const redirectPath = url.searchParams.get('gh_route')

  if (!redirectPath) {
    return
  }

  url.searchParams.delete('gh_route')

  const basePath = getAppBasePath().replace(/\/$/, '')
  const normalizedRoute = redirectPath.startsWith('/') ? redirectPath : `/${redirectPath}`
  const remainingQuery = url.searchParams.toString()
  const nextUrl = `${basePath}${normalizedRoute}${remainingQuery ? `?${remainingQuery}` : ''}`

  window.history.replaceState(null, '', nextUrl)
}
