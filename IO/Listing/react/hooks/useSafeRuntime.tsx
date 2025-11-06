import { useCallback } from 'react'
import { useRuntime } from 'vtex.render-runtime'

export function useSafeRuntime() {
  const runtime = useRuntime()
  const { route, setQuery, query } = runtime

  // disable url change on site editor panel
  const isSiteEditor = route.queryString?.__siteEditor
  const setSafeQuery = useCallback(
    (q: Record<string, string | number | undefined>) => {
      if (isSiteEditor) return

      const safeQ: Record<string, string | number | undefined> = {}

      for (const key in q) {
        const value = q[key]

        if (typeof value === 'string') {
          safeQ[key] = value.replace(/&/g, '__and__')
        } else {
          safeQ[key] = value
        }
      }

      setQuery(safeQ)
    },
    [isSiteEditor, setQuery]
  )

  const safeQuery =
    query &&
    Object.keys(query).reduce(
      (obj, key) => ({ ...obj, [key]: query[key].replace(/__and__/g, '&') }),
      {} as Record<string, string>
    )

  return { ...runtime, setSafeQuery, safeQuery }
}
