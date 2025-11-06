import { useEffect, useMemo, useRef } from 'react'
import { useQuery } from 'react-apollo'

import type { FilterableFacetType } from '../types/FilterTypes'
import { getListingQuery, getSearchQuery } from '../graphql/Queries'
import { useSafeRuntime } from './useSafeRuntime'
import { useListingContext } from '../context'
import type { FilterType } from '../components/Filters/utils'

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
  const { setSafeQuery, safeQuery, route } = useSafeRuntime()
  const { term = undefined } = route.params

  const { distinctFilter, ...options } = indexOpts
  const correlationIdQuery = safeQuery?.correlationId
  const correlationId = useRef<string | undefined>(correlationIdQuery)

  const searchQuery = safeQuery?.q ?? term

  const isSearch = !!searchQuery

  const { sortBy, ordering, page, pageSize, filters, defaultFilters } =
    useListingContext()

  const [filtersIQL, customFilteredFacets] = useMemo(() => {
    const facets: FilterType = { ...defaultFilters }
    const filtered: string[] = []

    // To iterate over selected filterable facets where first is the most important and the last is the least important
    const activeFilters = filterableFacets.filter(
      (facet) => filters[facet.key]?.length
    )

    for (const { key: filterKey } of activeFilters) {
      filtered.push(filters[filterKey])

      // The maximum number of customFilteredFacets attributes is 10
      if (Object.keys(facets).length < 10) {
        const facetValue = Object.entries(filters)
          .flatMap(([key, value]) => {
            if (filterKey !== key && value.length) return value

            return defaultFilters[key] ?? []
          })
          .join(' AND ')

        facets[filterKey] = facetValue.length ? facetValue : facets[filterKey]
      }
    }

    return [filtered.join(' AND '), facets]
  }, [filters, defaultFilters, filterableFacets])

  const variables = {
    ...options,
    ...(distinctFilter?.attribute ? { distinctFilter } : {}),
    ...(sortBy !== 'relevance' ? { sortBy, ordering } : {}),
    facets: filterableFacets.map((facet) => facet.key),
    correlationId: correlationId.current,
    includeFacets: 'filtered',
    customFilteredFacets,
    filters: filtersIQL,
    query: searchQuery,
    limit: +pageSize,
    page,
  }

  const { data: searchData, loading: searchLoading } = useQuery(
    getSearchQuery,
    {
      variables,
      skip: !isSearch || !searchQuery,
      ssr: false,
    }
  )

  const { data: listingData, loading: listingLoading } = useQuery(
    getListingQuery,
    {
      variables,
      skip: isSearch,
      ssr: false,
    }
  )

  const loading = searchLoading || listingLoading

  const data = isSearch
    ? searchData?.syneriseAISearch.search
    : listingData?.syneriseAISearch.listing

  const totalPages = data?.meta.totalPages
  const resCorrelationId = data?.extras.correlationId
  const facets = {
    ...data?.extras.filteredFacets,
    ...data?.extras.customFilteredFacets,
  }

  useEffect(() => {
    correlationId.current = undefined
    if (!resCorrelationId) return

    setTimeout(() => setSafeQuery({ correlationId: resCorrelationId }))
  }, [resCorrelationId, setSafeQuery])

  return { loading, data, totalPages, facets, isSearch, resCorrelationId }
}
