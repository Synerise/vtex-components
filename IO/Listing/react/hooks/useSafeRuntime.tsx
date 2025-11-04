import { useCallback } from 'react'
import { useRuntime } from 'vtex.render-runtime'

export function useSafeRuntime() {
  const runtime = useRuntime()
  const { route, setQuery } = runtime

  // disable url change on site editor panel
  const isSiteEditor = route.queryString?.__siteEditor
  const setQuerySafe = useCallback(
    (q: Record<string, string | number | undefined>) =>
      !isSiteEditor && setQuery(q),
    [isSiteEditor, setQuery]
  )

  return { ...runtime, setQuerySafe }
}
