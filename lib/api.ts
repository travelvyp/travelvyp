/**
 * Prepends the app's basePath to any API path used in client-side fetch() calls.
 * fetch() in the browser uses the origin as base, NOT the Next.js basePath.
 *
 * NEXT_PUBLIC_BASE_PATH is set at build time by Netlify env vars.
 * Default: "/itinerario" (matches next.config.js basePath).
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "/itinerario"

export function apiPath(path: string): string {
  return `${BASE_PATH}${path}`
}
