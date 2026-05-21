/**
 * Prepends the app's basePath to any API or internal path.
 * Required because fetch() in client components uses absolute paths
 * and doesn't respect Next.js basePath automatically.
 *
 * Set NEXT_PUBLIC_BASE_PATH=/itinerario in Netlify env vars.
 */
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ""

export function apiPath(path: string): string {
  return `${BASE_PATH}${path}`
}
