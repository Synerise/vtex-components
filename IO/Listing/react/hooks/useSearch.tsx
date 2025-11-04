import { useEffect, useMemo, useRef } from 'react'
import { useQuery } from 'react-apollo'
import type { QueryHookOptions } from 'react-apollo'

import type { FilterableFacetType } from '../types/FilterTypes'
import { getListingQuery, getSearchQuery } from '../graphql/Queries'
import { useSafeRuntime } from './useSafeRuntime'
import { useListingContext } from '../context'

type IndexOpts = {
  indexId: string
  personalize: boolean
  sortByMetric: 'TransactionsPopularity' | 'PageVisitsPopularity'
  facetsSize: number
  maxValuesPerFacet: number
  distinctFilter: {
    attribute: string
    maxNumItems: number
    levelRangeModifier: number
  }
  ignoreQueryRules: boolean
}

export function useSearch(
  indexOpts: IndexOpts,
  filterableFacets: FilterableFacetType[]
) {
  const { setQuerySafe, query, route } = useSafeRuntime()
  const { term = undefined } = route.params

  const { distinctFilter, ...options } = indexOpts
  const correlationIdQuery = query?.correlationId
  const correlationId = useRef<string | undefined>(correlationIdQuery)

  const searchQuery = query?.q ?? term

  const isSearch = !!searchQuery

  const { sortBy, ordering, page, pageSize, filters } = useListingContext()

  const filtersIQL = useMemo(() => {
    return Object.values(filters)
      .filter((filter) => filter.length)
      .join(' AND ')
  }, [filters])

  const customFilteredFacets: Record<string, string> = useMemo(
    () =>
      filterableFacets.reduce(
        (customFacets, facet) => ({
          ...customFacets,
          [facet.key]: filtersIQL,
        }),
        {}
      ),
    [filtersIQL, filterableFacets]
  )

  const commonQueryOptions: QueryHookOptions = {
    variables: {
      ...options,
      query: searchQuery,
      correlationId: correlationId.current,
      ...(distinctFilter?.attribute ? { distinctFilter } : {}),
      customFilteredFacets,
      facets: filterableFacets.map((facet) => facet.key),
      includeFacets: 'none',
      filters: filtersIQL,
      ...(sortBy !== 'relevance' ? { sortBy, ordering } : {}),
      page,
      limit: +pageSize,
    },
    ssr: false,
  }

  const { data: searchData, loading: searchLoading } = useQuery(
    getSearchQuery,
    {
      ...commonQueryOptions,
      skip: !isSearch || !searchQuery,
    }
  )

  const { data: listingData, loading: listingLoading } = useQuery(
    getListingQuery,
    {
      ...commonQueryOptions,
      skip: isSearch,
    }
  )

  const loading = searchLoading || listingLoading

  const data = isSearch
    ? searchData?.syneriseAISearch.search
    : listingData?.syneriseAISearch.listing

  const totalPages = data?.meta.totalPages
  const facets = data?.extras.customFilteredFacets
  const resCorrelationId = data?.extras.correlationId

  useEffect(() => {
    correlationId.current = undefined
    if (!resCorrelationId) return

    setTimeout(() => setQuerySafe({ correlationId: resCorrelationId }))
  }, [resCorrelationId, setQuerySafe])

  return { loading, data, totalPages, facets, isSearch, resCorrelationId }
}
